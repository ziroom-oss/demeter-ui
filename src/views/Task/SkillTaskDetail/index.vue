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
              <span v-text="task.createTime"></span>
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
              :content="task.checkedRoleNames">
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
      <!-- <el-divider></el-divider>
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
      </el-table> -->
      <el-divider></el-divider>
      <p style="font-weight: bold">技能点认证标准</p>
      <div>
        <template v-for="(item, index) in taskFinishConditionList">
          <el-row :gutter="20" :key="index" style="margin-bottom: 10px">
            <el-col :span="4">技能点认证标准 {{ index + 1 }}：</el-col>
            <el-col :span="16">{{ item.taskFinishContent }}</el-col>
          </el-row>
        </template>
      </div>
    </el-card>
  </div>
</template>
<script>
import { RouteConfig, Component, Vue } from '@ziroom/cherry2-decorator';
import taskServer from '@/apis/task.js';
import newTaskServer from '@/apis/newTask.js';
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
      taskFinishConditionList: [],
      fileList: [],
      taskProgress: {},
      progressDialogVisible: false,
      checkDialogVisible: false,
      checkParam: {
        result: 1,
        opinion: ''
      },
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
    // async getMapSkillsInfo() {
    //   const mapSkills = await map.getMapSkillsByCondition({ skillTaskId: this.$route.query.id });
    //   const mapInfoQueue = [];
    //   mapSkills.forEach(ms => {
    //     mapInfoQueue.push(map.get(ms.skillMapId));
    //   });
    //   const mapSkillInfoList = await Promise.all(mapInfoQueue);
    //   mapSkillInfoList.forEach(async item => {
    //     const job = await jobs.getByCode(item.jobId);
    //     this.$set(item, 'jobName', job.name);
    //   });
    //   const treeNodes = await tree.getAllNodes();
    //   const treeNodesMap = Object.values(treeNodes).reduce((accu, value) => {
    //     accu[value.id] = value;
    //     return accu;
    //   }, {})
    //   const skill = {
    //     name: this.task.taskName,
    //     parentId: this.task.skillTreeId,
    //   };
    //   mapSkillInfoList.forEach(mapSkill => {
    //     mapSkill.skillPath = recuriveSetSkillPath(skill, treeNodesMap);
    //   });
    //   function recuriveSetSkillPath(node, memo) {
    //     const str = [];
    //     function recurive(node, memo) {
    //       str.push(node.name);
    //       if (memo[node.parentId]) {
    //         return recurive(memo[node.parentId], memo);
    //       }
    //     }
    //     recurive(node, memo);
    //     return str.reverse();
    //   }
    //   this.$set(this, 'mapSkillInfoList', mapSkillInfoList);
    // },
    refresh () {
      this.getTaskDetail();
    },

    getTaskDetail () {
      newTaskServer.getTaskDetail(this.$route.query.id, 1).then(data => {
        this.task = data;
        this.task.checkRoleName = this.task.checkRole.map(i => i.roleName).join(',');
        this.task.checkedRoleNames = data.checkRoleUserNameList.join(",");
        this.taskFinishConditionList = data.taskFinishConditionList;
       // this.getMapSkillsInfo();
      });
    },
    
    formatDate (date) {
      return dayjs(date).format('YYYY-MM-DD');
    },
    formateTime (time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
    },
  }
})
@RouteConfig({
  layout: true,
  name: 'SkillTaskDetail',
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
