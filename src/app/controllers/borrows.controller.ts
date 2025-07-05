import express, { NextFunction, Request, Response } from "express"
import { borrowZodSchema } from "../models/borrow.model"
import { Book } from "../models/book.model"

export const borrowsRoutes = express.Router()

borrowsRoutes.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = borrowZodSchema.parse(req.body)

        const { book, quantity, dueDate } = body

        const existingBook = await Book.findById(book)

        if (!existingBook) {
            throw new Error("Book not found")
        }

        await existingBook.adjustInventory()
    } catch (error: any) {
        if (!error.message) {
            error.message = "Book borrow failed"
        }

        if (error.name === "CastError") {
            error.message = "BookId is not valid"
        }
        next(error)
    }
})