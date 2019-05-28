import { controller, get, post, required } from 'koa2-router-decors';
import statusCode from '../utils/status-code';
import UserServer from "../app/service/user";

export default class BaseController {
	constructor(BaseService) {
		this.BaseService = BaseService;
	}
	
}
