import Request from './base';

class PortraitPerson {
    constructor() {
        this.http = new Request({ prefixURL: '/api/portrait/person' });
    }

    getUserGrowingupInfo(param){
        return this.http.get('/growingup?uid=' + param);
    }

    getDevlopPortraitData(param){
        return this.http.post('/devlop', param);
    }

    getDevlopPortraitByTeam(param) {
        return this.http.post('/devlopPortraitByTeam', param);
    }

    getProjectPortraitData(param) {
        return this.http.post('/project', param);
    }
}

export default new PortraitPerson();