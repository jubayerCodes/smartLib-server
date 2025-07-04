import express, { NextFunction, Request, Response } from "express"
import { Book, bookZodSchema } from "../models/books.model"

export const booksRoutes = express.Router()


// Create Book API
booksRoutes.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = bookZodSchema.parse(req.body)

        const newBook = await Book.create(body)

        res.json({
            success: true,
            message: "Book created successfully",
            data: newBook
        })
    } catch (error) {
        next(error)
    }
})

// Get all books API
booksRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { filter, sortBy, sort, limit = 10 } = req.query

        const sortOrder = sort === "asc" ? 1 : sort === "desc" ? -1 : undefined;

        const query: any = {};

        if (filter) {
            query.genre = filter;
        }

        let sortOption: any = {};

        let allBooksCursor = Book.find(query)

        if (sortBy && sortOrder !== undefined) {
            sortOption = { [sortBy as string]: sortOrder };
            allBooksCursor = allBooksCursor.sort(sortOption);
        }

        if (limit && !isNaN(Number(limit))) {
            allBooksCursor = allBooksCursor.limit(Number(limit));
        }

        const allBooks = await allBooksCursor.exec()

        res.json({
            success: true,
            message: "Books retrieved successfully",
            data: allBooks
        })
    } catch (error) {
        next(error)
    }
})