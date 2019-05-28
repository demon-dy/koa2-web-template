/**
* @idemon: 创建与 2019/5/28
* @auther: 杜宇 demonduyu@163.com
* @function:
*/
import { dbSequelize } from '../config';
import statusCode from "../utils/status-code";
const dbUtils = require('../utils/db-utils');
export default class BaseDao {
	constructor(baseModule) {
        this.baseModule = baseModule;
	}
    
    /**
     * 根据sql,预编译执行
     * 分页
     * sql += ` limit ${searchParam.page.limit} OFFSET ${searchParam.page.offset}`
     * @param sql
     * @param replacements
     * @returns {Promise<*>} 数组
     */
    async findSqlByParamsToList(sql,replacements) {
        return dbUtils.getCallbackReturnList(sql,{
            replacements :replacements,
            type : dbSequelize.QueryTypes.SELECT,
            model: this.baseModule,
            mapToModel: true
        })
    }
    
    /**
     * 根据sql,预编译执行
     * @param sql
     * @param replacements
     * @returns {Promise<*>} 单个对象
     */
    async findSqlByParamsToOne(sql,replacements) {
        return dbUtils.getCallbackReturnOne(sql,{
            replacements :replacements,
            type : dbSequelize.QueryTypes.SELECT,
            model: this.baseModule,
            mapToModel: true
        })
    }
    
    async findAll() {
        return await this.baseModule.findAll();
    }
    
    /**
     * 根据状态查找
     * @param status
     * @returns {Promise<Array<Model>|*>}
     */
    async findAllByStatus(status) {
        return await this.baseModule.findAll({
            where: {
                status: status || 1
            }
        });
    }
    async findById(id) {
        return await this.baseModule.findByPk(id);
    }
    async create(module) {
        return await this.baseModule.create(module);
    }
    async updateById(module) {
        let result = await this.findById(module.id);
        let updateDO = {};
        for(let key in result){
            if(key === 'id') {break;}
            updateDO[key] = module[key] ? module[key] : result[key];
        }
        return result.update(updateDO);
    }
    async logicDeleteById(id) {
        return await this.baseModule.update({ status: 0, updateTime: new Date() }, { where:{ id:id } });
    }
   
    
}