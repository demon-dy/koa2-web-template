const http = require('http');


let parseParam = function(param) {
    let paramStr = "";
    for(let i in param) {
        paramStr += "&" + i + "=" + encodeURIComponent(param[i]);
    }
    return paramStr.substr(1);
};
module.exports = {
    get: async (url) => {
       return new Promise((resolve, reject) => {
           http.get(url, (res) => {
               res.setEncoding('utf8');
               let rawData = '';
               res.on('data', (chunk) => { rawData += chunk; });
               res.on('end', () => {
                   try {
                       console.log(rawData);
                       resolve(rawData);
                   } catch (e) {
                       console.error(e);
                       reject(e);
                   }
               });
           }).on('error', (e) => {
               console.error(`错误: ${e}`);
               reject(e);
           });
       })
    },
    getByObj: async (url,params) => {
       url += '?' + parseParam(params);
       return new Promise((resolve, reject) => {
           // http://s99999.mrhx.hz.37.com.cn:5555/pay?drid=300001&remake=x&drlevel=2&dext=KOG_EXT&oid=sq111111&sign=&coin=60&pid=1&money=3&drname=%5B1%5D%E5%93%88%E7%BB%B4%E9%98%BF%E5%B0%94%E6%96%87&uid=1242997817&paid=x&gid=1004040&dsid=1&time=10000&doid=1242997817609886169328002%20&it_flag=0000
           http.get(url, (res) => {
               res.setEncoding('utf8');
               let rawData = '';
               res.on('data', (chunk) => { rawData += chunk; });
               res.on('end', () => {
                   try {
                       console.log(rawData)
                       resolve(rawData);
                   } catch (e) {
                       console.error(e);
                       reject(e);
                   }
               });
           }).on('error', (e) => {
               console.error(`错误: ${e}`);
               reject(e);
           });
       })
    },
    asyncGetByObj: async (url,params) => {
        url += '?' + parseParam(params);
        // http://s99999.mrhx.hz.37.com.cn:5555/pay?drid=300001&remake=x&drlevel=2&dext=KOG_EXT&oid=sq111111&sign=&coin=60&pid=1&money=3&drname=%5B1%5D%E5%93%88%E7%BB%B4%E9%98%BF%E5%B0%94%E6%96%87&uid=1242997817&paid=x&gid=1004040&dsid=1&time=10000&doid=1242997817609886169328002%20&it_flag=0000
        http.get(url, (res) => {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    console.log(rawData)
                } catch (e) {
                    console.error(e);
                }
            });
        }).on('error', (e) => {
            console.error(`错误: ${e}`);
        });
    },
}