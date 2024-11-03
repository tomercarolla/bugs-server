import { ObjectId } from "mongodb";
import { dbService } from "../../services/db.service.js";
import { loggerService } from "../../services/logger.service.js";

export const messageService = {
  query,
  getById,
  remove,
  save,
};

async function query() {
  try {
    return await dbService.getCollection("message").toArray();
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't get messages...`;
  }
}

async function getById(messageId) {
  try {
    const criteria = { _id: new ObjectId(messageId) };
    const collection = await dbService.getCollection("message");

    return await collection.findOne(criteria);
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't get message...`;
  }
}

async function save(message) {
  try {
    const collection = await dbService.getCollection("message");
    const { insertedId } = await collection.insertOne(message);

    return await getById(insertedId);
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
