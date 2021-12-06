<template>
  <div>
    <el-card>
      <p style="font-weight: bold; font-size: 25px">学习清单详情</p>
      <p style="font-weight: bold">任务基本信息</p>

      <el-form :model="studyLists" label-position="left" label-width="120px" label-suffix="：">

        <el-row :gutter="2">
          <el-col :span="8">
            <el-form-item label="学习清单名称" size="small">
              <span v-text="studyLists.name"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接收者">
              <span v-text="studyLists.learnerName"></span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="2"> 
          <el-col :span="8">
            <el-form-item label="学习清单编号">
              <span v-text="studyLists.id"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发布者">
              <span v-text="studyLists.assignerName"></span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="2">
          <el-col :span="8">
            <el-form-item label="学习周期">
              <span v-text="studyLists.learnPeriod"></span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="创建时间">
              <span v-text="formateTime(studyLists.createTime)"></span>
            </el-form-item>
          </el-col>         
        </el-row>  
        <el-row :gutter="2">
          <el-col :span="8">
            <el-form-item label="状态">
              <span v-text="studyLists.statusName"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="技能值奖励">
              <span v-text="studyLists.reward"></span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <p style="font-weight: bold; margin-top: 16px">学习清单详情</p>
      <el-card class="box-card" style="width: 100%; height: 500px">
        <!--学习清单，技能图谱清单-->
        <div style="width: 100%; height: 300px;">
          <StudyListPreview :skillPointModels="demeterSkillTasks" :name="name" />
        </div>
        <!---->
      </el-card>
    </el-card>
    
  </div>
</template>
<script>
import taskServer from '@/apis/task.js';
import dayjs from 'dayjs';
//import { getUserinfo } from '@ziroom/zcloud-head';
import SvgIcon from '@/components/svg-icon.vue';
import StudyListPreview from '@/components/RemoteMapSkillTree/studyListPreview.vue';
export default {
  components: {
    SvgIcon,
    StudyListPreview,
  },
  data: function() {
    return {
      studyLists: {},
      checkParam: {
        result: 1,
        opinion: ''
      },
      demeterSkillTasks: [],
      name: '', // 学习清单名称
    }
  },
  created () {
    this.refresh();
  },
  methods: {
    refresh () {
      this.getStudyListDetail();
    },
    getStudyListDetail () {
      taskServer.getStudyListDetail(this.$route.query.id).then(data => {
        console.log(data);
        this.studyLists = data;//.skillLearnManifestDetailResp       
        this.skillmodel = data.SkillTree;
        this.name = data.name;
        const { demeterSkillLearnPaths, demeterSkillTasks } = data;
        demeterSkillTasks.forEach(skillTask => {
          skillTask.skillTaskId = skillTask.id;
          skillTask.skillTreeId =  skillTask.skillId;
          skillTask.name = skillTask.taskName;
          demeterSkillLearnPaths.forEach(learnPath => {
            if (learnPath.taskId === skillTask.id) {
              if (!skillTask.children) {
                skillTask.children = [];
              }
              skillTask.children.push({
                id: 'path-' + learnPath.id,
                name: learnPath.path,
                type: 'dice-mind-map-leaf',
                color: 'orange',
                parentId: skillTask.id,
              });
            }
          })
        });
        this.demeterSkillTasks = demeterSkillTasks;
      });
      
    },
    formateTime (time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
    },
    checkCondition (conditionId) {
      console.log(conditionId);
      // 不在指派人列表
      const isReceiver = this.receiverList.filter(user => user.receiverUid === this.getCurrentUid());
      if (isReceiver.length === 0) {
        return 0;
      }

      if (!this.taskFinishConditionInfoRespList || this.taskFinishConditionInfoRespList.length === 0) {
        // 在指派人列表中但未认领
        return 1;
      }

      const conditionInfo = this.taskFinishConditionInfoRespList.filter(conditionInfo => conditionInfo.taskFinishConditionId === conditionId);
      if (conditionInfo[0].taskConditionStatus === 4) {
        // 未完成
        return 2;
      } else if (conditionInfo[0].taskConditionStatus === 3) {
        // 已完成
        return 3;
      }
    },
    checkUpload () {
      // 不在指派人列表
      const isReceiver = this.receiverList.filter(user => user.receiverUid === this.getCurrentUid());
      if (isReceiver.length === 0) {
        return 0;
      }

      // return 1;
      if (!this.taskFinishConditionInfoRespList || this.taskFinishConditionInfoRespList.length === 0) {
        // 在指派人列表中但未认领
        return 1;
      }

      // 认领任务但未上传
      // return 2;
      const outcome = this.taskFinishOutcomeRespList.filter(outcome => outcome.fileName !== '');
      if (outcome.length === 0) {
        return 2;
      }
      if (outcome.length !== 0 && (isReceiver[0].taskStatus === 2)) {
        // 已上传成果但未提交认证
        return 3;
      }

      // 已上传成果且提交认证，不允许修改成果
      if (outcome.length !== 0 && isReceiver[0].taskStatus === 3) {
        return 4;
      }

      // 已上传成果，认证通过，不允许修改成果
      if (outcome.length !== 0 && isReceiver[0].taskStatus === 4) {
        return 5;
      }

      // 已上传成果，认证未通过
      if (outcome.length !== 0 && isReceiver[0].taskStatus === 5) {
        return 6;
      }
    },
    
    getCurrentUid () {
      const user = getUserinfo();
      return user.userInfo.uid
    },
   
    // 检查是否可以提交认证 当前登录人 && 任务状态为进行中 2 || 认证未通过 5
    checkSubmitAuth () {
      const currentUid = this.getCurrentUid();
      const result = this.receiverList.filter((receiver) => receiver.receiverUid === currentUid);
      if (result && result.length > 0 && (result[0].taskStatus === 2 || result[0].taskStatus === 5)) {
        return true;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0px !important;
}
.el-dialog__body {
  font-size: 12px !important;
}
.el-form-item__label {
  font-weight: bold !important;
}
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>
