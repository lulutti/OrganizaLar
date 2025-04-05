import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    HomeFilled,
    HomeOutlined,
    PieChartOutlined,
    ProfileFilled,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import Image from "next/image";
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Typography } from 'antd';
import styles from "@/styles/BoardLayout.module.css";
import { useRouter } from 'next/router';

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

const items: MenuItem[] = [
    getItem('Gerenciar espaço', '/board/home', <HomeFilled />),
    getItem('Tarefas', '/board/tasks', <ProfileFilled />)
];


const { Title, Paragraph, Link } = Typography;

interface BoardLayoutProps {
    title: string;
    children: React.ReactNode;
    description?: string;
}

export default function BoardLayout({ title, children, description, }: BoardLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme='light' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className={`${styles.logoContainer} ${collapsed ? styles.logoContainerCollapsed : ""}`}>
                    {!collapsed && <Image
                        src="/assets/logo.svg"
                        alt="Logo"
                        layout="responsive"
                        width={214}
                        height={41}
                        objectFit="contain"
                    />
                    }
                </div>
                <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" items={items}   onClick={(e) => {
    router.push(e.key); 
  }} />
            </Sider>
            <Layout>
                <Content className={styles.boardContent}>
                    <Title level={1} id={styles.boardTitle}>{title}</Title>
                    {children}
                </Content>
                <Footer style={{ textAlign: 'center' }}>

                </Footer>
            </Layout>
        </Layout>
    );
}

