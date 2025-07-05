"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_model_1 = require("../models/books.model");
exports.booksRoutes = express_1.default.Router();
// Create Book API
exports.booksRoutes.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = books_model_1.bookZodSchema.parse(req.body);
        const newBook = yield books_model_1.Book.create(body);
        res.json({
            success: true,
            message: "Book created successfully",
            data: newBook
        });
    }
    catch (error) {
        error.message = "Book post failed";
        next(error);
    }
}));
// Get all books API
exports.booksRoutes.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy, sort, limit = 10 } = req.query;
        const sortOrder = sort === "asc" ? 1 : sort === "desc" ? -1 : undefined;
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        let sortOption = {};
        let allBooksCursor = books_model_1.Book.find(query);
        if (sortBy && sortOrder !== undefined) {
            sortOption = { [sortBy]: sortOrder };
            allBooksCursor = allBooksCursor.sort(sortOption);
        }
        if (limit && !isNaN(Number(limit))) {
            allBooksCursor = allBooksCursor.limit(Number(limit));
        }
        const allBooks = yield allBooksCursor.exec();
        res.json({
            success: true,
            message: "Books retrieved successfully",
            data: allBooks
        });
    }
    catch (error) {
        error.message = "Books retrieve failed";
        next(error);
    }
}));
// Get Book By Id
exports.booksRoutes.get('/:bookId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield books_model_1.Book.findById(bookId);
        res.json({
            success: true,
            message: "Book retrieved successfully",
            data: book
        });
    }
    catch (error) {
        error.message = "Book retrieve failed";
        if (error.name === "CastError") {
            error.message = "BookId is not valid";
        }
        next(error);
    }
}));
// Update book
exports.booksRoutes.put('/:bookId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const updatePart = req.body;
        const existingBook = yield books_model_1.Book.findById(bookId);
        if (!existingBook) {
            throw new Error("Book not found");
        }
        const updatedBook = yield books_model_1.Book.findByIdAndUpdate(bookId, { $set: updatePart }, { new: true });
        res.json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook
        });
    }
    catch (error) {
        if (!error.message) {
            error.message = "Book update failed";
        }
        if (error.name === "CastError") {
            error.message = "BookId is not valid";
        }
        next(error);
    }
}));
// Delete Book api
exports.booksRoutes.delete("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const existingBook = yield books_model_1.Book.findById(bookId);
        if (!existingBook) {
            throw new Error("Book not found");
        }
        yield books_model_1.Book.findByIdAndDelete(bookId);
        res.json({
            success: true,
            message: "Book deleted successfully",
            data: null
        });
    }
    catch (error) {
        if (!error.message) {
            error.message = "Book delete failed";
        }
        if (error.name === "CastError") {
            error.message = "BookId is not valid";
        }
        next(error);
    }
}));
