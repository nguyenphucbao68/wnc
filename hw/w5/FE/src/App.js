import React, { useState } from 'react';
import { UserOutlined, LoginOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme, Form, Input } from 'antd';
import TableCustom from './components/TableCustom';
import UserModal from './components/UserModal';
import { deleteActor } from './api/actor';
import { login } from './api/auth';
import { NotificationCustom } from './components/NotificationCustom/NotificationCustom';
const { Header, Content, Sider } = Layout;

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedMenuKey, setSelectedMenuKey] = useState('1');
  const [isLogin, setIsLogin] = useState(localStorage.getItem('isLogin'));

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
            height: '64px',
          }}
        />
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={['1']}
          onClick={(e) => {
            setSelectedMenuKey(e.key);
          }}
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
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          Actor Management
        </Header>
        <Content
          style={{
            margin: '1rem',
          }}
        >
          {selectedMenuKey === '1' && (
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '1rem',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
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
                    Create
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
                    Edit
                  </Button>
                </div>
                {isLogin && (
                  <Button
                    type='primary'
                    style={{
                      padding: '0 3rem',
                      height: 40,
                    }}
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('isLogin');
                      setIsLogin(false);
                      window.location.reload();
                    }}
                  >
                    Logout
                  </Button>
                )}
              </div>
              <TableCustom
                setSelectedRowKeys={setSelectedRowKeys}
                selectedRowKeys={selectedRowKeys}
              />
            </div>
          )}

          {selectedMenuKey === '2' && !isLogin && (
            <div
              style={{
                width: '100%',
              }}
            >
              <Form
                name='basic'
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                style={{
                  maxWidth: 600,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={(values) => {
                  try {
                    login(values).then((res) => {
                      localStorage.setItem('token', res.data.token);
                      localStorage.setItem('isLogin', true);
                      setIsLogin(true);
                      NotificationCustom({
                        type: 'success',
                        message: 'Thành công',
                        description: 'Đăng nhập thành công',
                        key: 'login',
                      });
                    });
                  } catch (error) {
                    NotificationCustom({
                      type: 'error',
                      message: 'Lỗi',
                      description: 'Đăng nhập thất bại',
                      key: 'login',
                    });
                  }
                }}
                autoComplete='off'
              >
                <Form.Item
                  label='Username'
                  name='email'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your username!',
                    },
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },
                  ]}
                >
                  <Input width={300} />
                </Form.Item>

                <Form.Item
                  label='Password'
                  name='password'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Button type='primary' htmlType='submit'>
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}
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

