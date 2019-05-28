/**
* @idemon: 创建与 2019/5/28
* @auther: 杜宇 demonduyu@163.com
* @function:
*/
const Sequelize = require('../config/db-sequelize');
module.exports ={
    // 执行sql查询语句，返回数组对象
    getCallbackReturnList : function (sql,parameter){
        return new Promise((resolve) => {
            Sequelize.query(sql,parameter).then(item => {
                let arr = item.map(value => value.dataValues );
                resolve(arr);
            })
        })
    },
    getCallbackReturnOne : function (sql,parameter){
        return new Promise((resolve) => {
            Sequelize.query(sql,parameter).then(item => {
                let arr = item.map(value => value.dataValues );
                if(arr.length > 0) {
                    arr = arr[0];
                }
                resolve(arr);
            })
        })
    }
};
