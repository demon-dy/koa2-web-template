/**
* @idemon: 创建与 2019/5/28
* @auther: 杜宇 demonduyu@163.com
* @function: 根据sql语句生成响应的模板文件
*/
const fileUtils = require('./file-utils');
/*
标准格式： 一个属性占一行,直接从数据库中复制过来，下面的部分
CREATE TABLE "public"."sys_role" (
  "id" int4 NOT NULL DEFAULT nextval('sys_role_id_seq'::regclass),
  "modules" varchar(255)[] COLLATE "pg_catalog"."default",
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "create_id" int4,
  "system_id" int4,
  "status" int4 NOT NULL,
  "create_time" timestamptz(6)
)
*/

// 将要执行的sql语句 -- 注意从navicat中复制的DDL语句，不用复制以外的内容, 一定要严格要求DDL中的换行，因为：解析的时候是逐行解析
let ddlSQL = "CREATE TABLE \"public\".\"sys_role\" (\n" +
        "  \"id\" int4 NOT NULL DEFAULT nextval('sys_role_id_seq'::regclass),\n" +
        "  \"modules\" varchar(255)[] COLLATE \"pg_catalog\".\"default\",\n" +
        "  \"name\" varchar(255) COLLATE \"pg_catalog\".\"default\" NOT NULL,\n" +
        "  \"create_id\" int4,\n" +
        "  \"status\" int2 NOT NULL DEFAULT 1,\n" +
        "  \"status\" int4 NOT NULL,\n" +
        "  \"create_time\" timestamptz(6),\n" +
        "  CONSTRAINT \"sys_role_pkey\" PRIMARY KEY (\"id\")\n" +
        ")";
// 封装的DDL语句参数
let templeMap = new Map();
let modelsList = {};
// 解析DDL语句
handelDDLSql(ddlSQL,templeMap,modelsList);
// 生成models文件
createFileModels('/app/models/',templeMap,modelsList);
// 生成dao文件
createFileCommon('/app/dao/','template-dao.txt',templeMap,modelsList);
// 生成service文件
createFileCommon('/app/service/','template-service.txt',templeMap,modelsList);
// 生成controller文件
createFileCommon('/app/controllers/','template-controller.txt',templeMap,modelsList);


/**
 * 解析ddl语句，
 * @param ddlSQL
 * @param templeMap
 * @param modelsList
 */
function handelDDLSql(ddlSQL,templeMap,modelsList) {
    // 获取每一行的数据
    const regex = /\"([^\"]*)\"/ig;
    let ddlROW = ddlSQL.split('\n');
    for(let j = 0,len = ddlROW.length; j < len; j++){
        let temStr = ddlROW[j].match(regex);
        if(temStr && temStr.length > 0) {
            if(j === 0 ) {
                // 第一行，获取表名称
                templeMap.set('tableName',deleteQuo(temStr[1]));
                templeMap.set('fileName',toConnectingLine(deleteQuo(temStr[1])));
                templeMap.set('className',firstUpperCase(camelCase(deleteQuo(temStr[1]))));
                templeMap.set('routerName',toItalicLine(deleteQuo(temStr[1])));
            } else {
                if(ddlROW[j].includes('CONSTRAINT')){
                    continue;
                }
                let attributes = {};
                let lastStr = ddlROW[j].substr(ddlROW[j].indexOf(temStr[0])+temStr[0].length);
                // 获取类型
                if(lastStr.includes('int') && lastStr.includes('[]')) {
                    attributes.type = 'DataTypes.ARRAY(DataTypes.INTEGER)';
                }  else if(lastStr.includes('int')) {
                    attributes.type = 'DataTypes.INTEGER()';
                } else if(lastStr.includes('varchar') && lastStr.includes('[]')) {
                    attributes.type = 'DataTypes.ARRAY(DataTypes.STRING)';
                } else if(lastStr.includes('varchar')) {
                    attributes.type = 'DataTypes.STRING()';
                } else if(lastStr.includes('timestamp')) {
                    attributes.type = 'DataTypes.DATE()';
                }
                // 封装默认值
                attributes.allowNull = !lastStr.includes('NOT NULL');
                if(deleteQuo(temStr[0]) !== 'id' && lastStr.includes('DEFAULT')){
                    attributes.defaultValue = lastStr.substr(lastStr.indexOf('DEFAULT')+'DEFAULT'.length+1,lastStr.substr(lastStr.indexOf('DEFAULT')+'DEFAULT'.length+1).length -1)
                }
                if(deleteQuo(temStr[0]) === 'create_time' || deleteQuo(temStr[0]) === 'update_time' ) {
                    attributes.defaultValue = 'sequelize.literal("CURRENT_TIMESTAMP")';
                }
                // 封装属性参数
                if(deleteQuo(temStr[0]) === 'id') {
                    attributes.primaryKey = true;
                    attributes.autoIncrement = true;
                }
                attributes.field = deleteQuo(temStr[0]);
                modelsList[camelCase(deleteQuo(temStr[0]))] = attributes
            }
        }
    }
}

