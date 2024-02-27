const express = require('express')
const { query, validationResult } =  require('express-validator')
const router = require('./routers/usersRouter')
const routerProduct = require('./routers/productRouter')
const cookeParse = require('cookie-parser')
const session = require('express-session')

const PORT = process.env.PORT || '3003'
const app = express()

app.use(express.urlencoded({ extended : true }))
app.use(express.json())
app.use(cookeParse())
app.use(session({
    secret : '12345',
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge : 60000 * 60
    }
}))
app.use(router)
app.use(routerProduct)


app.listen(PORT, () => {
    console.log('Running at port 3003')
})