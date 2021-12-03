<template>
  <el-card style="margin-top: 10px">
    <el-tooltip placement="top" effect="light">
      <div slot="content">
        <span>数据来源于Omega</span>
      </div>
      <span style="font-size: 20px; font-weight: bold">部门工程指标统计<i class="el-icon-question"></i></span>
    </el-tooltip>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-submenu index="1">
        <template slot="title">部门产出</template>
        <el-menu-item index="1-1">开发当量</el-menu-item>
        <el-menu-item index="1-2">代码行数</el-menu-item>
        <el-menu-item index="1-3">代码提交次数</el-menu-item>
        <!-- <el-menu-item index="1-4">项目数</el-menu-item> -->
        <!-- <el-menu-item index="1-5">功能数</el-menu-item> -->
        <!-- <el-menu-item index="1-6">修复bug数</el-menu-item> -->
        <!-- <el-menu-item index="1-7">开发价值</el-menu-item>
        <el-menu-item index="1-8">行价值密度</el-menu-item> -->
      </el-submenu>
      <!-- <el-submenu index="2">
        <template slot="title">部门效率</template>
        <el-menu-item index="2-1">项目平均开发周期</el-menu-item>
        <el-menu-item index="2-2">功能平均开发周期</el-menu-item>
        <el-menu-item index="2-3">bug平均修复时间</el-menu-item>
      </el-submenu> -->
      <el-submenu index="3">
        <template slot="title">部门发布</template>
        <el-menu-item index="3-1">发布次数</el-menu-item>
        <el-menu-item index="3-2">编译次数</el-menu-item>
        <el-menu-item index="3-3">上线次数</el-menu-item>
        <el-menu-item index="3-4">重启次数</el-menu-item>
        <el-menu-item index="3-5">回滚次数</el-menu-item>
      </el-submenu>
      <!-- <el-submenu index="4">
        <template slot="title">部门质量</template>
        <el-menu-item index="4-1">注释覆盖度</el-menu-item>
        <el-menu-item index="4-2">测试覆盖度</el-menu-item>
        <el-menu-item index="4-3">代码模块性</el-menu-item>
        <el-menu-item index="4-4">千行bug率</el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">部门成本</template>
        <el-menu-item index="5-1">总人数/研发人数/开发人员占比</el-menu-item>
        <el-menu-item index="5-2">休假天数</el-menu-item>
        <el-menu-item index="5-3">出勤工时/开发工时/工时饱和度</el-menu-item>
        <el-menu-item index="5-4">人均休假天数</el-menu-item>
      </el-submenu>
      <el-submenu index="6">
        <template slot="title">部门稳定性</template>
        <el-menu-item index="6-1">团队鲁棒性</el-menu-item>
        <el-menu-item index="6-2">团队稳定性</el-menu-item>
      </el-submenu> -->
    </el-menu>
    <el-card shadow="never">
       <p style="font-size: 18px; font-weight: bold">部门占比统计</p>
      <div ref="chart5" style="width: 100%; height: 400px; border: 1px solid gray"></div>
    </el-card>
    <el-card shadow="never">
      <p style="font-size: 18px; font-weight: bold">部门趋势统计</p>
      <div ref="chart6" style="width: 100%; height: 450px; border: 1px solid gray"></div>
    </el-card>
    <el-card shadow="never">
      <p style="font-size: 18px; font-weight: bold">部门效率与稳定性统计</p>
      <!-- <div ref="chart7" style="width: 100%; height: 400px; border: 1px solid gray"></div> -->
      <div ref="behaviorChart" style="width: 100%; height: 400px;"></div>
    </el-card>
  </el-card>
