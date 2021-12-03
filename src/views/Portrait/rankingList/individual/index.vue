<template>
  <el-container class="grid-content">
      <el-header>
          <div style="margin: 20px 0px 0px 0px;" class="block">
            <el-date-picker
            v-model="searchFilter.startTime"
            size="small"
            type="month"
            format="yyyy年MM月"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="">
            </el-date-picker>
            <el-button size="small" type="primary" @click="searchBydate">查询</el-button>
        </div>   
      </el-header>

  <el-main>
      <!-- 技能图谱排行榜 -->
      <el-row style="margin: 5px;" class="row-box">
        
          <el-row style="margin-bottom: 20px;">
              <span><h2>技能图谱排行榜</h2></span>
              <span>
                 <el-select
                    v-model="searchFilter.searchSkillMap"
                    filterable
                    reserve-keyword
                    placeholder="请选择图谱"
                    size="mini"
                    >
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                <el-button size="small" type="primary" @click="searchBySkillMap">查询</el-button>
              </span>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="6"><div class="grid-content"><Rankinggrid :rankingsinfo="skillMapabout[0]" title="认证技能点数量"></Rankinggrid></div></el-col>
            <el-col :span="6"><div class="grid-content"><Rankinggrid :rankingsinfo="skillMapabout[1]" title="认证技能数量"></Rankinggrid></div></el-col>
            <el-col :span="6"><div class="grid-content"><Rankinggrid :rankingsinfo="skillMapabout[2]" title="热门技能点"></Rankinggrid></div></el-col>
            <el-col :span="6"><div class="grid-content"><Rankinggrid :rankingsinfo="skillMapabout[3]" title="热门技能"></Rankinggrid></div></el-col>             
          </el-row>     
       
      </el-row>

      <hr/>

      <!-- 工程指标排行榜 -->
       <el-row style="margin: 5px;" class="row-box">  
       
          <el-row>
          <span><h2>工程指标排行榜</h2></span>
          </el-row>
          <el-row>
           <el-row :gutter="10">
             <!-- <div style="margin: 25px" v-for="(rank, idex) in rankingsinfo.rankingList" :key="idex" > -->
                <el-col :span="6"><div class="grid-content"><Rankinggrid :rankingsinfo="allProIndiactor[0]" title="开发当量"></Rankinggrid></div></el-col>
                <el-col :span="6"><div class="grid-content"><Rankinggrid :rankingsinfo="allProIndiactor[1]" title="开发价值"></Rankinggrid></div></el-col>
                <el-col :span="6"><div class="grid-content"><Rankinggrid :rankingsinfo="allProIndiactor[2]" title="开发质量"></Rankinggrid></div></el-col>
                <el-col :span="6"><div class="grid-content"><Rankinggrid :rankingsinfo="allProIndiactor[3]" title="开发效率"></Rankinggrid></div></el-col> 
             <!-- </div>  -->
          </el-row>  
          </el-row>
       
      </el-row>
    
  </el-main>
  </el-container>
</template>



<script>
import { RouteConfig, Component, Vue } from '@ziroom/cherry2-decorator';
import Rankinggrid from '@/components/rankinggrid/rankinggrid.vue';
import RemoteMapSkillTree from '@/components/RemoteMapSkillTree/index.vue';
import ehrServer from '@/apis/ehr.js';
import MapServer from '@/apis/map';
import portrait from '@/apis/portrait';
import RankingServer from '@/apis/ranking.js';
import { getUserinfo } from '@ziroom/zcloud-head';
import dayjs from 'dayjs';

@Component({
  
  components: {
      Rankinggrid,
      RemoteMapSkillTree,
      RankingServer
    },
  
  data(){
    
      return {
        title: null,
        options: [],
        searchFilter: {
          startTime: '',
          endTime: '',
          uid: this.getCurrentUid(),
          searchSkillMap: ''
        },
        skillMapList: [],
        allProIndiactor: [],
        skillMapabout: []
      }
  },
  watch: {
     //监控月份，，对应startTme和endTime
    'searchFilter.startTime': function(value) {  //'searchFilter.startTime' 对象内属性的监控方式
      this.searchFilter.endTime = dayjs(value).startOf('month').add(1, 'month').format('YYYY-MM-DD HH:mm:ss');
    }
  },

  created () {
    
  },
  async mounted (){
    //默认展示当月数据
    this.searchFilter.startTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
    this.searchFilter.endTime = dayjs(this.searchFilter.startTime).startOf('month').add(1, 'month').format('YYYY-MM-DD HH:mm:ss');
    //查询技能图谱
    this.listSkillMap();
    await this.skillMapranking();
    await this.projectindiator();
   
  },
  methods: {
    //about skillMapranking
    skillMapranking(){
      return new Promise(resolve => {
        RankingServer.individualSkillMap(this.searchFilter).then(res => {
            this.skillMapabout = res;
            resolve();
        }).catch(error => {
          this.$message.error(error.message + '： 创建失败，请重新关联');
        })
      })

    },
    async projectindiator(){
      const res = await RankingServer.individualPro(this.searchFilter);
      this.allProIndiactor = res;
      return Promise.resolve();
     },


     //查询按钮 按图谱
    searchBySkillMap(){
      this.skillMapranking();
     },
     //查询按钮 按时间
    searchBydate(){
      this.skillMapranking();
      this.projectindiator();
     },
     
//当前用户uid
    getCurrentUid () {
      const user = getUserinfo();
      return user.userInfo.uid
    },

    listSkillMap(){
      MapServer.listAll().then(res => {
          this.options = res;
      }).catch(error => {
        this.$message.error(error.message + '： 创建失败，请重新关联');
      })
    }
 }

})

@RouteConfig({
  layout: true,
  name: 'individualAbout',
  title: '个人排行榜',
  sort: 1
})
export default class App extends Vue {
}
</script>

<style>

/* .box-card {
    width: 100%;
    height: 900px;
  } */
 .row-box {
    /* border-style:solid;
    border-color:red; */
    width: 100%;
    height: 800px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
   .bg-purple {
    background: #bdbdba;
  }

</style>
