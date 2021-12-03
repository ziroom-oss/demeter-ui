<template>
  <a-table
      :columns="preColumns"
      :data-source="data"
      class="month-report-table-member"
      :pagination="false"
      bordered
      :rowClassName="rowClassName"
  >
    <span slot="head" slot-scope="head" style="width: 180px">
      <strong style="font-weight: 600; font-size: 16px;">{{head}}</strong>
    </span>
    <div slot="visual" slot-scope="visual" class="visual-grid">
      <div
        v-for="(v, i) in visual"
        :key="$random(10000, 99999) + '' + v"
        class="visual-grid-item"
        :style="linearGradientGenerator(i)"
      >
        {{v.value}}
        <div class="hover-user">
          <div class="user">
            <i class="avatar"></i>
            <p>Kenneth Holland</p>
          </div>
          <div class="code">
            <div class="row">
              <div>
                <p>开发当量</p>
                <p>13,000</p>
              </div>
              <div>
                <p>代码行数</p>
                <p>26,120</p>
              </div>
            </div>
            <div class="row">
              <div>
                <p>代码提交次数</p>
                <p>15</p>
              </div>
              <div>
                <p>发布次数</p>
                <p>3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-table>
</template>

<script>
const colors = [
  ['#7B40E7', '#B274F5'],
  ['#9676ED', '#C7AEF7'],
  ['#A89BF0', '#D3CBF9'],
  ['#BCC1F4', '#DFE2FA']
]
const grids = [
    '92px',
    '48px',
    '38px',
    '29px'
]
export default {
  data() {
    return {
      preColumns: [],
    };
  },
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
    columns: {
      deep: true,
      immediate: true,
      handler: function() {
        this.preColumns = [].concat(
          this.columns.slice(0, 1).map(item => {
            item.width = 180;
            item.scopedSlots = {};
            item.scopedSlots.customRender = 'head';
            return item;
          })
        );
        this.preColumns = this.preColumns.concat(
          this.columns.slice(1).map(item => {
            item.scopedSlots = {};
            item.scopedSlots.customRender = 'visual';
            return item;
          })
        )
      }
    },
  },

  methods: {
    rowClassName(record, index) {
      if (index % 2 === 0) {
        return 'custom-bg';
      }
    },
    linearGradientGenerator(value) {
      const color = colors[value];
      const width = grids[value];
      return `background: linear-gradient(180deg, ${color[0]} 0%, ${color[1]} 100%);width: ${width}`;
    }
  }
};
</script>

<style lang="scss">
.month-report-table-member {
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
    height: 72px;
  }
  .visual-grid {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;
    .visual-grid-item {
      position: relative;
      margin-bottom: 0;
      height: 40px;
      border-radius: 4px;
      margin-right: 2px;
      color: #fff;
      font-size: 12px;
      transition: all .2s ease-in-out;

      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        box-shadow: 0 2px 8px 0 #A16DE9;
        border: 2px solid #fff;

        .hover-user {
          display: block;
        }
        //transform: scale(1.2);
      }
      .hover-user {
        color: #000;
        z-index: 9;
        position: absolute;
        top: 40px;
        left: 0;

        display: none;
        width: 264px;
        height: 188px;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.08);
        border-radius: 8px;

        .user {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: flex-start;
          padding-left: 12px;
          height: 48px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);

          >p {
            margin-bottom: 0;
          }
        }

        .code {
          padding: 5px 5px 5px 12px;
        }

        .code .row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          p {
            margin-bottom: 0;
          }

          > div {
            width: 50%;
          }


          div > p:nth-child(1) {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.64);
            line-height: 28px;
          }

          div > p:nth-child(2) {
            font-size: 24px;
            color: rgba(0, 0, 0, 0.86);
            line-height: 28px;
            margin-bottom: 6px;

            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>


