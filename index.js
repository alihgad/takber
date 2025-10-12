import express from 'express'
import dotenv from 'dotenv'
import connection from './src/db/connection.js'
import bootstrap from './src/bootstrap.js'
import { deleteFolder, deleteFromDB, globalErrorHandling } from './src/utils/ErrorHandling.js'
import cors from 'cors'
dotenv.config()
const app = express()
const port = process.env.PORT || 3000

connection
app.use(cors())
app.use(express.json())

app.use(express.urlencoded({ extended: true }))

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'))





bootstrap(app)



app.get('/', (req, res) => res.send('Hello World!'))

app.use(globalErrorHandling, deleteFolder, deleteFromDB)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))