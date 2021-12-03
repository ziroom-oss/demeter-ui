<template>
   <div>
    <el-col style="margin: 10px 25%"> <h3  style="font-weight: bold" v-text="title"></h3></el-col>
    <el-col v-if="rankingsinfo.myRanking != null" style="margin: 0px 32%"> <label> 我的排名： </label><span v-text="rankingsinfo.myRanking"></span></el-col>
    <el-col>

      <div style="margin: 25px" v-for="(rank, idex) in rankingList" :key="idex" >       
        <div v-if="idex > 2" key="rank.uid" class="text item">
          <el-row :gutter="36">
            <el-col :span="4"><div> {{++idex}}</div></el-col> 
          <el-col :span="12"><div>
            <el-tooltip class="item" effect="light" placement="top-start">
              <div slot="content">{{rank.name}}</div>
              <label v-if="(rank.name && rank.name.length > 5)">{{rank.name.substring(0, 5)}}...</label>
              <label v-if="(rank.name && rank.name.length < 6)">{{rank.name}}</label>
            </el-tooltip>
          </div></el-col> 
            
            <el-col :span="6"><div> {{rank.num }}</div></el-col>
          </el-row>
        </div>
        <div v-else key="idex" class="text item"> 
          <el-row :gutter="30">
            <el-col :span="4"><div> {{"Top"+(++idex)}}</div></el-col>
            <el-col :span="12"><div>
            <el-tooltip class="item" effect="light" placement="top-start">
              <div slot="content">{{rank.name}}</div>
              <label v-if="(rank.name && rank.name.length > 5)">{{rank.name.substring(0, 5)}}...</label>
              <label v-if="(rank.name && rank.name.length < 6)">{{rank.name}}</label>
            </el-tooltip>
            </div></el-col> 
            <el-col :span="6"><div> {{rank.num }}</div></el-col>
          </el-row>
        </div>
      </div>

     
    </el-col>
   </div>
</template>



<script>
export default {

  components: {
    },

  props: {
      rankingsinfo: {
        type: Object,
        default() {
           return {};
          }
        },
      title: {
        type: String,
         default() {
           return '';
          }
      }
    },

    watch: {
      rankingsinfo: {
        deep: true,
        handler: function(value) {
          if (value.rankingList && Array.isArray(value.rankingList)) {
            //_.slice()
            return this.rankingList = value.rankingList;
          }      
          this.rankingList = [];
        } 
       
      }
    },

    data(){
        return {
          rankingList: []
        }
    },

    methods: {
     
    }
}


</script>

<style>

.text {
    font-size: 14px;
    text-align: center;
  }

.item {
    padding: 3px 3px;
  }
.itemlabel {
    padding: 10px 5px;
}
</style>

