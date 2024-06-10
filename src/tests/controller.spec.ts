import {
  addItemToList,
  getList,
  removeItemFromList,
} from '../controllers/myList';
import { getUserById } from '../db/users';
import { getMovieById } from '../db/movies';
import { getTVShowById } from '../db/tvShows';
import {
  getItemByUserId,
  getItemsListByUserId,
  deleteItem,
} from '../db/myList';
import {
  upsertList,
  updateCache,
  isValidObjectId,
  getCache,
  getKey,
  setCache,
} from '../helpers/index';

import {
  MOCK_USER_ID,
  MOCK_ITEM_ID,
  MOCK_ITEMS,
  MOCK_PATTERN,
  MOCK_SUCCESS_MSGS,
  MOCK_GET_TV_SHOW_BY_USER_ID,
  MOCK_GET_MOVIE_BY_USER_ID,
  MOCK_ITEM_LIST_BY_USER_ID,
  MOCK_ITEM_LIST_BY_USER_ID_2,
  MOCK_ERR_MSGS,
  MOCK_ITEM_ID_2,
  MOCK_REDIS_KEY,
} from './mockConstants';

jest.mock('../db/users', () => ({
  getUserById: jest.fn(),
}));

jest.mock('../db/myList', () => ({
  getItemByUserId: jest.fn(),
  getItemsListByUserId: jest.fn(),
  deleteItem: jest.fn(),
}));

jest.mock('../db/movies', () => ({
  getMovieById: jest.fn(),
}));

jest.mock('../db/tvShows', () => ({
  getTVShowById: jest.fn(),
}));

jest.mock('../helpers/index', () => ({
  getKey: jest.fn(),
  getCache: jest.fn(),
  setCache: jest.fn(),
  upsertList: jest.fn(),
  updateCache: jest.fn(),
  isValidObjectId: jest.fn(),
}));

