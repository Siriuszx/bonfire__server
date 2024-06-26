import { Document, Schema, Types, model } from 'mongoose';

import { ColorClass } from '@src/constants/misc';

export type TChatRoom = {
  _id: Types.ObjectId;
  name?: string;
  participants: Types.ObjectId[];
  created: Date;
  color_class: ColorClass;
};

export type TChatRoomDocument = Document<unknown, unknown, TChatRoom> &
  TChatRoom;

const ChatRoomSchema = new Schema<TChatRoom>({
  name: { type: String, minlength: 3, maxlength: 100 },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  created: { type: Date, required: true, default: new Date() },
  color_class: {
    type: String,
    required: true,
    enum: Object.values(ColorClass),
  },
});

const ChatRoom = model<TChatRoom>('ChatRoom', ChatRoomSchema);

export default ChatRoom;
