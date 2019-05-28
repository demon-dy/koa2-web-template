import UserDao from '../dao/user';
import BaseService from '../../lib/base-service';
import statusCode from "../../utils/status-code";
class UserServer extends BaseService{
    constructor() {
        super(UserDao);
    }
    
}

export default new UserServer();