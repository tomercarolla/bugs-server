import Cryptr from 'cryptr';
import {userService} from "../user/user.service.js";
import {loggerService} from "../../services/logger.service.js";
import bcrypt from "bcrypt";


const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-1');

export const authService = {
    getLoginToken,
    validateToken,
    login,
    signup
}

function getLoginToken(user) {
    const string = JSON.stringify(user);

    return cryptr.encrypt(string);
}

function validateToken(token) {
    try {
        const json = cryptr.decrypt(token);

        return JSON.parse(json);
    } catch (error) {
        console.log('Invalid login token')
    }

    return null;
}

async function login(username, password) {
    const user = await userService.getByUsername(username);

    if (!user) throw 'User not found';

    //un-comment for real login
    // const match = await bcrypt.compare(password, user.password);
    // if (!match) throw 'Invalid username or password';

    //Removing password and personal data
    return {
        _id: user._id,
        fullName: user.fullName,
        role: user.role,
        imgUrl: user.imgUrl
    };
}

async function signup({username, password, fullName}) {
    const saltRounds = 10;

    if (!username || !password || !fullName) throw 'Missing required fields';

    loggerService.debug(`auth.service - signup with username: ${username}, fullName: ${fullName}`);

    const userExist = await userService.getByUsername(username);

    if (userExist) throw 'Username already exists';

    const hash = await bcrypt.hash(password, saltRounds);

    return userService.save({username, password: hash, fullName});
}