<template>
  <div>
    <el-card style="margin-top: 16px" header="选择技能点" shadow="never">
      <el-container>
        <el-aside>
          <RemoteTreeSelect maxHeight="800px" v-model="selectNodes" />
        </el-aside>
      
        <el-main style="border: 1px solid #EBEEF5; margin-left: 16px">
        <!-- 展示表格 -->
          <div>
            <el-table :data="skillPoints" height="600">
              <el-table-column label="操作" >
                <template slot-scope="scope">
                  <el-button size="mini" type="text" icon="el-icon-plus" @click="addSkill(scope.row)">添加</el-button>
                </template>
              </el-table-column>
              <el-table-column label="技能点编号" prop="id" />              
              <el-table-column label="技能点名称" prop="taskName" />
              <el-table-column label="技能点等级" prop="skillLevel" />
              <el-table-column label="技能值奖励" prop="skillReward" />
            </el-table>
          </div>


        </el-main>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import taskServer from '@/apis/task.js';
import ehrServer from '@/apis/ehr.js';
import dayjs from 'dayjs';
import RemoteTreeSelect from '@/components/RemoteTreeSelect';
import map from '@/apis/map.js';
import skillPointServer from '@/apis/skill.js';

export default {
  components: {
    RemoteTreeSelect,
    skillPointServer
  },
  watch: {
   selectNodes: {
      deep: true,
      async handler(newArray) {
        console.log("........................newArray........................");
        console.log(newArray);
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
    },
  },
  data() {
    return {
      //根据当前技能点列表和当前技能图谱查询的关联数据列表
      mapSkills: [],
      selectNodes: [],
      // 技能图谱数据
      skillMapCreateReq: {
        name: '0714zxt',
        isEnable: 0,
        jobId: '',
      },
       // 技能点列表
      skillPoints: [],
      // searchSkillFilter: {
      //   skillPointLevel: '',
      //   skillTreeIds: [],
      //   taskType: 1,
      //   systemCode: '',
      //   nameOrNo: '',
      //   taskStatus: '',
      //   pageSize: 10,
      //   pageNumber: 1,
      // },
      allTaskStatus: [],
      allTaskFlowStatus: [],
      publisherList: [],
      loading: false,
      releaseTaskList: [],
      total: 0,
      pointLevelList: [],
       // 当前选中的技能点
      multipleSelection: [],
      editId: 0
    }
  },
  
  mounted() {
    this.getCurrentUid();
    this.refresh();
    this.getAllTypeChange();
    this.getAllSkillLevel()
  },


  methods: {
    addSkill(row) {  
      this.$emit('getSkillPoints', row);
      },
 
    refresh() {
      this.editId = 0
      this.searchSkill();
    },


    queryPeople (query) {
      this.loading = true;
      ehrServer.getEmpList({ empCodeNameAdcode: query }).then(data => {
        this.loading = false;
        this.publisherList = data.map(user => {
          return {
            code: user.code,
            email: user.email,
            name: user.name + '(' + user.email.split('@')[0] + ')'
          };
        });
      }).catch(() => {
        this.loading = false;
      });
    },
    getAllTypeChange () {
      taskServer.getAllSkillStatus().then(data => {
        this.allTaskStatus = data.map(s => {
          return {
            label: s.desc,
            value: s.code
          }
        })
      })
    },
    getAllSkillLevel () {
      taskServer.getAllSkillLevel().then(data => {
        console.log(data);
        this.pointLevelList = data.map(s => {
          return {
            label: s.desc,
            value: s.code
          }
        })
      })
    },
    getCurrentUid () {
      const user = this.$store.state.permission?.userinfo;
      return user.uid;
    },
    searchSkill () {
      //const params = this.searchSkillFilter;
      taskServer.releaseList().then(data => {
        this.total = data.total;
        const skillPointList = data.data;
        console.log(skillPointList);
        if (skillPointList) {
          this.releaseTaskList = skillPointList.map(skillPoint => {
            return {
              ...skillPoint,
              taskCreateTime: dayjs(skillPoint.taskCreateTime).format('YYYY-MM-DD HH:mm:ss')
            }
          })
        } else {
          this.releaseTaskList = []
        }
      });
    },
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
    handleSelectionChange(val) {
        this.multipleSelection = val;
        let ids=[]
          val.map((item)=> {
          ids.push(item.taskNo)
        });
        this.$emit('handleSelectionChange', val, ids);
      }
    }
  }

</script>
