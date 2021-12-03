<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import { RouteConfig, Component, Vue } from '@ziroom/cherry2-decorator';

@Component({
})
@RouteConfig({
  layout: true,
  name: 'TaskManagement',
  title: '任务管理',
  icon: 'audit',
  sort: 2,
})
export default class App extends Vue {
}
</script>
