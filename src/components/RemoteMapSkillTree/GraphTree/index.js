
import G6 from '@antv/g6';
import mainVueTemplate from '../GraphTree/index.vue';
import { cloneDeep } from 'lodash-es';

/**
 * 通过 hash 和尾递归从一维的技能点列表转换到
 * 根据每一 node 的 parentId 属性寻找其父节点，并将其推入到该父节点的 children[]
 */
function buildTreeByNodes(nodes, source) {
  const memo = {};

  nodes.forEach(node => {
    if (!memo[node.id]) {
      memo[node.id] = node;
      node.children = [];
    }
  });

  source.forEach(skill => {
    /**
     * 将技能点的 id 作为 memo 的键，对象作为值添加到 memo 变量
     * 因为技能点和上述的 TreeNodes 都是 nodes，将在后续遍历处理
     */
    memo[skill.id] = skill;
    /**
     * @todo 这里如何移出 skillTreeId 这个业务属性呢？
     * 因为技能点的 skillTreeId 记录的是每一个 TreeNode 类型的 id
     * 因此在这里给技能点添加 parentId === 它的 skillTreeId
     */
    skill.parentId = memo[skill.skillTreeId].id;

    /**
     * 不是每一个 TreeNode 都会被用上，
     * 例如通常给的技能点是来自 iOS 图谱的，那么 TreeNodes 中相关的应该都是 iOS 分类，
     * 但是此前我们获取的是整棵技能树（包含所有技术分类），这样做的目的也利于在前端页面上作图谱的快速切换
     * 因此递归遍历 memo 作 path 记号，然后一次性删除所有没有 path 记号的节点
     */
    recuriveSetPath(skill, memo);
  })
  function recuriveSetPath(node, memo) {
    node.path = true;
    if (memo[node.parentId]) {
      recuriveSetPath(memo[node.parentId], memo);
    }
  }
  Object.entries(memo).forEach(function ([key, value]) {
    if (!value.path) {
      delete memo[key]
    }
  })

  /**
   * 对合并 TreeNodes 和技能点的完整技能树作点亮配置（业务要求）
   * 如果某个技能点存在 isFinished 属性，则
   * 1.找到它的父级即 memo[skill.parentId]
   * 2.如果存在这个父级节点，则反向寻找该节点属下的所有技能点（只要是 memo 中属性的 parentId 等于它的 id，即可判真）
   * 当找到所有子节点的时候，当它所有子节点都满足 isFinished （必须如此） 则该父节点添加 isFinished: true
   */
  source.forEach(ms => {
    recuriveSetFinished(ms, memo);
  })
  function recuriveSetFinished(node, memo) {
    if (!node.isFinished) return;
    const parentNode = memo[node.parentId];
    if (parentNode) {
      parentNode.isFinished = Object.values(memo)
        .filter(m => m.parentId === parentNode.id)
        .every(n => !!n.isFinished);
      return recuriveSetFinished(parentNode, memo);
    }
  }

  // 遍历每一个子节点并按期属性 parentId 压入 memo[parentId] 的 children 中
  Object.values(memo).forEach(node => {
    if (memo[node.parentId]) {
      memo[node.parentId].children.push(node);
    }
  })
  return memo[100000];
}

export const dataTransform = (data) => {
  const changeData = (d, level = 0, color) => {
    const data = {
      ...d,
    };
    switch (level) {
      case 0:
        data.type = 'dice-mind-map-root';
        break;
      case 1:
        data.type = 'dice-mind-map-sub';
        break;
      default:
        data.type = 'dice-mind-map-leaf';
        break;
    }

    data.hover = false;

    if (color) {
      data.color = color;
    }

    if (level === 1 && !d.direction) {
      if (!d.direction) {
        data.direction = d.id.charCodeAt(d.id.length - 1) % 2 === 0 ? 'right' : 'left';
      }
    }

    if (d.children) {
      data.children = d.children.map((child) => changeData(child, level + 1, data.color));
    }
    return data;
  };
  return changeData(data);
};

/**
 * 根据状态赋值的 node 颜色
 */
export const statusMap = {
  0: '',
  2: '#00BFFF', // 2 进行中
  3: '#F0E68C', // 3 待认证
  4: '#90EE90', // 4 认证通过
  5: '#F08080', // 认证未通过
}
const { Util } = G6;
/**
 * G6 自定义节点
 * 需要在初始化前执行
 */
