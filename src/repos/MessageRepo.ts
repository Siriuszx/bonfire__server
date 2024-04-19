import Message, { TMessage } from '@src/models/Message';

type TQuery = {
  _id?: string;
  chat_room?: string;
  user?: string;
  body?: string;
  created?: string;
  reply?: string;
};

export type TCreateMessageData = {
  chat_room: string;
  user?: string;
  body: string;
  reply?: string;
};

export type TMessageMutable = {
  body: string;
};

const getAll = async (query: TQuery): Promise<TMessage[]> => {
  const messages = await Message.find(query).exec();

  return messages;
};

const getOne = async (query: TQuery): Promise<TMessage | null> => {
  const message = await Message.findOne(query).exec();

  return message;
};

const createOne = async (data: TCreateMessageData): Promise<void> => {
  const message = new Message(data);
  await message.save();
};

const updateOne = async (
  query: TQuery,
  messageData: TMessageMutable,
): Promise<void> => {
  await Message.findOneAndUpdate(query, messageData, { runValidators: true });
};

const deleteOne = async (query: TQuery): Promise<void> => {
  await Message.deleteOne(query);
};

const persists = async (ids: string[]): Promise<boolean> => {
  const messages = await Message.find({ _id: { $in: ids } }).exec();

  return ids.length === messages.length;
};

export default { getAll, getOne, createOne, updateOne, deleteOne, persists };