<template>
  <el-dialog
    top="4vh"
    :visible="showSkillDialog"
    :before-close="beforeClose"
  >
    <p style="font-weight: bold; font-size: 18px" v-if="edit">编辑技能点</p>
    <p style="font-weight: bold; font-size: 18px" v-else>创建技能点</p>
    <el-form :model="skillTaskForm" :rules="rules" ref="skillTaskForm" label-width="150px" class="skill-point-form">
      <el-form-item label="技能点名称" prop="taskName" size="small" required>
        <el-col :span="15">
          <el-input v-model="skillTaskForm.taskName" placeholder="请填写技能点名称"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item
        v-for="(domain, index) in skillTaskForm.taskFinishCondition"
        :label="'验收标准' + (index + 1)"
        :key="domain.key"
        :prop="'taskFinishCondition.' + index + '.value'"
        :rules="{
          required: true, message: '验收标准不能为空', trigger: 'blur'
        }"
        size="small"
        required
      >
        <el-col :span="9">
          <el-input v-model="domain.value">
          </el-input>
        </el-col>
        <el-col :span="8" style="margin-left: 30px">
          <el-button v-if="index === 0" @click.prevent="addDomain(domain)" type="primary" icon="el-icon-plus"></el-button>
          <el-button @click.prevent="removeDomain(domain)" type="danger" icon="el-icon-minus"></el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="技能点等级" prop="skillLevel" size="small" required>
        <el-select v-model="skillTaskForm.skillLevel" placeholder="请选择技能点等级">
          <el-option
            v-for="item in skillLevelList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="技能值奖励" prop="skillReward" size="small" required>
        <el-select v-model="skillTaskForm.skillReward" placeholder="请选择技能值奖励">
          <el-option
            v-for="item in rewardScores"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="验收角色" prop="checkRoles" size="small" required>
        <el-select
          v-model="skillTaskForm.checkRoles"
          @change="queryRoleList"
          placeholder="角色名"
          filterable
          remote
          multiple
          :remote-method="queryRoleList"
          size="small"
        >
          <el-option v-for="item in roleList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="taskRemark">
        <el-col :span="15">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入技能点备注"
            v-model="skillTaskForm.taskRemark">
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="edit" @click="onModify('skillTaskForm')" size="small">保存修改</el-button>
        <el-button type="primary" v-else @click="onSubmit('skillTaskForm')" size="small">创建</el-button>
        <el-button size="small" @click="beforeClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import taskServer from '@/apis/task.js';
