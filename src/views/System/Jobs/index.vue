<template>
  <div>
    <a-card>
      <a-button class="editable-add-btn" @click="addRecord">
        添加
      </a-button>
      <a-table :pagination="false" bordered :data-source="dataSource" :columns="columns" size="small">
        <template slot="name" slot-scope="text, record">
          <a-input v-model="record.name" size="small"/>
        </template>
        <template slot="code" slot-scope="text, record">
          <a-input v-model="record.code" size="small" type="number" />
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-button size="small" @click="updateRecord(record)">更 新</a-button>
          <a-popconfirm
            v-if="dataSource.length"
            title="确认删除吗？"
            @confirm="() => deleteRecord(record)"
          >
            <a-button size="small">删 除</a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import { RouteConfig, Component, Vue } from '@ziroom/cherry2-decorator';
import jobs from '@/apis/jobs';
@Component({
  components: {
  },
  watch: {
    dataSource: {
      deep: true,
      handler: function(value) {
        value.forEach((v, i) => {
          v.i = i;
        })
      }
    }
  }
})
@RouteConfig({
  layout: true,
  name: 'JobsManagement',
  title: '职务管理',
})
export default class App extends Vue {
  data () {
    return {
      count: 0,
      dataSource: [
      ],
      columns: [
        {
          title: '职务编码',
          dataIndex: 'name',
          width: '30%',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '职务编号',
          dataIndex: 'code',
          width: '30%',
          scopedSlots: { customRender: 'code' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
        },
      ],
    }
  }
  mounted() {
    jobs.listAll().then(res => {
      this.dataSource = res;
    });
  }
  updateRecord(record) {
    if (record.id) {
      jobs.update(record).then(() => {
        this.$message.success('更新成功')
      })
    } else {
      jobs.create(record).then((res) => {
        record.id = res;
        this.$message.success('添加成功');
      })
    }
  }
  deleteRecord(record) {
    const del = (i) => {
      const dataSource = [...this.dataSource];
      this.dataSource = dataSource.filter(item => item.i !== i);
    }
    if (!record.id) {
      return del(record.i);
    }
    jobs.delete(record.id).then(() => {
      del(record.i);
    });
  }
  addRecord() {
    const { dataSource } = this;
    const newData = {
      name: '请填写职务名称',
      code: 0,
    };
    this.dataSource = [...dataSource, newData];
  }

}
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
