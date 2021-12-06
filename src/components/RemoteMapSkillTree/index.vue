<template>
  <div class="container" v-loading="loading">
    
    <div v-bind:id="mapTree"></div>
    
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
          <el-button size="mini" type="text" @click="remove(skillPopup.model)" v-if="canRemove">移除</el-button>
          <el-button size="mini" type="text" @click="detail('/#/Task/SkillDetail?id=' + skillPopup.model.skillTaskId)">查看详情</el-button>
          <el-button size="mini" type="text" @click="skillPopup.display = 'none'">关闭</el-button>
          <el-button size="mini" type="text" @click="addToStudyList(skillPopup.model)" v-if="canAddStudy">添加到学习清单</el-button>
          <el-button size="mini" type="text" @click="addToStudyPath(skillPopup.model)" v-if="canAddStudy">添加学习路径</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import map from '@/apis/map.js';
import mapSkill from '@/apis/mapSkill.js';
import tree from '@/apis/tree.js';
import G6 from '@antv/g6';
import { buildTreeByNodes, graphInit, registerNode, dataTransform } from './index.js';
import { cloneDeep } from 'lodash-es';
import skillPointServer from '@/apis/skill.js';
//import { getUserinfo } from '@ziroom/zcloud-head';
const echarts = require('echarts/lib/echarts');

