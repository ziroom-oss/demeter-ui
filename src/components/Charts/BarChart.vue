<template>
    <section class="chart" :id="idName" :style="style">
      <div class="legend">
        <template v-for="item in legend">
          <span v-if="item.type === 'increase'" class="green"><i class="el-icon-caret-top"></i>{{ item.value }}</span>
          <span v-if="item.type === 'decrease'" class="red"><i class="el-icon-caret-bottom"></i>{{ item.value }}</span>
        </template>
      </div>
    </section>
</template>

<script>
import * as d3Selection from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';

import d3ReRender from './mixins/d3ReRender';
import d3DataValidate from "./mixins/d3DataValidate";

export default {
  mixins: [
    d3ReRender,
    d3DataValidate
  ],
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    legend: {
      type: Array,
      default: function() {
          return [];
      }
    },
    width: {
      type: String,
      default: '100%',
    },
    colors: {
      type: Array,
      default: function() {
        return ['#000']
      }
    }
  },
  data() {
      return {
        idName: null,
        rows: [], // 预处理的图形数据
        maxValue: 0,
        totalLen: 0,
        rowsLen: 0,
      }
  },
  computed: {
    style() {
      return 'width: ' + this.width;
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler: function(value) {
        // mixins support
        if (!this.validateData(value)) return;
        this.reRender();

        const comparisonArray = [];
        let totalLen = 0;
        this.rows = value.reduce((acc, curr) => {
          // 将每一行数据转为以[下标]为 key 的对象
          const row = curr.reduce((set, curr, index) => {
            const item = {};
            item.key = index;
            item.value = curr;
            set.push(item);
            return set;
          }, []);
          // 找出每一个 row 中的最大值并压入 comparisonArray
          comparisonArray.push(d3Array.max(row, item => item.value));
          // 获得 curr 的长度并加入 totalLen
          totalLen += curr.length;
          acc.push(row);
          return acc;
        }, []);
        // 登记 comparisonArray 中的最大值
        this.maxValue = Math.max(...comparisonArray);
        // 空出多余的一列用于配置每组柱形图之间的间隔
        this.totalLen = totalLen * 2;
        this.rowsLen = this.rows.length;
        this.render();
      }
    }
  },
  created() {
    this.idName = 'chart_' + this.$random(1000000, 99999999);
  },
  methods: {
    render() {
      this.$nextTick(() => {
        const chart = document.getElementById(this.idName);
        let offsetH = null;
        let offsetW = null;
        if (chart) {
          offsetH = chart.offsetHeight;
          offsetW = chart.offsetWidth;
        } else {
          // 同时也要明确 chart 组件渲染在父组件之后
          return console.warn('获取不到 chart 的父容器，请检查 chart 组件的父级是否有明确的宽和高');
        }

        // 首先创建一个 svg 容器
        const svg = d3Selection.select('#' + this.idName)
          .append('svg')
          .attr('width', offsetW)
          .attr('height', offsetH / 2)
          .attr('viewBox', `0, 0, ${offsetW}, ${offsetH / 2}`)
          .attr('preserveAspectRatio', 'none')
          .attr('transform', `translate(0, ${offsetH / 2})`)

        const linearGradientIdName = this.idName + '_' + 'linearGradient';

        // 给 svg 容器添加一个渐变定义
        function appendLinearGradient(data, i) {
          const color = this.colors[i] || this.colors[0];
          const linearGradient = svg.append('defs').append('linearGradient')
            .attr('id', linearGradientIdName + '_' + i)
            .attr('x1', '50%')
            .attr('y1', '0')
            .attr('x2', '50%')
            .attr('y2', '100%')
          linearGradient.append('stop')
            .attr('offset', '0%')
            .attr('style', `stop-color:${color};stop-opacity:0.8`)
          linearGradient.append('stop')
            .attr('offset', '100%')
            .attr('style', `stop-color:${color};stop-opacity:0.1`)
        }

        // 先绘制多边形，再绘制折现
        const scale = makeScale.call(this);
        this.rows.forEach((data, i) => {
          appendLinearGradient.call(this, data, i);
          append.call(this, data, i);
        })

        /**
         * 按比例计算数据对应到 svg 容器上的位置
         * @returns {{xScale: ScaleBand<string>, yScale: ScaleLinear<number, number, never>}}
         */
        function makeScale() {
          const xScale = d3Scale.scaleBand().range([0, offsetW]);
          xScale.domain(new Array(this.totalLen).fill().map((item, i) => i));
          // 按数据的 value 值在 y 轴上进行线性分段，即从最小值到最大值投射到容器高度 offsetH 上
          // 这里因为整体下移 svg 容器到父级容器一半的位置，所以线性分段也必须折算
          const yScale = d3Scale.scaleLinear().range([offsetH / 2, 0]);
          yScale.domain([0, this.maxValue]);
          return {
            xScale,
            yScale
          }
        }

        /**
         * 绘制柱形（矩形）
         * @param data 即 this.rows
         * @param i this.rows 内第几个数组
         */
        function append(data, i) {
          const _this = this;
          const g = svg.append('g');
          const bandWidth = scale.xScale.bandwidth();
          // 矩形之间的间隔
          const barGap = bandWidth / 5;
          g.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', function(d, k) {
              // i 第几组数据 k 在所属数据的第几个元素（注意和数据组区分，即原始数据的位置）
              // 如下述示意
              // |        |               |+++++++++++++++++|
              // A1       B1              C1                A2 ... A3
              // |________|_______________|_________________|
              //  i*barGap                k*(bandWidth + 2)
              // |————————————————————————|
              // k*_this.rowsLen + i - (i*barGap)
              return scale.xScale(k * _this.rowsLen + i) + (k * (bandWidth + 2)) + i * barGap;
            })
            .attr('y', function(d, k) {
              return scale.yScale(d.value);
            })
            .attr('width', bandWidth)
            .attr('height', function(d) {
              return (offsetH / 2 - scale.yScale(d.value));
            })
            .attr('fill', `url(#${linearGradientIdName + '_' + i})`)
            .attr('rx', 2)
            .attr('ry', 2);
        }
      });
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.chart {
  position: relative;
  width: 100%;
  height: 100%;

  .legend {
    position: absolute;
    right: 0;
    top: 0;
    >span {
      display: inline-block;
      margin-top: 8px;
      margin-right: 8px;
      font-size: 14px;
    }
    .red {
      color: #D61E37;
    }
    .green {
      color: #0F9B66;
    }
  }
}
</style>

