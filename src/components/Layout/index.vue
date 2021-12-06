<template>
  <a-layout
      id="components-layout-custom"
      style="min-height: 100vh"
  >
    <a-layout-sider
      class="a-layout-sider-custom"
      v-model="collapsed"
      theme="light"
      width="192"
      collapsible
    >
      <div class="site-title">
        <h1><img class="site-logo" src="/public/img/brand_logo@2x.png" alt=""><span>员工发展平台</span></h1>
      </div>

      <!-- 主菜单区域 -->
      <a-menu
        mode="vertical"
        v-model="selectedKeys"
      >
        <template v-for="route in routes">
          <a-menu-item
            v-if="!route.children && !route.meta.hidden"
            :key="route.path"
            :data-path="route.path"
            @click="goTo(route.path)"
          >
            <span><a-icon v-if="route.meta.icon" :type="route.meta.icon" /><span>{{ route.meta.title }}</span></span>
          </a-menu-item>
          <SubMenu
            v-else
            :key="route.path"
            :menu-info="route">
          </SubMenu>
        </template>
      </a-menu>

      <!-- 副菜单区域 -->
      <a-menu mode="vertical" class="bottom-menu">
        <a-sub-menu key="userinfo">
          <span slot="title"><a-icon type="smile" theme="twoTone"></a-icon><span>{{userinfo.nickname}}</span></span>
          <a-menu-item>
            <a-icon type="logout" />
            <span @click="onLogout">登出</span>
          </a-menu-item>
        </a-sub-menu>
        <!-- <a-menu-item key="theme" disabled>
          <a-icon type="clock-circle" />
          <span>切换主题</span>
        </a-menu-item> -->
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-content class="a-layout-content-custom" :class="collapsed ? 'content-collapsed' : 'content-collapse'">
        <div :style="{ padding: '32px' }">
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ziroom Design ©2021 Developed by Basic Platform Team.
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
// import { getAsyncRoutes } from '@ziroom/cherry2-starter-vue';
import { Menu } from 'ant-design-vue';
// import { getUserinfo, doOauthLogout } from "@ziroom/zcloud-head";
import store from '@/store/index.js';

const SubMenu = {
  template: `
      <a-sub-menu :key="menuInfo.path" v-bind="$props" v-on="$listeners" popupClassName="ant-menu-pop-custom">
        <span slot="title"><a-icon v-if="menuInfo.meta.icon" :type="menuInfo.meta.icon" /><span>{{ menuInfo.meta.title }}</span></span>
        <template v-for="item in menuInfo.children">
          <template v-if="!item.meta.hidden">
            <a-menu-item v-if="!item.children" :key="item.path" @click="goTo(item.path)">
              <span><a-icon type="pie-chart" /><span>{{ item.meta.title }}</span></span>
            </a-menu-item>
            <sub-menu v-else :key="item.path" :menu-info="item" />
          </template>
        </template>
      </a-sub-menu>
    `,
  name: 'SubMenu',
  // must add isSubMenu: true
  isSubMenu: true,
  props: {
    ...Menu.SubMenu.props,
    // Cannot overlap with properties within Menu.SubMenu.props
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    goTo(path) {
      this.$router.push(path);
    }
  }
};

