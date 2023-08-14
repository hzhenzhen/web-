

import React, { useState } from 'react';
import {
  ThunderboltOutlined,
  FileOutlined,
  HighlightOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

type TranslationDictionary = {
  '语言切换': { en: string; zh: string };
  '数据管理系统': { en: string; zh: string };
  '数据管理': { en: string; zh: string };
  '标签管理': { en: string; zh: string };
  '搜索': { en: string; zh: string };
  '添加': { en: string; zh: string };
  '标签': { en: string; zh: string };
  '操作': { en: string; zh: string };
};

const translationDictionary: TranslationDictionary = {
  '语言切换': {
    en: 'Language Switch',
    zh: '语言切换',
  },
  '数据管理系统': {
    en: 'Data Management System',
    zh: '数据管理系统',
  },
  '数据管理': {
    en: 'Data Management',
    zh: '数据管理',
  },
  '标签管理': {
    en: 'Tag Management',
    zh: '标签管理',
  },
  '搜索': {
    en: 'Search',
    zh: '搜索',
  },
  '添加': {
    en: 'Add',
    zh: '添加',
  },
  '标签': {
    en: 'Tag',
    zh: '标签',
  },
  '操作': {
    en: 'Action',
    zh: '操作',
  },
};

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}



const View: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'zh'>('zh'); // 假设初始语言为中文
  const [collapsed, setCollapsed] = useState(false);
  const items: MenuItem[] = [
    getItem(translationDictionary['数据管理'][currentLanguage], '/page1', <HighlightOutlined />),
    getItem(translationDictionary['标签管理'][currentLanguage], '/page2', <ThunderboltOutlined />),
  ];
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigateTo = useNavigate();
  const currentRoute = useLocation();

  const menuClick = (e: { key: string }) => {
    // 编程式导航跳转
    navigateTo(e.key);
  };

  const handleLanguageToggle = () => {
    const newLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
    setCurrentLanguage(newLanguage);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" data-translate-key="数据管理平台">
        <h1>{translationDictionary['数据管理系统'][currentLanguage]}</h1>
        </div>
        <Menu theme="dark" defaultSelectedKeys={[currentRoute.pathname]} mode="inline" items={items} onClick={menuClick} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0 }} className="header">
          <Button onClick={handleLanguageToggle} data-translate-key="语言切换">
            {translationDictionary['语言切换'][currentLanguage]}
          </Button>
        </Header>
        <Content style={{ margin: '16px 16px 0 ' }} className="site-layout-background">
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </Layout>
  );
};

export default View;