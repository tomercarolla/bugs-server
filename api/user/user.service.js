import { ObjectId } from "mongodb";
import { dbService } from "../../services/db.service.js";
import { loggerService } from "../../services/logger.service.js";

export const userService = {
  query,
  getById,
  getByUsername,
  remove,
  save,
};

async function query() {
  try {
    const collection = await dbService.getCollection("user");

    return await collection.find().toArray();
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't get users...`;
  }
}

async function getById(userId) {
  try {
    const criteria = { _id: new ObjectId(userId) };
    const collection = await dbService.getCollection("user");
    const user = await collection.findOne(criteria);

    delete user.password;

    return user;
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't get user...`;
  }
}

async function getByUsername(username) {
  try {
    const collection = await dbService.getCollection("user");

    return await collection.findOne({ username });
  } catch (error) {
    loggerService.error("userService[getByUsername]: ", error);

    throw error;
  }
}

async function remove(userId) {
  try {
    const criteria = { _id: new ObjectId(userId) };
    const userCollection = await dbService.getCollection("user");
    const bugCollection = await dbService.getCollection("bug");
    const hasOwnedBugs = await bugCollection.findOne({ "owner._id": userId });

    loggerService.info(
      "hasOwnedBugs: ",
      `User with _id ${userId} owns bugs and cannot be deleted`,
    );

    if (hasOwnedBugs) throw `You can't delete this user.`;

    await userCollection.deleteOne(criteria);
  } catch (err) {
    loggerService.error(err);

    throw err;
  }
}

async function save(user) {
  try {
    const userToAdd = {
      ...user,
      role: "user",
      imgUrl: "https://dog.ceo/api/breeds/image/random",
    };
    const collection = await dbService.getCollection("user");

    await collection.insertOne(userToAdd);

    return userToAdd;
  } catch (err) {
    loggerService.error(err);

    throw `couldn't save user`;
  }
}
