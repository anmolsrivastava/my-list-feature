import mongoose from 'mongoose';

import { GENRES } from '../constants';

const moviesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    genres: [{ type: String, enum: GENRES, required: true }],
    releaseDate: { type: Date, required: true },
    director: { type: String, required: true },
    actors: [{ type: String, required: true }],
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

export const MovieModel = mongoose.model('Movie', moviesSchema);

export const getMovieById = (id: string) => MovieModel.findById(id);
export const createMovie = (values: Record<string, any>) =>
  new MovieModel(values).save().then((movie) => movie.toObject());
