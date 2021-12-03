<template>
  <div>
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText"
      size="mini"
      style="margin-bottom: 20px"
    >
    </el-input>

    <div :style="'max-height:' + maxHeight + ';overflow: auto'">
      <el-tree
        class="filter-tree"
        :data="tree"
        :props="defaultProps"
        show-checkbox
        @node-click="handleNodeClick"
        node-key="id"
        default-expand-all
        
        @check-change="handleCheckChange"
        :filter-node-method="filterNode"
        ref="tree">
      </el-tree>
    </div>

  </div>
</template>

<script>
import tree from '@/apis/tree.js';
export default {
  model: {
    prop: 'selects',
    event: 'change'
  },
  props: {
    maxHeight: {
      type: String,
      default: '800px'
    },
    selects: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data() {
    return {
      tree: [],
      treeMemo: {},
      selectsMemo: {},
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      times: null,
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.getNodes();
  },
  methods: {
    handleNodeClick (data) {
      const index = this.selects.findIndex(d => d.id === data.id);
      if (index > -1) {
        this.$refs.tree.setChecked(data, false)
      } else {
        this.$refs.tree.setChecked(data, true)
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getNodes() {
      tree.getAllNodes().then(res => {
        this.buildTreeByNodes(res);
      })
    },
    /**
     * 构建层次结构的树
     */
    buildTreeByNodes(nodes) {
      const memo = this.treeMemo;
      nodes.forEach(node => {
        if (!memo[node.id]) {
          node.saved = true;
          this.$set(memo, node.id, node);
          this.$set(node, 'children', []);
        }
      });
      nodes.forEach(node => {
        if (memo[node.parentId]) {
          memo[node.parentId].children.push(node);
        }
      });
      // 仅使用 rootNode 即可
      this.tree.push(memo[100000]);
    },
    handleCheckChange(data, checked, indeterminate) {
      const { id, children } = data;
      // 仅允许选择最末端的节点，即没有子节点的叶子节点
      if (children.length > 0) return;
      if (checked) {
        this.selectsMemo[id] = data;
      } else {
        delete this.selectsMemo[id];
      }
      // 如果选择父节点，该组件的 checkChange 事件会触发多次，限定到一段时间内仅触发一次
      if (this.times) {
        clearInterval(this.times);
      }
      this.times = setTimeout(() => {
        this.$emit('change', Object.values(this.selectsMemo).map(s => s));
      }, 300);
    },
  },
};
</script>