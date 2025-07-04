import express, { NextFunction, Request, Response } from "express"
import { Book, bookZodSchema } from "../models/books.model"

export const booksRoutes = express.Router()

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