const express = require('express')
const bcrypt = require('bcrypt')

const app = express();


app.use(express.json())

let users = []

app.get('/users', (req, res) => {
    res.json(users)
})


app.post('/user', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const user = { name: req.body.name, password: hashedPassword }
        users.push(user)
        res.status(201).send('Registered successfully')
    }
    catch {
        res.status(500).send('internal server error')
    }
})

app.post('/user/login', async (req,res) => { 
    const user = users.find(user => user.name === req.body.name)
    if(user == null){
         res.status(400).send('Cannot found user')
    }
    try{
        if(await bcrypt.compare(req.body.password,user.password)){
            res.status(200).json({name: req.body.name, password: req.body.password})
        }
        else{
            res.send('invalid password')
        }
    }
    catch{
        res.status(500).send('Internal server error')
    }

})


app.listen(5000)