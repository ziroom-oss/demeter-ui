<template>
  <div>
    <p style="font-weight: bold; font-size: 18px">员工列表</p>
    <div>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-date-picker
            v-model="listFilter.daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small">
          </el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="listFilter.deptNo"
            placeholder="选择部门"
            size="small">
            <el-option
              v-for="item in []"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="listFilter.jobNo"
            placeholder="选择职务"
            size="small">
            <el-option
              v-for="item in []"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" style="margin-left: 10px">
          <el-button type="primary" size="small" @click="query">查询</el-button>
        </el-col>
      </el-row>
      <div>
        <el-table :data="employeeList" style="width: 100%">
          <el-table-column label="姓名" prop="name" align="center"></el-table-column>
          <el-table-column label="职务" prop="jobName" align="center"></el-table-column>
          <el-table-column label="技能值" prop="skillValue" align="center" sortable></el-table-column>
          <el-table-column label="技能点完成数" prop="skillTaskCount" align="center" sortable></el-table-column>
          <el-table-column label="认证技能数量" prop="skillCount" align="center" sortable></el-table-column>
          <el-table-column label="认证技能图谱数量" prop="graphCount" align="center" sortable></el-table-column>
        </el-table>
      </div>
      <div class="block" style="float: right; margin-top: 20px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size.sync="listFilter.pageSize"
          :current-page.sync="listFilter.pageNumber"
          :page-sizes="[5, 10, 30, 50]"
          layout="total, sizes, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { RouteConfig, Component, Vue } from '@ziroom/cherry2-decorator';
import portraitServer from '@/apis/portrait.js';
import authServer from '@/apis/authorize.js';
@Component({
  mounted () {
    this.getEmployeeList()
    this.getCurrentRole()
  },
  data () {
    return {
      listFilter: {
        daterange: [],
        deptNo: '',
        jobNo: '',
        pageSize: 0,
        pageNumber: 1,
      },
      employeeList: [],
      total: 0,
      roles: [],
    }
  },
  methods: {
    getCurrentRole () {
      authServer.getAuthorize().then(data => {
        this.roles = data.roles;
      })
    },
    refresh () {
      this.getEmployeeList();
    },
    query () {
      this.getEmployeeList();
    },
    getEmployeeList () {
      const params = {
        startTime: this.listFilter.daterange[0],
        endTime: this.listFilter.daterange[0],
        // deptNo: this.listFilter.deptNo,
        deptNo: '100372',
        jobNo: this.listFilter.jobNo,
      }
      portraitServer.getEmployeeList(params).then(data => {
        this.employeeList = data;
      })
    },
    handleSizeChange (val) {

    },
    handleCurrentChange (val) {

    }
  }
})
@RouteConfig({
  layout: true,
  name: 'EmployeeList',
  title: '员工列表',
  role: ['demeter-super-admin', 'demeter-dept-admin'],
})
export default class App extends Vue {
}
</script>
