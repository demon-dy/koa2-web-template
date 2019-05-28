require('dotenv').config();
const config = {
    user:"postgres",
    password:"admin",
    database:"test-template",
    host:"localhost",
    port:5432,
    dialect: 'postgres',
    
    // 扩展属性
    idle:10000, // 连接最大空闲时间 3s
    max:50, // 连接池最大连接数
};
export default config;
