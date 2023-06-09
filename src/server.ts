import express from "express";
import path from 'path';
import cors from "cors";
import dotenv from 'dotenv';
import foodRouter from './routers/food-router';
import userRouter from './routers/user-router';
import orderRouter from './routers/order-router';
import { dbConnect } from './configs/database.config';

dbConnect();
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200"]
}));

app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

app.use(express.static(path.join(__dirname, "../frontend/dist/frontend")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/frontend/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is now listening at port ${PORT}`);
});
