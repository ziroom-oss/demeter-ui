<template>
  <div>
    <el-container>
      <el-main>
        <div>
          <el-row :gutter="10">
            <el-col :span="5">
              <el-select
                v-model="searchFilter.email"
                placeholder="姓名/工号/邮箱前缀"
                filterable
                remote
                clearable
                :loading="loading"
                :remote-method="queryPeople"
                @change="query"
                size="small"
              >
                <el-option v-for="item in publisherList" :key="item.email" :label="item.name" :value="item.email"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6" style="margin-left: 10px">
              <el-button type="primary" size="small" @click="query">搜索</el-button>
              <el-button size="small" @click="openAddDialog">添加新关联</el-button>
            </el-col>
          </el-row>
          <el-table
            :data="tableData"
            height="600">
            <el-table-column label="序号" prop="id"></el-table-column>
            <el-table-column label="自如企业邮箱" prop="email"></el-table-column>
            <el-table-column label="附属邮箱" prop="subEmail"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteEmail(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>
    <el-dialog
      :visible.sync="addDialogShow"
    >
      <el-form label-width="120px" :model="form">
        <el-form-item label="自如企业邮箱">
          <el-input size="small" v-model="form.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="新添加附属邮箱">
          <el-input size="small" v-model="form.subEmail"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="insertEmail">添加</el-button>
          <el-button size="small" @click="addDialogShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { RouteConfig, Component, Vue } from '@ziroom/cherry2-decorator';
import emailServer from '@/apis/email.js';
import ehrServer from '@/apis/ehr.js';
import dayjs from 'dayjs';
import { getUserinfo } from '@ziroom/zcloud-head';
@Component({
  components: {
  },
  watch: {
  },
  data() {
    return {
      searchFilter: {
        email: '',
      },
      tableData: [],
      loading: false,
      publisherList: [],
      addDialogShow: false,
      form: {
        email: '',
        subEmail: ''
      }
    }
  },
  mounted() {
  },
  methods: {
    deleteEmail (id) {
      emailServer.deleteEmail(id).then(data => {
        console.log(data);
        this.query()
      }).catch(err => {
      })
    },
    insertEmail () {
      const params = {
        email: this.form.email,
        subEmail: this.form.subEmail
      }
      emailServer.insertEmail(params).then(data => {
        console.log(data);
        this.addDialogShow = false
        this.query()
      }).catch(err => {
      })
    },
    openAddDialog () {
      if (!this.searchFilter.email) {
        this.$message({
          message: '请输入邮箱前缀或工号',
          type: 'warning'
        });
        return;
      }
      this.addDialogShow = true;
      this.form.email = this.searchFilter.email
    },
    query () {
      const params = {
        email: this.searchFilter.email,
      }
      emailServer.selectSubEmail(params).then(data => {
        console.log(data);
        this.tableData = data;
      })
    },
    refresh() {
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
    }
  }
})
@RouteConfig({
  layout: true,
  name: 'SkillPointList',
  title: '邮箱管理',
})
export default class App extends Vue {
}
</script>
<style>
.el-table {
  font-size: 14px;
}
</style>