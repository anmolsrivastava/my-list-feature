import express from 'express';

import users from './myList';

const router = express.Router();

export default (): express.Router => {
  users(router);
  return router;
};
