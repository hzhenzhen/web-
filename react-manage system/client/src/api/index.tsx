import ajax from './ajax';
const BASE='';
// 获取数据接口
export const DataGet = (user: any) => ajax(BASE+'/api/data', user, 'POST');
// 1）数据查询接口: 接收查询参数，查询数据库中符合条件的数据并返回结果；
export const DataQuery = (user: any) => ajax(BASE+'api/manage/user/query', user, 'POST');

// 2）数据添加接口：接收新增数据信息，包括数据的名称、描述、时间等信息和所属标签的ID，保存到数据库中；
export const DataAdd = (user: any) => ajax('api/manage/user/add', user, 'POST');
// 3）数据编辑接口：接收编辑数据信息，包括数据的名称、描述、时间等信息和所属标签的ID，更新数据库中的数据；
export const DataEdit = (user: any) => ajax('api/manage/user/edit', user, 'POST');
// 4）数据删除接口：接收删除数据的ID，从数据库中删除该数据并返回删除成功消息
export const DataDel = (user: any) => ajax('api/manage/user/del', user, 'POST');
//5） 标签查询接口：查询数据库中的标签并返回结果；
export const TagQuery = (user: any) => ajax('api/manage/tag/query', user, 'POST');
// 6)标签添加接口
export const TagAdd=(user: any) => ajax('api/manage/tag/add', user, 'POST');
//7） 标签编辑接口：接收编辑标签信息，更新数据库中的标签信息并返回更新后的标签信息；；
export const TagEdit = (user: any) => ajax('api/manage/tag/edit', user, 'POST');
//8） 标签删除接口：接收编辑标签信息，更新数据库中的标签信息并返回更新后的标签信息；；
export const TagDel = (user: any) => ajax('api/manage/tag/del', user, 'POST');
// 9)语言切换接口
export const LanguageToggle = (user: any) => ajax('api/manage/user/langtoggle', user, 'POST');
// 10)语言查询接口
export const LanguageQuery = (user: any) => ajax('api/manage/user/langquery', user, 'POST');