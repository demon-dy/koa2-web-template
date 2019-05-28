import cors from './cors';
import router from './router';
import interceptor from './interceptor';
/**
* @idemon: 创建与 2019/5/28
* @auther: 杜宇 demonduyu@163.com
* @function:
*/
module.exports = (app) => {
	// 使用跨域
	app.use(interceptor());
	// app.use(error());
	app.use(cors);
	router(app); // 加载路由中间件
	// app.use(error);
};