/**
 * 替换通用的参数
 * @param path
 * @param templeFileName
 * @param templeMap
 * @param modelsList
 * @returns {Promise<void>}
 */
async function createFileCommon(path,templeFileName,templeMap,modelsList) {
    let dirBool = await fileUtils.createDirectory(path);
    console.log(templeFileName+'-创建文件夹是否成功：'+ dirBool);
    // 读取模板文件
    let fileContent = await fileUtils.readFile('/utils/template-file',templeFileName);
    fileContent = fileContent.replace(/\${className}/g, templeMap.get('className'));
    fileContent = fileContent.replace(/\${fileName}/g, templeMap.get('fileName'));
    fileContent = fileContent.replace(/\${routerName}/g, templeMap.get('routerName'));
    // 创建文件
    let createFileBool = await fileUtils.createFile(path,templeMap.get('fileName')+'.js',fileContent);
    console.log(templeFileName+'-创建DAO文件是否成功：'+ createFileBool);
}

/**
 * 生成models文件
 * @param path
 * @param templeMap
 * @param modelsList
 * @returns {Promise<void>}
 */
async function createFileModels(path,templeMap,modelsList) {
    // 创建文件夹
    let dirBool = await fileUtils.createDirectory(path);
    console.log('创建Models文件夹是否成功：'+ dirBool);
    // 读取模板文件
    let fileContent = await fileUtils.readFile('/utils/template-file','template-models.txt');
    fileContent = fileContent.replace(/\${tableName}/g, templeMap.get('tableName'));
    let attributes = "{\n";
    for(let key in modelsList) {
        // console.log(key)
        attributes += `\t\t${key}: {\n`;
        let arrtObj = modelsList[key];
        for(let attrKey in arrtObj) {
            // console.log('\t'+arrtObj[attrKey])
            attributes += `\t\t\t${attrKey}: ${ attrKey=== 'field' ?'\''+arrtObj[attrKey]+'\'':arrtObj[attrKey] },\n`;
        }
        attributes = attributes.substr(0,attributes.length-2) + '\n\t\t},\n';
    }
    attributes = attributes.substr(0,attributes.length-2) + '\n\t}';
    fileContent = fileContent.replace(/\${attributes}/g, attributes);
    // 创建文件
    let createFileBool = await fileUtils.createFile(path,templeMap.get('fileName')+'.js',fileContent);
    console.log('创建Models文件是否成功：'+ createFileBool);
    
}

// 下划线转驼峰格式的数据
function camelCase(str){
    return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
        return $1 + $2.toUpperCase();
    });
}
// 下划线转连接线
function toConnectingLine(str){
    return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
        return $1 + '-' + $2;
    });
}
// 下划线转斜杠
function toItalicLine(str){
    return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
        return $1 + '/' + $2;
    });
}
// 首字母大写
function firstUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
// 去除字符串两边的引号
function deleteQuo (str) {
    return str.replace(/\"/g, "");
}



