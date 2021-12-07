<template>
  <div>
    <p style="font-weight: bold; font-size: 18px">画像信息</p>
    <el-container>
       <!--组织架构starter-->
      <el-aside width="220px" v-if="roles.includes('') || roles.includes('demeter-super-admin')">
        <div style="padding: 20px 0 0 0">
          <el-select
            v-model="selectUserCode"
            placeholder="姓名查询"
            filterable
            remote
            clearable
            :loading="loading"
            :remote-method="queryPeople"
            size="small"
            style="margin-bottom: 10px"
          >
            <el-option v-for="item in employeeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
          <div class="dept-header">
            <span>组织架构</span>
          </div>
          <div class="dept-tree">
            <el-tree
              ref="depttree"
              :props="props"
              :load="loadNode"
              :highlight-current="true"
              node-key="code"
              lazy
              :default-checked-keys="defaultCheckedKeys"
              :default-expanded-keys="defaultExpandedKeys"
              :indent="4"
              @node-click="handleNodeClick"
            />
          </div>
        </div>
      </el-aside>
      <!--组织架构end-->
      
      <el-main>
        <el-tabs type="card" @tab-click="handleClick" v-model="activeName">

          <el-tab-pane label="员工画像" name="portrayal">
            <p style="font-weight: bold; font-size: 18px">员工基本信息</p>
            <div style="display: flex;justify-content:space-between;flex-wrap:nowrap">
              <el-form :model="userinfo" >
                <el-row :gutter="2">
                  <el-col :span="12">
                    <el-form-item label="姓名：" size="small">
                      <span v-text="userinfo.username"></span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="学历：" size="small">
                      <span v-text="userinfo.education"></span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="邮箱：" size="small">
                      <span v-text="userinfo.email"></span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="入职天数：" size="small">
                      <span v-text="userinfo.hireDays"></span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="职务：" size="small">
                      <span v-text="userinfo.job"></span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="职级：" size="small">
                      <span v-text="userinfo.position"></span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="个人技能：" size="small">
                      <span v-text="userinfo.skills"></span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <el-divider></el-divider>
            <div>
              <el-row :gutter="20">
               <div v-for="item in PortraitPersonGrowingupRespVOs" :key="item.title">
                  <el-col :span="8" v-if="item.type === 1">
                    <el-card style="height: 120px">
                      <div style="font-size: 16px; font-weight: bold">
                        {{item.title}}
                      </div>
                      <div v-for="point in item.points" :key="point.coreName">
                          <span>
                             <div style="text-align: center; font-size: 16px; font-weight: bold">
                              {{point.coreData}}
                             </div>
                             <div style="text-align: center">{{point.coreName}}</div>
                          </span>
                      </div>
                    </el-card>
                </el-col>

                 <el-col :span="8" v-if="item.type === 2">
                    <el-card style="height: 120px">
                      <div style="font-size: 16px; font-weight: bold">
                        {{item.title}}
                      </div>
                      <div style="display: flex; justify-content: space-between" >
                        <div v-for="point in item.points" :key="point.coreName">
                          <span>
                             <div style="text-align: center; font-size: 16px; font-weight: bold">
                              {{point.coreData}}
                             </div>
                             <div style="text-align: center">{{point.coreName}}</div>
                          </span>
                        </div>
                      </div>
                    </el-card>
                </el-col>
                <el-col :span="8" v-if="item.type === 3">
                    <el-card style="height: 120px">
                      <div style="font-size: 16px; font-weight: bold">
                        {{item.title}}
                      </div>
                      <div style="display: flex; justify-content: space-between">
                        <div v-for="point in item.points" :key="point.coreName" >
                            <span>
                                <div style="text-align: center; font-size: 14px; font-weight: bold">
                                  {{point.coreData}}
                                </div>
                                <div style="text-align: center">{{point.coreName}}</div>
                            </span>
                         </div>
                        </div>
                    </el-card>
                </el-col>
               </div>
              </el-row>
            </div>
          </el-tab-pane>


          <el-tab-pane label="技能图谱" name="graph" lazy>
            <el-card>
              <el-row :gutter="20">
                <el-col :span="6">
                  <span>认证技能点数量：</span>
                  <span>{{ summaryData.skillPointNum }}</span>
                </el-col>
                <el-col :span="6">
                  <span>认证技能数量：</span>
                  <span>{{ summaryData.skillNum }}</span>
                </el-col>
              </el-row>
            </el-card>
            
            <el-card style="margin-top: 15px;">
              <RemoteMapSkillTreePreview />
            </el-card>
          </el-tab-pane>
        

        <el-tab-pane label="工程指标" name="metric" v-loading="loading">
            <el-card>
              <div style="display: flex; justify-content: flex-start">
                <el-date-picker
                  style="margin-left: 15px"
                  @change="changeMetricDate()"
                  v-model="metricDate"
                  type="daterange"
                  align="right"
                  unlink-panels
                  size="small"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  >
                </el-date-picker>
              </div>
            </el-card>
            <el-card style="margin-top: 15px">
              <p style="font-weight: bold; font-size: 18px">个人表现</p>
              <el-row>
                <el-col :span="14">
                  <el-row :gutter="30">
                    <el-col :span="24">
                      <div class="title-layout">产出类</div>
                    </el-col>
                    <el-col :span="8">
                      <div class="growthinfo-layout">
                        <div>开发当量</div>
                        <div class="metric">{{ PortraitPersonDevlopRespVO.devEquivalent }}</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="growthinfo-layout">
                        <div>代码行数</div>
                        <div class="metric">{{ PortraitPersonDevlopRespVO.insertions }}/{{PortraitPersonDevlopRespVO.deletions}}</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="growthinfo-layout">
                        <div>代码提交次数</div>
                        <div class="metric">{{ PortraitPersonDevlopRespVO.commitCount }}</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="growthinfo-layout">
                        <div>项目数/功能数/修复bug数</div>
                        <div class="metric">{{ PortraitPersonDevlopRespVO.projectNum }}/{{PortraitPersonDevlopRespVO.demandNum}}/{{PortraitPersonDevlopRespVO.bugNum}}</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="growthinfo-layout">
                        <div>开发价值</div>
                        <div class="metric">{{PortraitPersonDevlopRespVO.devValue}}%</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="growthinfo-layout">
                        <div>代码影响力</div>
                        <div class="metric">{{PortraitPersonDevlopRespVO.funImpact}}%</div>
                      </div>
                    </el-col>
                    <el-col :span="24"><el-divider></el-divider></el-col>
                    <div>
                      <el-col :span="24">
                        <div class="title-layout">效率类</div>
                      </el-col>
                      <el-col :span="8">
                        <div class="growthinfo-layout">
                          <div>项目平均开发周期</div>
                          <div class="metric">{{PortraitPersonDevlopRespVO.projectAveDevPeriod}}h</div>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="growthinfo-layout">
                          <div>功能平均开发周期</div>
                          <div class="metric">{{PortraitPersonDevlopRespVO.functionAveDevPeriod}}h</div>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="growthinfo-layout">
                          <div>bug平均修复时间</div>
                          <div class="metric">{{PortraitPersonDevlopRespVO.bugAveFixTime}}h</div>
                        </div>
                      </el-col>
                    </div>
                    <el-col :span="24"><el-divider></el-divider></el-col>
                    <el-col :span="24">
                      <div class="title-layout">发布类</div>
                    </el-col>
                    <el-col :span="8">
                      <div class="growthinfo-layout">
                        <div>发布次数</div>
                        <div class="metric">{{PortraitPersonDevlopRespVO.publishNum}}</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="growthinfo-layout">
                        <div>编译次数</div>
                        <div class="metric">{{PortraitPersonDevlopRespVO.compileNum }}</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="growthinfo-layout">
                        <div>上线次数</div>
                        <div class="metric">{{PortraitPersonDevlopRespVO.onlineNum }}</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="growthinfo-layout">
                        <div>重启次数</div>
                        <div class="metric">{{PortraitPersonDevlopRespVO.restartNum}}</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="growthinfo-layout">
                        <div>回滚次数</div>
                        <div class="metric">{{PortraitPersonDevlopRespVO.rollbackNum}}</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="growthinfo-layout">
                        <div>平均交付周期</div>
                        <div class="metric">{{PortraitPersonDevlopRespVO.rollbackNum}}</div>
                      </div>
                    </el-col>
                    <el-col :span="24"><el-divider></el-divider></el-col>
                    <el-col :span="24">
                      <div class="title-layout">质量类</div>
                    </el-col>
                    <el-col :span="8">
                      <div class="growthinfo-layout">
                        <div>注释覆盖度</div>
                        <div class="metric">{{PortraitPersonDevlopRespVO.docCoverage}}%</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="growthinfo-layout">
                        <div>测试覆盖度</div>
                        <div class="metric">{{PortraitPersonDevlopRespVO.staticTestCoverage}}%</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="growthinfo-layout">
                        <div>千行bug率</div>
                        <div class="metric">{{PortraitPersonDevlopRespVO.bugProbability}}%</div>
                      </div>
                    </el-col>
                    <el-col :span="24"><el-divider></el-divider></el-col>
                    <el-col :span="24">
                      <div class="title-layout">成本类</div>
                    </el-col>
                    <el-col :span="8">
                      <div class="growthinfo-layout">
                        <div style="text-align: center">出勤工时/开发工时/工时饱和度</div>
                        <div class="metric">{{PortraitPersonDevlopRespVO.workHours}}/{{PortraitPersonDevlopRespVO.devlopHours}}/{{PortraitPersonDevlopRespVO.workSaturability}}%</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="growthinfo-layout">
                        <div>休假天数</div>
                        <div class="metric">{{PortraitPersonDevlopRespVO.vacationDays}}</div>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="10">
                  <div ref="metricRadarChart" style="text-align: center; width: 80%; height: 400px;"></div>
                </el-col>
              </el-row>
            </el-card>
            <el-card style="margin-top: 15px; width: 100%">
              <p style="font-weight: bold; font-size: 18px">项目表现</p>
              <div ref="projectChart1" style="text-align: center; width: 100%; height: 500px; border: 1px solid gray; padding: 20px"></div>
            </el-card>
          </el-tab-pane>

        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>
