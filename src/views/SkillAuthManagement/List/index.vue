<template>
  <div>
    <div>
      <div style="display: flex; flex-flow: row nowrap;">
        <div>
          <el-select
            v-model="receiveTaskFilter.skillPointLevel"
            placeholder="选择技能点等级"
            size="small">
            <el-option
              v-for="item in pointLevelList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="margin-left: 16px;">
          <el-select
            v-model="receiveTaskFilter.taskStatus"
            placeholder="请选择认证状态"
            size="small">
            <el-option
              v-for="item in allTaskFlowStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="margin-left: 16px;">
          <el-input
            v-model="receiveTaskFilter.nameOrNo"
            clearable
            placeholder="技能点名称/编号"
            size="small"
          ></el-input>
        </div>
        <el-col :span="5" style="margin-left: 10px">
          <el-button type="primary" size="small" @click="searchReceiveList">搜索</el-button>
        </el-col>
      </div>
    </div>
    <el-card style="margin-top: 16px;">
      <el-table :data="receiveTaskList" style="width: 100%">
        <el-table-column label="编号" prop="taskNo" align="center" width=""></el-table-column>
        <el-table-column label="名称" prop="taskName" align="center" width="250">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.taskName" placement="top">
              <span style="overflow: hidden;text-overflow:ellipsis; white-space: nowrap;">{{ scope.row.taskName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- <el-table-column label="类型" prop="taskTypeName" align="center" width=""></el-table-column> -->
        <el-table-column label="执行状态" prop="taskFlowStatusName" align="center" width=""></el-table-column>
        <el-table-column label="创建时间" prop="taskCreateTime" align="center" width="150">
        </el-table-column>
        <el-table-column label="奖励值" prop="taskReward" align="center" width=""></el-table-column>
        <el-table-column label="分配人" prop="assignerName" align="center" width=""></el-table-column>
        <el-table-column label="发布人" prop="publisherName" align="center" width=""></el-table-column>
        <el-table-column label="认领人" prop="receiverName" align="center" width=""></el-table-column>
        <el-table-column label="操作" prop="" align="center" width="">
          <template slot-scope="scope">
            <span>
              <el-button v-if="scope.row.taskType === 1" type="text" size="small" @click="$router.push({ path: '/Task/SkillDetail', query: { id: scope.row.id }})">查看</el-button>
            </span>
            <span>
              <el-button v-if="checkSkillAuth(scope.row)" type="text" size="small" @click="submitCheckTask(scope.row.id, scope.row.taskType)">发起认证</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="text-align: right; margin-top: 16px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size.sync="receiveTaskFilter.pageSize"
          :current-page.sync="receiveTaskFilter.pageNumber"
          :page-sizes="[5, 10, 30, 50]"
          layout="total, sizes, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import taskServer from '@/apis/task.js';
import ehrServer from '@/apis/ehr.js';
import dayjs from 'dayjs';
//import { getUserinfo } from '@ziroom/zcloud-head';
export default {
   data: function() {
    return {
      receiveTaskFilter: {
        taskStatus: 0,
        skillPointLevel: 0,
        systemCode: '',
        nameOrNo: '',
        pageSize: 10,
        pageNumber: 1,
      },
      allTaskFlowStatus: [],
      publisherList: [],
      loading: false,
      receiveTaskList: [],
      total: 0,
      pointLevelList: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '初',
          value: 1,
        },
        {
          label: '中',
          value: 2
        },
        {
          label: '高',
          value: 3
        }
      ]
    }
  },

  async mounted() {
    const allTaskFlowStatus = await taskServer.getAllSkillFlowStatus();
    this.allTaskFlowStatus = allTaskFlowStatus.map(status => {
      return {
        label: status.desc,
        value: status.code,
      };
    });
    this.refresh();
  },
  methods: {
    refresh() {
      this.refreshReceive();
    },
    handleSizeChange (val) {
      this.receiveTaskFilter.pageSize = val;
      this.refreshReceive();
    },
    handleCurrentChange (val) {
      this.receiveTaskFilter.pageNumber = val;
      this.refreshReceive();
    },
    refreshReceive () {
      this.searchReceiveList();
    },
    queryPeople (query) {
      this.loading = true;
      ehrServer.getEmpList({ empCodeNameAdcode: query }).then(data => {
        this.loading = false;
        this.publisherList = data.map(user => {
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
    searchReceiveList () {
      const params = this.receiveTaskFilter;
      // params.systemCode = this.getCurrentUid();
      taskServer.receiveList(params).then(data => {
        this.total = data.total;
        this.receiveTaskList = data.data.map(task => {
          return {
            ...task,
            taskCreateTime: dayjs(task.createTime).format('YYYY-MM-DD HH:mm:ss')
          }
        })
      })
    },
    confirmChange (id, taskType, status) {
      if (status === 2) {
        this.$confirm('此操作将关闭/禁用此任务，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.changeTaskStatus(id, taskType, status);
        }).catch(() => {
          return;
        })
      } else {
        // 开启任务无需确认
        this.changeTaskStatus(id, taskType, status);
      }
    },
    changeTaskStatus (id, taskType, status) {
      taskServer.changeTaskStatus(id, taskType, status).then(data => {
      }).catch(() => {
      })
    },
    getCurrentUid () {
      const user = getUserinfo();
      return user.userInfo.uid
    },
    acceptTask (id, type) {
      this.$confirm('确认认领此任务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        taskServer.acceptTask(id, type).then(data => {
          this.refresh();
        }).catch(err => {
          this.refresh();
        })
      }).catch(() => {
        return;
      })
    },
    // 检查技能类任务是否可以认证
    checkSkillAuth (task) {
      // 技能类任务 && 当前登录人为任务接收人 && 任务状态为进行中
      const currentUid = this.getCurrentUid();
      if (task.taskType === 1 && task.receiver === currentUid && task.taskFlowStatus === 2) {
        return true;
      }
    },
    submitCheckTask(id, type) {
      taskServer.submitCheckTask(id, type).then(() => {
        this.$message({
          message: '提交验收/认证成功',
          type: "success"
        });
        this.refresh();
      }).catch(err => {
        this.refresh();
      })
    },
  }
}
</script>
