const koa = require('koa');
const app = new koa();
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
app.use(json());
app.use(bodyparser({
    enableTypes:['json', 'form', 'text']
}));
// 挂载全部的中间件
require('./middleware')(app);


app.listen(5000, () => {
	console.log('服务已经启动,请直接访问localhost:5000');
});