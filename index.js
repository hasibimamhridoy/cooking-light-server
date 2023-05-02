const express = require('express');
const app = express();
const port = process.env.PORT || 6005;



app.get('/',(req,res)=>{
    res.send('The server is running successfully')
})

app.listen(port,()=>{
    console.log(`The server is running and port is: ${port}`);
})