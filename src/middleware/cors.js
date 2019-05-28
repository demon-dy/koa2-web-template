/**
* @idemon: 创建与 2019/5/28
* @auther: 杜宇 demonduyu@163.com
* @function: 
*/
const cors = require('koa2-cors');
export default async (ctx, next) => {
	cors({
		origin: function (ctx) {
			if (ctx.url === '/test') {
				return false;
			}
			return '*';
		},
		exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
		maxAge: 5,
		credentials: true,
		allowMethods: ['HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
		allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
	});
	await next();
};