describe('addItemToList - test suite', () => {
  let req: any;
  let res: any;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    req = {
      params: { userId: MOCK_USER_ID },
      body: { itemId: MOCK_ITEM_ID, itemType: MOCK_ITEMS.TVSHOW },
    };
    res = {
      status: statusMock,
    };

    (isValidObjectId as jest.Mock).mockReturnValue(true);
    (getUserById as jest.Mock).mockResolvedValue({ id: MOCK_USER_ID });
    (getTVShowById as jest.Mock).mockResolvedValue({ id: MOCK_ITEM_ID });
    (getMovieById as jest.Mock).mockResolvedValue({ id: MOCK_ITEM_ID_2 });
    (getItemByUserId as jest.Mock).mockResolvedValue(
      MOCK_GET_TV_SHOW_BY_USER_ID
    );
    (upsertList as jest.Mock).mockResolvedValue(true);
    (updateCache as jest.Mock).mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should add item tvshow to list successfully', async () => {
    await addItemToList(req, res);

    expect(isValidObjectId).toHaveBeenCalledWith(MOCK_USER_ID);
    expect(isValidObjectId).toHaveBeenCalledWith(MOCK_ITEM_ID);
    expect(getUserById).toHaveBeenCalledWith(MOCK_USER_ID);
    expect(getTVShowById).toHaveBeenCalledWith(MOCK_ITEM_ID);
    expect(getMovieById).not.toHaveBeenCalled();
    expect(upsertList).toHaveBeenCalledWith(MOCK_USER_ID, {
      itemId: MOCK_ITEM_ID,
      itemType: MOCK_ITEMS.TVSHOW,
    });
    expect(updateCache).toHaveBeenCalledWith(MOCK_PATTERN);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(MOCK_GET_TV_SHOW_BY_USER_ID);
  });

  test('should add item movie to list successfully', async () => {
    (getItemByUserId as jest.Mock).mockResolvedValue(MOCK_GET_MOVIE_BY_USER_ID);

    req.body = { itemId: MOCK_ITEM_ID_2, itemType: MOCK_ITEMS.MOVIE };
    await addItemToList(req, res);

    expect(isValidObjectId).toHaveBeenCalledWith(MOCK_USER_ID);
    expect(isValidObjectId).toHaveBeenCalledWith(MOCK_ITEM_ID_2);
    expect(getUserById).toHaveBeenCalledWith(MOCK_USER_ID);
    expect(getMovieById).toHaveBeenCalledWith(MOCK_ITEM_ID_2);
    expect(getTVShowById).not.toHaveBeenCalled();
    expect(upsertList).toHaveBeenCalledWith(MOCK_USER_ID, {
      itemId: MOCK_ITEM_ID_2,
      itemType: MOCK_ITEMS.MOVIE,
    });
    expect(updateCache).toHaveBeenCalledWith(MOCK_PATTERN);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(MOCK_GET_MOVIE_BY_USER_ID);
  });

  test('should return 400 if userId or itemId is invalid', async () => {
    (isValidObjectId as jest.Mock).mockReturnValueOnce(false);

    await addItemToList(req, res);

    expect(getUserById).not.toHaveBeenCalled();
    expect(getMovieById).not.toHaveBeenCalled();
    expect(getTVShowById).not.toHaveBeenCalled();
    expect(upsertList).not.toHaveBeenCalled();
    expect(updateCache).not.toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: MOCK_ERR_MSGS.INVALID_ID_MSG,
    });
  });

  test('should return 400 if user is not found', async () => {
    (getUserById as jest.Mock).mockResolvedValue(null);

    await addItemToList(req, res);

    expect(getMovieById).not.toHaveBeenCalled();
    expect(getTVShowById).not.toHaveBeenCalled();
    expect(upsertList).not.toHaveBeenCalled();
    expect(updateCache).not.toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: MOCK_ERR_MSGS.INVALID_USER_MSG,
    });
  });

  test('should return 400 if item is not found', async () => {
    (getTVShowById as jest.Mock).mockResolvedValue(null);

    await addItemToList(req, res);

    expect(isValidObjectId).toHaveBeenCalledWith(MOCK_USER_ID);
    expect(isValidObjectId).toHaveBeenCalledWith(MOCK_ITEM_ID);
    expect(getUserById).toHaveBeenCalledWith(MOCK_USER_ID);
    expect(upsertList).not.toHaveBeenCalled();
    expect(updateCache).not.toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: MOCK_ERR_MSGS.INVALID_ITEM_MSG,
    });
  });

  test('should return 400 if item is duplicate', async () => {
    (upsertList as jest.Mock).mockRejectedValue(
      new Error(MOCK_ERR_MSGS.DUPLICATE_ITEM_MSG)
    );

    await addItemToList(req, res);

    expect(isValidObjectId).toHaveBeenCalledWith(MOCK_USER_ID);
    expect(isValidObjectId).toHaveBeenCalledWith(MOCK_ITEM_ID);
    expect(getUserById).toHaveBeenCalledWith(MOCK_USER_ID);
    expect(getTVShowById).toHaveBeenCalledWith(MOCK_ITEM_ID);
    expect(getMovieById).not.toHaveBeenCalled();
    expect(upsertList).toHaveBeenCalledWith(MOCK_USER_ID, {
      itemId: MOCK_ITEM_ID,
      itemType: MOCK_ITEMS.TVSHOW,
    });
    expect(getCache).not.toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: MOCK_ERR_MSGS.DUPLICATE_ITEM_MSG,
    });
  });

  test('should return 500 if an error occurs', async () => {
    (upsertList as jest.Mock).mockRejectedValue(new Error('error'));

    await addItemToList(req, res);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: MOCK_ERR_MSGS.SERVER_ERROR_MSG,
    });
  });
});

