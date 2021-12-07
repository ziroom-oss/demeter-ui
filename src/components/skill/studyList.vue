<template>
  <div>
    <!--学习清单中选中的技能 start-->
    <div>
       <el-table :data="skillList" style="width: 100%">          
            <el-table-column label="技能点编号" prop="taskNo" align="center" fit ="true"></el-table-column>
            <el-table-column label="技能点名称" prop="taskName" align="center" fit ="true">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.taskName" placement="top">
                  <span style="overflow: hidden;text-overflow:ellipsis; white-space: nowrap;">{{ scope.row.taskName }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="技能等级" prop="skillLevelName" align="center" fit ="true"></el-table-column>
            <el-table-column label="技能值奖励" prop="skillTreeName" align="center" fit ="true"></el-table-column> 
            <el-table-column label="认证状态" prop="taskStatusName" align="center" fit ="true"></el-table-column>            
        </el-table>
      <div class="block" style="float: right; margin-top: 20px">
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

    <el-col :span="5" style="margin-left: 50px">
        <el-button type="primary" size="medium" @click="createStudyList" >创建</el-button>
    </el-col>
     <el-col :span="5" style="margin-left: 50px">
        <el-button type="info" size="medium" @click="cancelCreate" >取消</el-button>
    </el-col>
    </div>
    <!--学习清单中选中的技能 end-->
  </div>
</template>

<script>
import taskServer from "@/apis/task.js";
import ehrServer from "@/apis/ehr.js";
import dayjs from "dayjs";
export default {

  data() {
    return {
      allstudyListStatus: [],
      allTaskFlowStatus: [],
      publisherList: [],
      loading: false,
      skillList: [], //学习清单
      total: 0,
    };
  },
  mounted() {
    this.getCurrentUid(); //获取当前用户uid
    taskServer.getAllTaskTypes().then((data) => {
      this.allTaskTypes = data.map((type) => {
        return {
          label: type.desc,
          value: type.code,
        };
      });
    }); //任务类型
    this.refresh();
    this.getAllStatus(); //任务状态
  },
 
  methods: {
    refresh() {
      this.refreshstudyList();
    },
    getAllStatus(value) {
      taskServer.getAllSkillFlowStatus().then((data) => {
        this.allTaskFlowStatus = data.map((s) => {
          return {
            label: s.desc,
            value: s.code,
          };
        });
      });
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
            listCreateTime: dayjs(task.createTime).format("YYYY-MM-DD HH:mm:ss"),
          };
        });
      }).catch(err => {
        console.error(err);
      });

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
  }

}
</script>