export function registerNode() {
  G6.registerNode('dice-mind-map-root', {
    jsx: (cfg) => {
      const width = Util.getTextSize(cfg.name, 16)[0] + 24;
      const stroke = cfg.style.stroke || '#096dd9';
      let fill = '#fff';
      let textColor = '#000';
      if (cfg.isFinished) {
        fill = statusMap[4];
        textColor = '#fff';
      }
      return `
        <group>
            <rect style={{width: ${width}, height: 42, fill: ${fill}, stroke: ${stroke}, radius: 4}} keyshape>
                <text style={{ fontSize: 16, marginLeft: 12, marginTop: 12, fill: ${textColor} }}>${cfg.name}</text>
            </rect>
        </group>
      `
    },
    getAnchorPoints() {
      return [
        [0, 0.5],
        [1, 0.5],
      ]
    },
  }, 'single-node');
  G6.registerNode('dice-mind-map-sub', {
    jsx: cfg => {
      const width = Util.getTextSize(cfg.name, 14)[0] + 24;
      let color = statusMap[cfg.status] || '#e8e8e8';
      if (cfg.isFinished) {
        color = statusMap[4];
      }
      return `
        <group>
            <rect style={{width: ${width + 24}, height: 22}} keyshape>
                <text style={{fontSize: 14, marginLeft: 12, marginTop: 6}}>${cfg.name}</text>
            </rect>
            <rect style={{ fill: ${color}, width: ${width + 24}, height: 2, x: 0, y: 22 }} />
        </group>
      `
    },
    getAnchorPoints() {
      return [
        [0, 0.965],
        [1, 0.965],
      ]
    }
  }, 'single-node')
  G6.registerNode('dice-mind-map-leaf', {
    jsx: (cfg) => {
      const width = Util.getTextSize(cfg.name, 12)[0] + 24;
      let color = statusMap[cfg.status] || '#e8e8e8';
      if (cfg.isFinished) {
        color = statusMap[4];
      }
      // @todo 添加叶子节点的标识，这里不应该传入业务数据
      if (cfg.skillTaskId) {
        return `
          <group>
            <rect draggable="true" style={{width: ${width + 20}, height: 26, fill: 'transparent' }}>
              <text style={{ fontSize: 12, marginLeft: 12, marginTop: 6, cursor: 'pointer' }} action="query">${cfg.name}</text>
                  <text
                    style={{ marginLeft: ${width - 8}, marginTop: -10, stroke: ${color}, fill: '#000', cursor: 'pointer', opacity: ${cfg.hover ? 0.75 : 0}, next: 'inline' }}
                    action="query">🔍</text>
            </rect>
            <rect style={{ fill: ${color}, width: ${width + 24}, height: 2, x: 0, y: 32 }} />
          </group>
      `;
      }
      // 学习路径
      return `
        <group>
            <rect style={{width: ${width + 24}, height: 22}} keyshape>
                <text style={{fontSize: 14, marginLeft: 12, marginTop: 6}}>${cfg.name}</text>
                ${cfg.isDynamicLeaf
          ? `<text style={{ marginLeft: ${width - 8}, marginTop: -10, stroke: ${color}, fill: '#000', cursor: 'pointer', opacity: ${cfg.hover ? 0.75 : 0}, next: 'inline' }}
                      action="remove">&nbsp&nbsp移除</text>`
          : ''
        }
            </rect>
            <rect style={{ fill: ${color}, width: ${width + 24}, height: 2, x: 0, y: 22 }} />
        </group>
      `
    },
    getAnchorPoints() {
      return [
        [0, 0.965],
        [0, 0.965],
      ]
    }
  }, 'single-node');
  G6.registerBehavior('dice-mindmap', {
    getEvents() {
      return {
        'node:mouseenter': 'hoverNode',
        'node:mouseleave': 'hoverNodeOut',
      };
    },
    hoverNode(evt) {
      evt.currentTarget.updateItem(evt.item, {
        hover: true,
      });
    },
    hoverNodeOut(evt) {
      evt.currentTarget.updateItem(evt.item, {
        hover: false,
      });
    },
  });
  G6.registerBehavior('scroll-canvas', {
    getEvents: function getEvents() {
      return {
        wheel: 'onWheel',
      };
    },

    onWheel: function onWheel(ev) {
      const {
        graph
      } = this;
      if (!graph) {
        return;
      }
      if (ev.ctrlKey) {
        const canvas = graph.get('canvas');
        const point = canvas.getPointByClient(ev.clientX, ev.clientY);
        let ratio = graph.getZoom();
        if (ev.wheelDelta > 0) {
          ratio += ratio * 0.05;
        } else {
          ratio *= ratio * 0.05;
        }
        graph.zoomTo(ratio, {
          x: point.x,
          y: point.y,
        });
      } else {
        const x = ev.deltaX || ev.movementX;
        const y = ev.deltaY || ev.movementY || (-ev.wheelDelta * 125) / 3;
        graph.translate(-x, -y);
      }
      ev.preventDefault();
    },
  });
}

/**
 * 技能图谱核心组件（ ui 渲染部分）
 * @param {[type]} option [description]
 */
