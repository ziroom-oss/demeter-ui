<template>
    <section class="chart" :id="idName" :style="style">
      <div class="legend">
        <template v-for="item in legends">
          <!-- {{legends}} -->
          <span v-if="item.type === 'increase'" class="green"><i class="el-icon-caret-top"></i>{{ item.value }}</span>
          <span v-if="item.type === 'decrease'" class="red"><i class="el-icon-caret-bottom"></i>{{ item.value }}</span>
        </template>
      </div>
    </section>
</template>

<script>
import * as d3Selection from 'd3-selection';
import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';

import { cloneDeep } from 'lodash-es';
import d3ReRender from "./mixins/d3ReRender";
import d3DataValidate from "./mixins/d3DataValidate";

export default {
  mixins: [
    d3ReRender,
    d3DataValidate,
  ],
  props: {
    data: {
      type: Array,
      default: function() {
        /**
         * 二维数组内的每一个数组生成一条折线
         */
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
    color: {
      type: String,
      default: '#000',
    }
  },
  data() {
      return {
        idName: null,
        rows: [], // 预处理的图形数据
        maxValue: 0,
        legends: [],
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
        this.rows = value.reduce((acc, curr) => {
          // 将每一行数据转为以[下标]为 key 的对象
          const row = curr.reduce((set, curr, index) => {
            const item = {};
            item.key = index;
            item.value = curr;
            set.push(item);
            return set;
          }, []);
          comparisonArray.push(d3Array.max(row, item => item.value));
          acc.push(row);
          return acc;
        }, []);
        this.maxValue = Math.max(...comparisonArray);
        this.render();
      }
    },
  legend: {
      deep: true,
      immediate: true,
      handler: function(value) {
        this.$set(this, 'legends', value);
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
          return console.warn('获取不到 chart 的父容器，请检查 chart 组件的父级是否有明确的宽和高')
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
        const linearGradient = svg.append('defs').append('linearGradient')
          .attr('id', linearGradientIdName)
          .attr('x1', '50%')
          .attr('y1', '0')
          .attr('x2', '50%')
          .attr('y2', '100%')
        linearGradient.append('stop')
          .attr('offset', '0%')
          .attr('style', `stop-color:${this.color};stop-opacity:0.2`)
        linearGradient.append('stop')
          .attr('offset', '100%')
          .attr('style', 'stop-color:rgb(255,255,255);stop-opacity:0.2')

        // 先绘制多边形，再绘制折现
        this.rows.forEach(data => {
          appendPolygon.call(this, data);
          append.call(this, data);
        })

        /**
         * 按比例计算数据对应到 svg 容器上的位置
         * @param data
         * @returns {{xScale: ScaleBand<string>, yScale: ScaleLinear<number, number, never>}}
         */
        function makeScale(data) {
          const maxValue = this.maxValue;
          // 按数据的 key 值（事先计算好的 1 2 3 4 5...）等比分段
          const xScale = d3Scale.scaleBand().range([0, offsetW]);
          xScale.domain(data.map(item => item.key));
          // 按数据的 value 值在 y 轴上进行线性分段，即从最小值到最大值投射到容器高度 offsetH 上
          // 这里因为整体下移 svg 容器到父级容器一半的位置，所以线性分段也必须折算
          const yScale = d3Scale.scaleLinear().range([offsetH / 2, 0]);
          yScale.domain([0, maxValue]);
          return {
            xScale,
            yScale
          }
        }

        function append(data) {
          const scale = makeScale.call(this, data);
          const lineGenerator = d3Shape.line()
            .x(d => {
              return scale.xScale(d.key) + scale.xScale.bandwidth() / 2;
            })
            .y(d => {
              return scale.yScale(d.value);
            })
            .curve(d3Shape.curveLinear);

          svg.append('path')
            .attr('d', lineGenerator(data))
            .attr('fill', 'none')
            .attr('stroke', this.color);
        }

        function appendPolygon(value) {
          let data = cloneDeep(value);
          const scale = makeScale.call(this, data);

          let rows = data.map(d => {
            // 返回分段比例尺（scaleBand）每一段宽度的中点；在其它情况不一定要这么做，但是本折线图并不表达具体数值，因为更多投入到外观上
            // 举个例子，scale.xScale(d.key) 可能是 0，那么加上 xScale.bandWidth() / 2 相当于移动到分段的中点
            // 附：scaleBand 分段比例尺通常用于柱形图
            return [scale.xScale(d.key) + scale.xScale.bandwidth() / 2, scale.yScale(d.value)]
          }).sort((a, b) => {
            return a.value > b.value;
          });

          // 构造一个 polygon 多边形所需要的数据
          const maxItemValue = d3Array.max(rows, item => item[1]);
          const firstSlice = rows.slice(0, 1);
          const lastSlice = rows.slice(1);
          // 添加一个与原数组第一个元素相同 x 坐标，最大 y 坐标的元素到最前面
          let points = [[firstSlice[0][0], maxItemValue]]
            .concat(firstSlice)
            .concat(lastSlice)
          // 添加一个与原数组末尾元素相同 x 坐标，最大 y 坐标的元素到最后面
          // 完成两步操作以后，相当于构造一个以折线图顶点为上部顶点，并添加左右两点在最下方的多边形
          // /\/\/\
          // |    |
          // ------
          points.push([d3Array.max(rows, item => item[0]), maxItemValue]);

          // 使用字符串的原因是 d3 会修改数组类型的参数
          const pointsStr = points.reduce((acc, curr) => {
            acc = acc + ' ' + curr.join(',');
            return acc;
          }, '')
          svg.append('polygon')
            .attr('points', pointsStr)
            .attr('fill', `url(#${linearGradientIdName})`)
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

