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
import * as d3Interpolators from 'd3-interpolate';

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
        return [['#fff', '#7635E6']]
      }
    }
  },
  data() {
      return {
        idName: null,
        rows: [], // 预处理的图形数据
        maxValue: 0,
        minValue: 0,
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

        const comparisonMaxArray = [];
        const comparisonMinArray = [];
        this.rows = value.reduce((acc, curr) => {
          // 将每一行数据转为以[下标]为 key 的对象
          const row = curr.reduce((set, curr, index) => {
            const item = {};
            item.key = index;
            item.value = curr;
            set.push(item);
            return set;
          }, []);
          // 找出每一个 row 中的最大值并压入 comparisonMaxArray
          comparisonMaxArray.push(d3Array.max(row, item => item.value));
          comparisonMinArray.push(d3Array.min(row, item => item.value));
          acc.push(row);
          return acc;
        }, []);
        // 登记 comparisonMaxArray 中的最大值
        this.maxValue = Math.max(...comparisonMaxArray);
        this.minValue = Math.min(...comparisonMinArray);
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
          return console.warn('获取不到 chart 的父容器，请检查 chart 组件的父级是否有明确的宽和高');
        }

        const svg = d3Selection.select('#' + this.idName)
          .append('svg')
          .attr('width', offsetW)
          .attr('height', offsetH)
          .attr('viewBox', `0, 0, ${offsetW}, ${offsetH}`)
          .attr('preserveAspectRatio', 'none')

        this.rows.forEach((data, i) => {
          append.call(this, data, i);
        })

        function makeScale(data) {
          const yScale = function(value) {
            // 先不使用参数，纵坐标固定在容器高度一半
            return offsetH / 1.5;
          }

          // 将数据中的 value 映射到容器高度的一半，相当于通过数据值求出泡泡的半径，而容器高度一半是为了限定泡泡的最大值（避免占据整个容器的情况）
          // 不用 offsetW 的原因是宽度远大于高度，使用它会导致泡泡所占区域过大
          const xScale = d3Scale.scaleLinear().range([0, offsetH / 2]);
          xScale.domain([0, this.maxValue]);

          return {
            xScale,
            yScale,
          }
        }

        function makeLineGradient(value) {
          const color = this.colors[0];
          const linearColors = d3Scale.scaleLinear().domain([this.minValue, this.maxValue]).range([0, 1]);
          const interpolatorsGenerator = d3Interpolators.interpolate(color[0], color[1]);
          // 给 svg 容器添加一个渐变定义
          const linearGradientIdName = this.idName + '_' + 'linearGradient' + '_' + this.$random(100000, 999999);
          const stopColorBot = interpolatorsGenerator(linearColors(value / 1.5));
          const stopColorTop = interpolatorsGenerator(linearColors(value));
          // console.info(stopColorBot, stopColorTop);
          const linearGradient = svg.append('defs').append('linearGradient')
            .attr('id', linearGradientIdName)
            .attr('x1', '0')
            .attr('y1', '0')
            .attr('x2', '0')
            .attr('y2', '100%')
          linearGradient.append('stop')
            .attr('offset', '0%')
            .attr('style', `stop-color:${stopColorBot}`)
          linearGradient.append('stop')
            .attr('offset', '100%')
            .attr('style', `stop-color:${stopColorTop};`)
          return linearGradientIdName;
        }

        function append(data, i) {
          const _this = this;
          const g = svg.append('g');
          const scale = makeScale.call(this, data);
          let tempRadius = [];

          g.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('r', function(d, k) {
              const r = scale.xScale(d.value) / 2;
              tempRadius.push(r);
              return r;
            })
            .attr('cx', function(d, k) {
              if (k < 1) {
                return tempRadius[k];
              } else {
                let sum = 0;
                for (let i = 0; i < k; i++) {
                  sum += tempRadius[i] * 2 + 2;
                }
                sum += tempRadius[k];
                return sum;
              }
            })
            .attr('cy', function(d) {
              return scale.yScale(d.value);
            })
            .attr('fill', d => `url(#${makeLineGradient.call(_this, d.value)})`)
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

