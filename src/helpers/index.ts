import mongoose from 'mongoose';
import redisClient from './redis';

import { getUserByUserId, addItem } from '../db/myList';
import { Item } from '../types/index';
import {
  DUPLICATE_ITEM_MSG,
  REDIS_PREFIX,
  REDIS_SEPARATOR,
} from '../constants/index';

const ttl = process.env.REDIS_TTL || (300 as number);

export const upsertList = async (userId: string, item: Item) => {
  try {
    // Check if user exists in mylist
    const existingRecord = await getUserByUserId(userId);
    if (existingRecord) {
      // Check if item is duplicate
      const itemExists = existingRecord.items.some((ele) =>
        ele.itemId.equals(item.itemId)
      );
      if (itemExists) {
        throw new Error(DUPLICATE_ITEM_MSG);
      }

      existingRecord.items.push(item);
      await existingRecord.save();
    } else {
      await addItem(userId, item);
    }
  } catch (error) {
    throw error;
  }
};

export const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const getKey = (userId: string, limit: number, offset: number) =>
  `${REDIS_PREFIX}${REDIS_SEPARATOR}${userId}${REDIS_SEPARATOR}${limit}${REDIS_SEPARATOR}${offset}`;

export const getCache = (key: string) => {
  try {
    return redisClient.get(key);
  } catch (error) {
    throw error;
  }
};

export const setCache = async (key: string, data: any) => {
  try {
    return redisClient.setex(key, ttl, JSON.stringify(data));
  } catch (error) {
    throw error;
  }
};

export const updateCache = async (pattern: string) => {
  try {
    let cursor = '0';
    do {
      const result = await redisClient.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100
      );
      cursor = result[0];
      const keys = result[1];
      if (keys.length > 0) {
        const pipeline = redisClient.pipeline();
        keys.forEach((key) => {
          pipeline.del(key);
        });
        await pipeline.exec();
        console.log(`Deleted ${keys.length} keys in this batch`);
      }
    } while (cursor !== '0');
    console.log('Finished deleting keys');
  } catch (error) {
    throw error;
  }
};