export default {
  props: {
    mapTree: {
      type: String,
      default: function(){
        return 'mapTree'
      }
    }
  },
  data() {
    return {
      loading: false,
      graph: null,
      mapSkillTree: null,

      // 缓存，用于优化性能
      mapId: null,
      mapInfo: {},
      mapSkills: null,
      jobLevel: null,
      treeNodes: null,
      skillPopup: {
        display: 'none',
        left: 0,
        top: 0,
        model: {},
        evt: null,
        item: null,
      },
      canRemove: false,
      canAddStudy: false,
      timer: null,
      //Map
      skillPaths: {},
    };
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
 
  mounted () {
  },
  methods: {
    //添加学习路径，即添加子节点
    addToStudyPath(model){
      const name = window.prompt("请输入学习清单名称");
      const evt = this.skillPopup.evt;
      if (name) {
        const newId =
          model.id +
          '-' +
          (((model.children || []).reduce((a, b) => {
              const num = Number(b.id.split('-').pop());
              return a < num ? num : a;
            }, 0) || 0) +
            1);
        evt.currentTarget.updateItem(evt.item, {
          children: (model.children || []).concat([{
            id: newId,
            direction: newId.charCodeAt(newId.length - 1) % 2 === 0 ? 'right' : 'left',
            name,
            type: 'dice-mind-map-leaf',
            color: model.color || 'orange',
            memo: 'study-path',
          }, ]),
        });
        evt.currentTarget.layout(false);

        /**
         * 组合新创建的学习路径 map<skillTaskId, string[]> 结构
         * 每次 emit 完整的结构出去
         */
        const { skillTaskId } = model;
        if (!this.skillPaths[skillTaskId]) {
          this.skillPaths[skillTaskId] = [];
        }
        this.skillPaths[skillTaskId].push(name);
        console.log(this.skillPaths);
        this.$emit('addToStudyPath', this.skillPaths);
      }
    },
    /**
     * 返回当前图形实例
     * 一般提供外部调用例如 this.$refs[name].getThisGrpah() 并且可能需要检查返回的是否 null
     */
    getThisGraph () {
      return this.graph;
    },
    /**
     * mapName 可选，如果传了则不请求本图谱信息
     * mapId 和 mapSkills 至少传一个，如果没有传 mapSkills 则使用 mapId 请求本图谱关联的技能点列表
     * jobLevel[] 可选职务等级，用于筛选
     * mapSkills[] 图谱技能点对象，关键属性 { skillName, jobLevel, id, skillMapId, skillTaskId, skillTreeId  }
     * refresh 是否阻止对 mapId 已存在的判断
     * @param isFinished 技能点显示 完成 等状态
     * @param mapId 图谱 id，必传
     * @param mapName 图谱名称，可选
     * @param jobLevel 用于外部做职级筛选，可选
     * @param mapSkills 外部传入技能点数据，不在内部请求，可选
     * @param userid 用于查询技能点的用户认领状态，如果有传入该值，则查询该用户的认领状态。默认查询登录用户的
     */
    async getRemoteData({ mapName, mapId, jobLevel, mapSkills, isFinished, userid}) {
      // mapId 必传值
      this.mapId = mapId;

      // treeNodes 是通用数据，仅需要做好缓存即可
      if (!this.treeNodes) {
        const treeNodes = await tree.getAllNodes(); //返回所有节点数据
        if (!treeNodes || treeNodes.length < 1) {
          return this.$message.warning('获取技能树节点失败');
        }
        this.treeNodes = treeNodes;
      }

      // 当从外部传入 mapSkills 时使用父级组件数据
      // 如果没有外部数据，则使用 mapId 请求远程数据
      if (mapSkills) {
        this.mapSkills = mapSkills;
      } else {
        if (!this.mapId) return this.$message.warning('mapId 和 mapSkills 必须至少传入一个');
        this.mapSkills = await mapSkill.getMapSkillTreeByMapId(this.mapId);
      }
      
      if (!this.mapSkills || this.mapSkills.length < 1) {
        return this.$message.warning('图谱技能点空，无需渲染技能树');
      }

      // 如果已经传入 mapName 则无需请求图谱数据，因为当前仅用到图谱的名称
      if (!mapName) {
        const mapInfo = await map.get(mapId);
        this.mapInfo.name = (mapInfo && mapInfo.name) || '不存在的图谱名称';
      } else {
        this.mapInfo.name = mapName;
      }

      // 过滤 jobLevel 数据，jobLevel 是一个数组
      if (jobLevel && !Array.isArray(jobLevel)) {
        return this.$message.warning('若使用 jobLevel 请传入 Array<Number> 类型的 jobLevel');
      }
      this.jobLevel = jobLevel;
      // 避免修改父级传入的 mapSkills，在这里需要深拷贝，
      let mapSkillsClone = cloneDeep(this.mapSkills);
      if (this.jobLevel && this.jobLevel.length > 0) {
        mapSkillsClone = mapSkillsClone.filter(skill => this.jobLevel.includes(skill.jobLevel));
      }
      if (mapSkillsClone.length < 1) {
        return false;
      }

      // ------点亮逻辑-----------
      // @daijk this.mapSkills 是一个包含 skillTaskId 的数组对象，用这个值查询登陆用户该技能的认证状态
      // 如果某个技能点已认证，则按 skillTaskId 将其认证状态 isFinished 设置到 this.mapSkills
      if (isFinished) {
        // mapSkillsClone.forEach(async ms => {
        //   // 在这里按 skillTaskId 请求每个 task 的认证状态
        //   const res = await task.isFinished?(ms.skillTaskId);
        //   ms.isFinished = true; // = isFinisheds
        //   ms.status = res.skillStatus;
        // });
        // 模拟代码，假设点亮第一个
        // mapSkillsClone[0].isFinished = true;
        // mapSkillsClone[0].进行中 = true;
        // console.log(mapSkillsClone);
        const skillIds = mapSkillsClone.map(i => i.skillTaskId);
        const uid = (!userid) ? getUserinfo().userInfo.uid : userid;
        await skillPointServer.batchQuery({
          skillIds: skillIds,
          uid,
        }).then(res => {
          res.forEach(item => {
            mapSkillsClone.forEach(ms => {
              if (ms.skillTaskId === item.taskId && item.taskStatus > 0) {
                ms.isFinished = true;
                ms.status = item.taskStatus;
              }
            })
          })
        })
      }
      // -------------点亮逻辑-end---------------

      // 从一维的节点数据生成嵌套数据，并且仅包含末端叶子节点（mapSkills）的一系列节点
      // 深拷贝 treeNodes 是因为以下方法会修改它，需要保存一份干净的原数据
      const mapSkillTree = buildTreeByNodes(cloneDeep(this.treeNodes), mapSkillsClone);
      // 获取该 map 的信息并放置到顶级节点用于展示
      mapSkillTree.name = this.mapInfo.name;
      return mapSkillTree;
    },
    destroy() {
      if (this.graph) {
        this.graph.destroy();
        this.graph = null;
      }
    },
    
    // 绘制主逻辑
    /**
     * @param canRemove 是否允许删除节点操作
     * @param canAddStudy 是否允许添加学习路径和学习清单
     * @param ...params 剩余参数
     */
    async render({ canRemove, canAddStudy, ...params }) {
      // 移除前一个渲染好的图形
      this.destroy();
      this.loading = true;
      // 是否开启可移除功能
      this.canRemove = canRemove;
      // 是否开启可添加到学习清单的功能
      this.canAddStudy = canAddStudy;
      // 获取远程数据并处理，返回符合格式的数据
      const remoteData = await this.getRemoteData(params);
      if (!remoteData) {
        this.loading = false;
        return false;
      }
      // 注册自定义的节点类型
      registerNode();
      // 开始渲染
      const container = document.getElementById(this.mapTree);
      const width = container.scrollWidth;
      const height = container.scrollHeight || 500;
      const settings = { container, width, height };
      const graph = graphInit({ ...settings });
      this.graph = graph;
      // 仅使用根节点
      G6.Util.traverseTree(remoteData, function (item) {
        item.id = String(item.id);
      });

      graph.on('node:click', evt => {
        // 被点击的项移动到画布中点
        const item = evt.item;
        const name = evt.target.get('action');
        const model = item.get('model');
        switch(name) {
          case 'query':
            this.skillPopup = {
              display: 'block',
              left: evt.clientX + 'px',
              top: evt.clientY - 150 + 'px',
              model,
              item,
              evt,
            };
            break;
          default:
            return;
        }
      })
      graph.data(dataTransform(remoteData));
      graph.render();
      // 移动到视窗中心并放大1.2倍
      graph.fitCenter();
      graph.zoomTo(1);
      this.loading = false;
      if (typeof window !== 'undefined') {
        window.onresize = () => {
          if (!graph || graph.get('destroyed')) return;
          if (!container || !container.scrollWidth || !container.scrollHeight) return;
          graph.changeSize(container.scrollWidth, container.scrollHeight);
        };
      }
    },
    remove(skill) {
      this.$emit('remove', skill);
    },
    addToStudyList(model){
      this.$emit('addToStudyList', cloneDeep(model));
    },
    onShowPopupTimeout() {
      clearTimeout(this.timer);
    },
    onHidePopupTimeout() {
      this.timer = setTimeout(() => {
        this.skillPopup.display = 'none';
      }, 2000);
    },
    detail(path) {
      window.open(location.origin + path);
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
#mapTree {
  width: 100%;
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
