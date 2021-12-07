<template>
  <div>
    <div style="text-align: right;">
      <div style="background-color: white;" class="legend">待认领</div>
      <div style="background-color: #00BFFF;" class="legend">进行中</div>
      <div style="background-color: #F0E68C;" class="legend">待认证</div>
      <div style="background-color: #90EE90;" class="legend">认证通过</div>
      <div style="background-color: #F08080;" class="legend">认证不通过</div>

      <el-button size="mini" type="success" @click="saveToPng">保存到图片</el-button>
      <RemoteSkillMapSelect v-model="mapSelect.mapId"/>
      <RemoteJobLevelsSelect v-model="mapSelect.jobLevel" />
    </div>
    <div
        style="width: 100%; height: 800px"
        id="MapSkillTree-Preview"
        v-loading="isSavingPicture"
    >
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
          <el-button size="mini" type="text" @click="open('/#/Task/SkillDetail?id=' + skillPopup.model.skillTaskId)">详情</el-button>
          <el-button size="mini" type="text" @click="qa(skillPopup.model.skillTaskId)">快速认证</el-button>
          <el-button size="mini" type="text" @click="skillPopup.display = 'none'">关闭</el-button>
        </div>
      </el-card>
    </div>
    </div>
  </div>
</template>

<script>
import RemoteSkillMapSelect from '@/components/RemoteSkillMapSelect.vue';
import RemoteJobLevelsSelect from '@/components/RemoteJobLevelsSelect.vue';
import mixin from './mixin';
import ss from '@/apis/skill.js';

export default {
  mixins: [mixin],
  components: {
    RemoteSkillMapSelect,
    RemoteJobLevelsSelect,
  },
  props: {
    userId: {
      type: String,
      default: function() {
        const user = this.$store.state.permission?.userinfo;
        return user.uid;
      }
    }
  },
  data() {
    return {
      showDialog: false,
      skillPopup: {
        display: 'none',
        left: 0,
        top: 0,
        model: {},
        evt: null,
        item: null,
      },
      timer: null,
    }
  },
  methods: {
    async updateRender(value) {
      const { name, nodes, source } = await this.getRemoteData(value.mapId, value.jobLevel);
      this.graphTree.setState({ name, nodes, source });
      this.graphTree.onEvent('nodeClick:query', (evt) => {
        const model = evt.item._cfg.model
        this.skillPopup = {
          display: 'block',
          left: evt.clientX + 'px',
          top: evt.clientY - 150 + 'px',
          model,
        }
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
    qa (t) {
      const p = {
        id: t
      }
      ss.qa(p).then(r => {
        this.updateRender(this.mapSelect);
        this.$message.success('发起认证成功！')
      });
    }
  }
}
</script>

<style scoped>
.legend {
  display: inline-block;
  padding: 4px;
  font-weight: bold;
  font-size: 13px;
  margin-right: 10px;
  border-radius: 4px;
}
#MapSkillTree-Preview {
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