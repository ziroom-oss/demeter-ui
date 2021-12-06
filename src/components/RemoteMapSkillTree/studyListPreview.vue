<template>
  <div>
    <div id="MapSkillTree-StudyListPreview"></div>
  </div>
</template>

<script>
/**
 * study 提供添加和移除技能点、学习路径的功能
 */
//import { getUserinfo } from '@ziroom/zcloud-head';
import { cloneDeep } from 'lodash-es';
import GraphTree from './GraphTree/index';
import treeServer from '@/apis/tree';

export default {
  props: {
    userId: {
      type: String,
      default: function() {
        return getUserinfo().userInfo.uid;
      }
    },
    skillPointModels: {
      type: Array,
      default: function() {
        return [];
      }
    },
    name: {
      type: String,
      default: function () {
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
    }
  },
  watch: {
    skillPointModels: {
      deep: true,
      handler: function(value) {
        console.info(value);
        if (!this.graphTree) {
          this.graphTree = new GraphTree({
            mount: '#MapSkillTree-StudyListPreview'
          })
        }
        this.startRender(value);
      }
    },
  },
  methods: {
    async startRender(skillPointModels) {
      if (!this.treeNodes) {
        this.treeNodes = await treeServer.getAllNodes();
      }
      // 检查 cacheStudyPaths 当其中的 parentId 是 skillPointModels 的 skillTaskId 时则放到它的 children []
      const source = cloneDeep(skillPointModels);
      const name = this.name;
      this.graphTree.setState({ name, nodes: this.treeNodes, source });
      this.graphTree.onEvent('nodeClick:query', (evt) => {
        const model = evt.item.get('model');
        this.open('/#/Task/SkillDetail?id=' + model.skillTaskId);
      });
    },
    open(url) {
      window.open(url);
    },
  }
}
</script>

<style scoped>
#MapSkillTree-StudyListPreview {
  height: 100%;
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