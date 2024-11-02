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

const PAGE_SIZE = 2;
// const bugs = utilService.readJsonFile("./data/bug.json");

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy);
    const sort = _buildSort(filterBy);
    const collection = await dbService.getCollection("bug");

    let bugCursor = await collection.find(criteria, { sort });

    if (filterBy.pageIdx !== undefined) {
      bugCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE);
    }

    return bugCursor.toArray();
  } catch (err) {
    loggerService.error(err);

    throw err;
  }

  // let filteredBugs = [...bugs];

  // try {
  //   if (filterBy.title) {
  //     const regExp = new RegExp(filterBy.title, "i");
  //
  //     filteredBugs = filteredBugs.filter((bug) => regExp.test(bug.title));
  //   }
  //
  //   if (filterBy.severity) {
  //     filteredBugs = filteredBugs.filter(
  //       (bug) => bug.severity >= filterBy.severity,
  //     );
  //   }
  //
  //   if (filterBy.label) {
  //     const regExp = new RegExp(filterBy.label, "i");
  //
  //     filteredBugs = filteredBugs.filter((bug) => regExp.test(bug.labels));
  //   }
  //
  //   if (filterBy.sortBy) {
  //     const direction = filterBy.sortDir === "-1" ? -1 : 1;
  //
  //     filteredBugs = filteredBugs.sort((a, b) => {
  //       if (a[filterBy.sortBy] > b[filterBy.sortBy]) return direction;
  //       if (a[filterBy.sortBy] < b[filterBy.sortBy]) return -direction;
  //       return 0;
  //     });
  //   }
  //
  //   if (filterBy.pageIdx !== undefined) {
  //     const startIdx = filterBy.pageIdx * PAGE_SIZE;
  //
  //     filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE);
  //   }
  //
  //   return filteredBugs;
  // } catch (err) {
  //   loggerService.error(err);
  //
  //   throw `Couldn't get bugs...`;
  // }
}

async function getById(bugId) {
  try {
    const criteria = { _id: new ObjectId(bugId) };
    const collection = await dbService.getCollection("bug");

    return await collection.findOne(criteria);

    // const bug = bugs.find((bug) => bug._id === bugId);

    // if (!bug) throw `Couldn't get bug...`;

    // return bug;
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't get bug...`;
  }
}

async function getByOwnerId(ownerId) {
  try {
    const criteria = { "owner._id": new ObjectId(ownerId) };
    const collection = await dbService.getCollection("bug");

    return await collection.find(criteria).toArray();

    // const filteredBugs = bugs.filter((bug) => bug.owner._id === ownerId);

    // if (!filteredBugs) throw `Couldn't get bugs...`;

    // return filteredBugs;
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't get bugs...`;
  }
}

async function remove(bugId, user) {
  const { _id: ownerId, role } = user;
  try {
    const criteria = {
      _id: new ObjectId(bugId),
    };

    if (role !== "admin") criteria["owner._id"] = ownerId;

    const collection = await dbService.getCollection("bug");
    const res = await collection.deleteOne(criteria);

    if (res.deletedCount === 0) throw `Not your bug`;

    return bugId;

    // const idx = bugs.findIndex((bug) => bug._id === bugId);

    // if (idx === -1) throw `Bad bug Id`;

    // if (user.role !== "admin") {
    //   if (bugs[idx].owner._id !== user._id) throw `Not your bug`;
    // }

    // bugs.splice(idx, 1);

    // await _saveBugs();
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

async function save(bugToSave) {
  try {
    const collection = await dbService.getCollection("bug");
    const criteria = { _id: new ObjectId(bugToSave._id) };

    await collection.updateOne(criteria, { $set: bugToSave });

    return bugToSave;

    // if (bugToSave._id) {
    //   const idx = bugs.findIndex((bug) => bug._id === bugToSave._id);
    //
    //   if (idx === -1) throw `Bad bug Id`;
    //
    //   if (user.role !== "admin") {
    //     if (bugs[idx].owner._id !== user._id) throw `Not your bug`;
    //   }
    //
    //   bugs.splice(idx, 1, bugToSave);
    // } else {
    //   bugToSave._id = utilService.makeId();
    //   bugToSave.createdAt = Date.now();
    //
    //   bugs.push(bugToSave);
    // }
    //
    // await _saveBugs();
  } catch (err) {
    loggerService.error(err);

    throw `couldn't save bug`;
  }
}

// async function _saveBugs() {
//   await utilService.writeJsonFile("./data/bug.json", bugs);
// }

function _buildCriteria(filterBy) {
  return {
    title: { $regex: filterBy.title, $options: "i" },
    label: { $regex: filterBy.label, $options: "i" },
    severity: { $gte: filterBy.severity },
  };
}

function _buildSort(filterBy) {
  if (!filterBy.sortBy) return {};

  return { [filterBy.sortBy]: filterBy.sortBy };
}
