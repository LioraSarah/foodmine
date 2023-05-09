"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var food_router_1 = __importDefault(require("./routers/food-router"));
var user_router_1 = __importDefault(require("./routers/user-router"));
var order_router_1 = __importDefault(require("./routers/order-router"));
var database_config_1 = require("./configs/database.config");
(0, database_config_1.dbConnect)();
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: ["http://localhost:4200"]
}));
app.use("/api/foods", food_router_1.default);
app.use("/api/users", user_router_1.default);
app.use("/api/orders", order_router_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "../frontend/dist/frontend")));
app.get("*", function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "../frontend/dist/frontend/index.html"));
});
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
    console.log("Server is now listening at port ".concat(PORT));
});
