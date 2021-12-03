<template>
  <div>
    <el-card>
      <p v-if="edit" style="font-size: 18px; font-weight: bold">编辑指派任务</p>
      <p v-else style="font-size: 18px; font-weight: bold">新建指派任务</p>
      <el-form :model="assignTaskForm" :rules="rules" ref="assignTaskForm" label-width="150px" class="demo-ruleForm">
        <el-form-item label="任务名称：" prop="taskName" size="small" required>
          <el-col :span="12">
            <el-input v-model="assignTaskForm.taskName" placeholder="请填写任务名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item
          label="任务周期："
          prop="taskPeriod"
          size="small"
          required
        >
          <el-date-picker
            v-model="assignTaskForm.taskPeriod"
            type="daterange"
            range-separator="至"
            start-placeholder="选择任务开始时间"
            end-placeholder="选择任务结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务指派人：" prop="taskReceiver" size="small">
          <el-select
            v-model="assignTaskForm.taskReceiver"
            placeholder="通过姓名/工号/邮箱前缀搜索"
            filterable
            remote
            clearable
            multiple
            :loading="loading"
            :remote-method="queryPeople"
            style="width:300px"
          >
            <el-option v-for="item in receiverList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in assignTaskForm.taskFinishCondition"
          :label="'任务完成条件' + (index + 1) + ':'"
          :key="domain.key"
          :prop="'taskFinishCondition.' + index"
          :rules="{
            required: true, message: '任务完成条件不能为空', trigger: ['blur']
          }"
          size="small"
          required
        >
          <el-col :span="9">
            <el-input v-model="domain.value"></el-input>
          </el-col>
          <el-col :span="4" style="margin-left: 30px">
            <el-button v-if="index === 0" @click.prevent="addDomain(domain)" type="primary" icon="el-icon-plus" size="mini"></el-button>
            <el-button @click.prevent="removeDomain(domain)" type="danger" icon="el-icon-minus" size="mini"></el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="成长值奖励：" prop="taskReward" size="small" required>
          <el-select v-model="assignTaskForm.taskReward" placeholder="请选择成长值奖励">
            <el-option
              v-for="item in rewardScores"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="是否有惩罚：" prop="needPunishment" size="small" required>
          <el-switch
            v-model="assignTaskForm.needPunishment"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item> -->
        <!-- <el-form-item label="是否邮件提醒：" prop="needEmailRemind" size="small" required>
          <el-switch
            v-model="assignTaskForm.needEmailRemind"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item> -->
        <el-form-item label="是否需要验收：" prop="needAcceptance" size="small" required>
          <el-switch
            v-model="assignTaskForm.needAcceptance"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-form-item>

        <el-form-item label="附件" size="small">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :file-list="fileList"
            :on-change="handelOnChange"
            :on-remove="handelRemove"
            :limit="1"
           >
            <el-button size="mini" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注：" prop="taskDescription">
          <el-col :span="12">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入任务备注"
              v-model="assignTaskForm.taskDescription">
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="12" style="text-align: center">
            <el-button v-if="edit" type="primary" @click="onModify('assignTaskForm')" size="small">保存修改</el-button>
            <el-button v-else type="primary" @click="onSubmit('assignTaskForm')" size="small">创建</el-button>
            <el-button size="small" @click="$router.push('/Task/List')">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { RouteConfig, Component, Vue } from '@ziroom/cherry2-decorator';
import taskServer from '@/apis/task.js';
import ehrServer from '@/apis/ehr.js';
import { v1 as uuidv1 } from 'uuid';
import { cloneDeep } from 'lodash-es';

