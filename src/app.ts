import express, { Application, NextFunction, Request, Response } from 'express';
import { booksRoutes } from './app/controllers/books.controller';
const app: Application = express()

app.use(express.json())

app.use("/api/books", booksRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send('Smart Lib server')
})


app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Route not found" })
})

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error) {
        res.status(400).json(
            {
                success: false,
                message: error._message || "Something went wrong",
                error
            }
        )
    }
})

export default app
