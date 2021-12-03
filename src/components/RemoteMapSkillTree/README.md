# 技能树说明书

```javascript
// 实例化
const graphTree = new GraphTree({
mount: '#MapSkillTree-StudyList'
});

// 直接从 DemeterSkillTask 返回的数据，如果要生成树图必须作以下修改
const source = skillTasks.map(skillTask => {
  skillTask.name = skillTask.taskName;
  skillTask.skillTreeId = skillTask.skillId;
  skillTask.skillTaskId = skillTask.id;
})

/**
 * 调用 setState 传入数据并触发渲染
 * name 图谱名称
 * nodes 是技能树技能节点（非技能点，因为技能点的 parentId 是它的 id）
 * source 是传入的技能点列表
 */
graphTree.setState({ name, nodes, source });

/**
 * 监听点击事件，当前仅支持 nodeClick:query 和 nodeClick:remove 两种事件
 * query 事件需要为传入的 source 类型添加 skillTaskId 属性
 * remove 需要为 source 类型添加 isDynamicLeaf: true 属性
 */
graphTree.onEvent('nodeClick:query', evt => {});
```