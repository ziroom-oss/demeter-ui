<template>
  <div>
    <div id="MapSkillTree-StudyList"></div>
    <div
      class="skillPopup"
      @mouseenter="onShowPopupTimeout"
      @mouseleave="onHidePopupTimeout"
      :style="{ display: skillPopup.display, left: skillPopup.left, top: skillPopup.top }"
    >
      <el-card>
        <div slot="header">
          <span>{{ skillPopup.model.name }}</span>
        </div>
        <div>
          <p class="skill-text">职务等级：{{ 'T' + skillPopup.model.jobLevel }}</p>
          <p class="skill-text">技能等级：{{ skillPopup.model.skillLevel | skillLevelFilter }}</p>
          <p class="skill-text">技能奖励：{{ skillPopup.model.skillReward }}</p>
        </div>
        <div>
          <el-button size="mini" type="text" @click="$router.push({ path: '/TaskManagement/SkillDetail', query: { id: skillPopup.model.skillTaskId }})">详情</el-button>
          <!-- <el-button size="mini" type="text" @click="open('/#/TaskManagement/SkillDetail?id=' + skillPopup.model.skillTaskId)">详情</el-button> -->
          <el-button size="mini" type="text" @click="add(skillPopup.model)">添加学习路径</el-button>
          <el-button size="mini" type="text" @click="remove(skillPopup.model)">移除本节点</el-button>
          <el-button size="mini" type="text" @click="skillPopup.display = 'none'">关闭</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
/**
 * study 提供添加和移除技能点、学习路径的功能
 * 【务必阅读】
 * 当 url 携带参数 query.id 则是编辑模式，对学习清单增删技能节点和学习路径都是远程操作的
 * 普通模式下是没有远程操作，除了提交整棵编辑完整的学习清单
 */
import { cloneDeep } from 'lodash-es';
import GraphTree from './GraphTree/index';
import treeServer from '@/apis/tree';
import taskServer from '@/apis/task';