import skillPointServer from '@/apis/skill.js'
import RemoteTreeSelect from '@/components/RemoteTreeSelect';
import { v1 as uuidv1 } from 'uuid';
import roleServer from '@/apis/role.js'
const form = {
  id: 0,
  taskName: '',
  taskStatus: "1",
  taskFinishCondition: [{
    value: '',
    key: new Date().getTime(),
  }],
  skillReward: 20,
  skillLevel: '',
  taskAttachmentUrl: '',
  attachment: '',
  taskRemark: '',
  // @daijr
  skillTreeId: '',
  checkRoles: []
}
export default {
  props: {
    showSkillDialog: {
      type: Boolean,
      default: false
    },
    editId: {
      type: Number,
      default: 0,
    },
    selectNodes: {
      type: Array,
      default: () => []
    }
  },
  components: {
    RemoteTreeSelect
  },
  
  async created() {
    await taskServer.getAllSkillLevel().then(data => {
      this.skillLevelList = data.map(level => {
        return {
          label: level.desc,
          value: level.code
        }
      })
      this.skillLevelList.splice(0, 1);
    })
    await this.queryRoleList();
  },
  data() {
    return {
      skillTaskForm: form,
      rewardScores: [10, 20, 30 ,40, 50],
      rules: {
        taskName: [
          { required: true, message: '请输入技能点名称', trigger: 'blur' },
        ],
      },
      receiverList: [],
      loading: false,
      edit: false,
      skillLevelList: [],
      uploadUrl: '',
      fileList: [],
      roleList: [],
    }
  },
  watch: {
    selectNodes: {
      deep: true,
      immediate: true,
      handler(newArray, oldArray) {
        console.log(newArray);
      }
    },
    editId: {
      immediate: true,
      handler: function(val, oval) {
        if (val) {
          this.getTask(val);
          this.edit = true;
        }
      }
    },
    showSkillDialog: {
      immediate: true,
      handler: function(val, oval) {
        if (!this.editId) {
          this.skillTaskForm = form
        }
      }
    }
  },
  methods: {
    beforeClose () {
      this.$emit('refresh')
      this.$emit('closepop')
      this.edit = false;
      this.$router.push('/System/SkillPointList');
    },
    queryRoleList (val) {
      roleServer.queryRoleList({
        queryCondition: val
      }).then(res => {
        this.roleList = res.map(i => {
          return {
            code: i.id,
            name: i.roleName + '(' + i.roleCode + ')'
          }
        })
      })
    },
    onModify (formName) {
      const data = new FormData()
      data.append('id', this.skillTaskForm.id)
      data.append('taskName', this.skillTaskForm.taskName)
      data.append('taskStatus', this.skillTaskForm.taskStatus)
      data.append('taskFinishCondition', this.skillTaskForm.taskFinishCondition.map(condition => {
        return condition.value
      }));
      data.append('skillLevel', this.skillTaskForm.skillLevel)
      data.append('skillReward', this.skillTaskForm.skillReward)
      data.append('taskDescription', this.skillTaskForm.taskDescription)
      data.append('taskRemark', this.skillTaskForm.taskRemark)
      data.append('checkRoles', this.skillTaskForm.checkRoles)
      data.append('modifyId', '60028724');
      const skillTreeIds = this.selectNodes.map(node => {
        return node.id;
      })
      data.append('skillTreeId', skillTreeIds);
      if (this.skillTaskForm.attachment !== undefined) {
        data.append('attachment', this.skillTaskForm.attachment);
      }
      skillPointServer.updateSkillPoint(data).then(() => {
        this.$message({
          message: '技能点编辑成功！',
          type: "success"
        });
        this.beforeClose()
        this.$emit('refresh')
      }).catch(err => {
      });
    },
    onSubmit(formName) {
      const data = new FormData();
      data.append('taskName', this.skillTaskForm.taskName);
      data.append('taskStatus', this.skillTaskForm.taskStatus);
      data.append('taskFinishCondition', this.skillTaskForm.taskFinishCondition.map(condition => {
        return condition.value;
      }));
      data.append('skillLevel', this.skillTaskForm.skillLevel);
      data.append('skillReward', this.skillTaskForm.skillReward);
      data.append('checkRoles', this.skillTaskForm.checkRoles)
      data.append('taskDescription', this.skillTaskForm.taskDescription);
      data.append('taskRemark', this.skillTaskForm.taskRemark);
      data.append('publisher', '60028724');
      const skillTreeIds = this.selectNodes.map(node => {
        return node.id;
      })
      data.append('skillTreeId', skillTreeIds);
      if (this.skillTaskForm.attachment !== '') {
        data.append('attachment', this.skillTaskForm.attachment);
      }
      skillPointServer.saveSkillPoint(data).then(() => {
        this.$message({
          message: '新建技能点成功！',
          type: "success"
        });
        this.beforeClose()
        this.$emit('refresh')
        //this.$router.push('/SkillAuthManagement/SkillAssignList');
      }).catch((error) => {
        this.$message.error(error.message + '： 保存失败，请重新创建');
        this.$router.push('/SkillAuthManagement/SkillAssignList');
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handelOnChange (file, fileList) {
      this.fileList = [file];
      this.skillTaskForm.attachment = file.raw;
    },
    handelRemove (response, file, fileList) {
      this.skillTaskForm.attachment = null;
    },
    removeDomain(item) {
      if (this.skillTaskForm.taskFinishCondition.length <= 1) {
        this.$message.warning('至少有一条验收标准');
        return;
      }
      var index = this.skillTaskForm.taskFinishCondition.indexOf(item);
      if (index !== -1) {
        this.skillTaskForm.taskFinishCondition.splice(index, 1)
      }
    },
    addDomain() {
      if (this.skillTaskForm.taskFinishCondition.length >= 5) {
        this.$message.warning('技能点验收标准最多创建五条');
        return;
      }
      this.skillTaskForm.taskFinishCondition.push({
        value: '',
        key: new Date().getTime(),
      });
    },
    getTask (id) {
      this.edit = true;
      skillPointServer.getSkillTask(id).then(data => {
        this.skillTaskForm = {
          id: data.id,
          taskName: data.taskName,
          taskStatus: data.taskStatus,
          taskFinishCondition: data.taskFinishConditionList.map(condition => {
            return {
              key: uuidv1(),
              value: condition.taskFinishContent
            }
          }),
          skillLevel: data.skillLevel,
          skillReward: data.skillReward,
          taskRemark: data.taskRemark,
          skillTreeId: data.skillTreeId,
          checkRoles: data.checkRoles.split(',').map(Number)
        }
        if (data && data.attachmentName && data.attachmentUrl) {
          this.fileList = [{
            name: data.attachmentName,
            url: data.attachmentUrl
          }]
        }
      })
    },

    getCurrentUid () {
      const user = this.$store.state.permission?.userinfo;
      return user.uid;
    },
  }

}
</script>
<style>
.skill-point-form {
  font-size: 12px;
}
</style>
