<template>
  <div>
    <el-card style="max-width: 1200px">
      <el-container direction="vertical">
        <el-card header="编辑基础信息" shadow="never">
          <el-form :label-position="'left'" label-width="120px" style="width: 820px">
            <el-form-item label="技能图谱名称">
              <el-input v-model="skillMapCreateReq.name" size="mini" placeholder="填写技能图谱名称"></el-input>
            </el-form-item>
            <el-form-item label="技能图谱状态">
              <el-radio-group v-model="skillMapCreateReq.isEnable" size="mini">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="适用职务">
              <RemoteJobsSelect v-model="skillMapCreateReq.jobId" />
            </el-form-item>
            <el-form-item label="已选择技能点">
              <div style="width: 100%; height: 300px;">
                <RemoteSkillMapSkillTree ref="mapSkillsTree" @remove="removeSkill" />
              </div>
            </el-form-item>
          </el-form>
        </el-card>
 
        <el-card style="margin-top: 16px" header="选择技能点" shadow="never">
          <el-container>
            <el-aside>
              <RemoteTreeSelect maxHeight="800px" v-model="selectNodes" />
            </el-aside>
            <el-main style="border: 1px solid #EBEEF5; margin-left: 16px">
              <div>
                <el-table
                  :data="skillPoints"
                  ref="multipleTable"
                >
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" icon="el-icon-plus" @click="addSkill(scope.row)">添加</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="jobLevel" label="职级">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.jobLevel"
                        placeholder="请选择职级"
                        size="mini"
                        @change="onChangeJobLevel(scope.row)"
                      >
                        <el-option
                          v-for="item in jobLevelOptions"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="技能点编号" prop="id" />
                  <el-table-column label="技能点名称" prop="taskName" />
                  <el-table-column label="技能点等级" prop="skillLevel">
                    <template slot-scope="scope">
                      <span>{{ scope.row.skillLevel | skillMapLevel }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="技能值奖励" prop="skillReward">
                  </el-table-column>
                  <el-table-column label="创建时间">
                    <template slot-scope="scope">
                      <span>{{ scope.row.createTime | timeFormat }}</span>
                    </template>
                    <span></span>
                  </el-table-column>
                </el-table>
              </div>
              <div style="text-align: center; margin-top: 16px">
                <el-button type="primary" style="width: 120px" size="mini" @click="onSave">保 存</el-button>
                <el-button type="primary" style="width: 120px" size="mini" @click="$router.push('/system/SkillMapManagement')">返 回</el-button>
              </div>
            </el-main>
          </el-container>
        </el-card>

      </el-container>
    </el-card>
  </div>
</template>

<script>
import { pick } from 'lodash-es';
import RemoteJobsSelect from '@/components/RemoteJobsSelect';
import RemoteTreeSelect from '@/components/RemoteTreeSelect';
import RemoteSkillMapSkillTree from '@/components//RemoteMapSkillTree/index.vue';
import { dateFormatFromTableTime } from '@/common/utils/timeFormat';
import map from '@/apis/map.js';
import skillPointServer from '@/apis/skill.js';

export default {
   components: {
    RemoteJobsSelect,
    RemoteTreeSelect,
    RemoteSkillMapSkillTree,
  },
  watch: {
    selectNodes: {
      deep: true,
      async handler(newArray) {
        // 以下逻辑的顺序大概是：
        // 从技能树节点筛选出选中的节点 id
        // 批量请求节点 id 关联的技能点
        // 从技能点中筛选出技能点 id
        // 批量请求技能点 id 关联技能图谱的记录
        // 将关联记录中的数据放到对应 id 的技能点列表中
        const params = newArray.map(node => {
          return node.id;
        })
        if (params.length < 1) {
          this.skillPoints = [];
          return;
        }
        const skillPointsSource = await skillPointServer.querySkillPoint(params);
        const skillPoints = Object.values(skillPointsSource).reduce((accu, curr) => {
          accu = accu.concat(curr);
          return accu;
        }, []);
        skillPoints.forEach(sp => {
          // 设置 skillTreeId 为了在预览中找到它的父节点（所有技能点的父节点都是技能节点）
          sp.skillTreeId = sp.skillId;
          sp.skillName = sp.taskName;
          sp.jobLevel = 1;
        })

        if (!this.skillMapId) {
          return this.skillPoints = skillPoints;
        }

        const skillTaskIds = skillPoints.map(item => item.id);
        const mapSkills = await map.listMapSkillsByMapId(this.skillMapId, { skillTaskIds });
        skillPoints.forEach(sp => {
          mapSkills.forEach(r => {
            if (r.skillTaskId === sp.id) {
              sp.mapSkillId = r.id;
              sp.skillMapId = r.skillMapId; // 拥有 skillMapId 值即该技能点已被保存到该棵技能树
              sp.jobLevel = r.jobLevel;
            }
          })
        })
        this.skillPoints = skillPoints;
      }
    }
  },
  filters: {
    timeFormat(value) {
      return dateFormatFromTableTime(value);
    },
    skillMapLevel(value) {
      const map = {
        1: '初级',
        2: '中级',
        3: '高级'
      };
      return map[value];
    }
  },

   data: function() {
    return {
        skillMapId : '', // 技能图谱 id，路由传入，如果有则回显数据
        // 技能图谱数据
        skillMapCreateReq : {
          name: '',
          isEnable: 0,
          jobId: '',
        },
        // 选中的技能树节点列表
        selectNodes : [],
        // 技能点列表
        skillPoints : [],
        // 职级选项
        jobLevelOptions : [],
        // 根据当前技能点列表和当前技能图谱查询的关联数据列表
        mapSkills : [],
        // 当前选中的技能点
        multipleSelection : [],
        // 图谱树预览窗口
        showMapSkillsTree : false,
      }
   },
  
  async created() {
    this.skillMapId = this.$route.query.id;
    this.jobLevelOptions = await map.getTechRanks();
  },
  async mounted() {
    if (this.skillMapId) {
      map.get(this.skillMapId).then(res => {
        this.skillMapCreateReq = res;
      });
      const mapSkills = await map.getMapSkillTreeByMapId(this.skillMapId);
      mapSkills.forEach(ms => {
        // mapSkills 后面会混入来自技能点（技能任务）的数据，
        // 避免双方的 id 混乱，在这里将其 id 赋值到 mapSkillId
        // 如果删除 mapSkill 取用 mapSkillId 即可，或者检查该值以判断该技能点是否被保存过
        ms.mapSkillId = ms.id;
      })
      this.mapSkills = mapSkills;
      this.$refs.mapSkillsTree.render({ canRemove: true, mapId: this.skillMapId, mapSkills, isFinished: false });
    }
  },

  methods: {
    onSave() {
      const submit = pick(this.skillMapCreateReq, ['name', 'jobId', 'isEnable']);
      if (this.skillMapId) {
        map.update(this.skillMapId, submit).then(res => {
          this.saveMapSkills();
        })
      } else {
        map.save(submit).then(res => {
          this.skillMapId = res;
          this.saveMapSkills();
        })
      }
    },
    // 保存新添加到技能树的节点，判断条件是该节点有无 skillMapId
    saveMapSkills() {
      const saveMapSkillQueue = [];
      this.mapSkills.forEach(ms => {
        if (!ms.skillMapId) {
          saveMapSkillQueue.push(map.saveMapSkill({
            skillMapId: this.skillMapId,
            skillTaskId: ms.id,
            jobLevel: ms.skillLevel || 1,
          }))
        }
      })
      Promise.all(saveMapSkillQueue).then(res => {
        this.$message.success('保存成功');
        this.$router.push('/system/SkillMapManagement');
      }).catch(error => {
        this.$message.error(error.message + '： 保存失败，请重新关联');
        this.$router.push('/system/SkillMapManagement');
      })
    },
    addSkill(row) {
      console.log(row);
      if (!this.skillMapCreateReq.name) {
        return this.$message.warning('请先添加技能图谱名称');
      }
      const isRepeat = this.mapSkills.some(ms => ms.skillTaskId === row.id);
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
        mapName: this.skillMapCreateReq.name,
        mapId: this.skillMapId,
        mapSkills: this.mapSkills,
        isFinished: false
      });
    },
    removeSkill(row) {
      this.$confirm(`确认移除节点：${row.name} ？`)
        .then(async () => {
          if (row.mapSkillId) {
            await map.deleteMapSkill(row.mapSkillId);
          }
          const index = this.mapSkills.findIndex(ms => ms.id === Number(row.id));
          this.mapSkills.splice(index, 1);
          this.$refs.mapSkillsTree.render({
            canRemove: true,
            mapName: this.skillMapCreateReq.name,
            mapId: this.skillMapId, 
            mapSkills: this.mapSkills,
            isFinished: false
          });
        })
    },
    onChangeJobLevel(row) {
      if (row.mapSkillId) {
        map.updateMapSkill(row.mapSkillId, { jobLevel: row.jobLevel }).then(res => {
          this.$message.success(`更新技能点${row.taskName}的职级成功`);
        })
      }
    }
  }
  
}
</script>
