# react-manage system
## 项目启动 
### 安装依赖
work/client/npm i
work/server/npm i
### 前端启动
正常进入client目录执行npm run start，启动3000，执行npm run build， build 目录打开 http://localhost:3001/index.html，
### 后端启动
进入work/server目录，npm run start 启动3001端口
## 接口文档
### 目录
1）数据查询接口: 接收查询参数，查询数据库中符合条件的数据并返回结果；
http://localhost:3002/api/data/query
2）数据添加接口：接收新增数据信息，包括数据的名称、描述、时间等信息和所属标签的ID，保存到数据库中；
http://localhost:3001:/api/data

3）数据编辑接口：接收编辑数据信息，包括数据的名称、描述、时间等信息和所属标签的ID，更新数据库中的数据；
http://localhost:3002/api/data:id
4）数据删除接口：接收删除数据的ID，从数据库中删除该数据并返回删除成功消息；
http://localhost:3002/api/data:id
5）标签查询接口：查询数据库中的标签并返回结果；

6）标签添加接口：接收新增标签信息，保存到数据库中并返回保存后的标签信息；
7）标签编辑接口：接收编辑标签信息，更新数据库中的标签信息并返回更新后的标签信息；
8）标签删除接口：接收删除标签的ID，从数据库中删除该标签并返回删除成功信息；