<script>

import NewEhrServer from '@/apis/newEhr.js';
import moment from 'moment';
import PortraitPerson from '@/apis/portraitPerson.js';
import authServer from '@/apis/authorize.js';
import ehrServer from '@/apis/ehr.js';
import { isEmpty } from 'lodash-es';
import RemoteMapSkillTreePreview from '@/components/RemoteMapSkillTree/preview.vue';
const echarts = require('echarts/lib/echarts');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend');
require('echarts/lib/chart/pie');
require('echarts/lib/component/title');
require('echarts/lib/chart/radar');
require('echarts/lib/component/grid');
require('echarts/lib/chart/line');
require('echarts/lib/chart/graph');
require('echarts/lib/component/brush');
require('echarts/lib/chart/scatter');
require('echarts/lib/component/markLine');
require('echarts/lib/component/markArea');
require('echarts/lib/component/markPoint');
var option;
var option1;
var option2;
var growthValueOption;
var assignTaskCountOption;
var skillValueOption;
var skillTaskCountOption;
var skillAuthCountOption;
var skillGraphCountOption;
var engineeringMetricOption;
var projectCharts1Option;
var projectCharts2Option;
var projectCharts3Option;
var periodCharts1Option;
var periodCharts2Option;
var relationChartOption;
var behaviorChartOption;
var deptTree = '';

