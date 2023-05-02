import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { OrderModel } from "../models/order.model";
import { OrderStatus } from "../constants/order_status";
import authMid from "../middlewares/auth.mid";
const router = Router();

router.use(authMid)

router.post('/create', expressAsyncHandler( async (req:any, res:any) => {
    const reqOrder = req.body;

    if (reqOrder.items.length <= 0) {
        res.status(HTTP_BAD_REQUEST).send('Cart is empty');
        return;
    };

    await OrderModel.deleteOne({
        user: req.user.id,
        status: OrderStatus.NEW
    });

    const newOrder = new OrderModel({
        ...reqOrder,
        user: req.user.id
    });
    await newOrder.save();
    res.send(newOrder);
}));

router.get('/userOrder', expressAsyncHandler( async (req:any, res) => {
    const order = await OrderModel.findOne({user: req.user.id, status: OrderStatus.NEW});
    if (order) res.send(order);
    else res.status(HTTP_BAD_REQUEST).send();
}));

export default router;
