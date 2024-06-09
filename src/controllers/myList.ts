import express from 'express';

import { getUserById } from '../db/users';
import { getMovieById } from '../db/movies';
import { getTVShowById } from '../db/tvShows';
import {
  deleteItem,
  getItemByUserId,
  getItemsListByUserId,
} from '../db/myList';
import { validatePayload } from '../schema/validator';
import {
  isValidObjectId,
  upsertList,
  getKey,
  getCache,
  setCache,
  updateCache,
} from '../helpers';
import {
  ITEM_TYPE,
  INVALID_USER_MSG,
  INVALID_ID_MSG,
  INVALID_ITEM_MSG,
  DUPLICATE_ITEM_MSG,
  SERVER_ERROR_MSG,
  ITEM_NOT_FOUND_MSG,
  ITEM_REMOVED_MSG,
  REDIS_PREFIX,
  REDIS_SEPARATOR,
  REDIS_PATTERN_MATCH,
} from '../constants';

export const addItemToList = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.params;
    const { body } = req;
    const { itemId, itemType } = body;

    // Validate Request
    const errors = validatePayload(body);
    if (errors.length) return res.status(400).send(errors);

    // Validate ObjectId
    if (!isValidObjectId(userId) || !isValidObjectId(itemId))
      return res.status(400).json({ message: INVALID_ID_MSG });

    // Validate userId
    const user = await getUserById(userId);
    if (!user) return res.status(400).json({ message: INVALID_USER_MSG });

    // Validate itemId
    let item;
    if (itemType === ITEM_TYPE.MOVIE) {
      item = await getMovieById(itemId);
    } else {
      item = await getTVShowById(itemId);
    }
    if (!item) return res.status(400).json({ message: INVALID_ITEM_MSG });

    await upsertList(userId, { itemId, itemType });
    const addedItem = await getItemByUserId(userId);

    const pattern = `${REDIS_PREFIX}${REDIS_SEPARATOR}${userId}${REDIS_PATTERN_MATCH}`;
    await updateCache(pattern);

    return res.status(200).json(addedItem).end();
  } catch (error) {
    if (error?.message === DUPLICATE_ITEM_MSG) {
      return res.status(400).json({ message: DUPLICATE_ITEM_MSG });
    } else {
      return res.status(500).json({ message: SERVER_ERROR_MSG });
    }
  }
};

export const getList = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;

    const limit = parseInt(req.query?.limit as string, 10) || 5;
    const offset = parseInt(req.query?.offset as string, 10) || 1;

    if (!isValidObjectId(userId))
      return res.status(400).json({ message: INVALID_ID_MSG });

    //Check cache in redis
    const key = getKey(userId, limit, offset);
    const cache = await getCache(key);
    if (cache) return res.status(200).json(JSON.parse(cache)).end();

    const userList = await getItemsListByUserId(userId, limit, offset);

    //Set cache in redis
    await setCache(key, userList);

    return res.status(200).json(userList);
  } catch (error) {
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
};

export const removeItemFromList = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId, itemId } = req.params;

    // Validate ObjectId
    if (!isValidObjectId(userId) || !isValidObjectId(itemId))
      return res.status(400).json({ message: INVALID_ID_MSG });

    const response = await deleteItem(userId, itemId);
    const pattern = `${REDIS_PREFIX}${REDIS_SEPARATOR}${userId}${REDIS_PATTERN_MATCH}`;
    await updateCache(pattern);

    if (response.modifiedCount)
      return res.status(200).json({ message: ITEM_REMOVED_MSG });

    return res.status(400).json({ message: ITEM_NOT_FOUND_MSG });
  } catch (error) {
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
};
