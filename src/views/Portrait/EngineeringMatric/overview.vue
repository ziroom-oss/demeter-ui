<template>
  <el-card style="margin-top: 10px">
    <el-row>
      <el-col :span="20">
        <span style="font-size: 20px; font-weight: bold">核心数据指标</span>
      </el-col>
      <el-col :span="4">
        <el-switch
          v-model="basePeriod"
          @change="refresh()"
          active-color="#13ce66"
          inactive-color="#13ce66"
          active-text="同比"
          inactive-text="环比">
        </el-switch>
      </el-col>
    </el-row>
    <el-row :gutter="20" type="flex" class="custom-flex-row" style="flex-flow: row wrap;">
      <el-col :span="12" v-for="category in teamOverviewResp" :style="category.style" :key="category.id">
        <div class="metrics-label">
          <span>{{ category.name }}</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8" v-for="metric in basePeriod ? category.yoyMetricList : category.qoqMetricList" :key="metric.id">
            <div class="sub-contain" style="display: flex; align-content: center; flex-direction: column; justify-content: center; align-items: center">
              <div style="display: flex;">
                <span v-html="metric.name" class="sub-title">
                </span>
                <el-tooltip v-if="metric.name in faqMap" placement="top" effect="light">
                  <div slot="content">
                    <div v-for="p in faqMap[metric.name]" :key="p">{{ p }}</div>
                  </div>
                  <i style="margin-top: 12px" class="el-icon-question"></i>
                </el-tooltip>
              </div>
              <div style="display: flex;">
                <div class="sub-value" style="text-align: center">
                  <div v-html="['NaN', 'Infinity'].includes(metric.value) ? 0 : metric.value"></div>
                  <div style="font-size: 8px; color: gray" v-html="['NaN', 'Infinity'].includes(metric.oldValue) ? '' : metric.oldValue"></div>
                </div>
                <!-- <span class="strip" v-if="metric.tendency === 0"/> -->
                <span v-if="metric.tendency === 1">
                  <span class="pointer"><div class="pointerUpT"></div><div class="pointerUpL"></div></span>
                </span>
                <span v-if="metric.tendency === 2">
                  <span class="pointer"><div class="pointerDownL"></div><div class="pointerDownT"></div></span>
                </span>
                <span v-if="metric.tendency === 1" style="color: #32CD32; margin: 10px 0 0 4px; font-size: 6px">{{ ['NaN', 'Infinity'].includes(metric.rate) ? '' : metric.rate + '%' }}</span>
                <span v-if="metric.tendency === 2" style="color: #DC143C; margin: 10px 0 0 4px; font-size: 6px">{{ ['NaN', 'Infinity'].includes(metric.rate) ? '' : metric.rate + '%'}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import portraitServer from '@/apis/portrait.js';

export default {
  components: {
  },
  props: {
    params: {
      type: Object,
      default: () => {}
    },
    teamOverviewResp: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    params: {
      // immediate: true,
      handler: function (value) {
        this.refresh()
      }
    },
  },
  data () {
    return {
      basePeriod: false,
      omegaStruct: {},
      wortopStruct: {},
      devOverviewStruct: {
        devEquivalent: '',
        insertions: '',
        commitCounts: '',
      },
      overviewList: [],

      faqMap: {
        '开发当量': ['开发当量是对程序员代码产出的一种合理量化和测量'],
        '开发价值': ['这个指标是综合了开发当量和代码影响力的综合指标，以百分比的形式计算该指标，可以直观理解为贡献比例。',
                   '代码影响力的算法：根据开发当量找到某个函数A贡献最大的开发者D, 把这个函数A算到D的头上, ',
                   '直接调用函数A的函数都是D这个开发者有影响的函数, 把这些有影响的函数个数记录下来, ',
                   '求占比就是排行榜里的代码影响力排名。',
                   '如何计算某个函数贡献最大的开发者：根据开发当量计算，比如函数好几个贡献者做了新增、修改等操作，其中在这个函数上开发当量最大的贡献者就是D。'],
        '价值密度': ['分为行价值密度和提交价值密度，具体以思码逸口径为准。'],
        '千行bug率': ['千行Bug率 = Bug数量/ (开发当量/1000)，千行Bug率数值越小代码质量越好'],
        '注释覆盖度': ['有格式化注释的函数占总函数个数的比例。'],
        '团队鲁棒性': ['贡献比例超过均值的人占总贡献者人数的比例。团队成员贡献比例的均衡程度。',
                      '具体统计的是超过团队平均开发价值的开发者占团队人数的比例。贡献者数指周期内有过至少一次代码提交的人。'],
        '团队稳定性': ['开发当量的离散系数。离散系数是测度数据离散程度的相对统计量，主要是用于比较不同样本数据的离散程度。',
                      '离散系数代表了数据的聚拢及稳定性。离散系数越小，代表数据的稳定性越高。'],
        '测试覆盖度': ['被测试用例覆盖的函数占总函数个数的比例。'],
        '代码模块性': ['反映代码划分出高内聚、松耦合的模块的难易程度，基于代码调用-提交图的最优划分计算。'],
      }
    }
  },
  methods: {
    refresh () {
    }
  } 
}
</script>
<style>
.strip {
  background: gray;
  width: 15px;
  height: 2px;
  margin: 20px 0 0 15px;
}
.pointer {
  width:14px;
  height: 25px;
}
.pointerUpT{
  border-width: 0 4px 5px 4px;
  border-color: #fff #fff #32CD32 #fff;
  border-style: solid;
  height: 0;
  width: 0;
  margin-left: 5px;
  margin-top: 14px;
}
.pointerUpL{
  width:2px;
  height: 10px;
  background-color: #32CD32;
  margin-left: 8px;
}
.pointerDownT{
  border-width: 5px 4px 0 4px;
  border-color:#DC143C #fff #fff #fff;
  border-style: solid;
  height: 0;
  width: 0;
  margin-left: 5px;
}
.pointerDownL{
  width:2px;
  height: 10px;
  background-color: #DC143C;
  margin-left: 8px;
  margin-top: 14px;
}

.sub-title {
  font-size: 12px;
  margin-top: 10px;
}
</style>