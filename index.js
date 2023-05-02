const express = require('express');
const app = express();
const port = process.env.PORT || 6005;


app.listen(port,()=>{
    console.log(`The server is running and port is: ${port}`);
})