<template>
  <el-card style="margin-top: 10px">
  <el-tooltip placement="top" effect="light">
    <div slot="content">
      <span>数据来源于EHR系统</span>
    </div>
    <span style="font-size: 20px; font-weight: bold">团队概览<i class="el-icon-question"></i></span>
  </el-tooltip>
  <div class="parent">
    <div ref="chart1" class="child" style="width: 49%; height: 400px; border: 1px solid gray"></div>
    <div ref="chart2" class="child" style="width: 49%; height: 400px; border: 1px solid gray"></div>
  </div>
  <div class="parent">
    <div style="border: 1px solid gray; width: 49%">
      <div style="display: flex; flex-direction: row-reverse; margin-right: 20px">
        <el-select
          @change="changeJobSeries"
          v-model="jobSeries"
          size="small"
          style="margin: 10px 0 0 370px"
          placeholder="请选择职级序列">
          <el-option
            v-for="item in jobSeriesList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div ref="chart3" class="child" style="width: 100%; height: 400px;">
      </div>
    </div>
    <div style="border: 1px solid gray; width: 49%; margin-top:">
      <div style="margin-top: 45px">
        <div ref="chart4" class="child" style="width: 100%; height: 400px;"></div>
      </div>
    </div>
  </div>
</el-card>
</template>
<script>
import ehrServer from '@/apis/ehr.js';
import portraitServer from '@/apis/portrait.js';

const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/chart/pie')
require('echarts/lib/component/grid')
require('echarts/lib/chart/bar')
require('echarts/lib/component/timeline')
require('echarts/lib/component/visualMap')
require('echarts/lib/component/calendar')

var option1; // 部门占比
var option2; // 职务占比
var option3; // 职级占比
var option4; // 入职年限占比
export default {
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    params: {
      immediate: true,
      handler: function (value) {
        this.refresh()
      }
    }
  },
  data () {
    return {
      jobSeries: '',
      jobSeriesList: ['M', 'P', 'S', 'T'],
      charts1: '',
      charts2: '',
      charts3: '',
      charts4: '',
      deptInfo: [],
    }
  },
  methods: {
    changeJobSeries (value) {
      console.log(value);
      this.selectLevelInfo = []
      console.log(this.levelInfo);
      this.selectLevelInfo = this.levelInfo.map(level => {
        if (level['name'].startsWith(value)) {
          return level
        }
      })
      this.draw3()
    },
    refresh () {
      portraitServer.getCtoData(this.params).then(data => {
        console.log(this.params);
        this.deptInfo = data.deptInfo
        this.jobInfo = data.jobInfo
        this.levelInfo = data.levelInfo
        this.selectLevelInfo = data.levelInfo
        this.hireDateInfo = data.hireDateInfo
        this.draw1()
        this.draw2()
        this.charts3 = echarts.init(this.$refs.chart3)
        this.draw3()
        this.draw4()
      })
    },
    draw1 () {
      this.charts1 = echarts.init(this.$refs.chart1)
      this.charts1.setOption(option1 = {
        title: {
          text: '部门占比',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '40%',
            center: ['50%', '50%'],
            data: this.deptInfo,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            label: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#6E7079',
                  lineHeight: 12,
                  align: 'center'
                },
                b: {
                  color: '#4C5058',
                  fontSize: 8,
                  fontWeight: 'bold',
                  lineHeight: 23
                },
                per: {
                  color: '#fff',
                  backgroundColor: '#4C5058',
                  padding: [3, 4],
                  borderRadius: 4
                }
              }
            },
          }
        ]
      })
    },
    draw2 () {
      this.charts2 = echarts.init(this.$refs.chart2)
      const data = {
        legendData: this.jobInfo.map(job => {
          return job.name
        }),
        seriesData: this.jobInfo,
      }
      this.charts2.setOption(option2 = {
        title: {
          text: '职务占比',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 5,
          top: 20,
          bottom: 20,
          data: data.legendData,
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '40%',
            center: ['35%', '50%'],
            data: data.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    draw3 () {
      this.charts3.setOption(option3 = {
        title: {
          text: '职级占比',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '40%',
            center: ['50%', '50%'],
            data: this.selectLevelInfo,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              alignTo: 'edge',
              formatter: '{name|{b}} {time|{c} 人}',
              minMargin: 1,
              edgeDistance: 50,
              lineHeight: 12,
              rich: {
                time: {
                  fontSize: 10,
                  color: '#999'
                }
              }
            },
          }
        ]
      })
    },
    draw4 () {
      this.charts4 = echarts.init(this.$refs.chart4)
      this.charts4.setOption(option4 = {
        title: {
          text: '入职年限占比',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          top: '35%',
          left: '75%'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '40%',
            center: ['35%', '50%'],
            data: this.hireDateInfo,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
  }
}
</script>