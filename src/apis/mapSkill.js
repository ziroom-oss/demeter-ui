import Request from './Request';
class MapSkill {
    constructor() {
        this.http = new Request({ prefixURL: '/api/map' });
    }

    // 以下所有接口是 图谱+技能点相关
    // 按 mapId 获取所有记录
    listMapSkillsByMapId(id, { skillTaskIds }) {
        return this.http.post(`/skill/${id}/skills`, skillTaskIds);
    }
    // 按 mapId 获取图形树
    getMapSkillTreeByMapId(id) {
        return this.http.get(`/skill/${id}/tree`);
    }
    // 创建图谱和技能点的关联
    saveMapSkill(params) {
        return this.http.post('/skill/', params);
    }
    // 移除指定 id 的记录
    deleteMapSkill(id) {
        return this.http.delete('/skill/' + id);
    }
    // 按 id 修改记录
    updateMapSkill(id, params) {
        return this.http.patch('/skill/' + id, params);
    }
    // 获取职级列表
    getTechRanks() {
        return this.http.get('/skill/job/levels');
    }
    // 查询记录
    getMapSkillsByCondition(params) {
        return this.http.post('/skill/search', params);
    }

    // 技能图谱汇总数据
    getSkillGraphData() {
        return this.http.post('/data');
    }
}

export default new MapSkill();
