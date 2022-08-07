const express = require('express')

const app = express()

app.get("/tasks", (request, response) => {
    return response.json({
        "name":"ana",
        "age": 18,
        "height": 1.651
    })
})




app.listen(8080)




