/**
 * 权限异常表
 *  200 正常
 *  590 权限异常
 *  591 用户未登录
 *  592 token失效
 
 *  402 校验异常 - 前台参数少传输
 *  403 校验异常 - 后台校验前台参数
 *  404 没有数据
 
 *  501 服务器操作异常
 *  500 服务器报错异常
 */

const statusCode = {
    // 服务器报错异常
    ERROR_500: (message) => {
        return {
            code: 500,
            message
        }
    },
    // 服务器操作异常
    ERROR_501: (message) => {
        return {
            code: 501,
            message
        }
    },
    // 没有数据
    ERROR_404: (message) => {
        return {
            code: 404,
            message
        }
    },
    // 前端参数校验异常
    ERROR_402: (message) => {
        return {
            code: 402,
            message
        }
    },
    // 服务器校验异常
    ERROR_403: (message) => {
        return {
            code: 403,
            message
        }
    },
    // token失效
    ERROR_592: (message) => {
        return {
            code: 592,
            message
        }
    },
    // 用户未登录
    ERROR_591: (message) => {
        return {
            code: 591,
            message
        }
    },
    // 权限异常
    ERROR_590: (message) => {
        return {
            code: 590,
            message
        }
    },
    
    // 自定义异常
    ERROR_AOTU: (code,message) => {
        return {
            code: code,
            message
        }
    },

    SUCCESS_200: (message, data) => {
        return {
            code: 200,
            message,
            data,
        }
    }
};

module.exports = statusCode;