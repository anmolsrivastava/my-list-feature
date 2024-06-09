import express from 'express';

import {
  addItemToList,
  getList,
  removeItemFromList,
} from '../controllers/myList';

export default (router: express.Router) => {
  router.get('/users/:userId/mylist', getList);
  router.post('/users/:userId/mylist', addItemToList);
  router.delete('/users/:userId/mylist/:itemId', removeItemFromList);
};
