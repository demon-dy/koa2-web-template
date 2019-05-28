import { controller, get, post, put, del } from 'koa2-router-decors';
import UserServer from '../service/user';
import statusCode from "../../utils/status-code";
@controller('/user')
export class UserController {
	constructor() {}
    @get('/findAll')
    async findAll(ctx) {
        ctx.log.resourceDesc = '查找全部数据';
        const result = await UserServer.findAll();
        ctx.body = statusCode.SUCCESS_200('查找成功',result);
    }
    @get('findById/:id')
    async findById(ctx) {
        ctx.log.resourceDesc = '根据id查找数据';
        const result = await UserServer.findById(ctx.params.id);
        ctx.body = statusCode.SUCCESS_200('查找成功',result);
    }
    @post('/')
    async create(ctx) {
        ctx.log.resourceDesc = '新增数据';
        const result = await UserServer.create(ctx.body);
        ctx.body = statusCode.SUCCESS_200('新增成功',result);
    }
    @put('/')
    async update(ctx) {
        ctx.log.resourceDesc = '修改数据';
        const result = await UserServer.updateById(ctx.body.id);
        ctx.body = statusCode.SUCCESS_200('修改成功',result);
    }
    @del('/')
    async delete(ctx) {
        ctx.log.resourceDesc = '逻辑删除数据';
        const result = await UserServer.logicDeleteById(ctx.body.id);
        ctx.body = statusCode.SUCCESS_200('修改成功',result);
    }
    
}
