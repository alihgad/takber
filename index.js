import express from 'express'

import connection from './src/db/connection.js'

import bootstrap from './src/bootstrap.js'
import { deleteFolder, deleteFromDB, globalErrorHandling } from './src/utils/ErrorHandling.js'
const app = express()
const port = process.env.PORT || 3000

connection
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

bootstrap(app)



app.get('/', (req, res) => res.send('Hello World!'))

app.use(globalErrorHandling, deleteFolder, deleteFromDB)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))