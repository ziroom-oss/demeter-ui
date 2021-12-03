import Request from './Request';

class MonthReport {

    constructor(){
        this.http = new Request({ prefixURL: '/api/monthReport' });
    }

    slaAll(data){
        return this.http.post('/slaAll', data);
    }

    busSupportAll(data){
        return this.http.post('/busSupportAll', data);
    }

    devEffiTollAll(data){
        return this.http.post('/devEffiTollAll', data);
    }

    oapSupportAll(data){
        return this.http.post('/oapSupportAll', data);
    }



}

export default new MonthReport();