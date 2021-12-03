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
  name: 'RankingList',
  title: '排行榜',
  icon: 'smile',
  sort: 1,
})
export default class App extends Vue {
}
</script>
