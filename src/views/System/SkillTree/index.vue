<template>
  <div>
    <el-card header="技能树">
      <el-tree
        class="custom-tree"
        :data="tree"
        node-key="id"
        :expand-on-click-node="false"
         empty-text="待补充"
         label="name"
        :default-expanded-keys="expandKeys"
        :render-content="renderContent">
      </el-tree>
    </el-card>
  </div>
</template>

<script>
import tree from '@/apis/tree.js';
import { Input, Button } from 'element-ui';
import { pick } from 'lodash-es';

export default {
   data: function() {
    return {
        tree : [],
        treeMemo : {},
        expandKeys : [],
    }
   },
 
  mounted() {
    this.getNodes();
  },

  methods: {
    renderContent(h, { node, data, store }) {
      return h('div',{ class: { 'custom-tree-node': true } }, [h('span',{ class: { 'tree-node-name': true } },
                                                             [h(Input,{ props: {
                                                                            value: data.name,
                                                                            size: 'small', },
                                                                          on: {input: value => {
                                                                                  data.saved = false;
                                                                                  data.name = value;
                                                                                }
                                                                              }
                                                                       }
                                                                )
                                                              ]
                                                                 ),
                                                            this.renderOperation(h, node, data),
                                                              ]
              )
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
    //仅使用 rootNode 即可
    this.tree.push(memo[100000]);
  },

  /**
   * 首先必须加载根节点，根节点有并且仅有一个
   */
  getNodes() {
    tree.getAllNodes().then(res => {
      this.expandKeys = [100000]
      this.buildTreeByNodes(res);
    })
  },

  /**
   * 平级添加子节点
   */
  append(node, data) {
    // saved 用于识别数据是否完成保存
    // parentId 是其父级 id，用于保存数据
    if (!data.saved) {
      return this.$message({
        message: '请先保存数据',
        type: 'warning',
      })
    }
    console.info(node);
    let id = '';
    if (node.childNodes < 1) {
      id = node.id++;
    } else {
      const children = node.childNodes;
      const lastChild = children[children.length - 1];
      id = lastChild.id++;
    }

    const child = { id, name: '', saved: false, parentId: data.id };
    data.children.push(child);
    this.$set(child, 'children', []);
  },

  /**
   * 移除节点
   */
  remove({ id, name, children }) {
    // 直接修改节点中 data 数据会导致丢失 parent 属性
    // 因此采用递归 tree 找到对应节点修改解决问题
    if (children.length > 0) {
      return this.$message({
        message: '请先删除该节点属下的所有子节点，才能删除该节点',
        type: 'warning'
      });
    }
    const parent = this.findTreeNodeParent(id);
    this.$confirm(`确认删除该节点吗：${name}`, '提示')
      .then(() => {
        if (parent) {
          if (id < 100000) {
            return removeNodeCommon();
          }
          tree.delete(id).then(() => {
            removeNodeCommon();
            this.$message.success('删除成功');
          })
        }
      })
    function removeNodeCommon() {
      const index = parent.children.findIndex(child => child.id === id);
      parent.children.splice(index, 1);
    }
  },

  findTreeNodeParent(id) {
    let result = null;
    function recurive(node) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.id === id) {
          result = node;
          break;
        }
        if (child.children && child.children.length > 0) {
          recurive(child);
        }
      }
    }
    recurive(this.tree[0]);
    return result;
  },

  /**
   * 创建新节点
   */
  save(node, data) {
    // 检查 submit 对象是否包含具体的 id 值
    if (data.id && data.id >= 100000) {
      return this.update(data.id, data);
    }
    tree.create(pick(data, ['name', 'parentId'])).then(res => {
      data.saved = true;
      data.id = res;
      this.$message.success('保存节点成功');
    })
  },

  /**
   * 更新节点
   */
  update(id, node) {
    tree.update(id, pick(node, ['name', 'parentId', 'id'])).then(res => {
      node.saved = true;
      this.$message.success(`节点 ${node.name} 更新成功`);
    })
  },

  /**
   * 不同状态、层级的节点渲染不同的操作按钮
   * id:100000 是根节点
   */
  renderOperation(h, node, data) {
    let operations = [];
    if (data.id !== 100000) {
      operations = operations.concat([
        h(
          Button,
          { props: { size: 'small', type: 'text' }, on: { click: () => { this.remove(data) } } },
          ['删除']
        ),
      ]);
    }
    operations = operations.concat([
      h(
        Button,
        { props: { size: 'small', type: 'text' }, on: { click: () => { this.append(node, data) } } },
        ['添加子技能']
      ),
    ]);
    // 如果数据没有保存则渲染保存按钮
    if (!data.saved) {
      operations.push(
        h(
          Button,
          { props: { size: 'small', type: 'text' }, on: { click: () => { this.save(node, data) } } },
          ['保存']
        )
      )
    }
    const element = h(
      'span',
      { class: { 'tree-node-operation': true } },
      operations,
    );
    return element;
  }
  }
  
}
</script>

<style lang="scss">
.custom-tree-node {
  width: 280px;
  .tree-node-name {
    margin-right: 16px;
  }
}
.custom-tree {
  .el-tree-node__content {
    height: 42px;
  }
}
</style>
