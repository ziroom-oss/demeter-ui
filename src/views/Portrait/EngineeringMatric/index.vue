<template>
  <div>
    <p style="font-weight: bold; font-size: 18px">工程管理</p>
    <el-container>
      <el-main>
        <el-card>
          <el-row :gutter="20">
            <el-col :span="5">
              <el-select
                v-model="searchFilter.deptId"
                @change="refresh"
                placeholder="请选择部门"
                size="small">
                <el-option
                  v-for="item in deptList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <!-- <el-col :span="5">
              <el-date-picker
                @change="refresh"
                v-model="searchFilter.daterange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small">
              </el-date-picker>
            </el-col> -->
            <div class="block" :span="5">
              <el-date-picker
                v-model="searchFilter.month"
                type="month"
                placeholder="选择日期"
                size="small"
                @change="changeMonth">
              </el-date-picker>
            </div>
          </el-row>
        </el-card>
        <overview :params="params" :teamOverviewResp="teamOverviewResp"/>
        <team-overview :params="params"/>
        <dept-engineering :params="params" :deptProportion="deptProportion" :deptTendency="deptTendency" :deptEffAndStab="deptEffAndStab"/>
        <div style="display: flex; margin-top: 20px">
          <dept-cascader style="width: 30%" @change="getCascaderValue" :value="deptArray" ref="cascader"></dept-cascader>
          <el-select
            v-model="searchFilter.selectUserCode"
            placeholder="姓名/工号/邮箱前缀"
            filterable
            remote
            clearable
            multiple
            :loading="loading"
            :remote-method="queryPeople"
            size="small"
            style="margin-left: 20px; width: 40%"
            @change="changeSelectPeople"
          >
            <el-option v-for="item in employeeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </div>
        <employee-engineering :params="params" :employeeProportion="employeeProportion" :employeeTendency="employeeTendency"/>
        <el-card style="margin-top: 10px">
          <p style="font-size: 20px; font-weight: bold">项目工程指标统计</p>
          <el-tabs v-model="activeName" type="card" @tab-click="handleProjectClick">
            <el-tab-pane label="开发当量" name="first"></el-tab-pane>
            <el-tab-pane label="代码行数" name="second"></el-tab-pane>
          </el-tabs>
          <div ref="chart6" style="width: 100%; height: 400px; border: 1px solid gray"></div>
        </el-card>
        <level-engineering :params="params" :levelProportion="levelProportion" :levelTendency="levelTendency"/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { RouteConfig, Component, Vue } from '@ziroom/cherry2-decorator';
import portraitServer from '@/apis/portrait.js';
import authServer from '@/apis/authorize.js';
import ehrServer from '@/apis/ehr.js';
import { getUserinfo } from '@ziroom/zcloud-head';
import { isEmpty } from 'lodash-es';
import overview from "@/views/Portrait/EngineeringMatric/overview.vue";
import teamOverview from "@/views/Portrait/EngineeringMatric/teamOverview.vue";
import deptEngineering from "@/views/Portrait/EngineeringMatric/deptEngineering";
import employeeEngineering from "@/views/Portrait/EngineeringMatric/employeeEngineering";
import LevelEngineering from './levelEngineering.vue';
import DeptCascader from '@/components/Dept/DeptCascader.vue';

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

var option5; // 部门工程指标统计-开发当量|代码行数|处理问题数|开发总工时
var option6; // 项目工程指标统计-开发当量|代码行数|处理问题数|开发总工时
var option7; // 周期工程指标统计-开发当量|代码行数|处理问题数|开发总工时
var option8; // 职级工程指标统计-开发当量|代码行数|处理问题数|开发总工时

