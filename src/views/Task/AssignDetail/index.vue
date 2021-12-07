<template>
  <div>
    <el-card>
      <p style="font-weight: bold; font-size: 18px">指派任务详情</p>
      <p style="font-weight: bold">任务基本信息</p>
      <el-form :model="task">
        <el-row :gutter="2">
          <el-col :span="24">
            <el-form-item label="任务名称：" size="small">
              <span v-text="task.taskName"></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="6">
            <el-form-item label="任务编号：">
              <span v-text="task.taskNo"></span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="任务周期：">
              {{ formatDate(task.taskStartTime) }} - {{ formatDate(task.taskEndTime) }}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="任务状态：">
              <span v-text="task.taskStatusName"></span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务类型：">
              <span v-text="task.taskTypeName"></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="6">
            <el-form-item label="任务创建时间：">
              <span v-text="formateTime(task.createTime)"></span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务接收者：">
              <span v-text="task.receiverName"></span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="任务发布者：">
              <span v-text="task.publisherName"></span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="任务成长值：">
              <span v-text="task.taskReward"></span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="是否需要验收：">
              <span>
                <el-tag v-if="task.needAcceptance === 0" type="info">否</el-tag>
                <el-tag v-else type="success">是</el-tag>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label="任务惩罚值：">
          <el-col :span="12">
          </el-col>
        </el-form-item> -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件：">
              <el-link :href="task.attachmentUrl" target="_blank">{{ task.attachmentName }}</el-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：">
              {{ task.taskDescription }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider></el-divider>
      <p style="font-weight: bold">任务完成信息</p>
      <div style="margin-bottom: 20px">
        <template v-for="(item, index) in taskFinishConditionList">
          <el-row :gutter="20" :key="index">
            <el-col :span="4">任务完成条件 {{ index + 1 }}：</el-col>
            <el-col :span="6">{{ item.taskFinishContent }}</el-col>
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
          <el-col :span="4">任务成果：</el-col>
          <el-col :span="4" v-if="[2, 3, 6, 8].includes(checkUpload())">
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
          <el-col :span="16">
            <el-link v-if="[4, 5, 7].includes(checkUpload())" :href="getFileAddress()" target="_blank">{{ getFileName() }}</el-link>
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
        <el-table-column prop="taskStatusName" label="任务执行状态"></el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <span>
              <el-button type="text" size="small" v-if="scope.row.taskStatus === 2" @click="getRejectReason(scope.row.id)">拒绝原因</el-button>
            </span>
            <span>
              <el-button type="text" size="small" v-if="task.publisher === getCurrentUid() && scope.row.taskStatus === 2" @click="openReassign(scope.row.id)">重新指派</el-button>
            </span>
            <span>
              <el-button type="text" size="small" v-if="scope.row.taskStatus !== 1" @click="getProgress(scope.row.id, scope.row.receiverUid)">查看进度</el-button>
            </span>
            <span>
              <el-button type="text" size="small" v-if="task.publisher === getCurrentUid() && scope.row.taskStatus === 5" @click="openCheckTask(scope.row.id)">验收</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 30px">
        <el-button size="small" type="primary" v-if="checkAccept()" @click="acceptTask">认领任务</el-button>
        <el-button size="small" type="primary" v-if="checkAccept()" @click="rejectTask">拒绝任务</el-button>
        <el-button size="small" type="primary" v-if="checkAuth()" @click="submitCheckTask">发起验收</el-button>
        <el-button size="small" type="primary" v-if="checkComplete()" @click="submitComplete">任务完成</el-button>
      </div>
    </el-card>
    <el-dialog
      title="任务进度"
      v-if="progressDialogVisible"
      :visible.sync="progressDialogVisible">
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
              <span style="font-size: 14px; font-weight: bold">任务完成条件{{ index + 1 }}：</span>
            </template>
            <div>
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
              <span style="font-size: 14px; font-weight: bold">任务成果：</span>
            </template>
            <!-- <el-link v-if="taskProgress.taskFinishOutcomeList[0]" :href="taskProgress.taskFinishOutcomeList[0].fileAddress" target="_blank">{{ taskProgress.taskFinishOutcomeList[0].fileName }}</el-link> -->
            <el-tooltip v-if="taskProgress.taskFinishOutcomeList[0]" effect="light" content="点击下载任务成果" placement="top">
              <a :href="taskProgress.taskFinishOutcomeList[0].fileAddress">
                <span class="ellipsis">{{ taskProgress.taskFinishOutcomeList[0].fileName }}</span>
              </a>
            </el-tooltip>
          </el-form-item>
          <div v-if="task.needAcceptance">
            <el-form-item>
              <template slot="label">
                <svg-icon iconname="icon-jiangzhang"></svg-icon>
                <span style="font-size: 14px; font-weight: bold">认证结果：</span>
              </template>
              {{ taskProgress.checkoutResult }}
            </el-form-item>
            <el-form-item>
              <template slot="label">
                <svg-icon iconname="icon-taolun"></svg-icon>
                <span style="font-size: 14px; font-weight: bold">验收意见：</span>
              </template>
              {{ taskProgress.checkoutOpinion }}
            </el-form-item>
            <el-form-item
            >
              <template slot="label">
                <svg-icon iconname="icon-shijian"></svg-icon>
                <span style="font-size: 14px; font-weight: bold">最近一次验收时间：</span>
              </template>
              {{ formateTime(taskProgress.checkoutTime) }}
            </el-form-item>
          </div>
        </el-form>
      </el-card>
    </el-dialog>
    <el-dialog
      title="任务重新指派"
      :visible.sync="reassignDialogVisible"
    >
      <el-form>
        <el-form-item label="指派人">
          <el-select
            v-model="reassign"
            placeholder="输入姓名/工号/邮箱前缀搜索"
            filterable
            remote
            clearable
            multiple
            :loading="loading"
            :remote-method="queryPeople"
            size="small"
          >
            <el-option v-for="item in reassignerList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-col :span="24" style="text-align: center">
            <el-button @click="reassignTask()" type="primary" size="small">提交</el-button>
            <el-button type="info" size="small" @click="reassignDialogVisible = false">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="任务验收"
      :visible.sync="checkDialogVisible"
      v-if="checkDialogVisible">
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
              <span style="font-size: 14px; font-weight: bold">任务完成条件{{ index + 1 }}：</span>
            </template>
            <el-col :span="20">
              {{ domain.taskFinishContent }}
            </el-col>
            <el-col :span="4">
              <el-tag type="success" size="mini" v-if="domain.taskConditionStatus === 3">{{ domain.taskConditionStatusName }}</el-tag>
              <el-tag type="warning" size="mini" v-if="domain.taskConditionStatus === 4">{{ domain.taskConditionStatusName }}</el-tag>
            </el-col>
          </el-form-item>
          <el-form-item>
            <template slot="label">
              <svg-icon iconname="icon-wenjian"></svg-icon>
              <span style="font-size: 14px; font-weight: bold">任务成果：</span>
            </template>
            <!-- <span v-if="checkUpload() === 3" style="color: blue">{{ taskFinishOutcomeRespList[0].fileName }}</span> -->
            <el-tooltip v-if="taskProgress.taskFinishOutcomeList[0]" effect="light" content="点击下载学习成果" placement="top">
              <a :href="taskProgress.taskFinishOutcomeList[0].fileAddress">
                <span class="ellipsis">{{ taskProgress.taskFinishOutcomeList[0].fileName }}</span>
              </a>
            </el-tooltip>
            <span v-else>-</span>
          </el-form-item>
          <el-form-item>
            <template slot="label">
              <svg-icon iconname="icon-jiangzhang"></svg-icon>
              <span style="font-size: 14px; font-weight: bold">验收结果：</span>
            </template>
            <el-radio v-model="checkParam.result" :label="1">通过</el-radio>
            <el-radio v-model="checkParam.result" :label="0">不通过</el-radio>
          </el-form-item>
          <el-form-item>
            <template slot="label">
              <svg-icon iconname="icon-taolun"></svg-icon>
              <span style="font-size: 14px; font-weight: bold">验收意见：</span>
            </template>
            <el-col :span="22">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请填写验收意见，验收结果不通过必须填写。"
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
import taskServer from '@/apis/task.js';
import dayjs from 'dayjs';
import ehrServer from '@/apis/ehr.js';
import SvgIcon from '@/components/svg-icon.vue';

export default {
    components: {
    SvgIcon
  },
  data: function() {
    return {
      task: {},
      receiverList: [],
      taskFinishConditionList: [],
      taskFinishConditionInfoRespList: [],
      taskFinishOutcomeRespList: [],
      fileList: [],
      taskProgress: {},
      progressDialogVisible: false,
      checkDialogVisible: false,
      reassignDialogVisible: false,
      checkParam: {
        result: 1,
        opinion: ''
      },
      reassign: [],
      reassignerList: [],
      loading: false,
      uploadUrl: '',
    }
  },
  async mounted() {
    this.refresh();
  },
  methods: {
    getFileAddress () {
      if (this.taskFinishOutcomeRespList.length) {
        return this.taskFinishOutcomeRespList[0].fileAddress
      }
    },
    getFileName () {
      if (this.taskFinishOutcomeRespList.length) {
        return this.taskFinishOutcomeRespList[0].fileName
      }
      
    },
    refresh () {
      this.getTaskDetail();
    },
    getTaskDetail () {
      taskServer.getTaskDetail(this.$route.query.id, 2).then(data => {
        this.task = data.assignDetailResp;
        this.receiverList = data.receiverList;
        this.taskFinishConditionList = data.taskFinishConditionList;
        this.taskFinishConditionInfoRespList = data.taskFinishConditionInfoRespList;
        this.taskFinishOutcomeRespList = data.taskFinishOutcomeRespList;

        const file = data.taskFinishOutcomeRespList[0];
        console.log(data);
        if (file && file.fileName && file.fileAddress) {
          this.fileList = [{name: file.fileName, url: file.fileAddress}]
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
      const isReceiver = this.receiverList.filter(user => user.receiverUid === this.getCurrentUid() && user.taskStatus !== 2);
      if (isReceiver.length === 0) {
        return 0;
      }

      console.log(this.task.needAcceptance, isReceiver[0].taskStatus);

      // 在指派人列表中但未认领
      if (!this.taskFinishConditionInfoRespList || this.taskFinishConditionInfoRespList.length === 0) {
        return 1;
      }

      // 未上传
      const outcome = this.taskFinishOutcomeRespList.filter(outcome => outcome.fileName !== '');
      if (outcome.length === 0) {
        return 2;
      }

      // 无需验收，未完成任务，已上传
      if (!this.task.needAcceptance && isReceiver[0].taskStatus === 3) {
        return 3;
      }

      // 无需验收，完成任务，已上传
      if (!this.task.needAcceptance && isReceiver[0].taskStatus === 4) {
        return 4;
      }

      // 需要验收且进行中，已上传
      if (this.task.needAcceptance && isReceiver[0].taskStatus === 3) {
        return 3;
      }

      // 需要验收且待验收，已上传
      if (this.task.needAcceptance && isReceiver[0].taskStatus === 5) {
        return 5;
      }

      // 需要验收，已延期，已上传
      if (this.task.needAcceptance && isReceiver[0].taskStatus === 6) {
        return 6;
      }

      // 需要验收，验收通过，已上传
      if (this.task.needAcceptance && isReceiver[0].taskStatus === 7) {
        return 7;
      }

      // 需要验收，验收未通过，已上传
      if (this.task.needAcceptance && isReceiver[0].taskStatus === 8) {
        return 8;
      }
    },
    finishTaskCondition (id) {
      const conditionInfo = this.taskFinishConditionInfoRespList.filter(conditionInfo => conditionInfo.taskFinishConditionId === id);
      taskServer.finishTaskCondition(conditionInfo[0].id).then(data => {
        this.$message({
          message: '任务条件已完成.',
          type: "success"
        })
      }).catch(err => {
      });
      this.refresh();
    },
    handelOnChange (file, fileList) {
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
      })
    },
    handelRemove (response, file, fileList) {
    },
    getCurrentUid () {
      const user = this.$store.state.permission?.userinfo;
      return user.uid
    },
    // 检查是否可以认领
    checkAccept () {
      const currentUid = this.getCurrentUid();
      const result = this.receiverList.filter((receiver) => receiver.receiverUid === currentUid && receiver.taskStatus !== 2);
      if (result.length > 0 && result[0].taskStatus === 1) {
        return true;
      }
    },
    acceptTask () {
      const id = this.task.id;
      const type = this.task.taskType;
      this.$confirm('确认认领此任务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        taskServer.acceptTask(id, type).then(data => {
          this.$message({
            message: '任务认领成功',
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
    rejectTask () {
      this.$prompt('确认拒绝此任务？确认拒绝请输入原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '拒绝原因不能为空'
      }).then(({ value }) => {
        const params = {
          taskId: this.task.id,
          reason: value
        }
        taskServer.rejectTask(params).then(data => {
          this.$message({
            message: '已拒绝',
            type: "success"
          });
          this.refresh();
        }).catch(() => {
          this.refresh();
        })
      }).catch(() => {

      });
    },
    checkComplete () {
      // 当前登录人为任务接收人之一 && 任务状态为进行中 && 任务无需验收
      const currentUid = this.getCurrentUid();
      const result = this.receiverList.filter((receiver) => receiver.receiverUid === currentUid);
      if (result.length > 0 && result[0].taskStatus === 3 && result[0].checkResult === -2) {
        return true;
      }
    },
    submitComplete () {
      const id = this.task.id;
      const type = this.task.taskType;
      this.$confirm('确认完成任务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        taskServer.submitComplete(id).then(() => {
          this.$message({
            message: '任务完成！',
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
    // 检查是否可以验收
    checkAuth () {
      // 当前登录人为任务接收人之一 && （任务状态为进行中 3 || 任务状态为验收未通过 8） && 任务需要验收
      const currentUid = this.getCurrentUid();
      const result = this.receiverList.filter((receiver) => receiver.receiverUid === currentUid && receiver.taskStatus !== 2);
      if (result && result.length > 0 && (result[0].taskStatus === 3 || result[0].taskStatus === 8) && (result[0].checkResult === -1 || result[0].checkResult === 0)) {
        return true;
      }
    },
    submitCheckTask() {
      const id = this.task.id;
      const type = this.task.taskType;
      taskServer.submitCheckTask(id, type).then(() => {
        this.$message({
          message: '成功提交验收，请等待发布人验收结果',
          type: "success"
        });
        this.refresh();
      }).catch(err => {
        this.refresh();
      })
    },
    openCheckTask (id) {
      taskServer.getTaskProgress(id).then(data => {
        this.taskProgress = data;
        this.checkDialogVisible = true;
      }).catch(err => {
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
          message: '验收成功',
          type: "success"
        });
        this.refresh();
        this.checkDialogVisible = false;
      }).catch(() => {
        this.refresh();
        this.checkDialogVisible = false;
      })
    },
    getProgress (id) {
      taskServer.getTaskProgress(id).then(data => {
        this.progressDialogVisible = true
        this.taskProgress = data;
      }).catch(err => {
      })
    },
    getRejectReason (id) {
      const params = {
        id: id
      }
      taskServer.getRejectReason(params).then(data => {
        this.$alert(data.rejectReason, '拒绝原因');
      });
    },
    openReassign (id) {
      this.reassignDialogVisible = true;
    },
    reassignTask () {
      const params = {
        id: this.task.id,
        reassignList: this.reassign,
      }
      taskServer.reassignTask(params).then(data => {
        this.$message({
          message: '指派成功！',
          type: "success"
        });
        this.reassignDialogVisible = false;
        this.refresh();
      })
    },
    queryPeople (query) {
      this.loading = true;
      ehrServer.getEmpList({ empCodeNameAdcode: query }).then(data => {
        this.loading = false;
        this.reassignerList = data.map(user => {
          return {
            code: user.code,
            email: user.email,
            name: user.name + '(' + user.email.split('@')[0] + ')'
          };
        });
      }).catch((err) => {
        this.loading = false;
      });
    },
  }
}
</script>
<style>

.el-dialog__body {
  font-size: 12px !important;
}
.el-form-item__label {
  font-weight: bold !important;
}
</style>
