import React, { useState } from 'react';
import { UserOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import TableCustom from './components/TableCustom';
import UserModal from './components/UserModal';
import { deleteActor } from './api/actor';
import { NotificationCustom } from './components/NotificationCustom/NotificationCustom';
const { Header, Content, Sider } = Layout;

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const toggleIsOpenCreateModal = () => {
    setIsOpenCreateModal(!isOpenCreateModal);
  };

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider
        breakpoint='lg'
        collapsedWidth='0'
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div
          className='demo-logo-vertical'
          style={{
            height: '32px',
          }}
        />
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'Actor Management',
            },
            {
              key: '2',
              icon: <LoginOutlined />,
              label: 'Login',
            },
            {
              key: '3',
              icon: <LogoutOutlined />,
              label: 'Logout',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            background: colorBgContainer,
            justifyContent: 'space-between',
            fontSize: '20px',
            fontWeight: 'bold',
          }}
        >
          Sakila Management
          <div
            style={{
              display: 'flex',
              gap: '1rem',
            }}
          >
            <Button
              style={{
                padding: '0 3rem',
                height: 40,
              }}
              type='primary'
              onClick={toggleIsOpenCreateModal}
            >
              Tạo
            </Button>
            <Button
              style={{
                padding: '0 3rem',
                height: 40,
              }}
              type='primary'
              danger
              onClick={() => {
                selectedRowKeys.forEach((id) => {
                  deleteActor(id).catch((error) => {
                    NotificationCustom({
                      type: 'error',
                      message: 'Lỗi',
                      description:
                        'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn',
                      key: 'deleteActor',
                    });
                  });
                });
              }}
            >
              Xóa
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px 0',
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <TableCustom
              setSelectedRowKeys={setSelectedRowKeys}
              selectedRowKeys={selectedRowKeys}
            />
          </div>
        </Content>
      </Layout>

      <UserModal
        isOpen={isOpenCreateModal}
        toggleModal={toggleIsOpenCreateModal}
      />
    </Layout>
  );
};
export default App;

