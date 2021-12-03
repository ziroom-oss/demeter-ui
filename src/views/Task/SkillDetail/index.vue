<template>
  <div>
    <el-card>
      <p style="font-weight: bold; font-size: 18px">技能点详情</p>
      <p style="font-weight: bold">基本信息</p>
      <el-form :model="task">
        <el-row :gutter="2">
          <el-col :span="24">
            <el-form-item label="技能点名称：" size="small">
              <span v-text="task.taskName"></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="6">
            <el-form-item label="技能点编号：">
              <span v-text="task.taskNo"></span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="技能点状态：">
              <span v-text="task.taskStatusName"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="技能点等级：">
              <span v-text="task.skillLevelName"></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="6">
            <el-form-item label="技能点创建时间：">
              <span v-text="formateTime(task.createTime)"></span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="技能点发布者：">
              <span v-text="task.publisherName"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="技能点认证角色：">
            <el-popover
              placement="bottom-start"
              title="以下同学可以给你认证此技能"
              width="200"
              trigger="hover"
              :content="task.checkRoleUserNameList.join(',')">
              <span slot="reference" v-text="task.checkRoleName"></span>
            </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="技能值奖励：">
              <span v-text="task.skillReward"></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：">
              {{ task.taskRemark }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider></el-divider>
      <p style="font-weight: bold">关联图谱信息</p>
      <el-table :data="mapSkillInfoList" size="mini" border>
        <el-table-column prop="name" label="图谱名称"></el-table-column>
        <el-table-column prop="id" label="图谱编号"></el-table-column>
        <el-table-column prop="jobName" label="适用职务"></el-table-column>
        <el-table-column prop="skillPath" label="关联技能" min-width="720">
          <template slot-scope="scope">
            <el-breadcrumb separator="->">
              <el-breadcrumb-item v-for="(s, i) in scope.row.skillPath" :key="i">{{s}}</el-breadcrumb-item>
            </el-breadcrumb>
          </template>
        </el-table-column>
      </el-table>
      <el-divider></el-divider>
      <p style="font-weight: bold">学习清单信息</p>
      <div>
        <template v-for="(item, index) in learnManifest">
          <el-row :gutter="20" :key="index">
            <el-col :span="4">关联学习清单：</el-col>
            <el-col :span="20" style="margin-bottom: 10px">{{ item.name }}</el-col>
            <el-col :span="4">分配人：</el-col>
            <el-col :span="20" style="margin-bottom: 10px">{{ item.assignerName }}</el-col>
            <el-col :span="4">学习周期：</el-col>
            <el-col :span="20" style="margin-bottom: 10px">{{ formatDate(item.learnPeriodStart) }}-{{ formatDate(item.learnPeriodEnd) }}</el-col>
          </el-row>
        </template>
        <template v-for="(item, index) in demeterSkillLearnPathList">
          <el-row :gutter="20" :key="index" style="margin-bottom: 10px">
            <el-col :span="4">学习路径 {{ index + 1 }}：</el-col>
            <el-col :span="20" style="margin-bottom: 6px">{{ item.path }}</el-col>
          </el-row>
        </template>
      </div>
      <el-divider></el-divider>
      <p style="font-weight: bold">技能点完成信息</p>
      <div>
        <template v-for="(item, index) in taskFinishConditionList">
          <el-row :gutter="20" :key="index" style="margin-bottom: 10px">
            <el-col :span="4">技能点认证标准 {{ index + 1 }}：</el-col>
            <el-col :span="16">{{ item.taskFinishContent }}</el-col>
            <el-col :span="4">
              <el-button
                v-if="checkCondition(item.id) === 1 || checkCondition(item.id) === 2"
                type="primary"
                size="mini"
                :disabled="checkCondition(item.id) === 1"
                @click="finishTaskCondition(item.id)">完成</el-button>
              <el-button v-if="checkCondition(item.id) === 3" type="primary" size="mini" disabled>已完成</el-button>
            </el-col>
          </el-row>
        </template>
      </div>
      <div>
        <el-row>
          <el-col :span="4">技能点学习成果：</el-col>
          <el-col :span="4" v-if="checkUpload() === 2 || checkUpload() === 3 || checkUpload() === 6">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :file-list="fileList"
              :on-change="handelOnChange"
              :on-remove="handelRemove"
              :limit="1">
              <el-button size="mini" type="primary">点击上传</el-button>
            </el-upload>
          </el-col>
          <el-col :span="8">
            <!-- <el-link v-if="checkUpload() === 4 || checkUpload() === 5" :href="getFileAddress()" target="_blank">{{ getFileName() }}</el-link> -->
            <el-tooltip v-if="checkUpload() === 4 || checkUpload() === 5" effect="light" content="点击下载学习成果" placement="top">
              <a :href="getFileAddress()">
                <span class="ellipsis">{{ getFileName() }}</span>
              </a>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>
      <el-table :data="receiverList" stripe style="margin-top: 30px">
        <el-table-column label="序号">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="receiverName" label="接收人"></el-table-column>
        <el-table-column prop="receiverDept" label="所属部门"></el-table-column>
        <el-table-column prop="taskStatusName" label="技能点执行状态"></el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <span>
              <el-button type="text" size="small" v-if="scope.row.taskStatus !== 1" @click="getProgress(scope.row.id, scope.row.receiverUid)">查看进度</el-button>
            </span>
            <span>
              <el-button type="text" size="small" v-if="task.checkRoleUserList.includes(getCurrentUid()) && scope.row.taskStatus === 3" @click="openCheckTask(scope.row.id)">认证</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 30px">
        <el-button size="small" type="primary" v-if="checkAccept()" @click="acceptTask">认领技能</el-button>
        <el-button size="small" type="primary" v-if="checkSubmitAuth()" @click="submitCheckTask">发起认证</el-button>
      </div>
    </el-card>
    <el-dialog
      :visible.sync="progressDialogVisible"
      v-if="progressDialogVisible"
      width="1100px"
    >
      <template slot="title">
        <!-- <svg-icon iconname="icon-expire"></svg-icon> -->
        <span style="font-size: 18px; font-weight: bold">技能点进度</span>
      </template>
      <el-card shadow="hover">
        <el-row :gutter="30">
          <el-col :span="16">
            <el-form
              label-width="170px"
              label-position="left">
              <el-form-item>
                <template slot="label">
                  <svg-icon iconname="icon-nansheng"></svg-icon>
                  <span style="font-size: 14px; font-weight: bold">员工姓名：</span>
                </template>
                <el-col :span="12">
                  {{ taskProgress.receiverName }}
                </el-col>
              </el-form-item>
              <el-form-item
                v-for="(domain, index) in taskProgress.taskFinishConditionInfoRespList"
                :key="domain.id"
                size="small"
              >
                <template slot="label">
                  <svg-icon iconname="icon-xiaohonghua"></svg-icon>
                  <span style="font-size: 14px; font-weight: bold">技能点完成条件{{ index + 1 }}：</span>
                </template>
                <div style="margin-bottom: 12px">
                  <el-col :span="20">
                    {{ domain.taskFinishContent }}
                  </el-col>
                  <span style="margin-left: 10px">
                    <el-tag type="success" size="mini" v-if="domain.taskConditionStatus === 3">{{ domain.taskConditionStatusName }}</el-tag>
                    <el-tag type="warning" size="mini" v-if="domain.taskConditionStatus === 4">{{ domain.taskConditionStatusName }}</el-tag>
                  </span>
                </div>
              </el-form-item>
              <el-form-item>
                <template slot="label">
                  <svg-icon iconname="icon-wenjian"></svg-icon>
                  <span style="font-size: 14px; font-weight: bold">技能点学习成果：</span>
                </template>
                <el-tooltip v-if="taskProgress.taskFinishOutcomeList" effect="light" content="点击下载学习成果" placement="top">
                  <a :href="taskProgress.taskFinishOutcomeList[0].fileAddress">
                    <span class="ellipsis">{{ taskProgress.taskFinishOutcomeList[0].fileName }}</span>
                  </a>
                </el-tooltip>
                <span v-else>-</span>
              </el-form-item>
              <el-form-item
              >
                <template slot="label">
                  <svg-icon iconname="icon-jiangzhang"></svg-icon>
                  <span style="font-size: 14px; font-weight: bold">认证结果：</span>
                </template>
                {{ taskProgress.checkoutResult }}
              </el-form-item>
              <el-form-item>
                <template slot="label">
                  <svg-icon iconname="icon-taolun"></svg-icon>
                  <span style="font-size: 14px; font-weight: bold">认证意见：</span>
                </template>
                {{ taskProgress.checkoutOpinion }}
              </el-form-item>
              <el-form-item
              >
                <template slot="label">
                  <svg-icon iconname="icon-shijian"></svg-icon>
                  <span style="font-size: 14px; font-weight: bold">最近一次认证时间：</span>
                </template>
                <span v-if="taskProgress.checkoutTime">{{ formateTime(taskProgress.checkoutTime) }}</span>
                <span v-else>-</span>
              </el-form-item>
            </el-form>
          </el-col>
          
          <el-col :span="8">
            <el-timeline :reverse="true">
              <el-timeline-item
                v-for="(item, index) in taskProgress.taskAuthHistoryList"
                :key="index"
                :timestamp="item.createTime">
                {{ item.authUserName }} {{ item.authResultName }}，验收意见： {{ item.authOpinion }}
              </el-timeline-item>
            </el-timeline>
          </el-col>

        </el-row>
      </el-card>
    </el-dialog>
    <el-dialog
      title="技能点认证"
      :visible.sync="checkDialogVisible"
      v-if="checkDialogVisible"
    >
      <el-card shadow="hover">
        <el-form
          label-width="170px"
          label-position="left">
          <el-form-item>
            <template slot="label">
              <svg-icon iconname="icon-nansheng"></svg-icon>
              <span style="font-size: 14px; font-weight: bold">员工姓名：</span>
            </template>
            <el-col :span="12">
              {{ taskProgress.receiverName }}
            </el-col>
          </el-form-item>
          <el-form-item
            v-for="(domain, index) in taskProgress.taskFinishConditionInfoRespList"
            :key="domain.id"
            size="small"
          >
            <template slot="label">
              <svg-icon iconname="icon-xiaohonghua"></svg-icon>
              <span style="font-size: 14px; font-weight: bold">技能点完成条件{{ index + 1 }}：</span>
            </template>
            <el-col :span="16">
              {{ domain.taskFinishContent }}
            </el-col>
            <el-col :span="2">
              <el-tag type="success" size="mini" v-if="domain.taskConditionStatus === 3">{{ domain.taskConditionStatusName }}</el-tag>
              <el-tag type="warning" size="mini" v-if="domain.taskConditionStatus === 4">{{ domain.taskConditionStatusName }}</el-tag>
            </el-col>
          </el-form-item>
          <el-form-item
          >
            <template slot="label">
              <svg-icon iconname="icon-wenjian"></svg-icon>
              <span style="font-size: 14px; font-weight: bold">技能点学习成果：</span>
            </template>
            <!-- <el-link v-if="taskFinishOutcomeRespList.length" :href="getFileAddress()" target="_blank">{{ getFileName() }}</el-link> -->
            <!-- <el-tooltip v-if="taskFinishOutcomeRespList.length" effect="light" content="点击下载学习成果" placement="top">
              <a :href="getFileAddress()">
                <span class="ellipsis">{{ getFileName() }}</span>
              </a>
            </el-tooltip> -->
            <el-tooltip v-if="taskProgress.taskFinishOutcomeList" effect="light" content="点击下载学习成果" placement="top">
              <a :href="taskProgress.taskFinishOutcomeList[0].fileAddress">
                <span class="ellipsis">{{ taskProgress.taskFinishOutcomeList[0].fileName }}</span>
              </a>
            </el-tooltip>
            <span v-else>-</span>
          </el-form-item>
          <el-form-item>
            <template slot="label">
              <svg-icon iconname="icon-jiangzhang"></svg-icon>
              <span style="font-size: 14px; font-weight: bold">认证结果：</span>
            </template>
            <el-radio v-model="checkParam.result" :label="1">认证通过</el-radio>
            <el-radio v-model="checkParam.result" :label="0">认证不通过</el-radio>
          </el-form-item>
          <el-form-item
          >
            <template slot="label">
              <svg-icon iconname="icon-taolun"></svg-icon>
              <span style="font-size: 14px; font-weight: bold">认证意见：</span>
            </template>
            <el-col :span="18">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请填写认证意见，认证结果不通过必须填写。"
                v-model="checkParam.opinion">
              </el-input>
            </el-col>
          </el-form-item>
          <div style="text-align: center; margin-top: 10px">
            <el-button @click="checkTask(taskProgress.id)" type="primary" size="small">提交</el-button>
            <el-button type="info" size="small" @click="checkDialogVisible = false">取消</el-button>
          </div>
        </el-form>
      </el-card>
    </el-dialog>
  </div>
</template>
<script>
import { RouteConfig, Component, Vue } from '@ziroom/cherry2-decorator';
import taskServer from '@/apis/task.js';
import map from '@/apis/map.js';
import jobs from '@/apis/jobs.js';
import tree from '@/apis/tree.js';
import dayjs from 'dayjs';
import { getUserinfo } from '@ziroom/zcloud-head';
import SvgIcon from '@/components/svg-icon.vue';
@Component({
  components: {
    SvgIcon
  },
  data() {
    return {
      task: {},
      receiverList: [],
      learnManifest: [],
      demeterSkillLearnPathList: [],
      taskFinishConditionList: [],
      taskFinishConditionInfoRespList: [],
      taskFinishOutcomeRespList: [],
      fileList: [],
      taskProgress: {},
      progressDialogVisible: false,
      checkDialogVisible: false,
      checkParam: {
        result: 1,
        opinion: ''
      },
      uploadUrl: '',
      mapSkillInfoList: [],
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }]
    }
  },
  created () {
    this.refresh();
  },
  methods: {
    async getMapSkillsInfo() {
      const mapSkills = await map.getMapSkillsByCondition({ skillTaskId: this.$route.query.id });
      const mapInfoQueue = [];
      mapSkills.forEach(ms => {
        mapInfoQueue.push(map.get(ms.skillMapId));
      });
      const mapSkillInfoList = await Promise.all(mapInfoQueue);
      mapSkillInfoList.forEach(async item => {
        const job = await jobs.getByCode(item.jobId);
        this.$set(item, 'jobName', job.name);
        // item.jobName = job.name;
      });
      const treeNodes = await tree.getAllNodes();
      const treeNodesMap = Object.values(treeNodes).reduce((accu, value) => {
        accu[value.id] = value;
        return accu;
      }, {})
      const skill = {
        name: this.task.taskName,
        parentId: this.task.skillTreeId,
      };
      mapSkillInfoList.forEach(mapSkill => {
        mapSkill.skillPath = recuriveSetSkillPath(skill, treeNodesMap);
      });
      function recuriveSetSkillPath(node, memo) {
        const str = [];
        function recurive(node, memo) {
          str.push(node.name);
          if (memo[node.parentId]) {
            return recurive(memo[node.parentId], memo);
          }
        }
        recurive(node, memo);
        return str.reverse();
      }
      this.$set(this, 'mapSkillInfoList', mapSkillInfoList);
    },
    getFileAddress () {
      if (this.taskFinishOutcomeRespList.length) {
        return this.taskFinishOutcomeRespList[0].fileAddress;
      }
    },
    getFileName () {
      if (this.taskFinishOutcomeRespList.length) {
        return this.taskFinishOutcomeRespList[0].fileName;
      }
    },
    refresh () {
      this.getTaskDetail();
    },
    getTaskDetail () {
      taskServer.getTaskDetail(this.$route.query.id, 1).then(data => {
        this.task = data.skillDetailResp;
        this.task.checkRoleName = this.task.checkRole.map(i => i.roleName).join(',');
        this.receiverList = data.receiverList;
        this.learnManifest = data.learnManifest;
        this.demeterSkillLearnPathList = data.demeterSkillLearnPathList;
        this.taskFinishConditionList = data.taskFinishConditionList;
        this.taskFinishConditionInfoRespList = data.taskFinishConditionInfoRespList;
        this.taskFinishOutcomeRespList = data.taskFinishOutcomeRespList;
        this.getMapSkillsInfo();
        const file = data.taskFinishOutcomeRespList[0];
        if (file && file.fileName && file.fileAddress) {
          this.fileList = [{
            name: file.fileName,
            url: file.fileAddress
          }]
        }
      });
    },
    formatDate (date) {
      return dayjs(date).format('YYYY-MM-DD');
    },
    formateTime (time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
    },
    checkCondition (conditionId) {
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
    finishTaskCondition (id) {
      const conditionInfo = this.taskFinishConditionInfoRespList.filter(conditionInfo => conditionInfo.taskFinishConditionId === id);
      taskServer.finishTaskCondition(conditionInfo[0].id).then(data => {
        this.$message({
          message: '技能点认证标准已完成.',
          type: "success"
        })
      }).catch(err => {
      });
      this.refresh();
    },
    handelOnChange (file, fileList) {
      this.fileList = [file];
      // this.assignTaskForm.attachment = file.raw;
      this.fileList = [file];
      const params = new FormData();
      params.append('multipartFile', file.raw);
      params.append('taskId', this.task.id)
      params.append('taskType', this.task.taskType)
      taskServer.uploadLearningOutcome(params).then(data => {
        this.$message({
          message: '学习成果上传成功',
          type: "success"
        });
        this.refresh()
      })
    },
    handelRemove (response, file, fileList) {
      // this.assignTaskForm.attachment = null;
    },
    getCurrentUid () {
      const user = getUserinfo();
      return user.userInfo.uid
    },
    // 检查是否可以认领，若接收者中已有当前登录人，则不可认领
    checkAccept () {
      const currentUid = this.getCurrentUid();
      const result = this.receiverList.filter((receiver) => receiver.receiverUid === currentUid);
      if (result.length > 0) {
        return false;
      } else {
        return true;
      }
    },
    acceptTask () {
      const id = this.task.id;
      const type = this.task.taskType;
      this.$confirm('确认认领此技能点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        taskServer.acceptTask(id, type).then(data => {
          this.$message({
            message: '技能点认领成功',
            type: "success"
          });
          this.refresh();
        }).catch(err => {
          this.refresh();
        })
      }).catch(() => {
        return;
      })
    },
    // 检查是否可以提交认证 当前登录人 && 任务状态为进行中 2 || 认证未通过 5
    checkSubmitAuth () {
      const currentUid = this.getCurrentUid();
      const result = this.receiverList.filter((receiver) => receiver.receiverUid === currentUid);
      if (result && result.length > 0 && (result[0].taskStatus === 2 || result[0].taskStatus === 5)) {
        return true;
      }
    },
    submitCheckTask() {
      const id = this.task.id;
      const type = this.task.taskType;
      taskServer.submitCheckTask(id, type).then(() => {
        this.$message({
          message: '成功提交认证，请等待技能技能点发布人认证结果',
          type: "success"
        });
        this.refresh();
      }).catch(err => {
        this.refresh();
      })
    },
    openCheckTask (id) {
      this.checkDialogVisible = true;
      taskServer.getTaskProgress(id).then(data => {
        console.log(data);
        this.taskProgress = data;
        this.checkDialogVisible = true;
      }).catch(() => {
        this.checkDialogVisible = true;
      })
    },
    checkTask () {
      const params = {
        id: this.taskProgress.id,
        receiverUid: this.taskProgress.receiverUid,
        taskId: this.taskProgress.taskId,
        taskType: this.taskProgress.taskType,
        result: this.checkParam.result,
        acceptanceOpinion: this.checkParam.opinion
      }
      taskServer.checkTask(params).then(data => {
        this.$message({
          message: '认证成功',
          type: "success"
        });
        this.refresh();
        this.checkDialogVisible = false;
      }).catch(err => {
        this.refresh();
        this.checkDialogVisible = false;
      })
    },
    getProgress (id) {
      this.progressDialogVisible = true
      taskServer.getTaskProgress(id).then(data => {
        this.taskProgress = data;
      }).catch(err => {
      })
    }
  }
})
@RouteConfig({
  layout: true,
  name: 'SkillDetail',
  title: '技能点详情',
  hidden: true,
})
export default class App extends Vue {
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
