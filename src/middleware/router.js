/**
* @idemon: 创建与 2019/5/28
* @auther: 杜宇 demonduyu@163.com
* @function:
*/
import { resolve } from 'path';
import Route from 'koa2-router-decors';
import glob from "glob";
// 可以写到config中统一配置
const API_VERSION = '/api';
/**
 * @Description: 反转路径的方法
 * @param {String} 
 * @return: 
 */
const dir = path => resolve(__dirname, path);

/**
 * @Description: 路由中间件读取controllers中的装饰器配置
 * @param {type} 
 * @return: 
 */
export default (app) => {
	const apiPath = dir('../app/controllers/');
	const route = new Route(app, apiPath, API_VERSION);
	route.init();
};
