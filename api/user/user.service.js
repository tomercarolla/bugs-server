import { loggerService } from "../../services/logger.service.js";
import { utilService } from "../../services/util.service.js";
import { bugService } from "../bug/bug.service.js";

export const userService = {
  query,
  getById,
  getByUsername,
  remove,
  save,
};

const users = utilService.readJsonFile("./data/user.json");

async function query() {
  try {
    return users;
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't get users...`;
  }
}

async function getById(userId) {
  try {
    const user = users.find((user) => user._id === userId);

    if (!user) throw `Couldn't get user...`;

    return user;
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't get user...`;
  }
}

async function getByUsername(username) {
  try {
    return users.find((user) => user.username === username);
  } catch (error) {
    loggerService.error("userService[getByUsername]: ", error);

    throw error;
  }
}

async function remove(userId) {
  try {
    const idx = users.findIndex((user) => user._id === userId);

    if (idx === -1) throw `Couldn't find user with _id ${userId}`;

    const bugs = await bugService.query();
    const hasOwnedBugs = bugs.some((bug) => bug.owner._id === userId);

    loggerService.info(
      "hasOwnedBugs: ",
      `User with _id ${userId} owns bugs and cannot be deleted`,
    );

    if (hasOwnedBugs) throw `You can't delete this user.`;

    users.splice(idx, 1);

    await _saveUsers();
  } catch (err) {
    loggerService.error(err);

    throw err;
  }
}

async function save(user) {
  try {
    user._id = utilService.makeId();
    user.role = "user";
    user.createAt = Date.now();
    user.imgUrl = "https://dog.ceo/api/breeds/image/random";

    users.push(user);

    await _saveUsers();

    return user;
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

async function _saveUsers() {
  await utilService.writeJsonFile("./data/user.json", users);
}
