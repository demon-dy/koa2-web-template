/**
* @idemon: 创建与 2019/5/28
* @auther: 杜宇 demonduyu@163.com
* @function: 根据sql语句生成响应的模板文件
*/
const fileUtils = require('./file-utils');
const config = require('../config/db-config');
const pg = require('pg');
const conStr = `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;



// 主函数 - 参数：数据库中的表名称
gen('data_dictionary');



/**
 * 根据数据库中的表名获取表借口
 * @param tableName
 * @returns {Promise<void>}
 */
async function gen(tableName){
	let client = new pg.Client(conStr);
	let showTable = `SELECT table_name as tableName, column_name as columnName, column_default as columnDefault, is_nullable as isNullable, udt_name as udtName
FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${tableName}'`;
	let tableColumnList = await pgSqlOne(client, showTable);
	let templeMap = new Map();
	let modelsList = {};
	// 解析表结构
	handelTableColumn(tableColumnList, templeMap, modelsList);
	// 异步生成文件
	// 生成models文件
	createFileModels('/app/models/', templeMap, modelsList);
	// 生成dao文件
	createFileCommon('/app/dao/', 'template-dao.txt', templeMap, modelsList);
	// 生成service文件
	createFileCommon('/app/service/', 'template-service.txt', templeMap, modelsList);
	// 生成controller文件
	createFileCommon('/app/controllers/', 'template-controller.txt', templeMap, modelsList);
 
}

/**
 * 解析表结构的数组语句，
 * @param tableColumnList
 * @param templeMap
 * @param modelsList
 */
function handelTableColumn(tableColumnList, templeMap, modelsList) {
	// 获取每一行的数据
	for(let j = 0, len = tableColumnList.length; j < len; j++){
		let rowInfo = tableColumnList[j];
		if(j === 0 ) {
			// 第一行，获取表名称
			templeMap.set('tableName', rowInfo.tablename);
			templeMap.set('fileName', toConnectingLine(rowInfo.tablename));
			templeMap.set('className', firstUpperCase(camelCase(rowInfo.tablename)));
			templeMap.set('routerName', toItalicLine(rowInfo.tablename));
		}
		let attributes = {};
		// 获取类型
		if(rowInfo.udtname.includes('_int')) {
			attributes.type = 'DataTypes.ARRAY(DataTypes.INTEGER)';
		}  else if(rowInfo.udtname.includes('int')) {
			attributes.type = 'DataTypes.INTEGER()';
		} else if(rowInfo.udtname.includes('_varchar')) {
			attributes.type = 'DataTypes.ARRAY(DataTypes.STRING)';
		} else if(rowInfo.udtname.includes('varchar')) {
			attributes.type = 'DataTypes.STRING()';
		} else if(rowInfo.udtname.includes('timestamp')) {
			attributes.type = 'DataTypes.DATE()';
		}
		// 封装默认值
		attributes.allowNull = rowInfo.isnullable === 'YES';
		// 封装默认值
		if(rowInfo.columndefault !== null && rowInfo.columndefault.includes('nextval') && rowInfo.columndefault.includes('id_seq')){
			// 表示为主键
			attributes.primaryKey = true;
			attributes.autoIncrement = true;
		} else if (rowInfo.columndefault !== null) {
			attributes.defaultValue = rowInfo.columndefault;
		}
		
		if(rowInfo.columnname === 'create_time' || rowInfo.columnname === 'update_time' ) {
			attributes.defaultValue = 'sequelize.literal("CURRENT_TIMESTAMP")';
		}
		attributes.field = rowInfo.columnname;
		modelsList[camelCase(rowInfo.columnname)] = attributes;
		
	}
}

/**
 * 解析ddl语句，
 * @param ddlSQL
 * @param templeMap
 * @param modelsList
 * let ddlSQL = "CREATE TABLE \"public\".\"sys_role\" (\n" +
		"  \"id\" int4 NOT NULL DEFAULT nextval('sys_role_id_seq'::regclass),\n" +
		"  \"modules\" varchar(255)[] COLLATE \"pg_catalog\".\"default\",\n" +
		"  \"name\" varchar(255) COLLATE \"pg_catalog\".\"default\" NOT NULL,\n" +
		"  \"create_id\" int4,\n" +
		"  \"status\" int2 NOT NULL DEFAULT 1,\n" +
 		"  \"status\" int4 NOT NULL,\n" +
 		"  \"create_time\" timestamptz(6),\n" +
		"  CONSTRAINT \"sys_role_pkey\" PRIMARY KEY (\"id\")\n" +
		")";
 */
