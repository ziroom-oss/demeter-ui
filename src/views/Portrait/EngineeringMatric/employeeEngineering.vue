<template>
  <el-card style="margin-top: 10px">
    <p style="font-size: 20px; font-weight: bold">员工工程指标统计</p>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-submenu index="1">
        <template slot="title">员工产出</template>
        <el-menu-item index="1-1">开发当量</el-menu-item>
        <el-menu-item index="1-2">代码行数</el-menu-item>
        <el-menu-item index="1-3">代码提交次数</el-menu-item>
        <!-- <el-menu-item index="1-4">项目数</el-menu-item>
        <el-menu-item index="1-5">功能数</el-menu-item>
        <el-menu-item index="1-6">修复bug数</el-menu-item>
        <el-menu-item index="1-7">开发价值</el-menu-item>
        <el-menu-item index="1-8">行价值密度</el-menu-item> -->
      </el-submenu>
      <!-- <el-submenu index="2">
        <template slot="title">员工效率</template>
        <el-menu-item index="2-1">项目平均开发周期</el-menu-item>
        <el-menu-item index="2-2">功能平均开发周期</el-menu-item>
        <el-menu-item index="2-3">bug平均修复时间</el-menu-item>
      </el-submenu> -->
      <el-submenu index="3">
        <template slot="title">员工发布</template>
        <el-menu-item index="3-1">发布次数</el-menu-item>
        <el-menu-item index="3-2">编译次数</el-menu-item>
        <el-menu-item index="3-3">上线次数</el-menu-item>
        <el-menu-item index="3-4">重启次数</el-menu-item>
        <el-menu-item index="3-5">回滚次数</el-menu-item>
      </el-submenu>
      <!-- <el-submenu index="4">
        <template slot="title">员工质量</template>
        <el-menu-item index="4-1">注释覆盖度</el-menu-item>
        <el-menu-item index="4-2">测试覆盖度</el-menu-item>
        <el-menu-item index="4-3">代码模块性</el-menu-item>
        <el-menu-item index="4-4">千行bug率</el-menu-item>
      </el-submenu> -->
      <!-- <el-submenu index="5">
        <template slot="title">员工成本</template>
        <el-menu-item index="5-1">总人数/研发人数/开发人员占比</el-menu-item>
        <el-menu-item index="5-2">休假天数</el-menu-item>
        <el-menu-item index="5-3">出勤工时/开发工时/工时饱和度</el-menu-item>
        <el-menu-item index="5-4">人均休假天数</el-menu-item>
      </el-submenu>
      <el-submenu index="6">
        <template slot="title">员工稳定性</template>
        <el-menu-item index="6-1">团队鲁棒性</el-menu-item>
        <el-menu-item index="6-2">团队稳定性</el-menu-item>
      </el-submenu> -->
    </el-menu>
    <el-card shadow="never">
       <p style="font-size: 18px; font-weight: bold">员工占比统计</p>
      <div ref="chart5" style="width: 100%; height: 400px; border: 1px solid gray"></div>
    </el-card>
    <el-card shadow="never">
      <p style="font-size: 18px; font-weight: bold">员工趋势统计Top20</p>
      <div ref="chart6" style="width: 100%; height: 400px; border: 1px solid gray"></div>
    </el-card>
  </el-card>
</template>
<script>
var option5;
var option6;
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
require('echarts/lib/component/toolbox');
require('echarts/lib/component/dataZoom');
export default {
  props: {
    employeeProportion: {
      type: Object,
      default: () => {}
    },
    employeeTendency: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    employeeProportion: {
      handler: function (value) {
        this.draw5(value.devEquivalentList, '开发当量')
      },
      deep: true
    },
    employeeTendency: {
      handler: function (value) {
        this.draw6(value.devEquivalentTendencyList, value.monthList, '开发当量');
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
      deptArray: []
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      switch (keyPath[1]) {
        case '1-1':
          this.draw5(this.employeeProportion.devEquivalentList, '开发当量')
          this.draw6(this.employeeTendency.devEquivalentTendencyList, this.employeeTendency.monthList, '开发当量');
          break;
        case '1-2':
          this.draw5(this.employeeProportion.codeLineList, '代码行数')
          this.draw6(this.employeeTendency.codeListTendencyList, this.employeeTendency.monthList, '代码行数');
          break;
        case '1-3':
          this.draw5(this.employeeProportion.commitList, '代码提交次数')
          this.draw6(this.employeeTendency.commitTendencyList, this.employeeTendency.monthList, '代码提交次数');
          break;
        case '3-1':
          this.draw5(this.employeeProportion.publishList, '发布次数')
          this.draw6(this.employeeTendency.publishTendencyList, this.employeeTendency.monthList, '发布次数');
          break;
        case '3-2':
          this.draw5(this.employeeProportion.compileList, '编译次数')
          this.draw6(this.employeeTendency.compileTendencyList, this.employeeTendency.monthList, '编译次数');
          break;
        case '3-3':
          this.draw5(this.employeeProportion.onlineList, '上线次数')
          this.draw6(this.employeeTendency.onlineTendencyList, this.employeeTendency.monthList, '上线次数');
          break;
        case '3-4':
          this.draw5(this.deptProportion.restartList, '重启次数')
          this.draw6(this.employeeTendency.rollbackTendencyList, this.employeeTendency.monthList, '重启次数');
          break;
        case '3-5':
          this.draw5(this.employeeProportion.rollbackList, '回滚次数')
          this.draw6(this.employeeTendency.restartTendencyList, this.employeeTendency.monthList, '回滚次数');
          break;
        default:
          break;
      }
    },
    refresh () {
    },
    draw5 (list, name) {
      const categoryData = list.map(i => {
        return i.name
      })
      const valueData = list.map(i => {
        return i.value
      })
      this.charts5 = echarts.init(this.$refs.chart5)
      this.charts5.setOption(option5 = {
        title: {
          text: name,
          left: 'center'
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: false
            },
            saveAsImage: {
              pixelRatio: 2
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          bottom: 90
        },
        dataZoom: [{
          type: 'inside'
        }, {
          type: 'slider'
        }],
        xAxis: {
          data: categoryData,
          silent: false,
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          }
        },
        yAxis: {
          splitArea: {
            show: false
          }
        },
        series: [{
          type: 'bar',
          data: valueData,
          // Set `large` for large data amount
          large: true
        }]
      }, true)
    },
    draw6 (list, monthList, name) {
      const legend = list.map(i => {
        return i.name
      })
      this.charts6 = echarts.init(this.$refs.chart6)
      this.charts6.setOption(option6 = {
        title: {
          text: name,
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: legend,
          top: '10%',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '25%',
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
    }
  }
}
</script>