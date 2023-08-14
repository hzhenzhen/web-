
import React, { useState, useEffect } from 'react';
import { Card, Space, Table, Button, Modal, Form, Input, Tag, Checkbox } from 'antd';
import { ColumnsType } from 'antd/es/table';
import axios from "axios";
// import ajax from "../api"
import dayjs from 'dayjs';
import AdvancedSearchForm from './SearchForm'

// 定义数据类型
interface DataType {
    id: number;
    key: React.Key;
    name: string;
    des: string;
    addtime: string;
    tag: string;
}

const View: React.FC = () => {
    const [filteredData, setFilteredData] = useState<DataType[]>([]); // 存储搜索过滤后的数据

    const columns: ColumnsType<DataType> = [

        {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 100,
        },
        {
            title: '描述',
            dataIndex: 'des',
            key: 'des',
            width: 150,
        },
        {
            title: '添加时间',
            dataIndex: 'addtime',
            key: 'addtime',
        },
        // {
        //     title: '标签',
        //     dataIndex: 'tag',
        //     key: 'tag',
        // },
        {
            title: '标签',
            dataIndex: 'tag',
            key: 'tag',
            render: (tags: string) => {
                const tagList = tags.split(','); // 假设标签是以逗号分隔的字符串
                return (
                    <span>
                        {tagList.map((tag, index) => (
                            <Tag key={index} color="orange" style={{ textAlign: 'center' }}>{tag}</Tag>
                        ))}
                    </span>
                );
            },
        },
        {
            title: '操作',
            render: (_, record) => (
                <Space>
                    <Button type='link' key='edit' onClick={() => showEditModal(record)}>编辑</Button>
                    <Button type='link' key='delete' danger onClick={() => showDeleteConfirm(record)}>删除</Button>
                </Space>
            ),
        },
    ];

    // 复选框设计

    // 复选框设计

    const [data, setData] = useState<DataType[]>([]); // 数据列表
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 }); // 分页信息

    useEffect(() => {
        if (filteredData.length === 0) {
            // 如果没有搜索条件，则获取全部数据
            fetchData(pagination.current, pagination.pageSize);
        }
    }, [filteredData, pagination]);

    const [isModalVisible, setIsModalVisible] = useState(false); // 控制添加数据的模态框显示与隐藏

    // 获取数据
    const fetchData = async (page: number, pageSize: number) => {
        try {
            const response = await axios.get('http://localhost:3001/api/data', {
                params: {
                    page: page,
                    pageSize: pageSize,
                },
            });
            setData(response.data.data); // 设置数据列表


        } catch (error) {
            console.error('获取数据时出错：', error);
        }
    };

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize);
    }, [pagination]);

    // 处理表格分页变化
    const handleTableChange = (pagination: any) => {
        setPagination(pagination);
    };

    // 处理点击添加按钮
    const handleAddButtonClick = () => {
        setIsModalVisible(true);
    };
    // 处理模态框确认添加操作
    const handleModalOk = async () => {
        try {
            const formData = await form.validateFields();

            // 将ISO格式的时间转换为MySQL格式
            const mysqlFormattedAddtime = dayjs(formData.addtime).format('YYYY-MM-DD HH:mm:ss');

            // 删除formData中的id字段
            delete formData.id;

            // 使用转换后的时间来添加数据
            formData.addtime = mysqlFormattedAddtime;

            // 调用API来添加数据
            await axios.post('http://localhost:3001/api/data', formData);

            // 添加数据后刷新数据列表
            fetchData(1, pagination.pageSize);

            setIsModalVisible(false);
            form.resetFields(); // 添加数据后清空表单字段
        } catch (error) {
            console.error('添加数据出错：', error);
        }
    };

    // 处理模态框取消添加操作
    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const [editModalVisible, setEditModalVisible] = useState(false); // 控制编辑数据的模态框显示与隐藏
    const [editRecord, setEditRecord] = useState<DataType | undefined>(undefined); // 编辑的记录

    // 显示编辑模态框
    const showEditModal = (record: DataType) => {
        setEditModalVisible(true);
        setEditRecord(record);

        // 设置表单的初始值为当前编辑的记录的值
        form.setFieldsValue(record);
    };

    // 处理编辑模态框确认操作
    const handleEditModalOk = async () => {
        try {
            const updatedData = await form.validateFields();

            // 将ISO格式的时间转换为MySQL格式
            const mysqlFormattedAddtime = dayjs(updatedData.addtime).format('YYYY-MM-DD HH:mm:ss');

            // 调用API来更新数据，注意使用编辑记录的id
            await axios.put(`http://localhost:3001/api/data/${editRecord?.id}`, {
                ...updatedData,
                addtime: mysqlFormattedAddtime, // 使用转换后的时间
            });

            // 刷新数据列表
            fetchData(pagination.current, pagination.pageSize);

            setEditModalVisible(false);
            setEditRecord(undefined);
        } catch (error) {
            console.error('编辑数据出错：', error);
        }
    };
    // 处理编辑模态框取消操作
    const handleEditModalCancel = () => {
        setEditModalVisible(false);
        setEditRecord(undefined);
    };

    const [form] = Form.useForm(); // 表单实例
    const showDeleteConfirm = (record: DataType) => {
        Modal.confirm({
            title: '确认删除',
            content: `是否确定删除 ${record.name} 这条数据？`,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => handleDelete(record),
        });
    };

    // 处理删除操作
    const handleDelete = async (record: DataType) => {
        try {
            await axios.delete(`http://localhost:3001/api/data/${record.id}`);
            // 删除成功后刷新数据列表
            fetchData(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error('删除数据时出错：', error);
        }
    };
    // 处理高级搜索表单的提交
    const handleAdvancedSearch = (filteredData: DataType[]) => {

        setFilteredData(filteredData);

    };

    // 复选框
    return (
        <div className="home">
            <div style={{ marginBottom: '20px' }}>
                {/* 高级搜索表单 */}
                <AdvancedSearchForm key="search-form" onSearch={handleAdvancedSearch} />
            </div>
            <div>
                <Card extra={<Button type='primary' onClick={handleAddButtonClick}>添加</Button>} >
                    {/* 数据列表 */}
                    <Table
                        bordered
                        dataSource={filteredData.length > 0 ? filteredData : data}
                        columns={columns}
                        // 分页配置
                        pagination={{
                            ...pagination,
                            total: filteredData.length,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50'],
                            locale: {
                                items_per_page: '/ 页',
                            },
                        }}
                        onChange={handleTableChange}
                        scroll={{ y: 240 }}
                    />

                </Card>
            </div>

            {/* 添加数据模态框 */}
            <Modal
                title="添加数据"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <Form form={form}>
                    {/* <Form.Item label="编号" name="id">
                        <Input />
                    </Form.Item> */}
                    <Form.Item label="名称" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="描述" name="des">
                        <Input />
                    </Form.Item>
                    <Form.Item label="时间" name="addtime">
                        <Input />
                    </Form.Item>
                    <Form.Item label="标签" name="tag">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 编辑数据模态框 */}
            <Modal
                title="编辑数据"
                visible={editModalVisible}
                onOk={handleEditModalOk}
                onCancel={handleEditModalCancel}
            >
                <Form form={form} initialValues={editRecord}>
                    {/* <Form.Item label="编号" name="id">
                        <Input />
                    </Form.Item> */}
                    <Form.Item label="名称" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="描述" name="des">
                        <Input />
                    </Form.Item>
                    <Form.Item label="时间" name="addtime">
                        <Input />
                    </Form.Item>
                    <Form.Item label="标签" name="tag">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default View;