export default {
  components: {
    RemoteMapSkillTreePreview,
  },
  watch: {
    selectUserCode: {
      handler(val) {
        if (this.selectTab === 'portrayal') {
          this.activePortrayalInfo()
        }
        if (this.selectTab === 'graph') {
          //let uid = this.selectUserCode;
          let user = this.$store.state.permission?.userinfo;
          let uid = user.uid;
          PortraitPerson.getSkillGraphData(uid).then(res => {
            this.summaryData = res
          })
        }
        if (this.selectTab === 'task') {
          this.drawTask()
        }
        if (this.selectTab === 'metric') {
          this.changeMetricDate();
        }
      }
    },
    mapSelect: {
      deep: true,
      handler(value) {
        if (!value.mapId) {
          return;
        }
        // 开启点亮技能渲染的逻辑
        value.isFinished = true;
        this.$refs.mapSkillTree.render(value);
      }
    }
  },
  created () {
    this.getCurrentRole();
    this.getCurrentUid();
    this.loadTree()
  },
  mounted () {
    this.activePortrayalInfo();
  },
  data: function() {
    return {
      PortraitDevlopTeam:[],
      PortraitPersonGrowingupRespVOs:[],
      PortraitPersonDevlopRespVO:{},
      
      employeeList: [],
      graphZoomOrigin: 1, // 用于存放 graph 缩放大小
      isSavingPicture: false, // 是否正在保存图片中

      summaryData: {},
      // 操作图谱技能树
      mapSelect: {
        mapId: '',
        jobLevel: [],
      },
      loading: false,
      userinfo: {},
      growthInfo: {
        growthValueAcc: [],
        growthValueDate: [],
      },
      radarGraphs: [],
      radarTexts: [],
      radarValues: [],
      receivedCount: 0,
      releasedCount: 0,
      receiveCharts: '',
      releaseCharts: '',
      radarCharts: '',
      growthValueCharts: '',
      assignTaskCountCharts: '',
      skillValueCharts: '',
      skillTaskCountCharts: '',
      skillAuthCountCharts: '',
      skillGraphCountCharts: '',
      metricRadarCharts: '',
      projectCharts1: '',
      projectCharts2: '',
      projectCharts3: '',
      periodCharts1: '',
      periodCharts2: '',
      relationCharts: '',
      behaviorCharts: '',
      activeName: 'portrayal',
      activeLine: 'growthValue',
      taskDate: [new Date(2020, 12, 1), new Date(2021, 11, 31)],
      lineDate: [new Date(2020, 12, 1), new Date(2021, 11, 31)],
      metricDate: [new Date(2020, 12, 1), new Date(2021, 11, 31)],
      engineering: {
        personalByProject: {},
        personalProjectResp: {},
        personalResp: {},
        personOverview: {}
      },
      roles: [],
      props: {
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf'
      },
      defaultCheckedKeys: [],
      defaultExpandedKeys: [],
      noDeptCodes: [],
      selectUserCode: this.getCurrentUid(),
      selectTab: 'portrayal',
    }
  },

  methods: {

     //个人基本信息展现
    getPortraitPersonInfo(){
        //用户code
        let uid = this.selectUserCode;
        console.log(uid)
        NewEhrServer.getPortraitUserInfo(uid).then(res => {
          this.userinfo = res;
        }).catch((error) => {
          console.log(error);
        })
    },

    //个人成长指标信息展现
    getUserGrowingupInfo(){
        //用户code
        let uid = this.selectUserCode;
        PortraitPerson.getUserGrowingupInfo(uid).then(res => {
          this.PortraitPersonGrowingupRespVOs=res;
        }).catch((error) => {
          console.log(error);
        })
    },

    //工程指标
    changeMetricDate () {
      this.tabMertic();
    },
    tabMertic(){
      
      let startTime = moment(this.metricDate.length ? this.metricDate[0] : new Date(2021, 1, 1)).format('YYYY-MM-DD');
      let endTime = moment(this.metricDate.length ? this.metricDate[1] : new Date(2021, 12, 31)).format('YYYY-MM-DD');
        let params = {
          uid: this.selectUserCode,
          startTime: startTime,
          endTime: endTime,
        }
        //个人表现展现
        this.getDevlopPortraitData(params);
        //描绘个人表现雷达图
        this.activeMetricRadar(params);
        //个人项目表现
        this.activeProjectChart(params);
    },

    //个人工程指标
    getDevlopPortraitData(params){
        PortraitPerson.getDevlopPortraitData(params).then(res => {
          console.log(res);
          this.PortraitPersonDevlopRespVO=res;
        }).catch((error) => {
          console.log(error);
        })
    },

    //工程指标-雷达图
    activeMetricRadar (params) {
      //获取团队表现
      PortraitPerson.getDevlopPortraitByTeam(params).then(res => {
          let devValue = this.PortraitPersonDevlopRespVO.devValue - 0;
          let funImpact = this.PortraitPersonDevlopRespVO.funImpact - 0;
          let functionAveDevPeriod = 0 - this.PortraitPersonDevlopRespVO.functionAveDevPeriod;
          let bugAveFixTime = 0 - this.PortraitPersonDevlopRespVO.bugAveFixTime;
          let portraitPersonDevlop=[this.PortraitPersonDevlopRespVO.devEquivalent, devValue, funImpact, functionAveDevPeriod, bugAveFixTime];

          let portraitDevlopTeam=[];
          portraitDevlopTeam.push(res.devEquivalent);
          portraitDevlopTeam.push(res.devValue-0);
          portraitDevlopTeam.push(res.funImpact-0);
          portraitDevlopTeam.push(0-res.functionAveDevPeriod);
          portraitDevlopTeam.push(0-res.bugAveFixTime);

          console.log(portraitPersonDevlop);
          console.log(portraitDevlopTeam);


          let newPromise = new Promise((resolve) => {
            resolve()
          })
          newPromise.then(() => {
            this.metricRadarCharts = echarts.init(this.$refs.metricRadarChart)
            this.metricRadarCharts.setOption(engineeringMetricOption = {
              color: [ '#FF6347', '#FFE434', '#56A3F1', '#FF917C'],
              title: {
                text: ''
              },
              legend: {
                data: ['团队平均值', '个人值', 'Data C', 'Data D']
              },
              radar: [
                {
                  indicator: [
                    { text: '开发当量' },
                    { text: '开发价值' },
                    { text: '代码影响力' },
                    { text: '功能平均开发时间' },
                    { text: 'bug平均修复时间' }
                  ],
                  center: ['60%', '60%'],
                  radius: 80,
                  startAngle: 90,
                  splitNumber: 4,
                  shape: 'circle',
                  name: {
                    formatter: '{value}',
                    textStyle: {
                      color: 'black'
                    }
                  },
                  splitArea: {
                    areaStyle: {
                      color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
                    }
                  },
                  axisLine: {
                    lineStyle: {
                      color: 'white'
                    }
                  },
                  splitLine: {
                    lineStyle: {
                      color: 'white'
                    }
                  }
                },
              ],
              series: [
                {
                  name: '雷达图',
                  type: 'radar',
                  emphasis: {
                    lineStyle: {
                      width: 4
                    }
                  },
                  data: [
                    {
                      value: portraitDevlopTeam,
                      name: '团队平均值'
                    },
                    {
                      value: portraitPersonDevlop,
                      name: '个人值',
                      areaStyle: {
                        color: 'rgba(255, 228, 52, 0.6)'
                      }
                    }
                  ]
                },
              ]
            }, true);
          })
      }).catch((error) => {
        console.log(error);
      })
    },

    //个人工程指标-项目表现
    activeProjectChart (params) {
      //个人在项目的表现
      PortraitPerson.getProjectPortraitData(params).then(res => {
          let list = res;
          this.projectCharts1 = echarts.init(this.$refs.projectChart1)
          this.projectCharts1.setOption(projectCharts1Option = {
            title: {
              text: '开发当量',
              subtext: '',
              left: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              top: 'bottom',
              left: 'center'
            },
            series: [
              {
                name: '',
                type: 'pie',
                radius: '50%',
                center: ['50%', '50%'],
                data: list,
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
        }).catch((error) => {
          console.log(error);
        })
    },


    convertSecond2Hour (s) {
      return this.MathCeil(s / (60 * 60));
    },


    queryPeople (query) {
      ehrServer.getEmpList({ empCodeNameAdcode: query }).then(data => {
        this.employeeList = data.map(user => {
          return {
            code: user.code,
            email: user.email,
            name: user.name + '(' + user.email.split('@')[0] + ')'
          };
        });
      }).catch((err) => {
      });
    },


    MathCeil (val) {
      return Math.ceil(val)
    },
    saveToPng() {
      const graph = this.$refs.mapSkillTree.getThisGrpah();
      if (!graph) {
        return this.$message.warning('技能图谱不存在，请先选择职务');
      }
      this.isSavingPicture = true;
      this.graphZoomOrigin = graph.getZoom();
      graph.zoomTo(1.3);
      graph.downloadFullImage(this.mapSelect.mapId, 'image/png');
      setTimeout(() => {
        graph.zoomTo(this.graphZoomOrigin);
        graph.fitCenter();
        this.isSavingPicture = false;
      }, 2500);
    },
    activePeriodChart (list) {
      this.periodCharts1 = echarts.init(this.$refs.periodChart1)
      this.periodCharts1.setOption(periodCharts1Option = {
        xAxis: {
          type: 'category',
          data: list.filter(i => i.devEquivalent !== 0).map(i => i.day)
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: list.filter(i => i.devEquivalent !== 0).map(i => i.devEquivalent),
          type: 'bar',
          label: {
            show: true,
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
            },
            position: 'outside'
          },
        }]
      })
    },
    
    handleNodeClick (data) {
      if (data.isLeaf) {
        this.selectUserCode = data.code;
      }
    },

    async loadTree() {
      // 该用户没有部门树，主动查询该用户部门树
       NewEhrServer.getUserInfo().then(data => {
        const user =  data;
        this.selectUserCode = user.userCode;
        let currentUserCode = this.selectUserCode;
        if (isEmpty(deptTree)) {
            ehrServer.queryDetail({userCode: currentUserCode}).then(data => {
            this.defaultExpandedKeys = (data.treePath && data.treePath.split("/")) || ['101'];
          }).catch(() => {
          });
        }
        this.currentUserKey = currentUserCode;
        this.defaultCheckedKeys = [currentUserCode]
        })
    },

    async loadNode (node, resolve) {
      if (node.level === 0) {
        const data = await ehrServer.getOrgList();
        const dept = (data) || null;
        if (!dept) {
          return resolve([]);
        }
        return resolve([dept]);
      }
      let results = [];
      const { code } = node.data;
      const users = await ehrServer.getEmpListByDept({
        orgCode: code,
        empCodeNameAdcode: '',
      }).catch(err => {
        this.$message({ type: 'error', message: '查询部门人员异常: ' + err.message });
        throw err;
      });
      if (users && users.length) {
        results.push(...users.map(user => {
          if (user.code === this.currentUserKey) {
            this.currentNodeKey = user.code;
          }
          return {
            code: user.code,
            name: user.name,
            isUser: true,
            isLeaf: true,
          };
        }));
      }
      const deptList = await ehrServer.getNextOrg({ deptId: code });
      if (deptList && deptList.length) {
        results = results.concat(deptList);
      }
      return resolve(results);
    },


    getCurrentRole () {
      authServer.getAuthorize().then(data => {
        this.roles = data.roles;
      })
    },

    getCurrentUid () {
      NewEhrServer.getUserInfo().then(data => {
        const user =  data;
        this.selectUserCode = user.userCode;
        console.log(this.selectUserCode);
        return user.userCode;
      })
    },

    handleClick (tab, event) {
      this.selectTab = tab.name
      if (tab.name === 'portrayal') {
        this.activePortrayalInfo()
      }
      if (tab.name === 'graph') {
         //let uid = this.selectUserCode;
        let user = this.$store.state.permission?.userinfo;
         let uid = user.uid;
          PortraitPerson.getSkillGraphData(uid).then(res => {
            this.summaryData = res
          })
      }
      if (tab.name === 'task') {
        if (this.$refs.receiveChart) {
          this.receiveCharts = echarts.init(this.$refs.receiveChart)
        }
        if (this.$refs.releaseChart) {
          this.releaseCharts = echarts.init(this.$refs.releaseChart)
        }
        this.drawTask()
      }
      if (tab.name === 'metric') {
        this.$nextTick(() => {
           this.tabMertic();
        })
      }
    },

    activePortrayalInfo () {
      this.getPortraitPersonInfo();
      this.getUserGrowingupInfo();
    },

    getFirstDayOfMonth () {
      let date = new Date();
      date.setDate(1);
      return date;
    },

    getLastDayMonth (){
      var date = new Date();
      var currentMonth = date.getMonth();
      var nextMonth = ++currentMonth;
      var nextMonthFirstDay = new Date(date.getFullYear(),nextMonth,1);
      var oneDay = 1000 * 60 * 60 * 24;
      return new Date(nextMonthFirstDay - oneDay);
    },

    activeAssignTaskCount () {
      this.assignTaskCountCharts = echarts.init(this.$refs.assignTaskCountChart)
      this.assignTaskCountCharts.setOption(assignTaskCountOption = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [150, 230, 224, 218, 342, 147, 260],
            type: 'line'
        }]
      }, true);
    },

    refresh () {
    },
    query () {
    },
    drawRadar () {
      this.radarCharts = echarts.init(this.$refs.radarChart)
      this.radarCharts.setOption(option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        radar: [
          {
            indicator: this.radarTexts,
            center: ['50%', '50%'],
            radius: 50
          },
        ],
        series: [
          {
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },
            areaStyle: {},
            data: [
              {
                value: this.radarValues,
                name: '技能值：'
              }
            ]
          },
        ]
      }, true);
    },
    drawTask () {
      const params = {
        uid: this.selectUserCode,
        startTime: this.taskDate[0],
        endTime: this.taskDate[1]
      }
      PortraitPerson.getDailyTaskInfo(params).then(data => {
        console.log(data);
        this.receivedCount = data.receivedCount
        this.releasedCount = data.releasedCount
        const receiveData = [
          {value: data.received.unclaimed, name: '待认领'},
          {value: data.received.rejected, name: '已拒绝'},
          {value: data.received.ongoing, name: '进行中'},
          {value: data.received.finished, name: '已完成'},
          {value: data.received.waitingAccept, name: '待验收'},
          {value: data.received.unfinished, name: '未完成'},
          {value: data.received.acceptance, name: '验收通过'},
          {value: data.received.failed, name: '验收不通过'}
        ];
        const releaseData = [
          {value: data.released.ongoing, name: '进行中'},
          {value: data.released.completed, name: '已完成'},
          {value: data.released.closed, name: '已关闭'},
        ]
        if (this.receiveCharts) {
          this.receiveCharts.setOption(option1 = {
            title: {
                text: '我接受的任务统计',
                left: 'center'
            },
            legend: {
              top: 'bottom',
              left: 'center'
            },
            series: [
              {
                name: '接收任务统计',
                type: 'pie',
                radius: ['25%', '40%'],
                avoidLabelOverlap: true,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2
                },
                label: {
                  formatter: '{b|{b}：}{c}  {per|{d}%}  ',
                  backgroundColor: '#F6F8FC',
                  borderColor: '#8C8D8E',
                  borderWidth: 1,
                  borderRadius: 4,
                  rich: {
                    a: {
                      color: '#6E7079',
                      lineHeight: 22,
                      align: 'center'
                    },
                    hr: {
                      borderColor: '#8C8D8E',
                      width: '100%',
                      borderWidth: 1,
                      height: 0
                    },
                    b: {
                      color: '#4C5058',
                      fontSize: 14,
                      fontWeight: 'bold',
                      lineHeight: 33
                    },
                    per: {
                      color: '#fff',
                      backgroundColor: '#4C5058',
                      padding: [3, 4],
                      borderRadius: 4
                    }
                  }
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: '20',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: receiveData,
              }
            ]
          }, true)
        }
        if (this.releaseCharts) {
          this.releaseCharts.setOption(option2 = {
            title: {
                text: '我发布的任务统计',
                left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              top: 'bottom',
              left: 'center'
            },
            series: [
              {
                name: '发布任务统计',
                type: 'pie',
                radius: ['25%', '40%'],
                avoidLabelOverlap: true,
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
                data: releaseData
              }
            ]
          }, true)
        }
      })
    },
  }
}
</script>
<style>
.growthinfo-layout {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap
}
.title-layout {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.metric {
  font-weight: bold
}
.dept-header {
  padding: 0 0 10px 16px;
  background: rgba(249,249,249,1);
  border-bottom: 1px solid rgba(238,238,238,1);;
}
.dept-header span {
  font-size:13px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:rgba(0,0,0,0.4);
  line-height:18px;
  height:18px;
}
.dept-tree {
  /* height: calc(100% - 48px); */
  height: 600px;
  overflow-y: scroll;
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
