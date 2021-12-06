<template>
  <PageWrapper>
    <PageHeader title="工程管理面板">
      <template slot="extra">
        <FormInline>
          <DeptListSelect v-model="searchFilter.deptId" style="margin-right: 16px;" />
          <DatePicker v-model="searchFilter.month" />
        </FormInline>
      </template>
    </PageHeader>

    <BlockWrapper title="核心数据指标" style="margin-bottom: 16px;">
      <template slot="extra">
        <YoySwitch v-model="basePeriod" :text="['同比', '环比']"></YoySwitch>
      </template>
      <div>
        <el-row type="flex" align="top" justify="start" style="margin-bottom: 16px">
          <!-- 产出类 -->
          <el-col style="width: 920px; margin-right: 16px">
            <BlockCard title="产出类">
              <!-- 第一行 -->
              <el-row type="flex" justify="start" align="top" style="margin-bottom: 8px">
                <!-- 开发当量 -->
                <el-col style="width: 216px; margin-right: 8px">
                  <DataCard :bgColor="'rgba(161, 109, 233, 0.04)'">
                    <Data title="开发当量" :value="portraitDepartment.nowDevEquivalent" :subValue="portraitDepartment.lastDevEquivalent"></Data>
                    <LineChart :legend="portraitDepartment.devEquivalentChartLegend" :data="portraitDepartment.devEquivalentChartData" color="#7B40E7" class="chart-poi" width="80px" />
                  </DataCard>
                </el-col>
                <!-- 人均当量 -->
                <el-col style="width: 216px; margin-right: 8px">
                  <DataCard :bgColor="'rgba(161, 109, 233, 0.04)'">
                    <Data title="人均当量" :value="portraitDepartment.nowAverDevEquivalent" :subValue="portraitDepartment.lastAverDevEquivalent"></Data>
                    <LineChart :legend="portraitDepartment.averDevEquivalentChartLegend" :data="portraitDepartment.averDevEquivalentChartData" color="#7B40E7" class="chart-poi" width="80px" />
                  </DataCard>
                </el-col>
                <!-- 代码增/删行数 -->
                <el-col style="width: 440px">
                  <DataCard :bgColor="'rgba(161, 109, 233, 0.04)'">
                    <el-row type="flex" justify="start" align="top">
                      <el-col style="width: 140px; margin-right: 4px">
                        <Data title="代码增加行数" :value="portraitDepartment.nowInsertions"
                        :subValue="portraitDepartment.lastInsertions"></Data>
                      </el-col>
                      <el-col style="width: 140px; margin-right: 4px;">
                        <Data title="代码删除行数" :value="portraitDepartment.nowDeletions"
                        :subValue="portraitDepartment.lastDeletions"></Data>
                      </el-col>
                      <el-col style="width: 140px;">
                        <BarChart :legend="portraitDepartment.deletionsChartLegend" :data="portraitDepartment.deletionsChartData" :colors="['#7635E6', '#AE65F4']" class="chart-poi" width="140px" />
                      </el-col>
                    </el-row>
                  </DataCard>
                </el-col>
              </el-row>
              <!-- 第二行 -->
              <el-row type="flex" justify="start" align="top">
                <!-- 项目数/功能数/修复BUG数 -->
                <el-col style="width: 440px; margin-right: 8px">
                  <DataCard :bgColor="'rgba(161, 109, 233, 0.04)'" style="height: 200px">
                    <el-row type="flex" justify="start" align="top">
                      <el-col style="width: 140px; margin-right: 4px">
                        <Data title="项目数" :value="portraitDepartment.nowProjectNum" 
                        :subValue="portraitDepartment.lastProjectNum"></Data>
                      </el-col>
                      <el-col style="width: 140px; margin-right: 4px;">
                        <Data title="功能数" :value="portraitDepartment.nowDemandNum"
                        :subValue="portraitDepartment.lastDemandNum"></Data>
                      </el-col>
                      <el-col style="width: 140px;">
                        <Data title="修复BUG数" :value="portraitDepartment.nowBugNum"
                        :subValue="portraitDepartment.lastBugNum"></Data>
                      </el-col>
                    </el-row>
                    <el-row type="flex" style="width: 100%; height: 100px">
                      <LineChart :legend="portraitDepartment.bugNumLegend" :data="portraitDepartment.bugNumChartData" color="#7B40E7" class="chart-poi" width="100%" />
                    </el-row>
                  </DataCard>
                </el-col>
                <!-- 价值密度/开发价值/代码提交次数 -->
                <el-col style="width: 440px;">
                  <DataCard :bgColor="'rgba(161, 109, 233, 0.04)'" style="margin-bottom: 8px">
                    <el-row type="flex" justify="start" align="top">
                      <el-col style="width: 140px; margin-right: 4px;">
                        <Data title="开发价值" :value="portraitDepartment.nowDevValue"
                        :subValue="portraitDepartment.lastDevValue"></Data>
                      </el-col>
                       <el-col style="width: 140px; margin-right: 4px">
                        <Data title="代码影响力" :value="portraitDepartment.nowFunImpact"
                        :subValue="portraitDepartment.lastFunImpact"></Data>
                      </el-col>
                      <el-col style="width: 140px;">
                        <BarChart :legend="portraitDepartment.funImpactLegend" :data="portraitDepartment.funImpactChartData" :colors="['#7635E6', '#AE65F4']" class="chart-poi" width="140px" />
                      </el-col>
                    </el-row>
                  </DataCard>
                  <DataCard :bgColor="'rgba(161, 109, 233, 0.04)'">
                    <Data title="代码提交次数" :value="portraitDepartment.nowCommitCount"
                    :subValue="portraitDepartment.lastCommitCount"></Data>
                    <BubbleChart :legend="portraitDepartment.commitCountChartLegend" :data="portraitDepartment.commitCountChartData" class="chart-poi" width="300px" />
