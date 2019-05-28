### KOA2快速开发脚手架
前述：
   
    经过了几个koa2开发的web项目之后，发现有很多造轮子的地方，现在也有很多脚手架工具，但是很多都是前端思想，该模板结合java开发经验，将一些常用工具封装起来，使用注解来导出路由，方便下一个项目的开发。
    
    在后续需求变更下，会逐步完善该模板，当前版本连接的postgre，使用mysql的小伙伴可以更改/src/config/db-config.js 中的配置文件，下面会有详细说明。
    
### 项目目录说明  
    所有的代码文件均放在src目录下，当前版本使用babel支持ES6语法
    app 目录主要写开发的逻辑流程

        --controllers为视图层，主要处理请求参数

        --service为逻辑处理层，主要处理业务逻辑结构

        --dao为持久层，主要处理sql语句的执行

        --model为实体类，存储了orm框架的支持

    config 存储了数据库的基本配置

        --db-config.js sql配置文件
        
        --secret.json 设置jwt的盐值

    lib 中封装了逻辑代码的常用操作，app中部分文件会继承其中的class,并且设置了log4j存放的目录
    
    logs 日志存放目录，在启动项目后访问接口即可自动创建
    
    middelware 存储了本项目所用的中间件：路由、跨域、拦截器

    utils 工具文件夹
        --auto-generate.js 根据sql的DDL语句生成app下逻辑代码，并且可直接访问
        --template-file 上述文件中使用模板文件
        --status-code.js 返回响应的格式
        --logs.js 打印日志
        --file-utils.js 文件操作
        --http-urils.js 发送http请求（这个没有封装好...有待完成）
    
    index.js 主要运行文件，其中定义了访问端口号

### 运行说明：
  从git上clone下来之后，先进行初始胡：
  
    npm install
    
  初始化完毕之后，运行项目
  
    node start 或 npm start
    
  初始化数据库：
```
    CREATE TABLE "public"."auth_user" (
      "id" serial primary key,
      "username" varchar(255) COLLATE "pg_catalog"."default",
      "password" varchar(255) COLLATE "pg_catalog"."default",
      "source" int2 DEFAULT 0,
      "nick_name" varchar(255) COLLATE "pg_catalog"."default",
      "status" int2 NOT NULL DEFAULT 1,
      "version" varchar(255) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 0,
      "create_time" timestamp(0) NOT NULL,
      "update_time" timestamp(0) NOT NULL,
      CONSTRAINT "auth_user_pkey" PRIMARY KEY ("id")
    );
```
### 开发说明:
1.首先设计数据库
    假设您以设计出设计库
```
    CREATE TABLE "public"."data_dictionary" (
      "id" int4 NOT NULL DEFAULT nextval('data_dictionary_id_seq'::regclass),
      "project_id" int4,
      "type" varchar(255) COLLATE "pg_catalog"."default",
      "val" varchar(255) COLLATE "pg_catalog"."default",
      "desc" varchar(255) COLLATE "pg_catalog"."default",
      "create_time" timestamp(0),
      "update_time" timestamp(0),
      "status" int2 DEFAULT 1,
      "priority" int4 NOT NULL DEFAULT 0,
      CONSTRAINT "data_dictionary_pkey" PRIMARY KEY ("id")
    )
```
    然后将您生成数据库表的sql语句原封不动的复制到 /utils/auto-generate.js 文件中赋值给 ddlSQL 属性，第21行，把原有ddl语句删除掉
    打开cmd进入/src/utils 文件中，执行当前文件 :
        node auto-generate.js
    会自动在app目录下生成相应的mvc格式代码
2.设置路由
    路由的统一前缀在/src/middleware/router.js 中的API_VERSION 属性配置
    在/src/app/controllers文件中进行路由设置：
```
    @controller('/user')
    export class UserController {
    	constructor() {}
        @get('/findAll')
        async findAll(ctx) {
            ctx.log.resourceDesc = '查找全部数据';
            const result = await UserServer.findAll();
            ctx.body = statusCode.SUCCESS_200('查找成功',result);
        }
    }
```
    访问：localhost:5000/api/user/findAll
    