export default {
  props: {
    userId: {
      type: String,
      default: function() {
        const user = this.$store.state.permission?.userinfo;
        return user.uid;
      }
    },
    skillPointModels: {
      type: Array,
      default: function() {
        return [];
      }
    },
    studyPaths: {
      type: Array,
      default: function() {
        return [];
      }
    },
    name: {
      type: String,
      default: function() {
        return '学习清单预览';
      }
    }
  },
  filters: {
    skillLevelFilter (value) {
      const map = {
        1: '初级',
        2: '中级',
        3: '高级',
      };
      return map[value];
    }
  },
  data() {
    return {
      skillPopup: {
        display: 'none',
        left: 0,
        top: 0,
        model: {},
      },
      timer: null,
      graphTree: null, // 本组件 graphTree 自行管理，别的组件放在 mixin.js
      treeNodes: null,
      cacheStudyPaths: [], // 存放学习路径的数组对象
    }
  },
  watch: {
    skillPointModels: {
      deep: true,
      handler: function(value) {
        if (!this.graphTree) {
          this.graphTree = new GraphTree({
            mount: '#MapSkillTree-StudyList'
          })
        }
        this.startRender(value);
      }
    },
    studyPaths: {
      deep: true,
      handler: function(value) {
        if (value.length > 0) {
          this.cacheStudyPaths = cloneDeep(value);
        }
      }
    }
  },
  methods: {
    async startRender(skillPointModels) {
      if (!this.treeNodes) {
        this.treeNodes = await treeServer.getAllNodes();
      }
      // 检查 cacheStudyPaths 当其中的 parentId 是 skillPointModels 的 skillTaskId 时则放到它的 children []
      const source = cloneDeep(skillPointModels);
      this.cacheStudyPaths.forEach(csp => {
        source.forEach(spm => {
          if (csp.parentId === spm.skillTaskId) {
            if (!spm.children) {
              spm.children = [];
            }
            spm.children.push(csp);
          }
        })
      })
      this.graphTree.setState({ name: this.name, nodes: this.treeNodes, source });
      this.graphTree.onEvent('nodeClick:query', (evt) => {
        const model = evt.item.get('model');
        this.skillPopup = {
          display: 'block',
          left: evt.clientX + 'px',
          top: evt.clientY - 150 + 'px',
          model,
          evt,
        }
      });
      this.graphTree.onEvent('nodeClick:remove', evt => {
        this.$confirm('确认移除该学习路径吗？')
          .then(() => {
            const model = evt.item.get('model');
            const index = this.cacheStudyPaths.findIndex(item => item.id === model.id);
            this.cacheStudyPaths.splice(index, 1);
            const parent = evt.item.get('parent');
            evt.currentTarget.updateItem(parent, {
              children: (parent.get('model').children || []).filter((e) => e.id !== model.id),
            });
            evt.currentTarget.layout(false);
            // 如果 url 带有 id 参数则判断是通过远程数据的移除
            if (this.$route.query.id && !model.id.includes('Local')) {
              taskServer.deleteManifestSkillLearnPath(model.id).then(res => {
                this.$message.success('移除学习路径：' + model.name);
              }).catch(err => {
                this.$message.error('移除学习路径失败');
              })
            }
            // if (this.$route.query.id) {
            //   taskServer.deleteManifestSkill()
            // }
          })
      })
    },
    onShowPopupTimeout() {
      clearTimeout(this.timer);
    },
    onHidePopupTimeout() {
      this.timer = setTimeout(() => {
        this.skillPopup.display = 'none';
      }, 2000);
    },
    open(url) {
      window.open(url);
    },
    add(parentModel) {
      const name = window.prompt("请输入学习清单名称");
      const evt = this.skillPopup.evt;
      if (name) {
        const newId =
          parentModel.id +
          '-' + 'Local' + '-' +
          (((parentModel.children || []).reduce((a, b) => {
              const num = Number(b.id.split('-').pop());
              return a < num ? num : a;
            }, 0) || 0) +
            1);

        const studyPath = {
          id: newId,
          direction: newId.charCodeAt(newId.length - 1) % 2 === 0 ? 'right' : 'left',
          name,
          type: 'dice-mind-map-leaf',
          color: parentModel.color || 'orange',
          parentId: parentModel.skillTaskId,
          isDynamicLeaf: true, // 动态添加的标识，因此可以动态移除
          taskUserId: parentModel.taskUserId,
        };
        evt.currentTarget.updateItem(evt.item, cloneDeep({children: (parentModel.children || []).concat([studyPath])}));
        evt.currentTarget.layout(false);

        // 当 url 带有 id 参数视作编辑已存在的学习清单
        if (this.$route.query.id) {
          const { taskUserId, parentId, name } = studyPath;
          taskServer.createSkillLearnPath(taskUserId, parentId, name).then(res => {
            this.$message.success('创建学习路径成功 ' + name);
            studyPath.id = res;
            this.cacheStudyPaths.push(studyPath);
          }).catch(error => {
            this.$message.error(error.message + '： 创建失败');
          })
        } else {
          this.cacheStudyPaths.push(studyPath);
        }
      }
    },
    remove(model) {
      this.$confirm('本操作将移除节点：' + model.name + '和为它添加的学习路径')
        .then(() => {
          // 清空该节点属下的所有学习路径
          this.cacheStudyPaths = this.cacheStudyPaths.filter(path => {
            return path.parentId !== model.skillTaskId;
          });
          // 因为本组件的技能点数据是外部传入的（也必须如此）因此删除节点操作必须交由外部组件处理
          this.$emit('remove', model);
        })
    },
    getSkillPoints() {
      return this.skillPointModels;
    },
    getStudyPaths() {
      return this.cacheStudyPaths;
    }
  }
}
</script>

<style scoped>
#MapSkillTree-StudyList {
  height: 500px;
}
.skillPopup {
  z-index: 99;
  position: fixed;
  width: 320px;
}
.skillPopup .skill-text {
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 0;
}
</style>