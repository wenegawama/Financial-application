const express = require("express")
const { v4: uuidv4 } = require("uuid")
const app = express()
app.use(express.json())



//Create an account

/*
* cpf-string
* name - string
* id - uuid 
* statement ou lançamentos(creditos, debitos...) []
*/
const customers = []

app.post("/account", (request, response) => {
    const { cpf, name } = request.body
    
    const customerAlreadyExists = customers.some(  //a função some() faz uma busca e retorna true/false suguindo a regra colocada dentro
        (customer) => customer.cpf === cpf
    )

    if(customerAlreadyExists){
        return response.status(400).json({error: "customer already exists!!!" })
    }

     

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    })
    return response.status(201).send()
})




app.listen(8080)




