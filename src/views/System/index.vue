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
  name: 'SystemManagement',
  title: '系统管理',
  icon: 'apartment',
  sort: 4,
  role: ['demeter-super-admin', 'demeter-dept-admin'],
})
export default class App extends Vue {
}
</script>
