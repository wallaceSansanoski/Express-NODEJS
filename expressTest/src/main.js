const express = require('express')
const { readFile, writeFile } = require('fs/promises')
const { promisify } = require('util')
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

const PORT = '3003'
const app = express()

app.use(express.urlencoded({ extended : true }))
app.use(express.json())

app.get('/search', async (request, response) => {

    const data = await readFile('../banco/db.json', 'utf-8')
    const formatedData = JSON.parse(data)
    response.status(200).send(formatedData)
})

app.get('/search/:category', async (request, response) => {

    const { category } = request.params
    const data = await readFile('../banco/db.json', 'utf-8')
    const filteredData = JSON.parse(data).find(item => item[category])
    if(!filteredData) return response.status(404).send('Bad request. Invalid parameter.')
    response.send(filteredData)
})


app.get('/search/:category/:nome', async (request, response) => {

    const { category, nome } = request.params
    const data = await readFile('../banco/db.json', 'utf-8')

    if(category && nome) {
      const categorySearched = JSON.parse(data).find(item => item[category])
        if(!categorySearched)return response.status(404).send(`Not found category ${category}.Please try again.`)

      const singleUser = categorySearched[category].find(item => item.nome === nome)
        if(!singleUser)return response.status(404).send('Not found user. Try again!!')

     return  response.status(200).send(singleUser)
    }

})

app.post('/include/:category', async (request, response) => {

    const data = await readFile('../banco/db.json', 'utf-8')
    const { category } = request.params 
    const { body } = request
    
    const hasCategoty = JSON.parse(data).find(item => item[category])
    if(!hasCategoty) return response.status(404).send('Has not category with this name. Bad request.')
    const id = (JSON.parse(data).find(item => item[category]))[category].length + 1

    const newObj = { id, ...body } 
    const filteredData = JSON.parse(data).map(item => {
        if (item[category]) {
            item[category].push(newObj)
        }
        return item
    })
    await writeFile('../banco/db.json',  JSON.stringify(filteredData))
    response.send(filteredData)
})

app.delete('/remove/:category/:id', async (request, response) => {
    const data = await readFile('../banco/db.json', 'utf-8')
    const {category, id} = request.params

   const listByCategory =  JSON.parse(data).find(item => {

        if(!item[category]) return response.send(`Not found category ${category} to delete.`)

        if(item[category]){
           return  item[category]
        }
    })

    const filteredByID = listByCategory[category].filter(item => parseInt(item.id) !== parseInt(id))

    const newList = JSON.parse(data).map(item => {
        if(item[category]){
           return  item[category] = {
            [category] : [...filteredByID]
           }
        }
        return item
    })

    writeFile('../banco/db.json', JSON.stringify(newList))
    response.send(newList)
})

app.put('/update/:category/:name', async (request, response) => {

    const { nome, materia, ano } = request.body
    const { category, name } = request.params

    let newList = null
    const data = await readFile('../banco/db.json', 'utf-8')

    JSON.parse(data).forEach(item => {
        if(item[category]){
            newList = item[category]
        }
    })

    const index = newList.findIndex(item => item.nome === name)
    console.log(index)

    if(index < 0 ) return response.status(404).send('BAD REQUEST. TRY UPDATE AGAIN.')
    
    newList[index] = {
        id :newList[index].id,
        nome ,
        materia ,
        ano 
    }

    const newFileUpdate = JSON.parse(data).map(item => {
        if(item[request.params.category]){
           return item[request.params.category] = {
                [request.params.category] : [...newList]
            }
        }
        return item
    })

   await writeFile('../banco/db.json',JSON.stringify(newFileUpdate))

   response.status(200).send(newFileUpdate)
})

app.listen(PORT, () => {
    console.log('Running at port 3003')
})