<!--                    <LineChart :legend="chartLegend.exampleA.concat(chartLegend.exampleB)" :data="chartData.exampleB" color="#7B40E7" class="chart-poi" width="300px" />-->
                  </DataCard>
                </el-col>
              </el-row>
            </BlockCard>
          </el-col>
          <!-- 效率类 -->
          <el-col style="width: 248px;">
            <BlockCard title="效率类">
              <!-- 项目平均开发周期 -->
              <DataCard :bgColor="'rgba(19, 194, 127, 0.04)'" style="margin-bottom: 8px;">
                <Data title="项目平均开发周期" :value="portraitDepartment.nowProjectAveDevPeriod" :subValue="portraitDepartment.lastProjectAveDevPeriod"></Data>
                <LineChart :legend="portraitDepartment.projectAveDevPeriodLegend" :data="portraitDepartment.projectAveDevPeriodChartData" color="#42CE98" class="chart-poi" width="80px" />
              </DataCard>
              <DataCard :bgColor="'rgba(19, 194, 127, 0.04)'"  style="margin-bottom: 8px;">
                <Data title="功能平均开发周期" :value="portraitDepartment.nowFunctionAveDevPeriod" :subValue="portraitDepartment.lastFunctionAveDevPeriod"></Data>
                <LineChart :legend="portraitDepartment.functionAveDevPeriodLegend" :data="portraitDepartment.functionAveDevPeriodChartData" color="#42CE98" class="chart-poi" width="80px" />
              </DataCard>
              <DataCard :bgColor="'rgba(19, 194, 127, 0.04)'">
                <Data title="BUG平均修复周期" :value="portraitDepartment.nowBugAveFixTime" :subValue="portraitDepartment.lastBugAveFixTime"></Data>
                <LineChart :legend="portraitDepartment.bugAveFixLegend" :data="portraitDepartment.bugAveFixChartData" color="#42CE98" class="chart-poi" width="80px" />
              </DataCard>
            </BlockCard>
          </el-col>
        </el-row>
        <el-row type="flex" align="top" justify="start" style="margin-bottom: 16px">
          <el-col style="width: 696px; margin-right: 16px">
            <BlockCard title="发布类">
              <el-row type="flex" justify="start" align="top" style="margin-bottom: 8px">
                <el-col style="width: 440px; margin-right: 8px">
                  <DataCard :bgColor="'rgba(230, 99, 23, 0.04)'">
                    <Data title="发布次数" :value="portraitDepartment.nowPublishNum" :subValue="portraitDepartment.lastPublishNum"></Data>
                    <LineChart :legend="portraitDepartment.publishNumLegend" :data="portraitDepartment.publishNumChartData" color="#EB8245" class="chart-poi" width="320px" />
                  </DataCard>
                </el-col>
                <el-col style="width: 216px;">
                  <DataCard :bgColor="'rgba(230, 99, 23, 0.04)'">
                    <Data title="编译次数" :value="portraitDepartment.nowCompileNum" :subValue="portraitDepartment.lastCompileNum"></Data>
                    <LineChart :legend="portraitDepartment.compileNumLegend" :data="portraitDepartment.compileNumChartData" color="#EB8245" class="chart-poi" width="80px" />
                  </DataCard>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="top">
                <el-col style="width: 216px; margin-right: 8px">
                  <DataCard :bgColor="'rgba(230, 99, 23, 0.04)'">
                    <Data title="重启次数" :value="portraitDepartment.nowRestartNum" :subValue="portraitDepartment.lastRestartNum"></Data>
                    <LineChart :legend="portraitDepartment.restartNumLegend" :data="portraitDepartment.restartNumChartData" color="#EB8245" class="chart-poi" width="80px" />
                  </DataCard>
                </el-col>
                <el-col style="width: 216px; margin-right: 8px">
                  <DataCard :bgColor="'rgba(230, 99, 23, 0.04)'">
                    <Data title="回滚次数" :value="portraitDepartment.nowRollbackNum" :subValue="portraitDepartment.lastRollbackNum"></Data>
                    <LineChart :legend="portraitDepartment.rollbackNumLegend" :data="portraitDepartment.rollbackNumChartData" color="#EB8245" class="chart-poi" width="80px" />
                  </DataCard>
                </el-col>
                <el-col style="width: 216px;">
                  <DataCard :bgColor="'rgba(230, 99, 23, 0.04)'">
                    <Data title="上线次数" :value="portraitDepartment.nowOnlineNum" :subValue="portraitDepartment.lastOnlineNum"></Data>
                    <LineChart :legend="portraitDepartment.onlineNumLegend" :data="portraitDepartment.onlineNumChartData" color="#EB8245" class="chart-poi" width="80px" />
                  </DataCard>
                </el-col>
              </el-row>
            </BlockCard>
          </el-col>
          <el-col style="width: 472px">
            <BlockCard title="质量类">
              <el-row type="flex" justify="start" align="top" style="margin-bottom: 8px;">
                <el-col style="width: 216px; margin-right: 8px">
                  <DataCard :bgColor="'rgba(18, 149, 222, 0.04)'">
                    <Data title="千行BUG率" :value="portraitDepartment.nowBugProbability" :subValue="portraitDepartment.lastBugProbability"></Data>
                    <LineChart :legend="portraitDepartment.bugProbabilityLegend" :data="portraitDepartment.bugProbabilityChartData" color="#1295DE" class="chart-poi" width="80px" />
                  </DataCard>
                </el-col>
                <el-col style="width: 216px">
                  <DataCard :bgColor="'rgba(18, 149, 222, 0.04)'">
                    <Data title="注释覆盖度" :value="portraitDepartment.nowDocCoverage" :subValue="portraitDepartment.nowDocCoverage"></Data>
                    <LineChart :legend="portraitDepartment.docCoverageLegend" :data="portraitDepartment.docCoverageChartData" color="#1295DE" class="chart-poi" width="80px" />
                  </DataCard>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" align="top">
                <el-col style="width: 216px; margin-right: 8px">
                  <DataCard :bgColor="'rgba(18, 149, 222, 0.04)'">
                    <Data title="测试覆盖度" :value="portraitDepartment.nowStaticTestCoverage" :subValue="portraitDepartment.lastStaticTestCoverage"></Data>
                    <LineChart :legend="portraitDepartment.staticTestCoverageLegend" :data="portraitDepartment.staticTestCoverageChartData" color="#1295DE" class="chart-poi" width="80px" />
                  </DataCard>
                </el-col>
                <el-col style="width: 216px;">
                  <DataCard :bgColor="'rgba(18, 149, 222, 0.04)'">
                    <Data title="代码模块性" :value="portraitDepartment.nowFunImpact" :subValue="portraitDepartment.lastFunImpact"></Data>
                    <LineChart :legend="portraitDepartment.funImpactLegend" :data="portraitDepartment.funImpactChartData" color="#1295DE" class="chart-poi" width="80px" />
                  </DataCard>
                </el-col>
              </el-row>
            </BlockCard>
          </el-col>
        </el-row>
        <el-row type="flex" align="top" justify="start">
          <el-col style="width: 920px; margin-right: 16px;">
            <BlockCard title="成本类">
              <el-row type="flex" justify="flex" align="top">
                <el-col style="width: 664px; margin: 0 8px 8px 0">
                  <DataCard :bgColor="'rgba(239, 173, 66, 0.04)'">
                    <el-row type="flex" justify="start" align="top">
                      <el-col style="width: 140px; margin-right: 4px">
                        <Data title="总人数" :value="portraitDepartment.nowTotalPeopleNum" :subValue="portraitDepartment.lastTotalPeopleNum"></Data>
                      </el-col>
                      <el-col style="width: 140px; margin-right: 4px">
                        <Data title="研发人数" :value="portraitDepartment.nowITNum" :subValue="portraitDepartment.lastITNum"></Data>
                      </el-col>
                      <el-col style="width: 140px; margin-right: 4px">
                        <Data title="开发人员占比" :value="portraitDepartment.nowITProbability" :subValue="portraitDepartment.lastITProbability"></Data>
                      </el-col>
                      <el-col style="width: 220px;">
                        <BarChart :legend="portraitDepartment.itProbabilityLegend" :data="portraitDepartment.itProbabilityChartData" :colors="['#EFAD42', '#F8D677', '#808080']" class="chart-poi" width="220px" />
                      </el-col>
                    </el-row>
                  </DataCard>
                </el-col>
                <el-col style="width: 216px; margin-bottom: 8px">
                  <DataCard :bgColor="'rgba(239, 173, 66, 0.04)'">
                    <Data title="休假天数" :value="portraitDepartment.nowAcationDays" :subValue="portraitDepartment.lastAcationDays"/>
                    <LineChart :legend="portraitDepartment.actionDaysLegend" color="#EEA442" class="chart-poi" width="80px" />
                  </DataCard>
                </el-col>
              </el-row>
              <el-row type="flex" justify="flex" align="top">
                <el-col style="width: 664px; margin-right: 8px">
                  <DataCard :bgColor="'rgba(239, 173, 66, 0.04)'">
                    <el-row type="flex" justify="start" align="top">
                      <el-col style="width: 140px; margin-right: 4px">
                        <Data title="出勤工时" :value="portraitDepartment.nowWorkHours" :subValue="portraitDepartment.lastWorkHours"></Data>
                      </el-col>
                      <el-col style="width: 140px; margin-right: 4px">
                        <Data title="开发工时" :value="portraitDepartment.nowDevlopHours" :subValue="portraitDepartment.lastDevlopHours"></Data>
                      </el-col>
                      <el-col style="width: 140px; margin-right: 4px">
                        <Data title="工时饱和率" :value="portraitDepartment.nowWorkSaturability" :subValue="portraitDepartment.lastWorkSaturability"></Data>
                      </el-col>
                      <el-col style="width: 220px;">
                        <BarChart :legend="portraitDepartment.workSaturabilityLegend" :data="portraitDepartment.workSaturabilityChartData" :colors="['#EFAD42', '#F8D677', '#808080']" class="chart-poi" width="220px" />
                      </el-col>
                    </el-row>
                  </DataCard>
                </el-col>
                <el-col style="width: 216px;">
                  <DataCard :bgColor="'rgba(239, 173, 66, 0.04)'">
                     <Data title="人均休假天数" :value="portraitDepartment.nowAverActionDays" :subValue="portraitDepartment.lastAverActionDays"></Data>
                    <LineChart :legend="portraitDepartment.averActionDaysLegend" color="#EEA442" class="chart-poi" width="80px" />
                  </DataCard>
                </el-col>
              </el-row>
            </BlockCard>
          </el-col>
          <el-col style="width: 472px">
            <BlockCard title="稳定性类">
              <DataCard :bgColor="'rgba(92, 113, 128, 0.04)'" style="margin-bottom: 8px">
                <Data title="团队鲁棒性" :value="portraitDepartment.nowRobustness" :subValue="portraitDepartment.lastRobustness"></Data>
                <LineChart :legend="portraitDepartment.robustnessLegend" :data="portraitDepartment.robustnessChartData" color="#5C7180" class="chart-poi" width="80px" />
              </DataCard>
              <DataCard :bgColor="'rgba(92, 113, 128, 0.04)'">
                <Data title="团队稳定性" :value="portraitDepartment.nowStability" :subValue="portraitDepartment.lastStability"></Data>
                <LineChart :legend="portraitDepartment.stabilityLegend" :data="portraitDepartment.stabilityChartData" color="#5C7180" class="chart-poi" width="80px" />
              </DataCard>
            </BlockCard>
          </el-col>
        </el-row>
      </div>
    </BlockWrapper>
    <div>
          <tr v-for="(row,index) in sliceList(testlist,2)" :key="index">
            <td v-for="(item,i) in row" :key="i">																																				
              {{item.attrA}}
            </td>
          </tr>
    </div>
    
  </PageWrapper>