</template>
<script>
var option5;
var option6;
var behaviorChartOption;
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
export default {
  props: {
    params: {
      type: Object,
      default: () => {}
    },
    deptProportion: {
      type: Object,
      default: () => {}
    },
    deptTendency: {
      type: Object,
      default: () => {}
    },
    deptEffAndStab: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    // params: {
    //   immediate: true,
    //   handler: function (value) {
    //     this.refresh()
    //   }
    // }
    deptProportion: {
      handler: function (value) {
        console.log(value);
        this.draw5(value.devEquivalentList, '开发当量')
      },
      deep: true
    },
    deptTendency: {
      handler: function (value) {
        this.draw6(value.devEquivalentTendencyList, value.monthList, '开发当量');
      },
      deep: true
    },
    deptEffAndStab: {
      handler: function (value) {
        this.activeBehaviorChart(value);
      },
      deep: true
    }
  },
  created () {

  },
  mounted () {
  },
  data () {
    return {
      deptDE: [],
      activeIndex: '1-1',
      charts5: '',
      charts6: '',
      behaviorCharts: ''
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      switch (keyPath[1]) {
        case '1-1':
          this.draw5(this.deptProportion.devEquivalentList, '开发当量')
          this.draw6(this.deptTendency.devEquivalentTendencyList, this.deptTendency.monthList, '开发当量');
          break;
        case '1-2':
          this.draw5(this.deptProportion.codeLineList, '代码行数')
          this.draw6(this.deptTendency.codeListTendencyList, this.deptTendency.monthList, '代码行数');
          break;
        case '1-3':
          this.draw5(this.deptProportion.commitList, '代码提交次数')
          this.draw6(this.deptTendency.commitTendencyList, this.deptTendency.monthList, '代码提交次数');
          break;
        case '3-1':
          this.draw5(this.deptProportion.publishList, '发布次数')
          this.draw6(this.deptTendency.publishTendencyList, this.deptTendency.monthList, '发布次数');
          break;
        case '3-2':
          this.draw5(this.deptProportion.compileList, '编译次数')
          this.draw6(this.deptTendency.compileTendencyList, this.deptTendency.monthList, '编译次数');
          break;
        case '3-3':
          this.draw5(this.deptProportion.onlineList, '上线次数')
          this.draw6(this.deptTendency.onlineTendencyList, this.deptTendency.monthList, '上线次数');
          break;
        case '3-4':
          this.draw5(this.deptProportion.restartList, '重启次数')
          this.draw6(this.deptTendency.rollbackTendencyList, this.deptTendency.monthList, '重启次数');
          break;
        case '3-5':
          this.draw5(this.deptProportion.rollbackList, '回滚次数')
          this.draw6(this.deptTendency.restartTendencyList, this.deptTendency.monthList, '回滚次数');
          break;
        default:
          break;
      }
    },
    refresh () {
    },
    draw5 (list, name) {
      const l = this.deepClone(list);
      this.charts5 = echarts.init(this.$refs.chart5)
      this.charts5.setOption(option5 = {
        title: {
          text: name,
          textAlign: 'auto'
        },
        legend: {
          top: 'center',
          orient: 'vertical',
          left: '80%'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: [30, 150],
            center: ['30%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: l.sort((a, b) => b.value - a.value),
            label: {
              formatter: '{name|{b}} {time|{c}}',
              minMargin: 1,
              edgeDistance: 500,
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
      }, true)
    },
    draw6 (list, monthList, name) {
      const legend = list.map(i => {
        return i.name
      })
      console.log(legend);
      this.charts6 = echarts.init(this.$refs.chart6)
      this.charts6.setOption(option6 = {
        title: {
          text: name
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '10%',
          data: legend
        },
        grid: {
          left: '6%',
          right: '6%',
          top: '25%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: monthList
        },
        yAxis: {
          type: 'value'
        },
        series: list
      }, true);
    },
    activeBehaviorChart (list) {
      let newPromise = new Promise((resolve) => {
        resolve()
      })
      newPromise.then(() => {
        this.behaviorCharts = echarts.init(this.$refs.behaviorChart)
        this.behaviorCharts.setOption(behaviorChartOption = {
          title: {
            text: '',
            subtext: ''
          },
          grid: {
            left: '5%',
            right: '10%',
            bottom: '0%',
            top: '10%',
            containLabel: true
          },
          tooltip: {
            show: true,
            position: 'top',
            formatter: function (params) {
              return params.value[0] + ',' + params.value[1] + '|' + params.value[2]
            }
          },
          // tooltip: {
          //     // trigger: 'axis',
          //     showDelay: 0,
          //     formatter: function (params) {
          //         if (params.value.length > 1) {
          //             return params.seriesName + ' :<br/>'
          //             + params.value[0] + 'cm '
          //             + params.value[1] + 'kg ';
          //         }
          //         else {
          //             return params.seriesName + ' :<br/>'
          //             + params.name + ' : '
          //             + params.value + 'kg ';
          //         }
          //     },
          //     axisPointer: {
          //       show: true,
          //       type: 'cross',
          //       lineStyle: {
          //         type: 'dashed',
          //         width: 1
          //       }
          //     },
          // },
          xAxis: [
            {
              type: 'value',
              // scale: true,
              axisLabel: {
                formatter: '{value}'
              },
              splitLine: {
                show: false
              },
              name: '人均当量'
            }
          ],
          yAxis: [
            {
              type: 'value',
              // scale: true,
              axisLabel: {
                formatter: '{value}'
              },
              splitLine: {
                show: false
              },
              name: '离散系数'
            }
          ],
          series: [
            {
              name: '',
              type: 'scatter',
              emphasis: {
                focus: 'series'
              },
              symbol: 'circle',
              symbolSize: 20,
              data: list,
              markArea: {
                silent: true,
                itemStyle: {
                  color: 'transparent',
                  borderWidth: 1,
                  borderType: 'dashed'
                },
                label: {
                  position: 'inside',
                  color: 'black'
                },
                data: [
                  [{name: '高稳定性-低效', xAxis: '0', yAxis: '0'}, {xAxis: 'average', yAxis: 'average'}],
                  [{name: '高稳定性-高效', xAxis: 'average', yAxis: '0'}, {xAxis: 'max', yAxis: 'average'}],
                  [{name: '低稳定性-低效', xAxis: '0', yAxis: 'average'}, {xAxis: 'average', yAxis: 'max'}],
                  [{name: '低稳定性-高效', xAxis: 'average', yAxis: 'average'}, {xAxis: 'max', yAxis: 'max'}],
                ]
              },
            },
          ],
        })
      }, true)
    },
    deepClone (obj) {
      if (!this.isObject(obj)) {
        throw new Error('obj 不是一个对象！')
      }
      let isArray = Array.isArray(obj)
      let cloneObj = isArray ? [...obj] : { ...obj }
      Reflect.ownKeys(cloneObj).forEach(key => {
        cloneObj[key] = this.isObject(obj[key]) ? this.deepClone(obj[key]) : obj[key]
      })
      return cloneObj
    },
    isObject(o) {
      return (typeof o === 'object' || typeof o === 'function') && o !== null
    }
  }
}
</script>