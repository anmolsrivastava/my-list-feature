import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;

const itemSchema = new mongoose.Schema({
  itemId: { type: ObjectId, required: true },
  itemType: { type: String, required: true },
});

const myListSchema = new mongoose.Schema(
  {
    userId: { type: ObjectId, required: true, unique: true },
    items: [itemSchema],
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
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const MyListModel = mongoose.model('MyList', myListSchema);

export const getItems = () => MyListModel.find();
export const getUserByUserId = (userId: string) =>
  MyListModel.findOne({ userId });
export const addItem = (userId: string, item: any) =>
  new MyListModel({ userId, items: [item] })
    .save()
    .then((list) => list.toObject());

export const deleteItem = (userId: string, itemId: string) => {
  return MyListModel.updateOne(
    { userId: userId },
    { $pull: { items: { itemId: itemId } } }
  );
};

export const getItemByUserId = async (userId: string) => {
  try {
    const result = await MyListModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$items' },
      {
        $addFields: {
          collectionName: {
            $cond: {
              if: { $eq: ['$items.itemType', 'TVShow'] },
              then: 'tvshows',
              else: 'movies',
            },
          },
        },
      },
      { $sort: { 'items._id': -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'tvshows',
          localField: 'items.itemId',
          foreignField: '_id',
          as: 'tvshowDetails',
        },
      },
      {
        $lookup: {
          from: 'movies',
          localField: 'items.itemId',
          foreignField: '_id',
          as: 'movieDetails',
        },
      },
      {
        $addFields: {
          mergedDetails: { $concatArrays: ['$tvshowDetails', '$movieDetails'] },
        },
      },
      { $unwind: '$mergedDetails' },
      {
        $project: {
          _id: 0,
          id: '$items.itemId',
          itemType: '$items.itemType',
          title: {
            $cond: {
              if: { $ne: ['$mergedDetails.title', null] },
              then: '$mergedDetails.title',
              else: undefined,
            },
          },
          description: {
            $cond: {
              if: { $ne: ['$mergedDetails.description', null] },
              then: '$mergedDetails.description',
              else: undefined,
            },
          },
          genres: {
            $cond: {
              if: { $ne: ['$mergedDetails.genres', null] },
              then: '$mergedDetails.genres',
              else: undefined,
            },
          },
          releaseDate: {
            $cond: {
              if: { $ne: ['$mergedDetails.releaseDate', null] },
              then: '$mergedDetails.releaseDate',
              else: undefined,
            },
          },
          director: {
            $cond: {
              if: { $ne: ['$mergedDetails.director', null] },
              then: '$mergedDetails.director',
              else: undefined,
            },
          },
          actors: {
            $cond: {
              if: { $ne: ['$mergedDetails.actors', null] },
              then: '$mergedDetails.actors',
              else: undefined,
            },
          },
        },
      },
    ]);

    return result[0];
  } catch (error) {
    throw error;
  }
};

export const getItemsListByUserId = async (
  userId: string,
  limit: number,
  currentPage: number
): Promise<any> => {
  try {
    const offset = (currentPage - 1) * limit;

    const results = await MyListModel.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $unwind: '$items',
      },
      {
        $lookup: {
          from: 'tvshows',
          localField: 'items.itemId',
          foreignField: '_id',
          as: 'tvShowDetails',
          pipeline: [
            {
              $project: {
                _id: 0,
                title: 1,
                description: 1,
                genres: 1,
                episodes: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'movies',
          localField: 'items.itemId',
          foreignField: '_id',
          as: 'movieDetails',
          pipeline: [
            {
              $project: {
                _id: 0,
                title: 1,
                description: 1,
                genres: 1,
                releaseDate: 1,
                director: 1,
                actors: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          itemDetails: {
            $cond: {
              if: { $eq: ['$items.itemType', 'Movie'] },
              then: { $arrayElemAt: ['$movieDetails', 0] },
              else: { $arrayElemAt: ['$tvShowDetails', 0] },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: 1,
          item: {
            itemId: '$items.itemId',
            itemType: '$items.itemType',
            details: '$itemDetails',
          },
        },
      },
      {
        $group: {
          _id: '$userId',
          userId: { $first: '$userId' },
          items: { $push: '$item' },
        },
      },
      {
        $addFields: {
          totalItems: { $size: '$items' },
        },
      },
      {
        $project: {
          userId: 1,
          items: { $slice: ['$items', offset, limit] },
          totalItems: 1,
        },
      },
      {
        $addFields: {
          hasNextPage: {
            $cond: {
              if: { $gt: ['$totalItems', offset + limit] },
              then: true,
              else: false,
            },
          },
          nextPage: {
            $cond: {
              if: { $gt: ['$totalItems', offset + limit] },
              then: currentPage + 1,
              else: null,
            },
          },
          currentPage: currentPage,
        },
      },
      {
        $project: {
          _id: 0,
          userId: 1,
          items: 1,
          hasNextPage: 1,
          nextPage: 1,
          currentPage: 1,
        },
      },
    ]);

    return results.length > 0 ? results[0] : {};
  } catch (error) {
    throw error;
  }
};