describe('getList - test suite', () => {
  let req: any;
  let res: any;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    req = {
      params: { userId: MOCK_USER_ID },
      query: {},
    };
    res = {
      status: statusMock,
    };

    (isValidObjectId as jest.Mock).mockReturnValue(true);
    (getCache as jest.Mock).mockReturnValue(null);
    (setCache as jest.Mock).mockReturnValue(true);
    (getKey as jest.Mock).mockReturnValue(MOCK_REDIS_KEY);
    (getItemsListByUserId as jest.Mock).mockResolvedValue(
      MOCK_ITEM_LIST_BY_USER_ID
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get user list successfully', async () => {
    await getList(req, res);

    expect(getCache).toHaveBeenCalledWith(MOCK_REDIS_KEY);
    expect(isValidObjectId).toHaveBeenCalledWith(MOCK_USER_ID);
    expect(getItemsListByUserId).toHaveBeenCalledWith(MOCK_USER_ID, 5, 1);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(MOCK_ITEM_LIST_BY_USER_ID);
  });

  test('should get user list successfully from cache', async () => {
    (getCache as jest.Mock).mockReturnValue(
      JSON.stringify(MOCK_ITEM_LIST_BY_USER_ID)
    );

    await getList(req, res);

    expect(isValidObjectId).toHaveBeenCalledWith(MOCK_USER_ID);
    expect(getCache).toHaveBeenCalledWith(MOCK_REDIS_KEY);
    expect(getItemsListByUserId).not.toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(MOCK_ITEM_LIST_BY_USER_ID);
  });

  test('should get user list with custom limit and offset', async () => {
    (getItemsListByUserId as jest.Mock).mockResolvedValue(
      MOCK_ITEM_LIST_BY_USER_ID_2
    );

    req.query = { limit: '3', offset: '2' };

    await getList(req, res);

    expect(isValidObjectId).toHaveBeenCalledWith(MOCK_USER_ID);
    expect(getItemsListByUserId).toHaveBeenCalledWith(MOCK_USER_ID, 3, 2);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(MOCK_ITEM_LIST_BY_USER_ID_2);
  });

  test('should return 400 if userId is invalid', async () => {
    (isValidObjectId as jest.Mock).mockReturnValueOnce(false);

    await getList(req, res);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: MOCK_ERR_MSGS.INVALID_ID_MSG,
    });
  });

  test('should return 500 if an error occurs', async () => {
    (getItemsListByUserId as jest.Mock).mockRejectedValue(
      new Error('Test error')
    );

    await getList(req, res);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: MOCK_ERR_MSGS.SERVER_ERROR_MSG,
    });
  });
});

describe('removeItemFromList - test suite', () => {
  let req: any;
  let res: any;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    req = {
      params: { userId: MOCK_USER_ID, itemId: MOCK_ITEM_ID },
    };
    res = {
      status: statusMock,
    };

    (isValidObjectId as jest.Mock).mockReturnValue(true);
    (deleteItem as jest.Mock).mockResolvedValue({ modifiedCount: 1 });
    (updateCache as jest.Mock).mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should remove item from list successfully', async () => {
    await removeItemFromList(req, res);

    expect(isValidObjectId).toHaveBeenCalledWith(MOCK_USER_ID);
    expect(isValidObjectId).toHaveBeenCalledWith(MOCK_ITEM_ID);
    expect(deleteItem).toHaveBeenCalledWith(MOCK_USER_ID, MOCK_ITEM_ID);
    expect(updateCache).toHaveBeenCalledWith(MOCK_PATTERN);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      message: MOCK_SUCCESS_MSGS.ITEM_REMOVED_MSG,
    });
  });

  test('should return 400 if userId or itemId is invalid', async () => {
    (isValidObjectId as jest.Mock).mockReturnValueOnce(false);

    await removeItemFromList(req, res);

    expect(getItemsListByUserId).not.toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: MOCK_ERR_MSGS.INVALID_ID_MSG,
    });
  });

  test('should return 400 if item is not found', async () => {
    (deleteItem as jest.Mock).mockResolvedValue({ modifiedCount: 0 });

    await removeItemFromList(req, res);

    expect(getItemsListByUserId).not.toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: MOCK_ERR_MSGS.ITEM_NOT_FOUND_MSG,
    });
  });

  test('should return 500 if an error occurs', async () => {
    (updateCache as jest.Mock).mockRejectedValue(new Error('Redis error'));

    await removeItemFromList(req, res);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: MOCK_ERR_MSGS.SERVER_ERROR_MSG,
    });
  });
});
