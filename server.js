import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import path from "path";
import {bugCtrl, userCtrl} from "./api/index.js";
import {authCtrl} from "./api/auth/index.js";

const app = express();

app.listen(3030, () => console.log('Server is running on port 3030'));

const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true,
}

const port = 3030;

app.use(express.static('public'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/api/bug', bugCtrl);
app.use('/api/user', userCtrl);
app.use('/api/auth', authCtrl);

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})
