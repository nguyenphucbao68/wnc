import generate from './generic.model.js';
import db from '../utils/db.js';
export default generate('user', 'user_id');

export const updateRefetchToken = async (username, refetchToken) => {
  return await db('user')
    .where('username', username)
    .update({ refetch_token: refetchToken });
};

export const findByRefetchToken = async (refetchToken) => {
  const list = await db('user').where('refetch_token', refetchToken);
  if (list.length === 0) {
    return null;
  }

  return list[0];
};

