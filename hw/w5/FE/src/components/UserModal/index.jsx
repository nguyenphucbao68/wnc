import React, { useEffect } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import { createActor, getActorById, updateActor } from '../../api/actor';
import { NotificationCustom } from '../NotificationCustom/NotificationCustom';

const UserModal = (props) => {
  const { isEdit = false, isOpen, toggleModal, currentId } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit) {
      getActorById(currentId)
        .then((res) => {
          form.setFieldsValue({
            first_name: res.data.first_name,
            last_name: res.data.last_name,
          });
        })
        .catch((error) => {
          NotificationCustom({
            type: 'error',
            message: 'Lỗi',
            description: 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn',
            key: 'getActorById',
          });
        });
    }
  }, [currentId, isEdit, form]);

  const onFinish = (values) => {
    const data = {
      first_name: values.first_name,
      last_name: values.last_name,
      last_update: new Date(),
    };

    if (!isEdit) {
      createActor(data)
        .then((res) => {
          toggleModal();
        })
        .catch((error) => {
          NotificationCustom({
            type: 'error',
            message: 'Lỗi',
            description: 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn',
            key: 'createActor',
          });
        });
    } else {
      updateActor(currentId, data)
        .then((res) => {
          toggleModal();
        })
        .catch((error) => {
          NotificationCustom({
            type: 'error',
            message: 'Lỗi',
            description: 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn',
            key: 'updateActor',
          });
        });
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal
      open={isOpen}
      title={isEdit ? 'Edit Actor' : 'Create Actor'}
      onCancel={toggleModal}
      footer={null}
    >
      <Form
        name='trigger'
        layout='vertical'
        autoComplete='off'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
      >
        <Form.Item
          label='First Name'
          name='first_name'
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Last Name'
          name='last_name'
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              gap: '1rem',
              justifyContent: 'flex-end',
            }}
          >
            <Button type='primary' danger onClick={toggleModal}>
              Cancel
            </Button>
            <Button type='primary' htmlType='submit'>
              {isEdit ? 'Edit' : 'Create'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;

