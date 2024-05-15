import EnvVars from '@src/constants/EnvVars';
import User, {
  TUser,
  TUserPublic,
  USER_DATA_SELECTION,
} from '@src/models/User';
import { TQueryOptions } from '@src/types/TQueryOptions';
import { Document } from 'mongoose';

type TQuery = Pick<TUser, '_id'>;

const getAll = async (
  query: TQuery,
  opts?: TQueryOptions<TUserPublic>,
): Promise<(Document<unknown, unknown, TUserPublic> & TUserPublic)[]> => {
  const user = (await User.findOne(query)
    .select('contacts')
    .populate({ path: 'contacts', select: USER_DATA_SELECTION })
    .limit(opts?.limit as number)
    .sort(opts?.sort)
    .skip((opts?.page as number) * EnvVars.Bandwidth.maxDocsPerFetch)
    .exec()) as unknown as {
    contacts: (Document<unknown, unknown, TUserPublic> & TUserPublic)[];
  };

  return user.contacts ?? [];
};

const getCount = async (query: TQuery): Promise<number> => {
  const user = await User.findOne(query).exec();

  return user ? user.contacts.length : 0;
};

export default { getAll, getCount } as const;
