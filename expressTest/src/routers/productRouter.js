const products  = require('../../banco/pordutos')
const express  = require('express')
// const { query, validationResult } = require('express-validator') about sanitazition the code

const routerProduct = express.Router()

const middlewareFake = (request, response, next) => {
    const { params : {id}} =  request
    const parsedID = parseInt(id)
    request.parsedID = parsedID
    next()
}

// routerProduct.get('/:id', middlewareFake, query('filter')
//     .notEmpty()
//     .withMessage('should not be empty')
//     .isString()
//     .withMessage('should be a string')
//     .isLength({ min: 2, max: 10 })
//     .withMessage('should be a string length between 2 at 10 caracters')
//     , (request, response) => {
//         const { query: { filter } } = request
//         const result = validationResult(filter)
//         const { parsedID } = request
//     })

routerProduct.get('/products', (request, response) => {
    response.cookie('name',  'wallace',  { maxAge : 10000})
    // if(request.cookies.name && request.cookies.name === 'wallace'){ 
    //     return response.status(404).send('cookie is not available anymore. Try again')
    // }
    // console.log(request.session)
    // console.log(request.session.id)
    request.session.visited = true
    response.status(200).send(products)
})

routerProduct.get('/product/:id', middlewareFake, (request, response) => {
    const { parsedID }  = request /// this proprety was insert in object request.

    const indexProduct = products.findIndex(item => item.id === parsedID)

    if(indexProduct < 0 ) return response.status(400).send('not found')

    response.status(200).send(products[indexProduct])
})

routerProduct.patch('/user/update/:id', (request, response) => { /// verb patch only change part of content, different put change everything 

        const { body , params : {id} } = request
    
        const parseID = parseInt(id)
        if(isNaN(parseID)) return response.status(400).send('Bad request.')
        const indexProduct = products.findIndex(({id}) => id === parseID)
        products[indexProduct] = { ...products[indexProduct], ...body }
        response.status(200).send(products)
    })

routerProduct.put('/user/update/:id', (request, response) => {
        const {body, params : {id}}  = request
    
        const indexProduct = products.findIndex(user => user.id === id)
        if(indexProduct < 0 ) return response.status(404).send('Bad request, Try again.')
    
        products[indexProduct] =  {
            id : products[indexProduct].id,
            ...body
        }
    
        response.status(200).send(products)
    })

routerProduct.delete('/user/delete/:id', (request, response) => {
    const {  params : { id} } = request
    const parsedID = parseInt(id)
    if(isNaN(parsedID)) return response.status(404).send('Bad request***')

    const indexUserDelete = products.findIndex(user => user.id === id)

    if(indexUserDelete <0 ) return response.status(400).send('Bad request**')

    products.splice(indexUserDelete, 1)

    response.status(200).send(products)
})

module.exports = routerProduct