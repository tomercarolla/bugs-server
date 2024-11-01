import { loggerService } from "../../services/logger.service.js";
import { utilService } from "../../services/util.service.js";

export const bugService = {
  query,
  getById,
  getByOwnerId,
  remove,
  save,
};

const PAGE_SIZE = 2;
const bugs = utilService.readJsonFile("./data/bug.json");

async function query(filterBy = {}) {
  let filteredBugs = [...bugs];

  try {
    if (filterBy.title) {
      const regExp = new RegExp(filterBy.title, "i");

      filteredBugs = filteredBugs.filter((bug) => regExp.test(bug.title));
    }

    if (filterBy.severity) {
      filteredBugs = filteredBugs.filter(
        (bug) => bug.severity >= filterBy.severity,
      );
    }

    if (filterBy.label) {
      const regExp = new RegExp(filterBy.label, "i");

      filteredBugs = filteredBugs.filter((bug) => regExp.test(bug.labels));
    }

    if (filterBy.sortBy) {
      const direction = filterBy.sortDir === "-1" ? -1 : 1;

      filteredBugs = filteredBugs.sort((a, b) => {
        if (a[filterBy.sortBy] > b[filterBy.sortBy]) return direction;
        if (a[filterBy.sortBy] < b[filterBy.sortBy]) return -direction;
        return 0;
      });
    }

    if (filterBy.pageIdx !== undefined) {
      const startIdx = filterBy.pageIdx * PAGE_SIZE;

      filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE);
    }

    return filteredBugs;
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't get bugs...`;
  }
}

async function getById(bugId) {
  try {
    const bug = bugs.find((bug) => bug._id === bugId);

    if (!bug) throw `Couldn't get bug...`;

    return bug;
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't get bug...`;
  }
}

async function getByOwnerId(ownerId) {
  try {
    const filteredBugs = bugs.filter((bug) => bug.owner._id === ownerId);

    if (!filteredBugs) throw `Couldn't get bugs...`;

    return filteredBugs;
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't get bugs...`;
  }
}

async function remove(bugId, user) {
  try {
    const idx = bugs.findIndex((bug) => bug._id === bugId);

    if (idx === -1) throw `Bad bug Id`;

    if (user.role !== "admin") {
      if (bugs[idx].owner._id !== user._id) throw `Not your bug`;
    }

    bugs.splice(idx, 1);

    await _saveBugs();
  } catch (err) {
    loggerService.error(err);

    throw `Couldn't remove bug`;
  }
}

async function save(bugToSave, user) {
  try {
    if (bugToSave._id) {
      const idx = bugs.findIndex((bug) => bug._id === bugToSave._id);

      if (idx === -1) throw `Bad bug Id`;

      if (user.role !== "admin") {
        if (bugs[idx].owner._id !== user._id) throw `Not your bug`;
      }

      bugs.splice(idx, 1, bugToSave);
    } else {
      bugToSave._id = utilService.makeId();
      bugToSave.createdAt = Date.now();

      bugs.push(bugToSave);
    }

    await _saveBugs();
  } catch (err) {
    loggerService.error(err);

    throw `couldn't save bug`;
  }

  return bugToSave;
}

async function _saveBugs() {
  await utilService.writeJsonFile("./data/bug.json", bugs);
}