@Component({
  components: {
    teamOverview,
    overview,
    deptEngineering,
    employeeEngineering,
    LevelEngineering,
    DeptCascader
  },
  watch: {
  },
  created () {

  },
  mounted () {
    this.initDept()
    this.refresh()
  },
  data () {
    return {
      deptArray: [],
      params: {},
      deptList: [
        {
          value: '100117',
          label: '智能家装事业群',
        },
        {
          value: '100363',
          label: '自如家服平台',
        },
        {
          value: '102303',
          label: '互联网营销运营平台'
        },
        {
          value: '102558',
          label: '互联网产品技术平台'
        }
      ],
      employeeList: [],
      charts5: '',
      charts6: '',
      charts7: '',
      charts8: '',
      activeName: 'first',
      searchFilter: {
        deptId: '102558',
        adCode: '',
        daterange: [new Date(2020, 12, 1), new Date(2021, 5, 18)],
        month: new Date(),
        subDeptId: '',
        selectUserCode: []
      },
      jobInfo: [],
      levelInfo: [],
      hireDateInfo: [],
      selectLevelInfo: [],
      departmentDevList: [],
      projectDevList: [],
      deptDE: [],
      deptCodeLine: [],
      projectDE: [],
      projectCodeLine: [],
      omegaStruct: {},
      wortopStruct: {},
      periodList: [],
      levelList: [],
      periodDevList: [],
      periodCodeLineList: [],
      deptProportion: {},
      deptTendency: {},
      deptEffAndStab: [],
      teamOverviewResp: [],
      employeeProportion: {},
      employeeTendency: {},
      levelProportion: {},
      levelTendency: {},
    }
  },
  methods: {
    initDept () {
      ehrServer.getPrincipalDeptTree().then(deptTree => {
        this.deptArray = deptTree.split(',');
        // this.projectFilter.departmentId = this.deptArray.join('/');
        // this.enterKeyUp();
      });
    },
    changeSelectPeople () {
      this.refresh();
    },
    getCascaderValue (cascaderValue) {
      console.log(cascaderValue.value);
      // this.projectFilter.departmentId = cascaderValue.value;
      // this.enterKeyUp();
      const arr = cascaderValue.value.split('/');
      this.searchFilter.subDeptId = arr[arr.length - 1];
      this.refresh();
    },
    changeMonth (value) {
      console.log(value);
      this.searchFilter.month = value;
      this.refresh();
    },
    refresh () {
      const year = this.searchFilter.month.getFullYear();
      const month = this.searchFilter.month.getMonth();
      this.params = {
        deptId: this.searchFilter.deptId,
        adCode: this.searchFilter.adCode,
        startDate: new Date(year, month, 1),
        endDate: new Date(year, month + 1, 0),
        subDeptId: this.searchFilter.subDeptId,
        selectUserCode: this.searchFilter.selectUserCode
      }
      // this.params['basePeriod'] = this.basePeriod
      console.log(this.params);
      portraitServer.getCtoOverview(this.params).then(res => {
        console.log(res);
        this.teamOverviewResp = res.teamOverviewResp;
        this.deptProportion = res.deptProportion;
        this.deptTendency = res.deptTendency;
        this.deptEffAndStab = res.deptEffAndStab;
        this.employeeProportion = res.employeeProportion;
        this.employeeTendency = res.employeeTendency;
        this.levelProportion = res.levelProportion;
        this.levelTendency = res.levelTendency;
      })
      portraitServer.getCtoDevData(this.params).then(data => {
        console.log(data);
        if (data) {
          this.projectDevList = data.projectDevList
        }
        if (this.projectDevList.length > 0) {
          this.projectDE = this.projectDevList.map(i => {
            return {
              name: i.name,
              value: i.devEquivalent
            }
          })
          this.draw6(this.projectDE)
        }
        if (this.projectDevList.length > 0) {
          this.projectCodeLine = this.projectDevList.map(i => {
            return {
              name: i.name,
              value: i.insertions
            }
          })
          this.draw6(this.projectCodeLine)
        }
      })
    },
    queryPeople (query) {
      // this.loading = true;
      ehrServer.getEmpList({ empCodeNameAdcode: query }).then(data => {
        // this.loading = false;
        this.employeeList = data.map(user => {
          return {
            code: user.code,
            email: user.email,
            name: user.name + '(' + user.email.split('@')[0] + ')'
          };
        });
      }).catch((err) => {
        // this.loading = false;
      });
    },
    handleClick (tab, event) {
      console.log(tab, event);
    },
    handleProjectClick (tab, event) {
      if (tab.name === 'first') {
        this.draw6(this.projectDE)
      } else if (tab.name === 'second') {
        this.draw6(this.projectCodeLine)
      }
    },
    // handlePeriodClick (tab, event) {
    //   if (tab.name === 'first') {
    //     this.draw7(this.periodDevList)
    //   } else if (tab.name === 'second') {
    //     this.draw7(this.periodCodeLineList)
    //   } else if (tab.name === 'third') {
    //     this.draw7(this.wortopStruct.monthData.problems)
    //   } else if (tab.name === 'fourth') {
    //     this.draw7(this.wortopStruct.monthData.workTime)
    //   }
    // },
    // handleLevelClick (tab, event) {
    //   if (tab.name === 'first') {
    //     this.draw8(this.levelDevList)
    //   } else if (tab.name === 'second') {
    //     this.draw8(this.levelCodeLineList)
    //   } else if (tab.name === 'third') {
    //     this.draw8(this.wortopStruct.levelData.problems)
    //   } else if (tab.name === 'fourth') {
    //     this.draw8(this.wortopStruct.levelData.workTime)
    //   }
    // },
    draw6 (list) {
      this.charts6 = echarts.init(this.$refs.chart6)
      this.charts6.setOption(option6 = {
        legend: {
          top: 'center',
          orient: 'vertical',
          left: '80%'
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
          data: list.map(i => {
            return i.name
          }),
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: [80, 150],
            center: ['30%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: list.sort((a, b) => b.value - a.value),
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
      })
    },
    // draw7 (list) {
    //   this.charts7 = echarts.init(this.$refs.chart7, 'dark')
    //   this.charts7.setOption(option7 = {
    //     xAxis: {
    //       type: 'category',
    //       data: list.map(i => i.name)
    //     },
    //     yAxis: {
    //       type: 'value'
    //     },
    //     series: [{
    //       data: list.map(i => i.value),
    //       type: 'bar',
    //       label: {
    //         show: true,
    //         position: 'inside'
    //       },
    //     }]
    //   })
    // },
    // draw8 (list) {
    //   this.charts8.setOption(option8 = {
    //     xAxis: {
    //       type: 'category',
    //       data: list.map(i => i.name)
    //     },
    //     yAxis: {
    //       type: 'value'
    //     },
    //     series: [{
    //       data: list.map(i => i.value),
    //       type: 'bar'
    //     }]
    //   })
    // },
  }
})
@RouteConfig({
  layout: true,
  name: 'EngineeringMetric',
  title: '工程指标',
})
export default class App extends Vue {
}
</script>
<style>
.navigate-bar {
  display: flex;
  justify-content: flex-start;
}
.metrics-label {
  text-align: center;
  font-weight: bold;
  font-size: 18px
}
.sub-title {
  font-size: 12px;
}
.sub-value {
  font-size: 16px;
  /* font-weight: bold; */
  text-align: center;
}
.parent {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  flex-grow: 1;
}
</style>
