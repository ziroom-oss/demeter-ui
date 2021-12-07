<template>
  <div>
    <el-tabs type="border-card" @tab-click="onTabChange">
      <el-tab-pane label="发布任务列表" v-if="roles.includes('') || roles.includes('demeter-super-admin') || roles.includes('demeter-dept-admin')">
        <div>
          <el-row :gutter="10">
            <el-col :span="3">
              <el-select
                v-model="releaseTaskFilter.taskStatus"
                placeholder="选择任务状态"
                size="small">
                <el-option
                  v-for="(item,index) in allTaskStatus"
                  :key="index+1"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select
                v-model="releaseTaskFilter.systemCode"
                placeholder="输入姓名"
                filterable
                remote
                clearable
                :loading="loading"
                :remote-method="queryPeople"
                size="small"
              >
              <el-option v-for="(item,index) in publisherList" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input
                v-model="releaseTaskFilter.nameOrNo"
                placeholder="请输入任务名称/编号"
                clearable
                size="small"
              ></el-input>
            </el-col>
            <el-col :span="6" style="margin-left: 10px">
              <el-button type="primary" size="small" @click="searchReleaseList">搜索</el-button>
              <el-button size="small" @click="$router.push('/Task/Assign')">新建任务</el-button>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-table :data="releaseTaskList" style="width: 100%">
            <el-table-column label="编号" prop="taskNo" align="center" width=""></el-table-column>
            <el-table-column label="名称" prop="taskName" align="center" width="250">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.taskName" placement="top">
                  <span style="overflow: hidden;text-overflow:ellipsis; white-space: nowrap;">{{ scope.row.taskName }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="类型" prop="taskTypeName" align="center" width=""></el-table-column>
            <el-table-column label="状态" prop="taskStatusName" align="center" width=""></el-table-column>
            <el-table-column label="创建时间" prop="taskCreateTime" align="center" width=""></el-table-column>
            <el-table-column label="成长值" prop="growthValue" align="center" width=""></el-table-column>
            <el-table-column label="发布人" prop="publisherName" align="center" width=""></el-table-column>
            <el-table-column label="操作" prop="" align="center" width="">
              <template slot-scope="scope">
                <span>
                  <el-button v-if="scope.row.taskType === 1" type="text" size="small" @click="$router.push({ path: '/TaskManagement/SkillDetail', query: { id: scope.row.id }})">查看</el-button>
                </span>
                <span>
                  <el-button v-if="scope.row.taskType === 2" type="text" size="small" @click="$router.push({ path: '/TaskManagement/AssignDetail', query: { id: scope.row.id }})">查看</el-button>
                </span>
                <span v-if="scope.row.publisher === getCurrentUid() && scope.row.taskReceiverName === '' && scope.row.taskType === 1 && scope.row.taskStatus === 2">
                  <el-button type="text" size="small" @click="$router.push({ path: '/TaskManagement/Skill', query: { id: scope.row.id }})">编辑</el-button>
                </span>
                <span v-if="scope.row.publisher === getCurrentUid() && scope.row.taskReceiverName === '' && scope.row.taskType === 2 && scope.row.taskStatus === 1">
                  <el-button type="text" size="small" @click="$router.push({ path: '/TaskManagement/NewTaskAssign', query: { id: scope.row.id }})">编辑</el-button>
                </span>
                <span v-if="scope.row.publisher === getCurrentUid() && scope.row.taskType === 1 && scope.row.taskStatus === 1">
                  <el-button type="text" size="small" @click="confirmChange(scope.row.id, scope.row.taskType, 2)">禁用</el-button>
                </span>
                <span v-if="scope.row.publisher === getCurrentUid() && scope.row.taskType === 1 && scope.row.taskStatus === 2">
                  <el-button type="text" size="small" @click="confirmChange(scope.row.id, scope.row.taskType, 1)">启用</el-button>
                </span>
                <span v-if="scope.row.publisher === getCurrentUid() && scope.row.taskType === 2 && scope.row.taskStatus === 1">
                  <el-button type="text" size="small" @click="confirmChange(scope.row.id, scope.row.taskType, 2)">关闭</el-button>
                </span>
                <span v-if="scope.row.publisher === getCurrentUid() && scope.row.taskType === 2 && scope.row.taskStatus === 2">
                  <el-button type="text" size="small" @click="confirmChange(scope.row.id, scope.row.taskType, 1)">打开</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" style="float: right; margin-top: 20px">
            <el-pagination
              @size-change="handleReleaseSizeChange"
              @current-change="handleReleaseCurrentChange"
              current-page.sync="1"
              :page-sizes="[5, 10, 30, 50]"
              :page-size="10"
              layout="total, sizes, prev, pager, next"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="接收任务列表">
        <div>
          <el-row :gutter="10">
            <el-col :span="4">
              <el-select
                v-model="receiveTaskFilter.taskStatus"
                placeholder="执行状态"
                size="small">
                <el-option
                  v-for="(item,index) in allTaskFlowStatus"
                  :key="index+2"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select
                v-model="receiveTaskFilter.systemCode"
                placeholder="输入姓名"
                filterable
                remote
                clearable
                :loading="loading"
                :remote-method="queryPeople"
                size="small"
              >
                <el-option v-for="(item,index) in publisherList" :key="index+3" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-input
                v-model="receiveTaskFilter.nameOrNo"
                clearable
                placeholder="任务名称/编号"
                size="small"
              ></el-input>
            </el-col>
            <el-col :span="5" style="margin-left: 10px">
              <el-button type="primary" size="small" @click="searchReceiveList">搜索</el-button>
              <el-button size="small" @click="$router.push('/Task/Assign')">新建任务</el-button>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-table :data="receiveTaskList" style="width: 100%">
            <el-table-column label="编号" prop="taskNo" align="center" width=""></el-table-column>
            <el-table-column label="名称" prop="taskName" align="center" width="250">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.taskName" placement="top">
                  <span style="overflow: hidden;text-overflow:ellipsis; white-space: nowrap;">{{ scope.row.taskName }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="类型" prop="taskTypeName" align="center" width=""></el-table-column>
            <el-table-column label="执行状态" prop="taskFlowStatusName" align="center" width=""></el-table-column>
            <el-table-column label="创建时间" prop="taskCreateTime" align="center" width="">
            </el-table-column>
            <el-table-column label="奖励值" prop="taskReward" align="center" width=""></el-table-column>
            <el-table-column label="发布人" prop="publisherName" align="center" width=""></el-table-column>
            <el-table-column label="接收人" prop="receiverName" align="center" width=""></el-table-column>
            <el-table-column label="操作" prop="" align="center" width="">
              <template slot-scope="scope">
                <span>
                  <el-button v-if="scope.row.taskType === 1" type="text" size="small" @click="$router.push({ path: '/TaskManagement/SkillDetail', query: { id: scope.row.id }})">查看</el-button>
                </span>
                <span>
                  <el-button v-if="scope.row.taskType === 2" type="text" size="small" @click="$router.push({ path: '/TaskManagement/AssignDetail', query: { id: scope.row.id }})">查看</el-button>
                </span>
                <span>
                  <el-button v-if="scope.row.receiver === getCurrentUid() && scope.row.taskType === 2 && scope.row.taskFlowStatus === 1" type="text" size="small" @click="acceptTask(scope.row.id, scope.row.taskType)">认领</el-button>
                </span>
                <span>
                  <el-button v-if="scope.row.receiver === getCurrentUid() && scope.row.taskType === 2 && scope.row.taskFlowStatus === 1" type="text" size="small" @click="rejectTask(scope.row.id)">拒绝</el-button>
                </span>
                <span>
                  <el-button v-if="checkAssignAuth(scope.row)" type="text" size="small" @click="submitCheckTask(scope.row.id, scope.row.taskType)">发起验收</el-button>
                </span>
                <span>
                  <el-button v-if="checkSkillAuth(scope.row)" type="text" size="small" @click="submitCheckTask(scope.row.id, scope.row.taskType)">发起认证</el-button>
                </span>
                <span>
                  <el-button v-if="checkComplete(scope.row)" type="text" size="small" @click="submitComplete(scope.row.id, scope.row.taskType)">完成任务</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" style="float: right; margin-top: 20px">
            <el-pagination
              @size-change="handleReceiveSizeChange"
              @current-change="handleReceiveCurrentChange"
              :page-size.sync="receiveTaskFilter.pageSize"
              :current-page.sync="receiveTaskFilter.pageNumber"
              :page-sizes="[5, 10, 30, 50]"
              layout="total, sizes, prev, pager, next"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import taskServer from '@/apis/task.js';
import authServer from '@/apis/authorize.js';
import ehrServer from '@/apis/ehr.js';
import dayjs from 'dayjs';
export default {

  data() {
    return {
      roles: [],
      releaseTaskFilter: {
        taskType: 2,
        taskStatus: '',
        systemCode: '',
        nameOrNo: '',
        pageSize: 10,
        pageNumber: 1,
      },
      receiveTaskFilter: {
        taskType: 2,
        taskStatus: '',
        systemCode: '',
        nameOrNo: '',
        pageSize: 10,
        pageNumber: 1,
      },
      allTaskTypes: [],
      allTaskStatus: [],
      allTaskFlowStatus: [],
      publisherList: [],
      loading: false,
      releaseTaskList: [],
      receiveTaskList: [],
      total: 0,
    }
  },
  mounted() {
    this.getCurrentRole();
    this.getCurrentUid();
    taskServer.getAllTaskTypes().then(data => {
      this.allTaskTypes = data.map(type => {
        return {
          label: type.desc,
          value: type.code
        }
      })
    });
    this.refresh();
    this.getAllAssignStatus();
    this.getAllAssignFlowStatus();
  },
  methods: {
     getCurrentRole () {
      authServer.getAuthorize().then(data => {
        this.roles = data.roles;
      })
    },
    refresh() {
      this.refreshRelease();
      this.refreshReceive();
    },
    handleReleaseSizeChange (val) {
      this.releaseTaskFilter.pageSize = val;
      this.searchReleaseList();
    },
    handleReleaseCurrentChange (val) {
      this.releaseTaskFilter.pageNumber = val;
      this.searchReleaseList();
    },
    handleReceiveSizeChange (val) {
      this.receiveTaskFilter.pageSize = val;
      this.refreshReceive();
    },
    handleReceiveCurrentChange (val) {
      this.receiveTaskFilter.pageNumber = val;
      this.refreshReceive();
    },
    refreshRelease () {
      this.searchReleaseList();
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
    getAllAssignStatus () {
      taskServer.getAllAssignStatus().then(data => {
        this.allTaskStatus = data.map(s => {
          return {
            label: s.desc,
            value: s.code
          }
        })
      })
    },
    getAllAssignFlowStatus () {
      taskServer.getAllAssignFlowStatus().then(data => {
        this.allTaskFlowStatus = data.map(s => {
          return {
            label: s.desc,
            value: s.code
          }
        })
      })
    },
    searchReleaseList () {
      const params = this.releaseTaskFilter;
      taskServer.releaseList(params).then(data => {
        this.total = data.total;
        const listData = data.data;
        if (listData) {
          this.releaseTaskList = listData.map(task => {
            return {
              ...task,
              taskCreateTime: dayjs(task.taskCreateTime).format('YYYY-MM-DD HH:mm:ss')
            }
          })
        }
      });
    },
    searchReceiveList () {
      const params = this.receiveTaskFilter;
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
        this.searchReleaseList();
      }).catch(() => {
        this.searchReleaseList();
      })
    },
    onTabChange (tab) {
      if(this.roles.includes('') || this.roles.includes('demeter-super-admin') || roles.includes('demeter-dept-admin')){
        if (tab.index === '0') {
          this.searchReleaseList();
        } else if (tab.index === '1') {
          this.searchReceiveList();
        }
      } else{
        this.searchReceiveList();
      }
    },
    getCurrentUid () {
      const user = this.$store.state.permission?.userinfo;
      return user.uid
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
    rejectTask (id) {
      this.$prompt('确认拒绝此任务？确认拒绝请输入原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '拒绝原因不能为空'
      }).then(({ value }) => {
        const params = {
          taskId: id,
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
    // 检查指派类任务是否可以验收
    checkAssignAuth (task) {
      // 指派类任务 && 当前登录人为任务接收人 && 任务状态为进行中 && 任务需要验收
      const currentUid = this.getCurrentUid();
      if (task.taskType === 2 && task.receiver === currentUid && task.taskFlowStatus === 3 && task.needAcceptance == 1) {
        return true;
      }
    },
    // 检查技能类任务是否可以认证
    checkSkillAuth (task) {
      // 技能类任务 && 当前登录人为任务接收人 && 任务状态为进行中
      const currentUid = this.getCurrentUid();
      if (task.taskType === 1 && task.receiver === currentUid && task.taskFlowStatus === 3) {
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
      }).catch(() => {
        this.refresh();
      })
    },
    checkComplete (task) {
      // 当前登录人为此任务接收人 && 任务状态为进行中 && 任务无需验收
      const currentUid = this.getCurrentUid();
      if (task.receiver === currentUid && task.taskFlowStatus === 3 && task.needAcceptance == 0) {
        return true;
      }
    },
    submitComplete (id, taskType) {
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
  }
}
</script>
