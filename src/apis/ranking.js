import Request from './Request';

class Ranking {
    constructor() {
        this.http = new Request({ prefixURL: '/api/rankinglist' });
        }

    individualSkillMap(data){
        return this.http.post('/getIndividualSkillmapInfo', data);
    }
    individualPro(data){
        return this.http.post('/getAllIndividualProjectIndiactorInfo', data);
    }
   
    deptSkillMap(data){
        return this.http.post('/getDeptSkillmapInfo', data);
    }
    deptPro(data){
        return this.http.post('/getAllDeptrojectIndiactorInfo', data);
    }

}

export default new Ranking();