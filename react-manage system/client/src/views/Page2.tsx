import React, { useState, useEffect } from 'react';
import { Card, Space, Table, Button, Modal, Form, Input, Row, Col } from 'antd';
import axios from 'axios';
import type { ColumnProps } from 'antd/es/table';
import { useLanguage } from './LanguageContext'; // 导入 useLanguage 自定义 hook
interface DataType {
  id: number;
  tag: string;
}

const View: React.FC = () => {
  const { currentLanguage } = useLanguage(); // 获取当前语言状态
  const text = {
    tag: currentLanguage === 'zh' ? '标签' : 'Tag',
    name: currentLanguage === 'zh' ? '名称' : 'Name',
    operation: currentLanguage === 'zh' ? '操作' : 'Operation',
    search: currentLanguage === 'zh' ? '搜索' : 'Search',
    add: currentLanguage === 'zh' ? '添加' : 'Add',
    edit: currentLanguage === 'zh' ? '编辑' : 'Edit',
    delete: currentLanguage === 'zh' ? '删除' : 'Delete',
  };
  // 状态管理
  const [data, setData] = useState<DataType[]>([]);
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<DataType | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [searchValue, setSearchValue] = useState('');

  // 初始化数据
  useEffect(() => {
    fetchData();
  }, []);

  // 从服务器获取标签数据
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/tag');
      setData(response.data.data);
    } catch (error) {
      console.error('获取数据时出错：', error);
    }
  };


  // 搜索事件
  const handleSearch = async () => {
    try {
      // 去除搜索内容前后的空格
      const trimmedSearchValue = searchValue.trim();

      if (trimmedSearchValue !== '') {
        // 根据搜索内容进行标签查询
        const searchResponse = await axios.get(`http://localhost:3001/api/query?tag=${trimmedSearchValue}`);
        setData(searchResponse.data.data);
      }

      // 清空搜索框的值
      setSearchValue('');
    } catch (error) {
      console.error('查询标签数据时发生错误：', error);
    }
  };

  // 编辑弹窗确定按钮回调
  const handleEditOk = async () => {
    if (editingRecord && newTag.trim() !== '') {
      try {
        await axios.put(`http://localhost:3001/api/tag/${editingRecord.id}`, { tag: newTag });

        setEditingRecord(null);

        // 编辑成功后，重新获取更新后的标签数据并更新本地状态
        const fetchResponse = await axios.get('http://localhost:3001/api/tag');
        setData(fetchResponse.data.data);
      } catch (error) {
        console.error('编辑数据时发生错误：', error);
      }
    }
  };


  // 删除弹窗确定按钮回调
  const handleDeleteOk = async () => {
    if (deleteRecord) {
      try {
        await axios.delete(`http://localhost:3001/api/tag/${deleteRecord.tag}`);
        setDeleteRecord(null);

        // 删除成功后，重新获取更新后的标签数据并更新本地状态
        const fetchResponse = await axios.get('http://localhost:3001/api/tag');
        const updatedData: DataType[] = fetchResponse.data.data;
        setData(updatedData);
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          Modal.warning({
            title: '无法删除',
            content: '该标签已在数据管理中存在，无法删除。',
          });
        } else {
          console.error('删除数据时发生错误：', error);
        }
      }
    }
  };

  // 添加弹窗确定按钮回调
  const handleAddOk = async () => {
    if (newTag.trim() !== '') {
      try {
        await axios.post('http://localhost:3001/api/tag', { tag: newTag });
        setNewTag('');
        setAddModalVisible(false);

        // 获取更新后的标签列表，并在前端处理数据
        const fetchResponse = await axios.get('http://localhost:3001/api/tag');
        const updatedData = [{ id: fetchResponse.data.data.id, tag: newTag }, ...data];
        setData(updatedData);
      } catch (error) {
        console.error('添加数据时发生错误：', error);
      }
    }
  };

  // 添加弹窗取消按钮回调
  const handleAddCancel = () => {
    setNewTag('');
    setAddModalVisible(false);
  };

  // 表格列定义
  const columns: ColumnProps<DataType>[] = [
    {
      title: '标签',
      dataIndex: 'tag',
      key: 'id',
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button type='link' key='edit' onClick={() => setEditingRecord(record)}>
            编辑
          </Button>
          <Button type='link' key='delete' danger onClick={() => setDeleteRecord(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 渲染页面
  return (
    <div className='home' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ width: '80%' }}>
        <div>
          <Card>
            <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>

              <Col flex="auto">
                <Form layout="inline">
                  <Form.Item name="searchValue">
                    <Input onChange={(e) => setSearchValue(e.target.value)} />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={handleSearch}>
                    {text.search}
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
              <Col>
                <Button type="primary" onClick={() => setAddModalVisible(true)}>
                  添加
                </Button>
              </Col>
            </Row>
            <Table columns={columns} dataSource={data} pagination={false} />
          </Card>
        </div>
      </div>
      {/* 编辑弹窗 */}
      <Modal
        title='编辑'
        visible={editingRecord !== null}
        onOk={handleEditOk}
        onCancel={() => setEditingRecord(null)}
        width={400}
        destroyOnClose
      >
        <Form>
          <Form.Item label='标签' name='tag'>
            <Input value={newTag} onChange={e => setNewTag(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
      {/* 删除弹窗 */}
      <Modal
        title='确认删除'
        visible={deleteRecord !== null}
        onOk={handleDeleteOk}
        onCancel={() => setDeleteRecord(null)}
      >
        <p>确定要删除这条记录吗？</p>
      </Modal>
      {/* 添加弹窗 */}
      <Modal
        title='添加标签'
        visible={addModalVisible}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
      >
        <Form>
          <Form.Item label='标签' name='tag'>
            <Input value={newTag} onChange={e => setNewTag(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default View;