function handelDDLSql(ddlSQL, templeMap, modelsList) {
	// 获取每一行的数据
	const regex = /"([^"]*)"/ig;
	let ddlROW = ddlSQL.split('\n');
	for(let j = 0, len = ddlROW.length; j < len; j++){
		let temStr = ddlROW[j].match(regex);
		if(temStr && temStr.length > 0) {
			if(j === 0 ) {
				// 第一行，获取表名称
				templeMap.set('tableName', deleteQuo(temStr[1]));
				templeMap.set('fileName', toConnectingLine(deleteQuo(temStr[1])));
				templeMap.set('className', firstUpperCase(camelCase(deleteQuo(temStr[1]))));
				templeMap.set('routerName', toItalicLine(deleteQuo(temStr[1])));
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
					attributes.defaultValue = lastStr.substr(lastStr.indexOf('DEFAULT')+'DEFAULT'.length+1, lastStr.substr(lastStr.indexOf('DEFAULT')+'DEFAULT'.length+1).length -1);
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
				modelsList[camelCase(deleteQuo(temStr[0]))] = attributes;
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
async function createFileCommon(path, templeFileName, templeMap, modelsList) {
	let dirBool = await fileUtils.createDirectory(path);
	console.log(templeFileName+'-创建文件夹是否成功：'+ dirBool);
	// 读取模板文件
	let fileContent = await fileUtils.readFile('/utils/template-file', templeFileName);
	fileContent = fileContent.replace(/\${className}/g, templeMap.get('className'));
	fileContent = fileContent.replace(/\${fileName}/g, templeMap.get('fileName'));
	fileContent = fileContent.replace(/\${routerName}/g, templeMap.get('routerName'));
	// 创建文件
	let createFileBool = await fileUtils.createFile(path, templeMap.get('fileName')+'.js', fileContent);
	console.log(templeFileName+'-创建DAO文件是否成功：'+ createFileBool);
}

/**
 * 生成models文件
 * @param path
 * @param templeMap
 * @param modelsList
 * @returns {Promise<void>}
 */
async function createFileModels(path, templeMap, modelsList) {
	// 创建文件夹
	let dirBool = await fileUtils.createDirectory(path);
	console.log('创建Models文件夹是否成功：'+ dirBool);
	// 读取模板文件
	let fileContent = await fileUtils.readFile('/utils/template-file', 'template-models.txt');
	fileContent = fileContent.replace(/\${tableName}/g, templeMap.get('tableName'));
	let attributes = '{\n';
	for(let key in modelsList) {
		// console.log(key)
		attributes += `\t\t${key}: {\n`;
		let arrtObj = modelsList[key];
		for(let attrKey in arrtObj) {
			// console.log('\t'+arrtObj[attrKey])
			attributes += `\t\t\t${attrKey}: ${ attrKey=== 'field' ?'\''+arrtObj[attrKey]+'\'':arrtObj[attrKey] },\n`;
		}
		attributes = attributes.substr(0, attributes.length-2) + '\n\t\t},\n';
	}
	attributes = attributes.substr(0, attributes.length-2) + '\n\t}';
	fileContent = fileContent.replace(/\${attributes}/g, attributes);
	// 创建文件
	let createFileBool = await fileUtils.createFile(path, templeMap.get('fileName')+'.js', fileContent);
	console.log('创建Models文件是否成功：'+ createFileBool);
    
}

// 执行一条sql语句
function pgSqlOne(client, sql) {
	return new Promise((resolve, reject)=> {
		client.connect(function (err) {
			if (err) {
				return console.error('could not connect to postgres', err);
			}
			client.query(sql, [], function (isErr, rst) {
				console.log('当前指定sql语句为：', sql);
				if (isErr) {
					console.error('sql执行失败:' + isErr.message);
					resolve(isErr);
				} else {
					console.log('sql执行成功, data is: ' + rst);
					resolve(rst.rows);
				}
				client.end();
			});
		});
	});
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
	return str.charAt(0).toUpperCase() + str.slice(1);
}
// 去除字符串两边的引号
function deleteQuo (str) {
	return str.replace(/\"/g, '');
}



