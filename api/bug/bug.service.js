import { ObjectId } from "mongodb";
import { dbService } from "../../services/db.service.js";
import { loggerService } from "../../services/logger.service.js";

export const bugService = {
  query,
  getById,
  getByOwnerId,
  remove,
  add,
  save,
};

async function query(filterBy = {}) {
  try {
    const collection = await dbService.getCollection("bug");

    let bugCursor = await collection
      .find(filterBy.criteria)
      .sort(filterBy.sort);

    return bugCursor.toArray();
  } catch (err) {
    loggerService.error(err);

    throw err;
  }
}

async function getById(bugId) {
  try {
    const criteria = { _id: new ObjectId(bugId) };
    const collection = await dbService.getCollection("bug");

    return await collection.findOne(criteria);
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't get bug...`;
  }
}

async function getByOwnerId(ownerId) {
  try {
    const criteria = { "owner._id": ownerId };
    const collection = await dbService.getCollection("bug");

    return await collection.find(criteria).toArray();
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't get bugs...`;
  }
}

async function remove(bugId, user) {
  try {
    const { _id: ownerId, role } = user;
    const criteria = {
      _id: new ObjectId(bugId),
    };

    if (role !== "admin") criteria["owner._id"] = ownerId;

    const collection = await dbService.getCollection("bug");
    const res = await collection.deleteOne(criteria);

    if (res.deletedCount === 0) throw `Not your bug`;

    return bugId;
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't remove bug`;
  }
}

async function add(bugToSave) {
  try {
    const collection = await dbService.getCollection("bug");

    await collection.insertOne(bugToSave);

    return bugToSave;
  } catch (err) {
    loggerService.error(err);

    throw `couldn't save bug`;
  }
}

async function save(bug) {
  try {
    const bugToSave = { severity: bug.severity };
    const collection = await dbService.getCollection("bug");
    const criteria = { _id: new ObjectId(bug._id) };

    await collection.updateOne(criteria, { $set: bugToSave });

    return await collection.findOne(criteria);
  } catch (err) {
    loggerService.error(err);

    throw `couldn't save bug`;
  }
}
