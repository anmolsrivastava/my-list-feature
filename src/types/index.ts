import mongoose from 'mongoose';

export type Genre =
  | 'Action'
  | 'Comedy'
  | 'Drama'
  | 'Horror'
  | 'Romance'
  | 'Sci-Fi'
  | 'Fantasy';

export interface Movie {
  title: string;
  description: string;
  genres: Genre[];
  releaseDate: Date;
  director: string;
  actors: string[];
}

export interface TVShow {
  id: string;
  title: string;
  description: string;
  genres: Genre[];
  episodes: Array<{
    episodeNumber: number;
    seasonNumber: number;
    releaseDate: Date;
    director: string;
    actors: string[];
  }>;
}

export interface User {
  username: string;
  preferences: {
    favoriteGenres: Genre[];
    dislikedGenres: Genre[];
  };
  watchHistory: Array<{
    contentId: string;
    watchedOn: Date;
    rating?: number;
  }>;
}

export interface AddListPayload {
  itemId: string;
  itemType: 'Movie' | 'TVShow';
}

export interface Item {
  itemType: string;
  itemId: mongoose.Types.ObjectId;
}

export interface myList {}
