<template>
  <div style="width: 100%; height: 300px;">
    <RemoteSkillMapSkillTree ref="mapSkillsTree" :mapTree="mapTreepreview" v-model="selectNodes" />
  </div>  
</template>

<script>
import RemoteJobsSelect from '@/components/RemoteJobsSelect';
import RemoteTreeSelect from '@/components/RemoteTreeSelect';
import RemoteSkillMapSkillTree from '@/components/RemoteMapSkillTree/index.vue';
import map from '@/apis/map.js';
import skillPointServer from '@/apis/skill.js';

export default {
 components: {
    RemoteJobsSelect,
    RemoteTreeSelect,
    RemoteSkillMapSkillTree,
  },
  props: {
    skillmodel: {
      type: Object,
      default() {
        return
      }
    },
  },
  
  data() {
      return{
        //skillmodels: this.skillmodel,//父组件传过来的值
        mapTreepreview: 'mapTreepreview',
        skillMapId: '',
        //选中的技能树节点列表
        selectNodes: [],
        skillPoints: [],
        //根据当前技能点列表和当前技能图谱查询的关联数据列表
        mapSkills: [],
        // 图谱树预览窗口
        showMapSkillsTree: false
      }
  },
  watch: {
    //监控传入的技能点
    skillmodel: {
      handler(value) {
        if (!value) {
          return;
        }
        this.addSkill(value);
      }
      
    },
    selectNodes: {
      deep: true,
      async handler(newArray) {
        // 以下逻辑的顺序大概是：
        // 从技能树节点筛选出选中的节点 id
        // 批量请求节点 id 关联的技能点
        // 从技能点中筛选出技能点 id
        // 批量请求技能点 id 关联技能图谱的记录
        // 将关联记录中的数据放到对应 id 的技能点列表中
        const params = newArray.map((node) => {
          return node.id;
        });
        if (params.length < 1) {
          this.skillPoints = [];
          return;
        }
        const skillPointsSource = await skillPointServer.querySkillPoint(
          params
        );
        const skillPoints = Object.values(skillPointsSource).reduce(
          (accu, curr) => {
            accu = accu.concat(curr);
            return accu;
          },
          []
        );
        skillPoints.forEach((sp) => {
          // 设置 skillTreeId 为了在预览中找到它的父节点（所有技能点的父节点都是技能节点）
          sp.skillTreeId = sp.skillId;
          sp.skillName = sp.taskName;
          sp.jobLevel = 1;
        });

        if (!this.skillMapId) {
          return (this.skillPoints = skillPoints);
        }

        const skillTaskIds = skillPoints.map((item) => item.id);
        const mapSkills = await map.listMapSkillsByMapId(this.skillMapId, {
          skillTaskIds,
        });
        skillPoints.forEach((sp) => {
          mapSkills.forEach((r) => {
            if (r.skillTaskId === sp.id) {
              sp.mapSkillId = r.id;
              sp.skillMapId = r.skillMapId; // 拥有 skillMapId 值即该技能点已被保存到该棵技能树
              sp.jobLevel = r.jobLevel;
            }
          });
        });
        this.skillPoints = skillPoints;
      },
    },
    
  },
  async mounted() {
   
  },

  methods: {
    addSkill(row) {     
      if (!row.name) {
        return this.$message.warning('请先添加学习清单名称');
      }
      const isRepeat = this.mapSkills.some((ms) => ms.skillTaskId === row.id);
      if (!isRepeat) {
        // 远程获取的技能点列表没有 skillTaskId 字段，在压入 mapSkills 需要定义，方便上述的 isRepeat 检查
        row.skillTaskId = row.id;
        this.mapSkills.push(row);
        this.$message.success(`已选择技能点 ${row.skillName}`);
      } else {
        return this.$message.warning(`技能点 ${row.skillName} 已存在`);
      }
      this.$refs.mapSkillsTree.render({
        canRemove: true,
        mapName: row.name,
        mapId: this.skillMapId,
        mapSkills: this.mapSkills,
        isFinished: false,
      });
    },
  },

}
</script>
