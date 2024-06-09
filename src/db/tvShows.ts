import mongoose, { Schema } from 'mongoose';

import { GENRES } from '../constants';

const EpisodeSchema: Schema = new Schema(
  {
    episodeNumber: { type: Number, required: true },
    seasonNumber: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    director: { type: String, required: true },
    actors: { type: [String], required: true },
  },
  { _id: false }
);

const TVShowSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    genres: { type: [String], required: true, enum: GENRES },
    episodes: { type: [EpisodeSchema], required: true },
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

export const TVShowModel = mongoose.model('TVShow', TVShowSchema);

export const getTVShowById = (id: string) => TVShowModel.findById(id);
export const createTVShow = (values: Record<string, any>) =>
  new TVShowModel(values).save().then((tvShow) => tvShow.toObject());
