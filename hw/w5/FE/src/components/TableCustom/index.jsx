import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { getAllActor } from '../../api/actor';
import dayjs from 'dayjs';
import UserModal from '../UserModal';
import { NotificationCustom } from '../NotificationCustom/NotificationCustom';

const TableCustom = ({ selectedRowKeys, setSelectedRowKeys }) => {
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const [currentId, setCurrentId] = useState(null);

  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const toggleIsOpenEditModal = () => {
    setIsOpenEditModal(!isOpenEditModal);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'first_name',
      render: (text) => {
        return text.toLowerCase().replace(/\b[a-z]/g, (x) => x.toUpperCase());
      },
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      render: (text) => {
        return text.toLowerCase().replace(/\b[a-z]/g, (x) => x.toUpperCase());
      },
    },
    {
      title: 'Lasted Update',
      dataIndex: 'last_update',
      render: (text) => {
        return dayjs(text).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <Button
            type='primary'
            onClick={() => {
              setCurrentId(record.key);
              toggleIsOpenEditModal();
            }}
          >
            Edit
          </Button>
        );
      },
    },
  ];

  const fetchData = async () => {
    const response = await getAllActor();
    return response.data;
  };

  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData()
      .then((actors) => {
        const dataMapping = actors.map((actor) => ({
          key: actor.actor_id,
          first_name: actor.first_name,
          last_name: actor.last_name,
          last_update: actor.last_update,
        }));
        setData(dataMapping);
      })
      .catch(() => {
        NotificationCustom({
          type: 'error',
          message: 'Lỗi',
          description: 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn',
          key: 'getAllActor',
        });
      });
  }, []);

  return (
    <>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 20,
          total: data.length,
          showPrevNextJumpers: false,
          showSizeChanger: false,
        }}
      />

      <UserModal
        isEdit
        currentId={currentId}
        isOpen={isOpenEditModal}
        toggleModal={toggleIsOpenEditModal}
      />
    </>
  );
};
export default TableCustom;

