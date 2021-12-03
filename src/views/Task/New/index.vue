<template>
  <div>
    <a-button @click="$router.push('/Task/Assign')">指派类任务</a-button>
    <a-button @click="$router.push('/Task/Skill')">技能类任务</a-button>
  </div>
</template>

<script>
import { RouteConfig, Component, Vue } from '@ziroom/cherry2-decorator';

@Component({
})
@RouteConfig({
  layout: true,
  name: 'NewTask',
  title: '新建任务',
  hidden: true
})
export default class App extends Vue {
}
</script>
