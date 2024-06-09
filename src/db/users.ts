import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

import { GENRES } from '../constants';

const watchHistorySchema = new mongoose.Schema(
  {
    contentId: { type: ObjectId, required: true },
    watchedOn: { type: Date, required: true },
    rating: { type: Number, min: 0, max: 5 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    preferences: {
      favoriteGenres: [{ type: String, GENRES }],
      dislikedGenres: [{ type: String, GENRES }],
    },
    watchHistory: [watchHistorySchema],
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const UserModel = mongoose.model('User', userSchema);

export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
