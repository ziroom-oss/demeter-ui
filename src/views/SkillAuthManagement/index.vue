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
  name: 'SkillAuthManagement',
  title: '技能认证管理',
  icon: 'trophy',
  sort: 3,
})
export default class App extends Vue {
}
</script>
