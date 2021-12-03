<template>
  <div>
    <p style="font-weight: bold; font-size: 18px">排行榜-这个不做</p>
  </div>
</template>

<script>
import { RouteConfig, Component, Vue } from '@ziroom/cherry2-decorator';

@Component({
})
@RouteConfig({
  layout: true,
  name: 'EmployeeTop',
  title: '排行榜',
  hidden: true
})
export default class App extends Vue {
}
</script>
