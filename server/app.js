require('dotenv').config()

const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')
const testSchema = require('./schema/types_schema')
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = process.env.PORT || 4000

mongoose.connect(process.env.MONGO_DB_HOST, 
    {   
        useUnifiedTopology: true,
        useNewUrlParser: true 
    } 
).catch(err => {
    console.log('--> error: ', err)
})

mongoose.connection.once('open', () => {
    console.log('--> info: Yes we are connected!')
})

const app = express()

app.use(cors())

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}))

app.listen(PORT, () => {
    console.log('Listining for requests on my awesome port 4000')
})