@Component({
  mounted() {
    const id = this.$route.query.id;
    if (id) {
      this.getTask(id);
      this.edit = true;
    }
  },

  data() {
    return {
      edit: false,
      assignTaskForm: {
        id: 0,
        taskName: '',
        taskStartTime: new Date(),
        taskEndTime: '',
        taskReceiver: [],
        taskFinishCondition: [{
          value: '',
          key: uuidv1(),
        }],
        taskReward: '',
        attachment: '',
        needEmailRemind: 0,
        needPunishment: 0,
        needAcceptance: 0,
        attachmentUrl: '',
        taskDescription: ''
      },
      rewardScores: [10, 20, 30 ,40, 50],
      fileList: [],
      uploadUrl: '',
      rules: {
        taskName: [
          { required: true, message: '请输入指派类任务名称', trigger: ['blur', 'change'] },
        ],
        taskEndTime: [
          { type: 'date', required: true, message: '请选择任务结束时间', trigger: 'blur' }
        ],
        taskPeriod: [
          { type: 'array', required: true, message: '请选择任务周期', trigger: ['change', 'blur'] }
        ],
        taskReward: [
          { required: true, message: '请选择成长值奖励', trigger: ['blur'] }
        ],
      },
      receiverList: [],
      loading: false,
    }
  },
  methods: {
    onModify (formName) {
      const data = new FormData();
      data.append('id', this.assignTaskForm.id);
      data.append('taskName', this.assignTaskForm.taskName);
      data.append('taskStartTime', new Date(this.assignTaskForm.taskPeriod[0]));
      data.append('taskEndTime', new Date(this.assignTaskForm.taskPeriod[1]));
      data.append('taskReceiver', this.assignTaskForm.taskReceiver);
      data.append('taskFinishCondition', this.assignTaskForm.taskFinishCondition.map(condition => {
        return condition.value;
      }));
      data.append('taskReward', this.assignTaskForm.taskReward);
      const attachment = this.assignTaskForm.attachment
      if (attachment) {
        data.append('attachment', this.assignTaskForm.attachment);
      }
      data.append('needAcceptance', this.assignTaskForm.needAcceptance);
      data.append('taskDescription', this.assignTaskForm.taskDescription);
      taskServer.editAssign(data).then(() => {
        this.$router.push('/Task/List');
      }).catch(err => {
      });
    },
    onSubmit(formName) {
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     alert('submit!');
      //   } else {
      //     console.log('error submit!!');
      //     return false;
      //   }
      // });
      const data = new FormData();
      data.append('taskName', this.assignTaskForm.taskName);
      data.append('taskStartTime', new Date(this.assignTaskForm.taskPeriod[0]));
      data.append('taskEndTime', new Date(this.assignTaskForm.taskPeriod[1]));
      data.append('taskReceiver', this.assignTaskForm.taskReceiver);
      data.append('taskFinishCondition', this.assignTaskForm.taskFinishCondition.map(condition => {
        return condition.value;
      }));
      data.append('taskReward', this.assignTaskForm.taskReward);
      if (this.assignTaskForm.attachment) {
        data.append('attachment', this.assignTaskForm.attachment);
      }
      data.append('needAcceptance', this.assignTaskForm.needAcceptance);
      data.append('taskDescription', this.assignTaskForm.taskDescription);
      taskServer.saveAssign(data).then(() => {
        this.$message({
          message: '新建指派任务成功！',
          type: "success"
        });
        this.$router.push('/Task/List');
      }).catch(() => {
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handelOnChange (file, fileList) {
      this.fileList = [file];
      this.assignTaskForm.attachment = file.raw;
    },
    handelRemove (response, file, fileList) {
      this.assignTaskForm.attachment = null;
    },
    removeDomain(item) {
      if (this.assignTaskForm.taskFinishCondition.length <= 1) {
        this.$message.warning('任务完成条件不能为空');
        return;
      }
      var index = this.assignTaskForm.taskFinishCondition.indexOf(item);
      if (index !== -1) {
        this.assignTaskForm.taskFinishCondition.splice(index, 1)
      }
      // this.$forceUpdate()
      // this.assignTaskForm.taskFinishCondition = [...this.assignTaskForm.taskFinishCondition];
    },
    addDomain() {
      if (this.assignTaskForm.taskFinishCondition.length >= 5) {
        this.$message.warning('任务完成条件最多创建五条');
        return;
      }
      this.assignTaskForm.taskFinishCondition.push({
        key: uuidv1(),
        value: '',
      });
      // this.$set(this.assignTaskForm, 'taskFinishCondition', this.assignTaskForm.taskFinishCondition.slice());
      // this.$forceUpdate();
    },
    queryPeople (query) {
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
    getTask (id) {
      taskServer.getAssignTask(id).then(data => {
        // this.assignTaskForm = data;
        this.assignTaskForm = {
          id: data.id,
          taskName: data.taskName,
          taskStartTime: data.taskStartTime,
          taskEndTime: data.taskEndTime,
          taskPeriod: [data.taskStartTime, data.taskEndTime],
          taskReceiver: data.taskReceiver,
          taskFinishCondition: data.taskFinishConditionList.map(condition => {
            return {
              key: uuidv1(),
              value: condition.taskFinishContent
            }
          }),
          taskReward: data.taskReward,
          needAcceptance: data.needAcceptance,
          taskDescription: data.taskDescription
        }
        this.fileList = [{name: data.attachmentName, url: data.attachmentUrl}]
        this.assignTaskForm.taskReceiver.forEach(element => {
          this.queryPeople(element);
        });
      })
    }
  }
})
@RouteConfig({
  layout: true,
  name: 'NewTaskAssign',
  title: '新建指派任务',
})
export default class App extends Vue {
}
</script>
