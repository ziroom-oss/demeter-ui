<template>
  <div>
    <el-container>
      <el-aside width="280px">
        <RemoteTreeSelect v-model="selectNodes" maxHeight="800px" />
      </el-aside>
      <el-main>
        <div>
          <el-row :gutter="10">
            <el-col :span="3">
              <el-select
                v-model="releaseTaskFilter.skillPointLevel"
                placeholder="技能等级"
                size="small">
                <el-option
                  v-for="item in pointLevelList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="releaseTaskFilter.taskStatus"
                placeholder="技能状态"
                size="small"
              >
                <el-option
                  v-for="item in allTaskStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select
                v-model="releaseTaskFilter.systemCode"
                placeholder="姓名/工号/邮箱前缀"
                filterable
                remote
                clearable
                :loading="loading"
                :remote-method="queryPeople"
                size="small"
              >
                <el-option v-for="item in publisherList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-input
                v-model="releaseTaskFilter.nameOrNo"
                placeholder="技能点名称/编号"
                clearable
                size="small"
              ></el-input>
            </el-col>
            <el-col :span="6" style="margin-left: 10px">
              <el-button type="primary" size="small" @click="searchReleaseList">搜索</el-button>
              <el-button size="small" @click="openSkillDialog">新建技能点</el-button>
            </el-col>
          </el-row>
        </div>
        <SkillDialog
          :showSkillDialog="showSkillDialog"
          @closepop="closepop"
          :selectNodes="selectNodes"
          @refresh="refresh"
          :editId="editId"/>
        <div>
          <el-table :data="releaseTaskList" style="width: 100%">
            <el-table-column label="编号" prop="taskNo" align="center" width="70"></el-table-column>
            <el-table-column label="技能等级" prop="skillLevelName" align="center" width="60"></el-table-column>
            <el-table-column label="所属技能树" prop="skillTreeName" align="center" width="90"></el-table-column>
            <el-table-column label="名称" prop="taskName" align="center">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.taskName" placement="top">
                  <span style="overflow: hidden;text-overflow:ellipsis; white-space: nowrap;">{{ scope.row.taskName }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="taskStatusName" align="center" width="70"></el-table-column>
            <el-table-column label="创建时间" prop="taskCreateTime" align="center" width="100"></el-table-column>
            <el-table-column label="技能值" prop="growthValue" align="center" width="60"></el-table-column>
            <el-table-column label="发布人" prop="publisherName" align="center" width="80"></el-table-column>
            <el-table-column label="操作" prop="" align="center" width="">
              <template slot-scope="scope">
                <span>
                  <el-button v-if="scope.row.taskType === 1" type="text" size="small" @click="$router.push({ path: '/Task/SkillDetail', query: { id: scope.row.id }})">查看</el-button>
                </span>
                <span v-if="scope.row.publisher === getCurrentUid() && scope.row.taskReceiverName === '' && scope.row.taskType === 1 && scope.row.taskStatus === 2">
                  <el-button type="text" size="small" @click="openEditSkill(scope.row.id)">编辑</el-button>
                </span>
                <span v-if="scope.row.publisher === getCurrentUid() && scope.row.taskType === 1 && scope.row.taskStatus === 2">
                  <el-button type="text" size="small" @click="confirmChange(scope.row.id, scope.row.taskType, 1)">启用</el-button>
                </span>
                <span v-if="scope.row.publisher === getCurrentUid() && scope.row.taskType === 1 && scope.row.taskStatus === 1">
                  <el-button type="text" size="small" @click="confirmChange(scope.row.id, scope.row.taskType, 2)">禁用</el-button>
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
      </el-main>
    </el-container>
  </div>
</template>

<script>
import taskServer from '@/apis/task.js';
import ehrServer from '@/apis/ehr.js';
import dayjs from 'dayjs';
//import { getUserinfo } from '@ziroom/zcloud-head';
import RemoteTreeSelect from '@/components/RemoteTreeSelect';
import SkillDialog from '@/components/skill/New.vue'
export default {
  components: {
    RemoteTreeSelect,
    SkillDialog
  },
  watch: {
    selectNodes: {
      deep: true,
      immediate: true,
      handler(newArray, oldArray) {
        console.log(newArray);
        this.releaseTaskFilter.skillTreeIds = newArray.map(node => {
          return node.id;
        })
        this.searchReleaseList()
      }
    }
  },
 data: function() {
    return {
      selectNodes: [],
      releaseTaskFilter: {
        skillPointLevel: '',
        // @daijr
        skillTreeIds: [],
        taskType: 1,
        systemCode: '',
        nameOrNo: '',
        taskStatus: '',
        pageSize: 10,
        pageNumber: 1,
      },
      allTaskStatus: [],
      allTaskFlowStatus: [],
      publisherList: [],
      loading: false,
      releaseTaskList: [],
      total: 0,
      pointLevelList: [],
      moveFormVisible: false,
      // @daijr
      moveForm: {
        id: '',
        root: 'internet',
        domain: 'ios',
        skill: '233'
      },
      showSkillDialog: false,
      editId: 0
    }
  },

  mounted() {
    this.getCurrentUid();
    this.refresh();
    this.getAllTypeChange();
    this.getAllSkillLevel()
  },
  methods: {
    openEditSkill (id) {
      console.log(id);
      this.editId = id
      this.showSkillDialog = true
    },
    openSkillDialog () {
      this.showSkillDialog = true
    },
    closepop () {
      this.showSkillDialog = false
    },
    refresh() {
      this.editId = 0
      this.searchReleaseList();
    },
    handleReleaseSizeChange (val) {
      this.releaseTaskFilter.pageSize = val;
      this.searchReleaseList();
    },
    handleReleaseCurrentChange (val) {
      this.releaseTaskFilter.pageNumber = val;
      this.searchReleaseList();
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
      }).catch(() => {
        this.loading = false;
      });
    },
    getAllTypeChange () {
      taskServer.getAllSkillStatus().then(data => {
        this.allTaskStatus = data.map(s => {
          return {
            label: s.desc,
            value: s.code
          }
        })
      })
    },
    getAllSkillLevel () {
      taskServer.getAllSkillLevel().then(data => {
        console.log(data);
        this.pointLevelList = data.map(s => {
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
        const skillPointList = data.data;
        if (skillPointList) {
          this.releaseTaskList = skillPointList.map(skillPoint => {
            return {
              ...skillPoint,
              taskCreateTime: dayjs(skillPoint.taskCreateTime).format('YYYY-MM-DD HH:mm:ss')
            }
          })
        } else {
          this.releaseTaskList = []
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
    getCurrentUid () {
      // const user = getUserinfo();
      // return user.userInfo.uid
      return '60028724';
    },
  }
}
</script>
<style>
.el-table {
  font-size: 14px;
}
</style>