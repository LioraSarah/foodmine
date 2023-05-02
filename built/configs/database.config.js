"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
var mongoose_1 = require("mongoose");
var dbConnect = function () {
    (0, mongoose_1.connect)("mongodb+srv://liosferrero:wwtG5MjjOn93xCzk@cluster0.8ssvooy.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(function () { return console.log("connected to database"); }, function (error) { return console.log(error); });
};
exports.dbConnect = dbConnect;
