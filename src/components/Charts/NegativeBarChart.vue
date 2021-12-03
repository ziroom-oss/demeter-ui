<template>
  <section :id="idName" :style="style"></section>
</template>

<script>
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
]);

export default {
  props: {
    category: {
      type: Array,
      default: function() {
        return [];
      }
    },
    series: {
      type: Array,
      default: function() {
        return [];
      }
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      idName: '',
      chartInstance: null,
    }
  },
  created() {
    this.idName = 'chart_' + this.$random(1000000, 99999999);
  },
  computed: {
    style() {
      return `width: ${this.width}; height: ${this.height}`;
    }
  },
  watch: {
    series: {
      immediate: true,
      deep: true,
      handler: function(value) {
        if (value.length < 1) return;
        if (!this.chartInstance) {
          this.render();
        } else {
          this.chartInstance.setOption(this.getOption());
        }
      }
    },
  },
  methods: {
    render() {
      this.$nextTick(() => {
        const chartDom = document.getElementById(this.idName);
        if (chartDom) {
          if (this.chartInstance) {
            this.chartInstance.setOption(this.getOption());
          } else {
            this.chartInstance = echarts.init(chartDom);
            this.chartInstance.setOption(this.getOption());
          }
        }
      })
    },
    getOption() {
      const dataRight = this.series[0];
      const dataLeft = this.series[1];
      return {
        color: ['#EB8245', '#1295DE'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: function(params) {
            const [right, left] = params;
            return `${left.marker} ${left.seriesName}: ${Math.abs(left.value)}<br />${right.marker} ${right.seriesName}: ${Math.abs(right.value)}`
          }
        },
        grid: {
          left: 150,
          bottom: 35,
        },
        legend: {
          type: 'scroll',
          top: '0',
          left: '4',
          icon: 'circle',
          orient: 'vertical',
          textStyle: {
            fontSize: '12',
          },
        },
        xAxis: [
          {
            type: 'value',
            splitLine: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#000',
                opacity: 0.28,
              }
            },
            axisLabel: {
              fontSize: 10,
              formatter: function(value) {
                return Math.abs(value);
              }
            },
          }
        ],
        yAxis: [
          {
            type: 'category',
            axisLine: {
              show: false,
            },
            axisTick: { show: false }, // bar 之间的刻度
            splitLine: {
              show: false,
            },
            data: this.category,
          }
        ],
        series: [
          {
            name: dataRight.name,
            type: 'bar',
            stack: 'Total',
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: dataRight.data,
            itemStyle: {
              normal: {
                color: function() {
                  return new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                    offset: 0,
                    color: '#EB8245',
                  }, {
                    offset: 1,
                    color: '#F7B87B',
                  }])
                },
                barBorderRadius: 4,
                borderColor: '#fff',
                borderWidth: 2,
              }
            },

          },
          {
            name: dataLeft.name,
            type: 'bar',
            stack: 'Total',
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            barMaxWidth: 17,
            data: dataLeft.data,
            itemStyle: {
              normal: {
                color: function() {
                  return new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                    offset: 0,
                    color: '#A1D8F7',
                  }, {
                    offset: 1,
                    color: '#1295DE',
                  }])
                },
                barBorderRadius: 4,
                borderColor: '#fff',
                borderWidth: 2,
              }
            },
          }
        ]
      }
    }
  }
}
</script>