</template>

<script>
// 接口
import ehrServer from '@/apis/ehr.js';
import PortraitDepartmentServer from '@/apis/portraitDepartment.js';

// 重构用的布局组件
import PageHeader from '@/components/Layout/PageHeader/index.vue';
import PageWrapper from '@/components/Layout/PageWrapper/index.vue';
import BlockWrapper from '@/components/Layout/BlockWrapper/index.vue';
import BlockCard from '@/components/Layout/BlockCard/index.vue';
import DataCard from '@/components/Layout/DataCard/index.vue';
import Data from '@/components/Layout/DataCard/data.vue';
import DataNoneValue from '@/components/Layout/DataCard/dataNoneValue.vue';

import LineChart from '@/components/Charts/LineChart.vue';
import BarChart from '@/components/Charts/BarChart.vue';
import BubbleChart from '@/components/Charts/BubbleChart.vue';
import PieChart from '@/components/Charts/PieChart.vue';
import NegativeBarChart from "@/components/Charts/NegativeBarChart";
import NightingalePieChart from "@/components/Charts/NightingalePieChart";

import DeptListSelect from "@/components/Forms/DeptListSelect";
import DatePicker from '@/components/Forms/DatePicker';
import FormInline from '@/components/Forms/FormInline';
import YoySwitch from '@/components/Forms/YoySwitch';

