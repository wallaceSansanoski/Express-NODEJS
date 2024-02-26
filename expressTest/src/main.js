const express = require('express')
const { query, validationResult } =  require('express-validator')
const router = require('./routers/usersRouter')
const routerProduct = require('./routers/productRouter')

const PORT = '3003'
const app = express()

app.use(express.urlencoded({ extended : true }))
app.use(express.json())

app.use(router)
app.use(routerProduct)


app.listen(PORT, () => {
    console.log('Running at port 3003')
})