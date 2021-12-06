<template>
  <div>
    <RemoteSkillMapSelect v-model="searchGraphName" />
  </div>
</template>

<script>
import RemoteSkillMapSelect from '@/components/RemoteSkillMapSelect';

export default {
  components: {
    RemoteSkillMapSelect,
  },
  data: function() {
    return {
      searchGraphName : '',
    }
  },
  methods: {
    }
  
}
</script>
