<template>
  <div>
    <div>
      <div style="display: flex; flex-flow: row nowrap;">
        <div>
          <!--选择状态start -->
          <el-select
            v-if="studyListFilter.taskType !== 0"
            v-model="studyListFilter.status" placeholder="选择状态" size="small">
            <el-option
              v-for="item in allTaskFlowStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <!--选择状态end-->  
        </div>

        <!--输入学习清单名称/编号start-->
        <div style="margin-left: 16px">
          <el-input
            v-model="studyListFilter.manifestIdOrName"
            clearable
            placeholder="输入学习清单名称/编号"
            size="small"
          ></el-input>
        </div>
        <!--输入学习清单名称/编号end-->

        <div style="margin-left: 16px">
          <el-button type="primary" size="small" @click="searchStudyList" >搜索</el-button>
        </div>
        <div style="margin-left: 16px"> <el-button type="success" size="small" @click="$router.push({path: '/skillAuthManagement/editStudyList'}) " >创建学习清单</el-button>
         
        </div>
      </div>
    </div>
    <!--grid start-->
    <el-card style="margin-top: 16px;">
      <el-table :data="studyList">
        <el-table-column
          label="学习清单编号"
          prop="id"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          label="学习清单名称"
          prop="name"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.name"
              placement="top"
            >
              <span
                style="
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                "
                >{{ scope.row.name }}</span
              >
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- <el-table-column label="类型" prop="taskTypeName" align="center" width=""></el-table-column> -->
        <el-table-column
          label="状态"
          prop="statusName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          align="center"
          width="150"
        >
        </el-table-column>
        <el-table-column
          label="技能点奖励"
          prop="reward"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          label="分配人"
          prop="assignerName"
          align="center"
        ></el-table-column>
        <el-table-column label="认领人" prop="learnerName" align="center" width=""></el-table-column>
        <el-table-column label="操作" prop="" align="center" width="">
          <template slot-scope="scope">
            <span><!--v-if="scope.row.taskType === 1"-->
              <el-button type="text" size="small" @click="$router.push({path: '/SkillAuthManagement/StudyListDetail', query: { id: scope.row.id }}) ">查看</el-button>
            </span>
            <span v-if="scope.row.createId === getCurrentUid()">
            <el-button type="text" size="small" @click="$router.push({ path: '/SkillAuthManagement/EditStudyList', query: { id: scope.row.id }}) " >编辑</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="text-align: right; margin-top: 16px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size.sync="studyListFilter.pageSize"
          :current-page.sync="studyListFilter.pageNumber"
          :page-sizes="[5, 10, 30, 50]"
          layout="total, sizes, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!--grid end-->
  </div>
</template>

<script>
import taskServer from "@/apis/task.js";
import ehrServer from "@/apis/ehr.js";
import dayjs from "dayjs";
//import { getUserinfo } from "@ziroom/zcloud-head";
export default {
 data: function() {
    return {
      //搜索参数
      studyListFilter: {
        // pointLevel: '',
        taskType: 1,
        status: 2,
        //systemCode: '',
        // nameOrNo: '',
        pageSize: 10,
        pageNumber: 1,
      },
      allstudyListStatus: [],
      allTaskFlowStatus: [],
      publisherList: [],
      loading: false,
      studyList: [], //学习清单
      total: 0,
    };
  },
  mounted() {
    this.getCurrentUid(); //获取当前用户uid
    this.getAllStatus(); //任务状态
    this.refresh();
  },
  methods: {
    refresh() {
      this.refreshstudyList();
    },
    getAllStatus(value) {
      this.allTaskFlowStatus = [
        { label: '进行中', value: 2 },
        { label: '认证通过', value: 4 }
      ];
    },
    handleSizeChange(val) {
      this.receiveTaskFilter.pageSize = val;
      this.refreshstudyList();
    },
    handleCurrentChange(val) {
      this.studylistFilter.pageNumber = val;
      this.refreshstudyList();
    },
    refreshstudyList() {
      this.searchStudyList();
    },
    queryPeople(query) {
      this.loading = true;
      ehrServer
        .getEmpList({ empCodeNameAdcode: query })
        .then((data) => {
          this.loading = false;
          this.publisherList = data.map((user) => {
            return {
              code: user.code,
              email: user.email,
              name: user.name + "(" + user.email.split("@")[0] + ")",
            };
          });
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    searchStudyList() {
      const params = this.studyListFilter;
      taskServer.getStudyListCurUser(params).then((data) => {
        this.total = data.total;
        this.studyList = data.data.map((task) => {
          return {
            ...task,
            createTime: dayjs(task.createTime).format("YYYY-MM-DD HH:mm:ss"),
            submitCheckTime: dayjs(task.submitCheckTime).format('YYYY-MM-DD HH:mm:ss')
          };
        });
      }).catch(err => {
        console.error(err);
      });

    },
    confirmChange(id, taskType, status) {
      if (status === 2) {
        this.$confirm("此操作将关闭/禁用此任务，是否继续？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.changeTaskStatus(id, taskType, status);
          })
          .catch(() => {
            return;
          });
      } else {
        // 开启任务无需确认
        this.changeTaskStatus(id, taskType, status);
      }
    },
    changeTaskStatus(id, taskType, status) {
      taskServer
        .changeTaskStatus(id, taskType, status)
        .then((data) => {})
        .catch(() => {});
    },
    getCurrentUid() {
      const user = this.$store.state.permission?.userinfo;
      return user.uid;
    },
    acceptTask(id, type) {
      this.$confirm("确认认领此任务？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          taskServer
            .acceptTask(id, type)
            .then((data) => {
              this.refresh();
            })
            .catch((err) => {
              this.refresh();
            });
        })
        .catch(() => {
          return;
        });
    },
    // 检查技能类任务是否可以认证
    checkSkillAuth(task) {
      // 技能类任务 && 当前登录人为任务接收人 && 任务状态为进行中
      const currentUid = this.getCurrentUid();
      if (
        task.taskType === 1 &&
        task.receiver === currentUid &&
        task.taskFlowStatus === 2
      ) {
        return true;
      }
    },
    submitCheckTask(id, type) {
      taskServer
        .submitCheckTask(id, type)
        .then(() => {
          this.$message({
            message: "提交验收/认证成功",
            type: "success",
          });
          this.refresh();
        })
        .catch((err) => {
          this.refresh();
        });
    },
  },
}
</script>
