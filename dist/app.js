"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_controller_1 = require("./app/controllers/books.controller");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/books", books_controller_1.booksRoutes);
app.get('/', (req, res) => {
    res.send('Smart Lib server');
});
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});
app.use((error, req, res, next) => {
    if (error) {
        res.status(400).json({
            success: false,
            message: error._message || error.message || "Something went wrong",
            error
        });
    }
});
exports.default = app;
