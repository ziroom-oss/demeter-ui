import Request from './base';

class Report {
    constructor() {
        this.http = new Request({ prefixURL: '/api/report/month' });
    }

    getCorePoint(param) {
        return this.http.post('/corePoint', param);
    }

    getBusinessPoint(param) {
        return this.http.post('/businessPoint', param);
    }

    getDevEffiTollRelatePoint(param){
        return this.http.post('/devEffiTollRelatePoint', param);
    }

    getOapSupportRelatePoint(param) {
        return this.http.post('/oapSupportRelatePoint', param);
    }
}

export default new Report();