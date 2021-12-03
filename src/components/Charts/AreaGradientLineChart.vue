<template>
  <section :id="idName" :style="style"></section>
</template>

<script>
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
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
        this.chartInstance = echarts.init(chartDom);
        this.chartInstance.setOption(option);
      })

    },
    getOption(data) {
    }
  }
}
</script>
