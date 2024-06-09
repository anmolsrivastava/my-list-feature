export const MOCK_USER_ID = '6664869e3fd94b857d2a171b';
export const MOCK_ITEM_ID = '6663fad0af6260095fda2604';
export const MOCK_ITEM_ID_2 = '6663facfaf6260095fda25dc';
export const MOCK_PATTERN = 'myList:6664869e3fd94b857d2a171b*';
export const MOCK_REDIS_KEY = 'myList:6664869e3fd94b857d2a171b:5:1';
export const MOCK_ITEMS = {
  MOVIE: 'Movie',
  TVSHOW: 'TVShow',
};
export const MOCK_GET_TV_SHOW_BY_USER_ID = {
  id: '6663fad0af6260095fda2604',
  itemType: 'TVShow',
  title: 'Eternal Love',
  description: 'A romance series about love that transcends time and space.',
  genres: ['Romance', 'Sci-Fi'],
};
export const MOCK_GET_MOVIE_BY_USER_ID = {
  id: '6663f5e05fff718e47c93ed3',
  itemType: 'Movie',
  title: 'Haunted Mansion',
  description: 'A horror film about a mansion with a dark past.',
  genres: ['Horror', 'Action'],
  releaseDate: new Date('2020-10-01T00:00:00.000Z'),
  director: 'Tim Burton',
  actors: ['Johnny Depp', 'Helena Bonham Carter'],
};
export const MOCK_ERR_MSGS = {
  INVALID_ID_MSG: 'Invalid Id',
  INVALID_USER_MSG: 'User does not exist',
  SERVER_ERROR_MSG: 'Interval Server Error',
  ITEM_NOT_FOUND_MSG: 'Item not found for user',
  INVALID_ITEM_MSG: 'Item does not exist',
};
export const MOCK_SUCCESS_MSGS = {
  ITEM_REMOVED_MSG: 'Item removed successfully',
};
export const MOCK_ITEM_LIST_BY_USER_ID = {
  userId: '6664869e3fd94b857d2a171b',
  items: [
    {
      itemId: '6663f5e05fff718e47c93edd',
      itemType: 'Movie',
      details: {
        title: 'Ancient Secrets',
        description:
          'A mystery that uncovers ancient secrets buried for millennia.',
        genres: ['Action', 'Sci-Fi'],
        releaseDate: '2020-06-17T00:00:00.000Z',
        director: 'Steven Spielberg',
        actors: ['Harrison Ford', 'Karen Allen'],
      },
    },
    {
      itemId: '6663f5e05fff718e47c93ed5',
      itemType: 'Movie',
      details: {
        title: 'The Last Samurai',
        description: 'A drama about the final days of the samurai in Japan.',
        genres: ['Drama', 'Action'],
        releaseDate: '2003-12-05T00:00:00.000Z',
        director: 'Edward Zwick',
        actors: ['Tom Cruise', 'Ken Watanabe'],
      },
    },
    {
      itemId: '6663f5e15fff718e47c93ee9',
      itemType: 'Movie',
      details: {
        title: 'Dark Dimensions',
        description: 'A sci-fi thriller exploring parallel dimensions.',
        genres: ['Sci-Fi'],
        releaseDate: '2024-01-05T00:00:00.000Z',
        director: 'Christopher Nolan',
        actors: ['Cillian Murphy', 'Ellen Page'],
      },
    },
    {
      itemId: '6663facfaf6260095fda25ee',
      itemType: 'TVShow',
      details: {
        title: 'Tech Pioneers',
        description:
          'A drama series about the lives and challenges of tech industry pioneers.',
        genres: ['Drama', 'Sci-Fi'],
        episodes: [
          {
            episodeNumber: 1,
            seasonNumber: 1,
            releaseDate: '2025-06-01T00:00:00.000Z',
            director: 'Ryan White',
            actors: ['Aiden Green', 'Chloe Brown'],
          },
          {
            episodeNumber: 2,
            seasonNumber: 1,
            releaseDate: '2025-06-08T00:00:00.000Z',
            director: 'Ryan White',
            actors: ['Aiden Green', 'Chloe Brown'],
          },
        ],
      },
    },
    {
      itemId: '6663f5e05fff718e47c93edb',
      itemType: 'TVShow',
      details: {
        title: 'Eternal Love',
        description:
          'A romance series about love that transcends time and space.',
        genres: ['Romance', 'Sci-Fi'],
        episodes: [
          {
            episodeNumber: 1,
            seasonNumber: 1,
            releaseDate: '2026-05-01T00:00:00.000Z',
            director: 'Cameron White',
            actors: ['Aiden Green', 'Eva Brown'],
          },
          {
            episodeNumber: 2,
            seasonNumber: 1,
            releaseDate: '2026-05-08T00:00:00.000Z',
            director: 'Cameron White',
            actors: ['Aiden Green', 'Eva Brown'],
          },
        ],
      },
    },
  ],
  hasNextPage: false,
  nextPage: null,
  currentPage: 1,
};

export const MOCK_ITEM_LIST_BY_USER_ID_2 = {
  userId: '6664869e3fd94b857d2a171b',
  items: [
    {
      itemId: '6663f5e05fff718e47c93ee3',
      itemType: 'Movie',
      details: {
        title: "Hero's Quest",
        description:
          'An action-packed journey of a hero on a quest to save the world.',
        genres: ['Action', 'Fantasy'],
        releaseDate: '2023-07-20T00:00:00.000Z',
        director: 'Peter Jackson',
        actors: ['Orlando Bloom', 'Cate Blanchett'],
      },
    },
    {
      itemId: '6663f5e05fff718e47c93ee5',
      itemType: 'Movie',
      details: {
        title: 'The Great Escape',
        description:
          'A thrilling story about a group of prisoners planning their escape.',
        genres: ['Action'],
        releaseDate: '2021-09-10T00:00:00.000Z',
        director: 'Christopher Nolan',
        actors: ['Christian Bale', 'Anne Hathaway'],
      },
    },
  ],
  hasNextPage: false,
  nextPage: null,
  currentPage: 1,
};
