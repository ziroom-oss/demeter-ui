import Request from './base';

class NewMapSkill {
    constructor() {
        this.http = new Request({ prefixURL: '/api/map' });
    }

    // 以下所有接口是 图谱+技能点相关
    // 按 mapId 获取所有记录
    listMapSkillsByMapId(id, { skillTaskIds }) {
        //return this.http.post('/${id}/mapRelTask', skillTaskIds);
        return this.http.post(`/skill/${id}/skills`, skillTaskIds);
    }
}

export default new NewMapSkill();
