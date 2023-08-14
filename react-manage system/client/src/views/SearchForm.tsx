
// import React, { useState } from 'react';
// import { Button, Col, Form, Input, Select, Space, DatePicker } from 'antd';
// import axios from 'axios';
// // 定义数据类型
// interface DataType {
//   id: number;
//   key: React.Key;
//   name: string;
//   des: string;
//   addtime: string;
//   tag: string;
// }

// const { Option } = Select;

//   const AdvancedSearchForm: React.FC<{ onSearch: (filteredData: DataType[]) => void }> = ({ onSearch }) => {
//   const [form] = Form.useForm();
//   const [expand, setExpand] = useState(false);

//   const formStyle: React.CSSProperties = { maxWidth: 'none', background: '#fff', borderRadius: '8px', padding: 24 };

//   const fieldStyle: React.CSSProperties = { marginRight: '6px' }; // Add right margin

//   const onFinish = async (values: any): Promise<void> => {
//     console.log('Received values of form: ', values);
//     try {
//       const response = await axios.get('http://localhost:3002/api/data/query', {
//         params: {
//           name: values['field-0'].trim() ,
//           tag: values['field-1'].trim(),
//           addtime: values['field-2'],
//         },
//       });

//       console.log('Search result:', response.data.data);
//       onSearch(response.data.data); // 将过滤后的数据传递给父组件
//     } catch (error) {
//       console.error('Error searching data:', error);
//     }
//   };
//   return (
//     <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish}>
//       <div style={{ display: 'flex', alignItems: 'center' }}>
//         <Col span={6} style={fieldStyle}>
//           <Form.Item name="field-0" label="名称">
//             <Input allowClear />
//           </Form.Item>
//         </Col>

//         <Col span={6} style={fieldStyle}>
//           <Form.Item name="field-1" label="标签">
//             <Input allowClear />
//           </Form.Item>
//         </Col>

//         <Col span={6} style={fieldStyle}>
//           <Form.Item name="field-2" label="添加时间">
//           <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
//           </Form.Item>
//         </Col>

//         <Form.Item style={fieldStyle}>
//           <Space size="small">
//             <Button type="primary" htmlType="submit">
//               搜索
//             </Button>
//             <Button
//               onClick={() => {
//                 form.resetFields();
//               }}
//             >
//               重置
//             </Button>
//           </Space>
//         </Form.Item>
//       </div>
//     </Form>
//   );
// };

// export default AdvancedSearchForm;


import React, { useState } from 'react';
import { Button, Col, Form, Input, Select, Space, DatePicker } from 'antd';
import axios from 'axios';
// 定义数据类型
interface DataType {
  id: number;
  key: React.Key;
  name: string;
  des: string;
  addtime: string;
  tag: string;
}

const { Option } = Select;

  const AdvancedSearchForm: React.FC<{ onSearch: (filteredData: DataType[]) => void }> = ({ onSearch }) => {
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(false);

  const formStyle: React.CSSProperties = { maxWidth: 'none', background: '#fff', borderRadius: '8px', padding: 24 };

  const fieldStyle: React.CSSProperties = { marginRight: '6px' }; 

  const onFinish = async (values: any): Promise<void> => {
    console.log('Received values of form: ', values);
    try {
      const response = await axios.get('http://localhost:3001/api/data/query', {
        params: {
          name: values['field-0'].trim(),
          tag: values['field-1'].trim(),
          addtime: values['field-2'],
        },
      });

      console.log('Search result:', response.data.data);
      onSearch(response.data.data); // 将过滤后的数据传递给父组件
    } catch (error) {
      console.error('Error searching data:', error);
    }
  };
  return (
    <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Col span={6} style={fieldStyle}>
          <Form.Item name="field-0" label="名称">
            <Input allowClear />
          </Form.Item>
        </Col>

        <Col span={6} style={fieldStyle}>
          <Form.Item name="field-1" label="标签">
            <Input allowClear />
          </Form.Item>
        </Col>

        <Col span={6} style={fieldStyle}>
          <Form.Item name="field-2" label="添加时间">
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
        </Col>

        <Form.Item style={fieldStyle}>
          <Space size="small">
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
              }}
            >
              重置
            </Button>
          </Space>
        </Form.Item>
      </div>
    </Form>
  );
};

export default AdvancedSearchForm;

