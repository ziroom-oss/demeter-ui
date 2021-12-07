<template>
    <div>
        <el-container>
        <el-main>
          <p class="classify-name">编辑基本信息</p>
          <div aria-rowspan="10">
              <el-row> 
                  <el-form label-width="120px" :model="editBasicInfo" :rules="rules" ref="editBasicInfo">
                      <el-form-item 
                      label="学习清单名称:"
                      :rules="{
                        required: true, message: '学习清单名称', trigger: 'blur'
                      }">
                          <el-col :span="7">
                              <el-input v-model="editBasicInfo.name" placeholder="请填写学习清单名称"></el-input>
                          </el-col>
                      </el-form-item>

                      <el-form-item
                      label="学习周期:"
                      :rules="{
                        required: true, message: '学习周期', trigger: 'blur'
                      }">
                          <el-date-picker
                              v-model="learnPeriod"
                              type="daterange"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              unlink-panels
                              :default-time="['00:00:00', '23:59:59']"
                              value-format="timestamp"
                              >
                              </el-date-picker>          
                      </el-form-item>
                      <el-form-item 
                      label="接收者:"
                      :rules="{
                        required: true, message: '接收者', trigger: 'blur'
                      }">
                          <el-col :span="7">
                               <el-select
                                v-model="editBasicInfo.learnerUid"
                                placeholder="通过姓名/工号/邮箱前缀填写接收者"
                                filterable
                                remote
                                clearable
                                :loading="loading"
                                :remote-method="queryPeople"
                                style="width:300px"
                              >
                                <el-option v-for="item in receiverList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                              </el-select>
                          </el-col>
                      </el-form-item>
                  </el-form>  
              </el-row>     
          </div>                      
        <!--表单 end <el-card style="margin-top: 15px;">-->
          
          <div>
            <p class="classify-name">分配学习内容</p>
            <el-tabs type="card" v-model="activeName">
              <el-tab-pane label="选择技能图谱" name="skillGraph">
              <el-card style="margin-top: 15px;">
                <MapSkillPointTree v-if="showSkillMapTreeEdit" :userId="editBasicInfo.learnerUid" @addSkill="addSkill"/>
                <el-alert title="请先填写接收者" type="warning" :closable="false" v-else></el-alert>
              </el-card>
            </el-tab-pane>
              <el-tab-pane label="选择技能点" name="skillPoint">
                <el-alert>该功能暂时不提供操作</el-alert>
<!--                <el-card style="margin-top: 15px;">-->
<!--                  <el-col style="width: 100%; height: 750px">-->
<!--                   <SkillPointComponent ref="skillPointComponent" @getSkillPoints = 'getSkillPoints' />-->
<!--                  </el-col>-->
<!--                </el-card>-->
              </el-tab-pane>
            </el-tabs>
          </div>

          <div style="margin-top: 16px">
            <p class="classify-name">学习清单预览</p>
            <el-card>
              <MapSkillStudyListTree ref="mapSkillStudyListTree" :skillPointModels="skillPointModels" :studyPaths="studyPaths" @remove="removeSkill" :name="editBasicInfo.name" />
            </el-card>
          </div>
          <div style="margin-top: 16px">
            <el-button type="primary" size="small" @click="addStudyList" v-if="!$route.query.id">创建</el-button>
            <el-button type="primary" size="small" @click="modifyStudyList" v-if="$route.query.id">修改</el-button>
            <el-button type="primary" size="small" @click="$router.push({name: 'SkillAuthManagement_SkillAssignList'})" >取消</el-button>
          </div>
        </el-main>
      </el-container>
    </div>
</template>

<script>
import authServer from '@/apis/authorize.js';
import ehrServer from '@/apis/ehr.js';
import taskServer from '@/apis/task.js';
import mapServer from '@/apis/map.js'
import { omit } from 'lodash-es';

// 提供弹窗交互的技能树组件，用于导出选中技能点数据
import MapSkillPointTree from '@/components/RemoteMapSkillTree/skillPoint.vue';
// 提供弹窗交互用于添加和修改学习路径的技能树组件
import MapSkillStudyListTree from '@/components/RemoteMapSkillTree/studyList.vue';

