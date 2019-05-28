/**
* @idemon: 创建与 2019/5/28
* @auther: 杜宇 demonduyu@163.com
* @function:
*/
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const util = require('util');
const verify = util.promisify(jwt.verify);
const statusCode = require('../utils/status-code');
const logsUtil = require('../utils/logs.js');

function getUserIp(req) {
    let ip = req.headers['x-real-ip'] ||
            req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0];
    }
    return ip;
}

async function getUser(ctx) {
    let token = ctx.request.headers["fancy-guo-login-token"];
    if(token) {
        try {
            let user = await verify(token, secret.sign);
            // 权限验证
            if (user) {
                ctx.user = user;
                ctx.log.userId = user.id;
            }
        } catch (e) {
            console.error(statusCode.ERROR_592('登录令牌失效，请退出后重新登录'));
        }
    }
}

/**
 * 判断token是否可用
 */
module.exports = function () {
    return async function (ctx, next) {
        // 解析用户信息
        console.log(`${ctx.method} ${ctx.url} - 请求开始 --------------------`);
        let log = {
            resourceUrl:'',// 请求url
            resourceDesc:'',// 请求url说明
            requestType:ctx.request.method,// 请求类型
            requestParams:'',// 请求参数
            
            responseCode:'',// 返回状态码
            responseMessage:'',// 返回提示
            responseDate:'',// 返回参数
            
            serverIp:'当前服务器id', // 当前服务器ip租房合同免费下载doc
            userIp: getUserIp(ctx.request),// 用户ip地址
            userId:null, // 用户url
            
            createTime:new Date().toLocaleString(),// 请求时间
            executionTime:0 // 执行时间
        };
        if(ctx.request.method === 'GET') {
            log.requestParams = JSON.stringify(ctx.request.query) || ctx.params;
        } else {
            log.requestParams = JSON.stringify(ctx.request.body)
        }
        ctx.log = log;
        await getUser(ctx);
        const start = new Date();
        try {
            await next();
        } catch (err) {
            // 有异常抛出
            console.error('异常',err);
            ctx.log.responseMessage = err.message;
            ctx.body = statusCode.ERROR_AOTU(err.code || 500, err.stack);
        }
        log = ctx.log;
        let intervals = new Date() - start;
        console.log(`${ctx.method} ${ctx.url} - 执行时间 - ${intervals} ms`);
        if(ctx.body) {
            // 如果有返回的body
            ctx.response.status = 200;
            log.responseCode = ctx.body.code;
            log.resourceUrl = ctx._matchedRoute;
            if(log.resourceUrl !== '/api/user/parse') {
                // 保存日志
                if(log.resourceUrl.startsWith('/user')) {
                    log.userParams = '用户信息，不可见';
                }
            }
        } else {
            ctx.body = '请求异常，请求接口不存在 或 响应返回！！！'
        }
        log.responseDate = ctx.body;
        logsUtil.logInfo(log);
        console.log(JSON.stringify(log),'\n-------------------- 请求结束');
    }
};