export default {
  components: {
    SubMenu,
  },
  mounted() {
    // 任意用户可见
    console.info(routes);
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler: function(path) {
        this.changeSelectedMenuItem(path);
      }
    },
    'store.permission.state.routes': {
      immediate: true,
      deep: true,
      handler: function(routes) {
        this.routes = routes[0].children;
      }
    }
  },
  data() {
    return {
      collapsed: false,
      routes: [],
      userinfo: { username: '未登录用户', nickname: '???' },
      selectedKeys: [],
    };
  },
  created() {
  },
  methods: {
    goTo(path) {
      this.$router.push(path);
    },
    changeSelectedMenuItem(value) {
      if (!value || typeof value !== 'string') return;
      this.selectedKeys = [value];
    },
    onLogout() {
      const result = window.confirm('请问是要登出吗？');
      if (result) {
        // doOauthLogout();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.site-title {
  position: relative;
  height: 82px;
  padding-left: 15px;
  overflow: hidden;
  h1 {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    line-height: 22px;
    color: #000;
    margin-bottom: 0;
    white-space: nowrap;
    >img {
      display: inline-block;
      vertical-align: middle;
      width: 27px;
      height: 29px;
      margin-right: 14px;
    }
    >span {
      font-weight: 600;
      vertical-align: middle;
    }
  }
}
.a-layout-sider-custom {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  .bottom-menu {
    position: absolute;
    bottom: 48px;
    width: 100%;
  }
}
.a-layout-content-custom {
  transition: margin-left .2s;
  &.content-collapse {
    margin-left: 192px;
  }
  &.content-collapsed {
    margin-left: 80px;
  }
}
</style>

<style lang="scss">
.ant-layout,
.ant-layout-content,
.ant-layout-footer {
  background-color: var(--bgColor) !important;
}

#components-layout-custom {
  .ant-layout-sider-collapsed {
    width: 52px !important;
  }
  .ant-menu-item-disabled {
    color: rgba(0, 0, 0, 0.6) !important;
    cursor: default;
  }
  .ant-menu {
    border-right: 0;
    padding: 0 8px;
    // 菜单项覆盖
    .ant-menu-item,
    .ant-menu-submenu {
      font-size: 14px;
      color: #000;
      border-radius: 8px;
      height: 36px;
    }
    // 次级菜单标题 hover
    .ant-menu-submenu-title:hover {
      color: #000;
    }
    // 已选中次级菜单项覆盖
    .ant-menu-submenu-selected {
      // ant-menu-submenu-arrow 次级目录的小箭头
      .ant-menu-submenu-arrow {
        &::after {
          background-image: linear-gradient(to right, #fff, #fff);
        }
        &::before {
          background-image: linear-gradient(to right, #fff, #fff);
        }
      }
      // 已选中时的 hover 效果
      &.ant-menu-submenu-vertical .ant-menu-submenu-title:hover {
        color: #fff;
        .ant-menu-submenu-arrow {
          &::after {
            background-image: linear-gradient(to right, #fff, #fff);
          }
          &::before {
            background-image: linear-gradient(to right, #fff, #fff);
          }
        }
      }
    }
    // vertical 模式次级菜单项默认覆盖
    .ant-menu-submenu-vertical > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::before,
    .ant-menu-submenu-vertical > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::after,
    {
      background-image: linear-gradient(to right, #E66317, #E66317);
    }
    // 已选中所有类型的菜单项覆盖
    .ant-menu-item-selected,
    .ant-menu-submenu-selected
    {
      background-color: #E66317;
      color: #fff;
    }
  }
  .ant-menu-inline-collapsed > .ant-menu-item {
    padding: 0 !important;
    text-align: center;
  }
  .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
    padding: 0 !important;
    text-align: center;
  }
}

// 次级菜单的气泡覆盖
.ant-menu-pop-custom.ant-menu-submenu-popup {
  .ant-menu,
  .ant-menu-submenu {
    //padding: 0 8px;
    border-radius: 8px !important;
    .ant-menu-submenu-title {
      color: #000;
    }
    .ant-menu-submenu-title:hover {
      color: #000;
    }
    // 已选中次级菜单项覆盖
    .ant-menu-submenu-selected {
      // ant-menu-submenu-arrow 次级目录的小箭头
      .ant-menu-submenu-arrow {
        &::after {
          background-image: linear-gradient(to right, #fff, #fff);
        }
        &::before {
          background-image: linear-gradient(to right, #fff, #fff);
        }
      }
      // 已选中时的 hover 效果
      &.ant-menu-submenu-vertical .ant-menu-submenu-title:hover {
        color: #fff;
        .ant-menu-submenu-arrow {
          &::after {
            background-image: linear-gradient(to right, #fff, #fff);
          }
          &::before {
            background-image: linear-gradient(to right, #fff, #fff);
          }
        }
      }
    }
    // vertical 模式次级菜单项默认覆盖
    .ant-menu-submenu-vertical > .ant-menu-submenu-title:hover {
      .ant-menu-submenu-arrow::before,
      .ant-menu-submenu-arrow::after, {
        background-image: linear-gradient(to right, #E66317, #E66317);
      }
    }
    .ant-menu-item-selected {
      background-color: #E66317;
      color: #fff;
      border-radius: 8px;
      &.ant-menu-item-active {
        color: #fff;
      }
    }
    &.ant-menu-submenu-active {
      .ant-menu-submenu-title {
        color: #E66317;
        &:hover {
          color: #E66317;
        }
      }
    }
    .ant-menu-item-active {
      color: #E66317;
    }
  }
}
</style>