import SkillPointComponent from '@/components/skill/SkillPointComponent.vue';

export default {
  components: {
    MapSkillPointTree,
    SkillPointComponent,
    MapSkillStudyListTree
  },
  watch: {
    selectUserCode: {
      handler(val) {
        console.log("获取用户系统码："+val);  
           if (this.selectTab === 'skillGraph') {
            mapServer.getSkillGraphData().then(res => {
              console.log("获取用户系统码测试");
              console.log(res);
          })
        }
      }
    },
    //60034198
    editBasicInfo: {
      handler(value){
        if(value.learnerUid && value.name) {
          this.showSkillMapTreeEdit = true;
        }
      },
      deep: true
    }
  },

   data: function() {
    return {
      // mapSkillTree 如果弹出过一次就不必再次渲染
      showSkillMapTreeEdit: false,
    //form about start
      editBasicInfo: {
          name: '',
          learnPeriodStart: '',
          learnPeriodEnd: '',
          learnerUid: '',
      },
      activeName: 'skillGraph',
      learnPeriod: [],
      loading: false,
      roles: [],
      selectUserCode: this.getCurrentUid(),
      selectTab: 'skillPoint',
      rules: {},
      receiverList: [],
      // 技能点列表
      skillPointModels: [],
      studyPaths: [],
    }
  },  
  mounted () {
    const studyListId = this.$route.query.id;
    if (studyListId) {
      taskServer.getStudyListDetail(studyListId).then(res => {
        const { name, learnPeriodStart, learnPeriodEnd, learnerUid, demeterSkillTasks, demeterSkillLearnPaths  } = res;
        Object.assign(this.editBasicInfo, { name, learnerUid, learnPeriodStart, learnPeriodEnd });
        this.learnPeriod = [learnPeriodStart, learnPeriodEnd];
        // // 对学习路径和技能任务作已保存 isSaved 的标记，避免再次添加
        // demeterSkillTasks.forEach(skillTask => {
        //   skillTask.isSaved = true;
        // });
        demeterSkillLearnPaths.forEach(learnPath => {
          // 为学习路径添加该属性以支持删除操作
          learnPath.isDynamicLeaf = true;
        })
        // ------end------

        // 生成树图需要作以下数据的修改
        this.studyPaths = demeterSkillLearnPaths.map(learnPath => {
          learnPath.name = learnPath.path;
          learnPath.parentId = learnPath.taskId;
          return learnPath;
        });
        this.$nextTick(() => {
          this.skillPointModels = demeterSkillTasks.map(skillTask => {
            // 直接从 DemeterSkillTask 返回的数据，如果要生成树图必须作以下修改
            skillTask.name = skillTask.taskName;
            skillTask.skillTreeId = skillTask.skillId;
            skillTask.skillTaskId = skillTask.id;
            return skillTask;
          });
        })
      })
    }
  },
  methods: {
    //创建学习清单
    createStudyList() {
      const refStudyListTree = this.$refs.mapSkillStudyListTree;
      const skillPoints = refStudyListTree.getSkillPoints();
      // @todo studyPaths 对应服务的 skillPaths 参数
      const studyPaths = refStudyListTree.getStudyPaths();
      // 先从所有 skillPoints 整理出 Record<skillTaskId, string[]> 的结构
      const skillPaths = skillPoints
          .map(sp => sp.skillTaskId)
          .reduce((acc, curr) => {
            acc[curr] = [];
            return acc;
          }, {});
      // 遍历所有学习路径，如果该路径的父级是 skillPoints 其中一个则推入它的值数组
      studyPaths.forEach(sp => {
        // sp 的 parentId 即 skillPoint 的 skillTaskId
        if (skillPaths[sp.parentId]) {
          skillPaths[sp.parentId].push(sp.name);
        }
      });
      return {
        name: this.editBasicInfo.name,
        learnPeriodStart: this.learnPeriod[0],
        learnPeriodEnd: this.learnPeriod[1],
        learnerUid: this.editBasicInfo.learnerUid,
        skillPaths,
      }
    },
    addStudyList() {
      const submit = this.createStudyList();
      taskServer.createManifest(submit).then(res => {
        this.$message.success('创建成功');
        this.$router.push({ name: 'SkillAuthManagement_SkillAssignList' });
      }).catch(error => {
        this.$message.error(error.message + '： 创建失败，请重新关联');
      })
    },
    queryPeople(query) {
      this.loading = true;
      ehrServer.getEmpList({ empCodeNameAdcode: query }).then(data => {
        this.loading = false;
        this.receiverList = data.map(user => {
          return {
            code: user.code,
            email: user.email,
            name: user.name + '(' + user.email.split('@')[0] + ')'
          };
        });
      }).catch(() => {
        this.loading = false;
      });
    },
    modifyStudyList() {
      const id = this.$route.query.id;
      if (!id) return this.$message.error('未知学习清单（没有清单 id 或者清单不存在）')
      const submit = {
        id,
        ...omit(this.createStudyList(), ['skillPaths']),
      };
      taskServer.modifyManifest(submit).then(() => {
        this.$message.success('修改成功');
        this.$router.push({ name: 'SkillAuthManagement_SkillAssignList' });
      }).catch(err => {
        this.$message.error(err.message);
      })
    },
    
    getSkillPoints(data){
      this.$set(data, "name", this.editBasicInfo.name);
      this.skillmodel = data;
    },
    //计算学习周期
    computeLearnedPeriod(){
      let startTime;
      let endTime;

      if(this.editBasicInfo.learnPeriod == null){
          startTime = new Date();
          endTime = new Date();
      } else {
        startTime = (this.editBasicInfo.learnPeriod[0] == null)?new Date():this.editBasicInfo.learnPeriod[0];
        endTime = (this.editBasicInfo.learnPeriod[1] == null)?new Date():this.editBasicInfo.learnPeriod[1];
      }
      const dateDiff = endTime.getTime() - startTime.getTime();//时间差的毫秒数
      const dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
      this.editBasicInfo.learnPeriod =  dayDiff;
    },
    getCurrentRole () {
      authServer.getAuthorize().then(data => {
        this.roles = data.roles;
      })
    },
    getCurrentUid () {
      const user = this.$store.state.permission?.userinfo;
      return user.uid
    },
    addSkill(model) {
      if (this.skillPointModels.length < 1) {
        this.$set(this, 'skillPointModels', []);
      }
      // 不要推入重复的数据
      const r = this.skillPointModels.find(item => model.skillTaskId === item.skillTaskId);
      if (r) return;
      // 如果 url 中有 id 参数则判断是远程添加
      if (this.$route.query.id) {
        const manifestId = this.$route.query.id;
        const taskId = model.skillTaskId;
        const learnerUid = this.editBasicInfo.learnerUid;
        taskServer.createSkillTaskIntoManifest(manifestId, taskId, learnerUid).then(res => {
          // 后续在该 model（技能点）下添加学习路径需要 taskUserId 参数
          model.taskUserId = res;
          this.skillPointModels.push(model);
          this.$message.success('技能点添加成功');
        }).catch((error) => {
          this.$message.error(error.message + '：添加失败');
        })
      } else {
        this.skillPointModels.push(model);
      }
    },
    // 学习清单树图的移除节点操作
    removeSkill(model) {
      console.info(model);
      const index = this.skillPointModels.findIndex(item => model.skillTaskId === item.skillTaskId);
      this.skillPointModels.splice(index, 1);
      const manifestId = this.$route.query.id;
      const taskId = model.skillTaskId;
      // manifestId 是已保存清单的 id，taskId 是任务 id
      // 如果没有 manifestId 不要操作此步
      if (manifestId && taskId) {
        taskServer.deleteManifestSkill(manifestId, taskId).then(res => {
          this.$message.success('已从清单移除目标技能节点和它的学习路径');
        }).catch(error => {
          this.$message.error('清除失败');
        })
      }
    }
  }
}
</script>

<style scoped>
.classify-name {
  font-size: 16px;
  line-height: 16px;
  border-left: 2px solid #0099FF;
  padding-left: 4px;
}
</style>