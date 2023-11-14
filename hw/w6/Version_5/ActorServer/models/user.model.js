import generate from './generic.model.js';
import db from '../utils/db.js';
export default generate('user', 'user_id');

export const updateRefreshToken = async (username, refreshToken) => {
  return await db('user')
    .where('username', username)
    .update({ refresh_token: refreshToken });
};

export const findByRefreshToken = async (refreshToken) => {
  const list = await db('user').where('refresh_token', refreshToken);
  if (list.length === 0) {
    return null;
  }

  return list[0];
};

