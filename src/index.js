const express = require("express")
const { v4: uuidv4 } = require("uuid")
const app = express()
app.use(express.json())


/*
* cpf-string
* name - string
* id - uuid 
* statement ou lançamentos(creditos, debitos...) []
*/

const customers = []
//Create an account

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

// get statement- buscar o estrato bancario

app.get("/statement", (request, response) => {
    const { cpf } = request.headers

    const customer = customers.find((customer) => customer.cpf === cpf )

    if(!customer) {
        return response.status(400).json({error: "Customer not found!"})
    }

    return response.json(customer.statement)
   
})


app.listen(8080)




