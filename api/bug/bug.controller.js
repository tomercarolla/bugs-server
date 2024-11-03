import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { bugService } from "./bug.service.js";

export const bugCtrl = Router();

bugCtrl.get("/", requireAuth, async (req, res) => {
  const { severity, labels, pageIdx } = req.query;
  const filterBy = {
    ...req.query,
    severity: +severity,
    labels: labels ? labels.split(",") : undefined,
    pageIdx,
  };

  try {
    const bugs = await bugService.query(filterBy);

    res.send(bugs);
  } catch (error) {
    res.status(400).send(error);
  }
});

bugCtrl.get("/:bugId", requireAuth, async (req, res) => {
  const { bugId } = req.params;

  try {
    let visitedBugs = req.cookies.visitedBugs
      ? JSON.parse(req.cookies.visitedBugs)
      : [];

    if (!visitedBugs.includes(bugId)) {
      visitedBugs.push(bugId);
    }

    if (visitedBugs.length > 3) {
      return res.status(401).send("Wait for a bit");
    }

    res.cookie("visitedBugs", JSON.stringify(visitedBugs), {
      maxAge: 7000,
      httpOnly: true,
    });

    const bug = await bugService.getById(bugId);

    res.send(bug);
  } catch (error) {
    res.status(400).send(error);
  }
});

bugCtrl.get("/owner/:ownerId", requireAuth, async (req, res) => {
  const { ownerId } = req.params;

  try {
    const bugs = await bugService.getByOwnerId(ownerId);

    res.send(bugs);
  } catch (error) {
    res.status(400).send(error);
  }
});

bugCtrl.post("/", requireAuth, async (req, res) => {
  const user = req.loggedInUser;
  const { severity } = req.body;
  const bugToSave = {
    ...req.body,
    severity: +severity,
    owner: {
      _id: user._id,
      fullName: user.fullName,
    },
  };

  try {
    const savedBug = await bugService.add(bugToSave);

    res.send(savedBug);
  } catch (error) {
    res.status(400).send(error);
  }
});

bugCtrl.put("/:bugId", requireAuth, async (req, res) => {
  const user = req.loggedInUser;
  const { _id, severity } = req.body;
  const bugToSave = {
    _id,
    severity: +severity,
  };

  try {
    const savedBug = await bugService.save(bugToSave, user);

    res.send(savedBug);
  } catch (error) {
    res.status(400).send(error);
  }
});

bugCtrl.delete("/:bugId", requireAuth, async (req, res) => {
  const user = req.loggedInUser;
  const { bugId } = req.params;

  try {
    await bugService.remove(bugId, user);

    res.send("OK");
  } catch (error) {
    res.status(400).send(error);
  }
});