export default class App {
  constructor({
    mount, // 组件挂载点
  }) {
    // 初始配置
    this.cache = {
      nodes: null, // 所有的技能树节点
      graph: null, // G6 TreeGraph 图形实例
      instance: null, // vue 实例
    }
    this.callback = {
      nodeClick: []
    };
    /**
     * 初始化 G6 配置
     * 注册自定义节点
     */
    registerNode();
    /**
     * 初始化 Vue 组件
     * 
     */
    const VueConstructor = Vue.extend(mainVueTemplate);
    this.cache.instance = new VueConstructor({
      el: document.createElement('div')
    });
    document.querySelector(mount).appendChild(this.cache.instance.$el);
  }

  /**
   * 返回转换后的结构树
   * @return {[type]} [description]
   */
  postTreeByNodes() {
    return buildTreeByNodes(cloneDeep(this.cache.nodes), cloneDeep(this.cache.source));
  }

  /**
   * @description 如果用户有二次重绘时，通过 setState(option) 添加新的配置项，并随后自行执行内置的渲染
   */
  async setState({ source, name, nodes }) {
    this.cache.source = source;
    if (name) this.cache.name = name;
    if (nodes) this.cache.nodes = nodes;

    // 检查数据
    if (!this.cache.name) this.cache.name = '未定义图谱名称';
    if (!this.cache.nodes) return console.error('未传入技能节点数据，请检查 nodes 是否 undefined');
    if (this.cache.nodes.length < 1) return console.warn('传入 nodes 长度小于 1，不作渲染');
    if (!this.cache.source) return console.error('未传入叶子节点数据，请检查 source 是否 undefined');
    if (this.cache.source.length < 1) return console.warn('传入 source 长度小于 1，不作渲染');

    const treeData = this.postTreeByNodes();
    // 设置根节点名称
    treeData.name = this.cache.name;
    // G6 代码会使用 id 的 charCodeAt 方法因此必须转换到字符串类型
    Util.traverseTree(treeData, function (item) {
      item.id = String(item.id);
    })
    this.render(treeData);
  }

  destroy() {
    if (this.cache.graph) {
      this.cache.graph.destroy();
      this.cache.graph = null;
    }
  }

  initGraph() {
    // 在 vue-template 组件添加唯一标识 id 并返回
    const id = this.cache.instance.getElementId();
    // 计算有标识 id 的容器的宽度和高度
    const container = document.getElementById(id);
    const width = container.scrollWidth;
    const height = container.scrollHeight || 500;
    return new G6.TreeGraph({
      container,
      width,
      height,
      fitView: true,
      fitViewPadding: [10, 20],
      modes: {
        default: [
          'drag-canvas',
          'zoom-canvas',
          'dice-mindmap',
        ],
      },
      defaultNode: {
        type: 'tree-node',
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
      },
      layout: {
        type: 'mindmap',
        direction: 'H',
        getHeight: () => {
          return 16;
        },
        getWidth: (node) => {
          return node.level === 0 ?
            Util.getTextSize(node.name, 16)[0] + 12 :
            Util.getTextSize(node.name, 12)[0];
        },
        getVGap: () => {
          return 10;
        },
        getHGap: () => {
          return 60;
        },
        getSide: (node) => {
          return node.data.direction;
        },
      },
      defaultEdge: {
        type: 'cubic-horizontal',
        style: {
          lineWidth: 2,
        },
      },
      minZoom: 0.5,
    })
  }

  render(treeData) {
    this.destroy();
    const graph = this.cache.graph = this.initGraph();
    graph.data(dataTransform(treeData));
    graph.render();
    graph.fitCenter();
    graph.zoomTo(1);

    graph.on('node:click', evt => {
      const name = evt.target.get('action');
      if (name === 'query') {
        this.callback['nodeClick:query'].forEach(cb => {
          cb(evt);
        })
      }
      if (name === 'remove') {
        this.callback['nodeClick:remove'].forEach(cb => {
          cb(evt);
        })
      }
    });
    // if (typeof window !== 'undefined') {
    //   window.onresize = () => {
    //     if (!graph || graph.get('destroyed')) return;
    //     if (!container || !container.scrollWidth || !container.scrollHeight) return;
    //     graph.changeSize(container.scrollWidth, container.scrollHeight);
    //   };
    // }
  }
  getGraph() {
    return this.cache.graph;
  }
  onEvent(name, callback) {
    const supportEvents = ['nodeClick:query', 'nodeClick:remove'];
    if (!supportEvents.includes(name)) {
      console.warn('监听事件类型不支持，以下是监听事件类型：');
      console.table(supportEvents);
      return;
    }
    if (!this.callback[name]) {
      this.callback[name] = [];
    }
    this.callback[name].push(callback);
  }
  remove(item) {
    this.cache.graph.remove(item);
  }
  resetLayout() {
    this.cache.graph.layout(false);
  }
}
