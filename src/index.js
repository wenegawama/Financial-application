const express = require("express")
const { v4: uuidv4 } = require("uuid")
const app = express()
app.use(express.json())


const customers = []
//Middleware
function verifyExistsAccountCPF (request, response, next) {
    const { cpf } = request.headers
    const customer = customers.find((customer) => customer.cpf === cpf )

    if(!customer) {
        return response.status(400).json({error: "Customer not found!"})
    }

    request.customer = customer

    return next()
}


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
//app.use(verifyExistsAccountCPF)  usar pra que todas as rotas usam essa rota
app.get("/statement", verifyExistsAccountCPF, (request, response) => { 
    const { customer } = request  
    return response.json(customer.statement)   
})

//Create a deposit

app.post("/deposit", verifyExistsAccountCPF, (request, response) => {
    const { description, amount } = request.body

    const { customer } = request

    const statatementOperation = {
        description,
        amount,
        created_at : new Date(),
        type: "credit"
    }

    customer.statement.push(statatementOperation)

    return response.status(201).send()
})


app.listen(8080)




