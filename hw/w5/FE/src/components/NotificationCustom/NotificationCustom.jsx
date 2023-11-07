import { notification } from 'antd';

export const NotificationCustom = (values) => {
  const { type, message, description, duration, key } = values;
  return notification[type]({
    message,
    description,
    duration,
    key,
  });
};

