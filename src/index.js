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

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if(operation.type === 'credit') {
            return acc + operation.amount
        }else {
            return acc - operation.amount
        }
    }, 0)

    return balance
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

// Create withdraw
app.post("/withdraw", verifyExistsAccountCPF, (request, response) => {
    const { amount } = request.body
    const { customer } = request

    const balance = getBalance(customer.statement)
    if(balance < amount){
        return response.status(400).json({error: "Insufficient funds"})
    }

    const statementOperation = {
        amount,
        created_at : new Date(),
        type: "debit"
    }
    customer.statement.push(statementOperation)

    return response.status(201).send()
})

// Get statement with date

app.get("/statement/date", verifyExistsAccountCPF, (request, response) => { 
    const { customer } = request 
    const { date } = request.query

    const dateFormat = new Date(date + " 00:00") 
    
    const statement = customer.statement.filter(
        (statement) =>
            statement.created_at.toDateString() ===
            new Date(dateFormat).toDateString()
    )
    
    return response.json(statement)   
})


app.listen(8080)




