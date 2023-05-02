const express = require('express');
const app = express();
const allChef = require('./chefData.json')
const port = process.env.PORT || 6005;



app.get('/',(req,res)=>{
    res.send('The server is running successfully')
})
app.get('/allChef',(req,res)=>{
    res.send(allChef)
})
app.get('/chef/:id',(req,res)=>{
    const id = req.params.id
    const findData = allChef.find(chef => chef.id == id)
    res.send(findData)
})

app.listen(port,()=>{
    console.log(`The server is running and port is: ${port}`);
})