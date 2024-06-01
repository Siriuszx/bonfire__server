import EnvVars from '@src/constants/EnvVars';
import User, { TUser, TUserDocument, TUserPublic } from '@src/models/User';
import { TQueryOptions } from '@src/types/TQueryOptions';
import { FilterQuery } from 'mongoose';

type TQuery = FilterQuery<TUser>;

type TCreate = Omit<TUser, '_id' | 'profile_image' | 'contacts'>;

type TUpdate = Partial<TUser>;

const getAll = async (
  query: TQuery,
  opts?: TQueryOptions<TUserPublic>,
): Promise<TUserDocument[]> => {
  const allUsers = await User.find(query)
    .limit(opts?.limit as number)
    .sort(opts?.sort)
    .skip((opts?.page as number) * EnvVars.Bandwidth.MAX_DOCS_PER_FETCH)
    .exec();

  return allUsers;
};

const getOne = async (query: TQuery): Promise<TUserDocument | null> => {
  const user = await User.findOne(query).exec();

  return user;
};

const createOne = async (data: TCreate): Promise<void> => {
  const newUser = new User(data);
  await newUser.save();
};

const updateOne = async (query: TQuery, data: TUpdate): Promise<void> => {
  await User.findOneAndUpdate(query, data, {
    runValidators: true,
    new: true,
  });
};

const deleteOne = async (id: string): Promise<void> => {
  await User.findByIdAndDelete(id);
};

const persistOne = async (query: TQuery): Promise<boolean> => {
  const persistingUser = await User.findOne(query).exec();

  return !!persistingUser;
};

const persistMany = async (ids: string[]): Promise<boolean> => {
  const persistingUsers = await User.find({ _id: { $in: ids } }).exec();

  return persistingUsers.length === ids.length;
};

const count = async (query: TQuery): Promise<number> => {
  const docCount = await User.countDocuments(query).exec();

  return docCount;
};

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  persistOne,
  persistMany,
  count,
} as const;
