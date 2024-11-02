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

// const users = utilService.readJsonFile("./data/user.json");

async function query() {
  try {
    return await dbService.getCollection("user").toArray();
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

    // const user = users.find((user) => user._id === userId);

    // if (!user) throw `Couldn't get user...`;

    // return user;
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't get user...`;
  }
}

async function getByUsername(username) {
  try {
    const collection = await dbService.getCollection("user");

    return await collection.findOne({ username });

    // return users.find((user) => user.username === username);
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

    // const idx = users.findIndex((user) => user._id === userId);

    // if (idx === -1) throw `Couldn't find user with _id ${userId}`;

    // const bugs = await bugService.query();
    // const hasOwnedBugs = bugs.some((bug) => bug.owner._id === userId);

    // users.splice(idx, 1);

    // await _saveUsers();
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

    // users.push(user);

    // await _saveUsers();

    // return user;
    // if (userToSave._id) {
    //     const idx = users.findIndex(user => user._id === userToSave._id);
    //
    //     if (idx === -1) throw `Bad user Id`;
    //
    //     users.splice(idx, 1, userToSave);
    // } else {
    //     userToSave._id = utilService.makeId();
    //     users.push(userToSave);
    // }
  } catch (err) {
    loggerService.error(err);

    throw `couldn't save user`;
  }
}

// async function _saveUsers() {
//   await utilService.writeJsonFile("./data/user.json", users);
// }
