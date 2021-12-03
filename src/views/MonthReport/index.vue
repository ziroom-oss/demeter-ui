<template>
  <PageWrapper>
    <PageHeader title="项目月报">
      <template slot="extra">
        <DeptListSelect v-model="searchFilter.departmentCode" />
      </template>
    </PageHeader>

    <BlockWrapper title="月度核心指标" style="margin-bottom: 8px">
      <template slot="extra">
        <FormInline>
          <DatePicker v-model="searchFilter.time" style="margin-right: 16px;"/>
          <YoySwitch v-model="basePeriod" :text="['同比', '环比']"/>
        </FormInline>
      </template>
      <div>
        <!-- moduleOne -->
        <BlockCard :title="moduleOne.title" style="margin-bottom: 16px;" >
          <el-row type="flex" justify="start" align="top" style="margin-bottom: 8px" v-for="(row,index) in sliceList(moduleOne.SLAList,4)" :key="index">
            <el-col style="width: 282px; margin-right: 10px;"  v-for="(item,i) in row" :key="i">
              <DataCard :bgColor="'rgba(161, 109, 233, 0.04)'">
                <Data :title="item.name" :value="item.value" :subValue="item.lastValue" barColor="linear-gradient(180deg, #AE65F4 0%, #7635E6 100%)"></Data>
                <LineChart class="chart-poi" width="142px" :data="item.chartData" :lengend="item.chartLegend" color="#7635E6" />
              </DataCard>
            </el-col>
          </el-row>
        </BlockCard>

        <!-- moduleTwo -->
        <BlockCard :title="moduleTwo.title" style="margin-bottom: 16px;">
          <el-row type="flex" align="top" justify="start" style="margin-bottom: 20px;" v-for="(row,index) in sliceList(moduleTwo.busSupportList,2)" :key="index"> 
            <el-col style="width: 571px; margin: 0 8px 0 0" v-for="(item,i) in row" :key="i">
              <BorderCard :title="item.appName" v-if="item.type === 1">
                <el-row type="flex" align="top" justify="start">
                  <el-col v-for="point in item.pointList" :key="point.name">
                    <DataCard bgColor="rgba(230, 99, 23, 0.04);">
                      <Data :title="point.name" :value="point.value" :subValue="point.lastValue" barColor="linear-gradient(180deg, #F49C33 0%, #E66317 100%)"/>
                      <LineChart class="chart-poi" width="142px" :data="point.chartData" :lengend="point.chartLegend" color="#7635E6" />
                    </DataCard>
                  </el-col>
                </el-row>
              </BorderCard>

              <BorderCard :title="item.appName" v-if="item.type === 2">
                <el-row type="flex" align="top" justify="start">
                  <el-col style="width: 272px; margin-right: 8px;" v-for="point in item.pointList" :key="point.name">
                    <DataCard bgColor="rgba(230, 99, 23, 0.04);">
                      <Data :title="point.name" :value="point.value" :subValue="point.lastValue" barColor="linear-gradient(180deg, #F49C33 0%, #E66317 100%)"/>
                      <LineChart class="chart-poi" width="142px" :data="point.chartData" :lengend="point.chartLegend" color="#7635E6" />
                    </DataCard>
                  </el-col>
                </el-row>
              </BorderCard>


              <BorderCard :title="item.appName" v-if="item.type === 3">
                <el-row type="flex" align="top" justify="start" style="margin-bottom: 8px;" v-for="(row,index) in sliceList(item.pointList,2)" :key="index">
                  <el-col style="width: 276px; margin-right: 8px" v-for="(item1,i) in row" :key="i">
                    <DataCard bgColor="rgba(230, 99, 23, 0.04);">
                       <Data :title="item1.name" :value="item1.value" :subValue="item1.lastValue" barColor="linear-gradient(180deg, #F49C33 0%, #E66317 100%)"/>
                       <LineChart class="chart-poi" width="142px" :data="item1.chartData" :lengend="item1.chartLegend" color="#7635E6" />
                    </DataCard>
                  </el-col>
                </el-row>
              </BorderCard>
            </el-col>
          </el-row>
        </BlockCard>

         <el-row type="flex" align="top" justify="start">
          <el-col style="width: 856px; margin-right: 16px" >
            <BlockCard :title="moduleThree.title">
              <el-row type="flex" style="margin-bottom: 20px" align="top" justify="start" v-for="(row,index) in sliceList(moduleThree.devEffiTollRelateList,1)" :key="index">
                  <el-col style="margin: 0 8px 0 0" v-for="(item,i) in row" :key="i">
                      <BorderCard :title="item.appName" v-if="item.type === 4">
                        <el-row type="flex" align="top" justify="start" style="margin-bottom: 8px;" v-for="(row,index) in sliceList(item.pointList,3)" :key="index">
                          <el-col style="width: 264px; margin-right: 8px" v-for="(item1,i) in row" :key="i">
                            <DataCard bgColor="rgba(19, 194, 127, 0.04)">
                              <Data :title="item1.name" :value="item1.value" :subValue="item1.lastValue" barColor="linear-gradient(180deg, #2BE3B6 0%, #13C27F 100%)"/>
                              <LineChart class="chart-poi" width="142px" :data="item1.chartData" :lengend="item1.chartLegend" color="#7635E6" />
                            </DataCard>
                          </el-col>
                         </el-row>
                      </BorderCard>
                  </el-col>
                </el-row>
            </BlockCard>
           </el-col>
           <el-col style="width: 312px">
              <BlockCard :title="moduleFour.title">
                <el-row v-for="item in moduleFour.oapSupportRelateList" :key="item.title">
                  <el-col v-if="item.type === 5">
                    <BorderCard :title="item.appName" style="margin-bottom: 20px" >
                      <el-row v-for="(point,i) in item.pointList" :key="i">
                        <DataCard bgColor="rgba(92, 113, 128, 0.04)" style="margin-bottom: 8px">
                            <Data :title="point.name" :value="point.value" barColor="linear-gradient(180deg, #95AAB6 0%, #5C7180 100%)"/>
                        </DataCard>
                      </el-row>
                    </BorderCard>
                  </el-col>
                </el-row>
                
              </BlockCard>
            </el-col>
        </el-row>
      </div>
    </BlockWrapper>
  </PageWrapper>
