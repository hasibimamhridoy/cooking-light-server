const express = require('express');
const app = express();
const cors = require('cors')
const allChef = require('./chefData.json')
const allRecipe = require('./recipes.json')
const port = process.env.PORT || 6005;
app.use(cors())



app.get('/',(req,res)=>{
    res.send('The server is running successfully')
})
app.get('/allChef',(req,res)=>{
    res.send(allChef)
})
app.get('/allRecipe',(req,res)=>{
    res.send(allRecipe)
})

app.get('/recipe/:id',(req,res)=>{
    const name = req.params.id
    const findData = allRecipe.find(chef => chef.recipe_name == name)
    res.send(findData)
})
app.get('/chef/:id',(req,res)=>{
    const id = req.params.id
    const findData = allChef.find(chef => chef.id == id)
    res.send(findData)
})


app.listen(port,()=>{
    console.log(`The server is running and port is: ${port}`);
})