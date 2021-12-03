<template>
  <a-table
    :columns="preColumns"
    :data-source="preData"
    :pagination="false"
    :rowClassName="rowClassName"
    bordered
    class="custom-project-table">
  </a-table>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      default: function() {
        return [];
      }
    },
    data: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler: function() {
        this.countMap = {};
        this.data.forEach(item => {
          if (!this.countMap[item.name]) {
            this.countMap[item.name] = 1;
            item.count = 1;
            return;
          }
          this.countMap[item.name] ++;
        })
        this.preData = this.data;
        this.preColumnsHandle();
      }
    },
  },
  data() {
    return {
      preData: [],
      preColumns: [],
      countMap: {},
    };
  },
  methods: {
    rowClassName(record, index) {
      if (index % 2 === 0) {
        return 'custom-bg';
      }
    },
    preColumnsHandle() {
      const customRender = (value, row, index) => {
        const obj = {
          children: value,
          attrs: {
            rowSpan: 0,
          },
        };
        if (this.countMap[value] && this.countMap[value] !== 'completed') {
          obj.attrs.rowSpan = this.countMap[value];
          this.countMap[value] = 'completed';
        }
        return obj;
      };
      this.columns.forEach(col => {
        if (col.dataIndex === 'name') {
          col.customRender = customRender;
        }
      })
      this.preColumns = this.columns;
    }
  }
};
</script>

<style lang="scss">
.custom-project-table {
  .ant-table table {
    border-radius: 8px;
    background-color: rgba(92, 113, 128, 0.04);
  }
  .custom-bg {
    background-color: rgba(92, 113, 128, 0.08);
  }
  .ant-table-thead .ant-table-column-title {
    font-size: 16px;
    font-weight: 600;
  }
  .ant-table-thead > tr:first-child > th:first-child {
    border-top-left-radius: 8px;
  }
  .ant-table-thead > tr:last-child > th:last-child {
    border-top-right-radius: 8px;
  }
  .ant-table-tbody > tr:last-child > td:first-child {
    border-bottom-left-radius: 8px;
  }
  .ant-table-tbody > tr:last-child > td:last-child {
    border-bottom-right-radius: 8px;
  }
  .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 0;
    padding-left: 16px;
  }
  .ant-table-thead {
    height: 40px;
  }
  .ant-table-tbody tr {
    height: 32px;
  }
}
</style>