import mapServer from '@/apis/map';
import treeServer from '@/apis/tree';
import skillPointServer from '@/apis/skill.js';
import GraphTree from './GraphTree/index';

export default {
  data() {
    return {
      mapSkills: null,
      treeNodes: null,
      isSavingPicture: false,
      graphZoomOrigin: null,
      graphTree: null,
      mapSelect: {
        mapId: '',
        jobLevel: '',
      },
    }
  },
  watch: {
    'mapSelect': {
      handler: function(value) {
        if (value) {
          if (!this.graphTree) {
            this.graphTree = new GraphTree({ mount: '#MapSkillTree-Preview' });
          }
          this.updateRender(value);
        }
      },
      deep: true,
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
  methods: {
    saveToPng() {
      const graph = this.graphTree.getGraph();
      if (!graph) {
        return this.$message.warning('技能图谱不存在，请先选择职务');
      }
      this.isSavingPicture = true;
      this.graphZoomOrigin = graph.getZoom();
      graph.zoomTo(1.3);
      graph.downloadFullImage(this.mapSelect.mapId, 'image/png');
      setTimeout(() => {
        graph.zoomTo(this.graphZoomOrigin);
        graph.fitCenter();
        this.isSavingPicture = false;
      }, 2500);
    },
    async getRemoteData (mapId, jobLevel) {
      if (mapId) {
        const mapInfo = await mapServer.get(mapId);
        const treeNodes = await this.getAllNodes();
        let mapSkills = await this.getMapSkillsByMapId(mapId);
        // 等级筛选
        if (jobLevel && Array.isArray(jobLevel)) {
          mapSkills = mapSkills.filter(skill => {
            return jobLevel.includes(skill.jobLevel);
          });
        }
        // 按用户查询每一个 mapSkill 根据返回结果添加 taskStatus
        let batchedMapSkills = await this.batchMapSkills(mapSkills);
        return Promise.resolve({ name: mapInfo.name, nodes: treeNodes, source: batchedMapSkills });
      }
    },
    // 拆分 mapSkills 查询
    async getMapSkillsByMapId(mapId) {
      this.mapSkills = await mapServer.getMapSkillTreeByMapId(mapId);
      this.traverseMapSkills(this.mapSkills);
      return Promise.resolve(this.mapSkills);
    },
    traverseMapSkills(mapSkills) {
      mapSkills.forEach(ms => {
        ms.name = ms.skillName;
      })
    },
    // 拆分 getAllNodes
    async getAllNodes() {
      if (!this.treeNodes || this.treeNodes.length < 1) {
        this.treeNodes = await treeServer.getAllNodes();
      }
      return Promise.resolve(this.treeNodes);
    },
    // 拆分 mapSkill 任务状态查询和遍历赋值
    async batchMapSkills(mapSkills) {
      const res = await skillPointServer.batchQuery({
        skillIds: mapSkills.map(i => i.skillTaskId),
        uid: this.userId,
      });
      if (!res || res.length < 1) {
        console.info('查询技能点任务状态返回的数据长度小于 1');
        return mapSkills;
      }
      res.forEach(item => {
        mapSkills.forEach(ms => {
          if (ms.skillTaskId === item.taskId) {
            if (item.taskStatus === 4) {
              ms.isFinished = true;
              ms.status = 4;
            } else {
              ms.status = item.taskStatus;
            }
          }
        })
      })
      return mapSkills;
    }
  }
}