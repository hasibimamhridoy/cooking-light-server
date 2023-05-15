const express = require('express');
const app = express();
const cors = require('cors')
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const allChef = require('./chefData.json')
const allRecipe = require('./recipes.json')
const allTrics = require('./trics.json')
require('dotenv').config()
const port = process.env.PORT || 6005;
app.use(cors())
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cookinglight.gydwnmr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const allRecipes = client.db('cookingLight').collection('allRecipes')
        const favorites = client.db('cookingLight').collection('favorites')




        //jwt pakabo__ step one get user mail and send token

        app.post('/jwt', async (req, res) => {

            const email = req.body.email
            console.log(email);

            const token = jwt.sign({
                email: email
            }, process.env.SECRET_TOKEN, { expiresIn: '1h' });

            res.send({ token })
        })


        const handleSecureApi = (req,res,next)=>{
            
            //  console.log('Hitting');
            //  console.log(req.headers.authorization);
             const authorization = req.headers.authorization

             const token = authorization?.split(' ')[1]
             console.log(token);

             if (!authorization) {
                res.status(404).send('unauthorized access')
             }

             else{
                jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
                    
                    console.log(decoded) // bar

                    if (err) {
                        res.status(404).send('unauthorized access')
                    }

                    else{
                        req.decode=decoded
                        next()
                    }

                  });
             }
        }


        app.get('/allRecipes', async (req, res) => {

            const currentPage = parseInt(req.query.page)
            const pageLimit = parseInt(req.query.limit)
            let skip = (currentPage * pageLimit)
            const result = await allRecipes.find().skip(skip).limit(pageLimit).toArray()
            res.send(result)
        })


        app.get('/recipe/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await allRecipes.findOne(query)

            res.send(result)
        })
        app.get('/totalRecipeCount', async (req, res) => {

            const totalRecipes = await allRecipes.countDocuments()
            res.send({ totalRecipes })
        })


        app.get('/favorites', handleSecureApi, async (req, res) => {

            const email = req.query.email
            const decodeEmail = req.decode.email
            console.log(decodeEmail);
            console.log(req.query.email);



            let query = {};
            if (req.query?.email) {
                query = { userEmail: req.query.email }
            }
            const result = await favorites.find(query).toArray()

            if (email === decodeEmail) {
                res.send(result)
            }

            else{
                res.status(401).send('unauthorized access')
            }
           
        })

        app.post('/favorites', async (req, res) => {

            const favoritesData = req.body
            console.log(favoritesData);
            const result = await favorites.insertOne(favoritesData)
            res.send(result)
        })
        app.delete('/favorites/:id', async (req, res) => {

            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await favorites.deleteOne(query)
            res.send(result)
        })





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('The server is running successfully')
})
app.get('/allChef', (req, res) => {
    res.send(allChef)
})
// app.get('/allRecipe', (req, res) => {
//     res.send(allRecipe)
// })
app.get('/allTrics', (req, res) => {
    res.send(allTrics)
})

// app.get('/recipe/:id', (req, res) => {
//     const name = req.params.id
//     const findData = allRecipe.find(chef => chef.recipe_name == name)
//     res.send(findData)
// })
app.get('/chef/:id', (req, res) => {
    const id = req.params.id
    const findData = allChef.find(chef => chef.id == id)
    res.send(findData)
})
app.get('/trics/:id', (req, res) => {
    const id = req.params.id
    const findData = allTrics.find(chef => chef.id == id)
    res.send(findData)
})


app.listen(port, () => {
    console.log(`The server is running and port is: ${port}`);
})