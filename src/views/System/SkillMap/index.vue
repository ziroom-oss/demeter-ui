<template>
  <div>
    <el-card header="技能图谱" style="max-width: 1200px">
      <el-form :inline="true" :model="skillMapListReq" class="demo-form-inline">
        <el-form-item>
          <el-date-picker
            v-model="skillMapListReq.createTimeArea"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable=""
            align="right"
            size="mini">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="skillMapListReq.isEnable" placeholder="选择图谱状态" size="mini" clearable="">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <RemoteJobsSelect v-model="skillMapListReq.jobId" />
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入图谱名称搜索" v-model="skillMapListReq.name" size="mini" clearable=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" size="mini">查询</el-button>
          <el-button type="primary" @click="onCreateMap" size="mini">新建技能图谱</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="技能图谱编号" width="110"></el-table-column>
        <el-table-column prop="name" label="技能图谱名称"></el-table-column>
        <el-table-column prop="jobName" label="适用职务"></el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | timeFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="modifyTime" label="最后更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.modifyTime | timeFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isEnable" label="启用状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.isEnable === 1">启用</span>
            <span v-else>禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="onPreview(scope.row)"><i class="el-icon-video-camera"></i> 预览</el-button>
            <el-button type="text" size="small" v-if="scope.row.isEnable === 1" @click="onEnableGraph(scope.row, 0)">禁用</el-button>
            <el-button type="text" size="small" v-else @click="onEnableGraph(scope.row, 1)">启用</el-button>
            <el-button type="text" size="small" @click="onEditGraph(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="onDeleteGraph(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-cont">
        <el-pagination
          @current-change="onChangePage"
          layout="prev, pager, next"
          :page-size="skillMapListReq.pageSize"
          :current-page="skillMapListReq.pageNumber"
          :total="pageTotal"
        />
      </div>
    </el-card>
    <el-dialog
      :title="previewMapSkillName"
      :visible.sync="previewVisible"
      width="80%"
    >
      <div style="width: 100%; min-height: 480px;">
        <RemoteSkillMapSkillTree ref="mapSkillsTree" />
      </div>
      <span slot="footer">
        <el-button @click="previewVisible = false" size="mini">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import map from '@/apis/map';
import { dateFormatFromTableTime } from '@/common/utils/timeFormat';
import RemoteJobsSelect from '@/components/RemoteJobsSelect';
import RemoteSkillMapSkillTree from '@/components//RemoteMapSkillTree/index.vue';

export default {
  components: {
    RemoteJobsSelect,
    RemoteSkillMapSkillTree,
  },
  filters: {
    timeFormat(value) {
      return dateFormatFromTableTime(value);
    }
  },

   data: function() {
    return {
      tableData : [],
      pageTotal: 0,
      skillMapListReq : {
        createTimeArea: [],
        isEnable: null,
        jobId: '',
        name: '',
        pageNumber: 1,
        pageSize: 10,
      },
      previewVisible : false,
      previewMapSkillName : '',
      pickerOptions : {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
      }
    },

    mounted() {
      this.onSearch();
    },

    methods: {
      onSearch() {
        const { createTimeArea, jobId, name, isEnable, pageSize, pageNumber } = this.skillMapListReq;
        const condition = {};
        if (isEnable === 0 || isEnable === 1) {
          condition.isEnable = isEnable;
        }
        if (jobId) {
          condition.jobId = jobId;
        }
        if (name) {
          condition.name = name;
        }
        if (createTimeArea && createTimeArea.length > 1) {
          condition.createStartTime = createTimeArea[0];
          condition.createEndTime = createTimeArea[1];
        }
        condition.pageSize = pageSize;
        condition.pageNumber = pageNumber;
        map.listByCondition(condition).then(res => {
          this.tableData = res.data;
          this.pageTotal = res.total;
        })
      },
        onCreateMap(id) {
          this.$router.push('/system/SkillMapNew');
        },
        onEnableGraph(row, status) {
          row.isEnable = status;
          map.update(row.id, { isEnable: status }).then(res => {
            this.$message.success('修改启用状态成功');
          })
        },
        onEditGraph(row) {
          this.$router.push({ path: '/system/skillMapNew', query: { id: row.id } });
        },
        onDeleteGraph(row) {
          this.$confirm(`确认删除图谱「${row.name}」吗？`)
            .then(() => {
              map.delete(row.id).then(() => {
                this.$message.success('删除成功');
                this.onSearch();
              })
            }).catch(() => {});
        },
        onChangePage(pageNumber) {
          this.skillMapListReq.pageNumber = pageNumber;
          this.onSearch();
        },
        onPreview(row) {
          this.previewVisible = true;
          this.previewMapSkillName = row.name + '预览';
          this.$nextTick(() => {
            this.$refs.mapSkillsTree.render({ mapId: row.id, isFinished: false });
          });
        }
    },
  
}
</script>

<style lang="scss" scoped>
.page-cont {
  text-align: right;
  margin-top: 16px;
}
</style>
