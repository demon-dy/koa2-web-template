import statusCode from "../utils/status-code";

/**
* @idemon: 创建与 2019/5/28
* @auther: 杜宇 demonduyu@163.com
* @function: 定义公共的server
*/

export default class BaseService {
	constructor(BaseDao) {
		this.BaseDao = BaseDao;
	}
    
    /**
	 * 查找所有
     */
    async findAll() {
        return await this.BaseDao.findAll();
    }
    async findById(id) {
        return await this.BaseDao.findById();
    }
    
    /**
	 * 创建
     */
    async create(module) {
        return await this.BaseDao.create(module);
    }
    
    /**
	 * 修改
     */
    async updateById(module) {
        return await this.BaseDao.updateById(module);
    }
    
    /**
	 * 删除
     */

    async logicDeleteById(id) {
        return await this.BaseDao.logicDeleteById(id);
    }
}
