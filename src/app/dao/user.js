/**
* 由模板自动生成
*/
import { dbSequelize } from '../../config';
import BaseDao from '../../lib/base-dao';
const UserModel = dbSequelize.import('./../models/user');
UserModel.sync({force: false});
class UserDao extends BaseDao {
	constructor() {
		super(UserModel);
	}
	
}

export default new UserDao();