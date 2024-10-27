import {Router} from "express";
import {userService} from "./user.service.js";
import {requireAuth} from "../../middleware/auth.middleware.js";
import {admin} from "../../middleware/admin.middleware.js";

export const userCtrl = Router();

userCtrl.get('/', requireAuth, admin, async (req, res) => {
    const { username, score, pageIdx } = req.query;
    const filterBy = { username, score: +score, pageIdx };

    try {
        const users = await userService.query(filterBy);
        res.send(users)
    } catch (error) {
        console.log(error);

        res.status(400).send(error);
    }
});

userCtrl.get('/:userId', requireAuth, admin, async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await userService.getById(userId);

        res.send(user);
    } catch (error) {
        console.log(error);

        res.status(400).send(error);
    }
});

userCtrl.post('/', requireAuth, admin, async (req, res) => {
    const { score } = req.body;
    const userToSave = { ...req.body, score: +score };

    try {
        const savedUser = await userService.save(userToSave);

        res.send(savedUser);
    } catch (error) {
        console.log(error);

        res.status(400).send(error);
    }
});

userCtrl.put('/:userId', requireAuth, admin, async (req, res) => {
    const { score } = req.body;
    const userToSave = { ...req.body, score: +score };

    try {
        const savedUser = await userService.save(userToSave);

        res.send(savedUser);
    } catch (error) {
        console.log(error);

        res.status(400).send(error);
    }
});

userCtrl.delete('/:userId', requireAuth, admin, async (req, res) => {
    const { userId } = req.params;

    try {
        await userService.remove(userId);

        res.send('OK');
    } catch (error) {
        console.log(error);

        res.status(400).send(error);
    }
});