import ProgressBar from "@/components/Table/ProgressBar";
import MemberDataTable from '@/components/Table/MemberDataTable';
import ProjectMemberTable from "@/components/Table/ProjectMemberTable";

export default {
  components: {
    PageHeader,
    PageWrapper,
    BlockWrapper,
    BlockCard,
    DataCard,
    Data,
    DataNoneValue,

    LineChart,
    BarChart,
    BubbleChart,
    PieChart,
    NegativeBarChart,
    NightingalePieChart,

    DeptListSelect,
    DatePicker,
    FormInline,
    YoySwitch,

    ProgressBar,
    MemberDataTable,
    ProjectMemberTable,
  },
  data: function() {
    return {
      testlist:[{"attrA":12},{"attrA":12},{"attrA":12},{"attrA":12}],
      basePeriod: false, // 同步和环比
      outputRelease: false,
      deptArray: [], // 部门级联数据
      employeeList: [], // 雇员列表
      searchFilter: {
        deptId: '102558',
        adCode: '',
        daterange: [new Date(2020, 12, 1), new Date(2021, 5, 18)],
        month: new Date(),
        subDeptId: '',
        selectUserCode: []
      },
      portraitDepartment:{},

      chartLegend: {
        exampleA: [{ type: 'increase', value: '12.3%' }],
        exampleB: [{ type: 'decrease', value: '17.1%' }],
      },
      chartData: {
        // D3 Svg 组件数据格式
        exampleA: [[200, 180, 320, 200, 360, 120, 320, 220, 110, 80, 50, 45, 30]],
        exampleB: [[200, 180, 320, 200, 360, 120, 320, 220, 360, 150, 50], [120, 280, 175, 290, 320, 190, 360, 400, 500, 900]],
        // Echarts 定制组件数据格式
        // 饼图（圆环）
        exampleC: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Adss' },
          { value: 300, name: 'Video Adsd' },
          { value: 187, name: 'Others2' },
          { value: 1048, name: 'Search Engdine' },
          { value: 735, name: 'Direfct' },
          { value: 580, name: 'Emadil' },
          { value: 484, name: 'Unidon Ads' },
          { value: 300, name: 'Viddeo Ads' },
          { value: 187, name: 'Otherxs' },
          { value: 1048, name: '2earch Engine' },
          { value: 735, name: 'Dire3ct' },
          { value: 580, name: 'Emai5l' },
          { value: 484, name: 'Uni4on Ads' },
          { value: 300, name: 'Vide5o Ads' },
          { value: 187, name: 'Other32s' },
        ],
        // 正负条形图
        exampleD: {
          category: ['89-96', '73-88', '65-72', '57-64', '32-12', '34-23'],
          series: [
            {
              name: 'Mary',
              data: [320, 302, 341, 374, 390, 450, 420, 520, 134],
            },
            {
              name: 'Mike',
              data: [-120, -132, -101, -134, -190, -230, -210, -234, -120]
            }
          ]
        },
      },
    }
  },
  mounted() {
    this.initDept();
    this.getDevlopPortraitData();
  },

  computed: {
    sliceList() {
      return function (data,count) {
        if (data != undefined) {
          let index = 0;
          let arrTemp = [];
          for (let i = 0; i < data.length; i++) {
            index = parseInt(i / count);
            if (arrTemp.length <= index) {
              arrTemp.push([]);
            }
            arrTemp[index].push(data[i])
          }
          return arrTemp;
        }
      }
    },
  },

  methods: {
    getDevlopPortraitData(){
      let params = {
        time:this.searchFilter.month,
        departmentCode:this.searchFilter.deptId,
      };
      PortraitDepartmentServer.getDevlopPortraitData(params).then(res => {
        this.portraitDepartment=res;
      }).catch((err) => {
        console.log(err);
      });
    },
    changeMonth (value) {
      console.log(value);
      this.searchFilter.month = value;
      this.refresh();
    },
    getCascaderValue (cascaderValue) {
      const arr = cascaderValue.value.split('/');
      this.searchFilter.subDeptId = arr[arr.length - 1];
    },
    initDept () {
      ehrServer.getPrincipalDeptTree().then(deptTree => {
        this.deptArray = deptTree.split(',');
      });
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
  }
}
</script>
<style lang="scss" scoped>
.chart-poi {
  right: 0;
  top: 0;
  width: 80px;
  height: 100%;
  position: absolute;
}
</style>
