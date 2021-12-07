import G6 from '@antv/g6';

const {
  Util
} = G6;

/**
 * 由一维数组 nodes 构建嵌套结构树
 * 根据每一 node 的 parentId 属性寻找其父节点，并将其推入到该父节点的 children[]
 *
 * @param {array} nodes [{ id, name, parentId }]
 * @param mapSkills
 * @return {object} memo 由 node.id: node 键值对构成的对象
 */
export function buildTreeByNodes(nodes, mapSkills) {
  const memo = {};

  nodes.forEach(node => {
    if (!memo[node.id]) {
      memo[node.id] = node;
      node.children = [];
    }
  });

  mapSkills.forEach(skill => {
    skill.name = skill.skillName;
    memo[skill.id] = skill;

    skill.parentId = memo[skill.skillTreeId].id;

    // 递归遍历 mapSkills 往上寻找每一个父节点并作标记
    // 没有该标记的节点将被删除
    recuriveSetPath(skill, memo);
  })
  function recuriveSetPath(node, memo) {
    node.path = true;
    if (memo[node.parentId]) {
      recuriveSetPath(memo[node.parentId], memo);
    }
  }
  // 删除没有标记的节点
  Object.entries(memo).forEach(function ([key, value]) {
    if (!value.path) {
      delete memo[key]
    }
  })

  // 找到 mapSkill 往上的父节点，然后在整体 memo 找到以该节点为父节点的所有节点，
  // 当这些节点都满足，则设置该父节点 isFinished:true；
  // 反之，如果存在某个节点不满足，则无必要继续递归这条路径
  mapSkills.forEach(ms => {
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
 * G6 自定义节点
 * 需要在初始化前执行
 */
const statusMap = {
  0: '#000',
  2: '#00BFFF',
  3: '#F0E68C',
  4: '#90EE90',
  5: '#F08080',
}
export function registerNode() {
  G6.registerNode('dice-mind-map-root', {
    jsx: (cfg) => {
      const width = Util.getTextSize(cfg.name, 16)[0] + 24;
      const stroke = cfg.style.stroke || '#096dd9';
      const fill = cfg.style.fill;
      return `
        <group>
            <rect style={{width: ${width}, height: 42, stroke: ${stroke}, radius: 4}} keyshape>
                <text style={{ fontSize: 16, marginLeft: 12, marginTop: 12 }}>${cfg.name}</text>
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
      const color = cfg.color || cfg.style.stroke;
      return `
        <group>
            <rect style={{width: ${width + 24}, height: 22}} keyshape>
                <text style={{fontSize: 14, marginLeft: 12, marginTop: 6}}>${cfg.name}</text>
            </rect>
            <rect style={{ fill: '#e8e8e8', width: ${width + 24}, height: 2, x: 0, y: 22 }} />
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
      const color = statusMap[cfg.status];
      if (cfg.skillTaskId) {
        return `
          <group>
            <rect draggable="true" style={{width: ${width + 20}, height: 26, fill: 'transparent' }}>
              <text style={{ fontSize: 12, marginLeft: 12, marginTop: 6 }}>${cfg.name}</text>
                  <text
                    style={{ marginLeft: ${width - 8}, marginTop: -10, stroke: ${color}, fill: '#000', cursor: 'pointer', opacity: ${cfg.hover ? 0.75 : 0}, next: 'inline' }}
                    action="query">🔍</text>
            </rect>
            <rect style={{ fill: '#e8e8e8', width: ${width + 24}, height: 2, x: 0, y: 32 }} />
          </group>
      `;
      }
      return `
        <group>
            <rect style={{width: ${width + 24}, height: 22}} keyshape>
                <text style={{fontSize: 14, marginLeft：12, marginTop: 6}}>${cfg.name}</text>
            </rect>
            <rect style={{ fill: '#e8e8e8', width: ${width + 24}, height: 2, x: 0, y: 22 }} />
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
 * G6 图形树初始化
 */
export function graphInit({ container, width, height }) {
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
  });
}