</template>

<script>
import { RouteConfig, Component, Vue } from '@ziroom/cherry2-decorator';

// 接口
import ehrServer from '@/apis/ehr.js';
import dayjs from 'dayjs';
// 其它组件
import DeptCascader from '@/components/Dept/DeptCascader.vue';

// 重构用的布局组件
import PageHeader from '@/components/Layout/PageHeader/index.vue';
import PageWrapper from '@/components/Layout/PageWrapper/index.vue';
import BlockWrapper from '@/components/Layout/BlockWrapper/index.vue';
import BlockCard from '@/components/Layout/BlockCard/index.vue';
import BorderCard from '@/components/Layout/BorderCard/index.vue';
import DataCard from '@/components/Layout/DataCard/index.vue';
import Data from '@/components/Layout/DataCard/data.vue';
import LineChart from '@/components/Charts/LineChart.vue';

// 重构用的表单组件
import DeptListSelect from "@/components/Forms/DeptListSelect";
import DatePicker from '@/components/Forms/DatePicker';
import FormInline from '@/components/Forms/FormInline';
import YoySwitch from '@/components/Forms/YoySwitch';
import MonthReportServer from '@/apis/report.js';
import moment from 'moment';
import Axios from 'axios';

@Component({
  components: {
    PageHeader,
    PageWrapper,
    BlockWrapper,
    BlockCard,
    DataCard,
    BorderCard,

    Data,
    LineChart,

    DeptCascader,
    DeptListSelect,
    DatePicker,
    YoySwitch,
    FormInline,
  },
  data () {
    return {
      moduleOne:{
        title:"",
        SLAList:[],
      },
      moduleTwo:{
        title:"",
        busSupportList:[],
      },
      moduleThree:{
        title:"",
        devEffiTollRelateList:[],
      },
      moduleFour:{
        title:"",
        oapSupportRelateList:[],
      },
      basePeriod: true, // 同步和环比
      deptArray: [], // 部门级联数据
      employeeList: [], // 雇员列表
      viewPeriod: false, // 项目和员工视图
      month: '',
      searchFilter: {
        departmentCode: '102558',
        time: '2021-07'
      },
      slaRelateMap: {},
      busSupportRelateMap: {},
      devEffiTollRelateMap: {},
      oapSupportRelateMap: {},
    }
  },

  watch: {
     //监控月份
    'searchFilter.createTimeEnd':
        async function(value) {
          this.initCoreData(this.searchFilter);
        },
    'searchFilter.departmentCode':
        async function(value) {
          this.initCoreData(this.searchFilter);
        }

  },

  computed:{
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

  mounted () {
    this.initCoreData(this.searchFilter);
  },

  methods: {
     initCoreData (params) {
        this.getCorePoint(params);
        this.getBusinessPoint(params);
        this.getDevEffiTollRelatePoint(params);
        this.getOapSupportRelatePoint(params);
     },

     getCorePoint(params){
        let reportReqParam={
           moduleType:1,
           departmentCode:params.departmentCode,
           time:moment(params.time).format('YYYY-MM'),
        };
        MonthReportServer.getCorePoint(reportReqParam).then(data => {
          this.moduleOne.title=data.title;
          this.moduleOne.SLAList=data.pointList;
        }).catch((err) => {
          console.log(err);
        });
      },

      getBusinessPoint(params){
         let reportReqParam={
           moduleType:2,
           departmentCode:params.departmentCode,
           time:moment(params.time).format('YYYY-MM'),
        };
        MonthReportServer.getBusinessPoint(reportReqParam).then(data => {
          this.moduleTwo.title=data.title;
          this.moduleTwo.busSupportList=data.appPointList;
          console.log(data.appPointList);
        }).catch((err) => {
          console.log(err);
        });
      },
      getDevEffiTollRelatePoint(params){
         let reportReqParam={
           moduleType:3,
           departmentCode:params.departmentCode,
           time:moment(params.time).format('YYYY-MM'),
        };
        MonthReportServer.getDevEffiTollRelatePoint(reportReqParam).then(data => {
          this.moduleThree.title=data.title;
          this.moduleThree.devEffiTollRelateList=data.appPointList;
        }).catch((err) => {
          console.log(err);
        });
      },
      getOapSupportRelatePoint(params){
         let reportReqParam={
           moduleType:4,
           departmentCode:params.departmentCode,
           time:moment(params.time).format('YYYY-MM'),
        };
        MonthReportServer.getOapSupportRelatePoint(reportReqParam).then(data => {
          this.moduleFour.title=data.title;
          this.moduleFour.oapSupportRelateList=data.appPointList;
        }).catch((err) => {
          console.log(err);
        });
      }
  }
})
@RouteConfig({
  layout: true,
  name: 'MonthReport',
  title: '项目月报',
  icon: 'calendar',
})
export default class App extends Vue {
}
</script>
<style lang="scss" scoped>
/* .line-chart-poi 用于图表组件在 DataCard 内的定位，不要设置 index，需要自行设置具体的 width */
.chart-poi {
  right: 0;
  top: 0;
  width: 80px;
  height: 100%;
  position: absolute;
}
</style>>
