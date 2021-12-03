<template>
  <section :id="idName" :style="style"></section>
</template>

<script>
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import * as d3Interpolators from 'd3-interpolate';
import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
  LabelLayout
]);

export default {
  props: {
    data: {
      type: Array,
      default: function () {
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
    data: {
      immediate: true,
      deep: true,
      handler: function(value) {
        if (value.length < 1) return;
        if (!this.chartInstance) {
          this.render();
        }
      }
    }
  },
  methods: {
    render() {
      this.$nextTick(() => {
        const option = this.getOption(this.data);
        const chartDom = document.getElementById(this.idName);
        if (chartDom) {
          if (this.chartInstance) {
            this.chartInstance.setOption(option);
          } else {
            this.chartInstance = echarts.init(chartDom);
            this.chartInstance.setOption(option);
          }
        }
      })

    },
    getOption(data) {
      const maxValue = d3Array.max(data, item => item.value);
      const minValue = d3Array.min(data, item => item.value);
      const linearColors = d3Scale.scaleLinear().domain([minValue, maxValue]).range([0, 1]);
      const interpolatorsGenerator = d3Interpolators.interpolate('#E7F1FC', '#7B40E7');
      return {
        title: {
          text: 'total',
          top: 'center',
          left: '58%'
        },
        tooltip: {
          trigger: 'item',
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
          pageIconSize: 6,
        },
        series: [
          {
            type: 'pie',
            radius: [70, 115],
            avoidLabelOverlap: false,
            center: ['62%', 140],
            itemStyle: {
              normal: {
                color: function(params) {
                  return new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: interpolatorsGenerator(linearColors(params.value)),
                  }, {
                    offset: 1,
                    color: interpolatorsGenerator(linearColors(params.value / 3)),
                  }])
                },
                borderColor: '#fff',
                borderWidth: 1,
              }
            },
            label: {
              fontSize: 10,
              formatter: function(params) {
                return params.data.value;
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data,
          }
        ]
      }
    }
  }
}
</script>
