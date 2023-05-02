import { Router } from "express";
import jwt from "jsonwebtoken";
import { sample_users } from "../data";
const router = Router();
import bcrypt from 'bcryptjs';
import expressAsyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";

router.get("/seed", expressAsyncHandler(async (req, res) => {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
        res.send("Seed is already done");
        return;
    }

    await UserModel.create(sample_users);
    res.send("Seeded successfuly");
}));

router.post("/login",expressAsyncHandler( async (req, res) => {
    const {email, password} = req.body;
    const lowerCaseEmail = email.toLowerCase();
    console.log(lowerCaseEmail);
    const user = await UserModel.findOne({email: lowerCaseEmail});
    console.log(user);

    if (user && await bcrypt.compare(password, user.password)) {
        res.send(generateTokenRes(user));
    } else {
        res.status(HTTP_BAD_REQUEST).send("Email or password does not match");
    }
}));

router.post('/register', expressAsyncHandler( async (req, res) => {
    const { name, email, password, address } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    const user = await UserModel.findOne({email: lowerCaseEmail});

    if (user) {
        res.status(HTTP_BAD_REQUEST).send('User already exist');
        return;
    }

    const encryptedPsw = await bcrypt.hash(password, 10);

    const newUser: User = {
        id: '',
        name,
        email: email.toLowerCase(),
        password: encryptedPsw,
        address,
        isAdmin: false
    };

    const dbUser = await UserModel.create(newUser);
    const registerUser = generateTokenRes(dbUser);
    console.log(registerUser);
    res.send(registerUser);

}));

const generateTokenRes = (user:any) => {
    const token = jwt.sign({id: user.id, email: user.email, isAdmin: user.isAdmin}, "randomText", { expiresIn: "30d" });
    user.token = token;
    return user;
}

export default router;
