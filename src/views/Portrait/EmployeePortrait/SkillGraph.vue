<template>
  <div>
    <RemoteSkillMapSelect v-model="searchGraphName" />
  </div>
</template>

<script>
import { Component, Vue } from '@ziroom/cherry2-decorator';
import RemoteSkillMapSelect from '@/components/RemoteSkillMapSelect';

@Component({
  components: {
    RemoteSkillMapSelect,
  }
})
export default class App extends Vue {
  searchGraphName = '';
}
</script>
