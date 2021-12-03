<template>
  <div>
    <div ref="chartDom" style="width: 1200px; height: 600px;"></div>
  </div>
</template>

<script>
import { RouteConfig, Component, Vue } from '@ziroom/cherry2-decorator';
import portraitServer from '@/apis/portrait.js';
const echarts = require('echarts/lib/echarts');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend');
require('echarts/lib/chart/pie');
var option;
@Component({
  mounted () {
    this.charts = echarts.init(this.$refs.chartDom)
    this.$nextTick(function() {
      // 默认查询所有别名，近一个月的数据
      // const params = {
      //   // alias: "94a278ccb31bf83d6297596cc48b40ba",
      //   startTime: dayjs().startOf('month').valueOf(),
      //   endTime: dayjs().endOf('month').valueOf()
      // };
      // this.drawLine(params);
    })
    this.draw()
  },
  data () {
    return {
      charts: '',
    }
  },
  methods: {
    refresh () {
    },
    query () {
    },
    draw () {
      this.charts.setOption(option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {value: 22, name: '待认领'},
              {value: 2, name: '已拒绝'},
              {value: 23, name: '进行中'},
              {value: 20, name: '已完成'},
              {value: 1, name: '未完成'},
              {value: 12, name: '验收通过'},
              {value: 4, name: '验收不通过'}
            ]
          }
        ]
      })
    },
  }
})
@RouteConfig({
  layout: true,
  name: 'DailyTask',
  title: '日常任务-废弃',
  hidden: true
})
export default class App extends Vue {
}
</script>
