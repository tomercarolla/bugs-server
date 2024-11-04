import { ObjectId } from "mongodb";
import { dbService } from "../../services/db.service.js";
import { loggerService } from "../../services/logger.service.js";

export const messageService = {
  query,
  remove,
  save,
};

async function query() {
  try {
    const collection = await dbService.getCollection("message");

    return await collection
      .aggregate([
        {
          $lookup: {
            from: "bug",
            localField: "aboutBugId",
            foreignField: "_id",
            as: "aboutBug",
          },
        },
        {
          $unwind: {
            path: "$aboutBug",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            localField: "byUserId",
            from: "user",
            foreignField: "_id",
            as: "byUser",
          },
        },
        {
          $unwind: {
            path: "$byUser",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            txt: 1,
            "aboutBug._id": 1,
            "aboutBug.title": 1,
            "aboutBug.severity": 1,
            "byUser._id": 1,
            "byUser.fullName": 1,
          },
        },
      ])
      .toArray();
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't get messages...`;
  }
}

async function save(message) {
  try {
    const messageToAdd = {
      byUserId: ObjectId.createFromHexString(message.byUserId),
      aboutUserId: ObjectId.createFromHexString(message.aboutUserId),
      txt: message.txt,
    };

    const collection = await dbService.getCollection("message");

    await collection.insertOne(messageToAdd);

    return messageToAdd;
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't save message...`;
  }
}

async function remove(messageId) {
  try {
    const criteria = { _id: new ObjectId(messageId) };
    const collection = await dbService.getCollection("message");

    return await collection.deleteOne(criteria);
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't remove message...`;
  }
}
