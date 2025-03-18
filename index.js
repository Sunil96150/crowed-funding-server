const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000

//middleware
app.use(cors());
app.use(express.json());


//mongodb connection


const { MongoClient, ServerApiVersion,  } = require('mongodb');
const { ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hxbb8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
   
    const campaignsCollection =client.db('campaignsdb').collection('campaigns')
    const donationsCollection =client.db('donationdb').collection('donation')
    const userCollection = client.db('campaignsdb').collection('user')

    //donations post

    app.post('/donation' , async (req , res) =>{
        const donation = req.body;
        console.log(donation);
        const result = await donationsCollection.insertOne(donation);
        res.send(result);
    })
//campaigns ar collection gula
    app.get('/AllCampaigns' , async(req , res) =>{
      const cursor = campaignsCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/AllCampaigns/:id' , async(req , res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await campaignsCollection.findOne(query);
      res.send(result);
    });

    app.post('/AllCampaigns' , async(req , res ) =>{
      const newCampaigns = req.body;
      console.log(newCampaigns);
      const result = await campaignsCollection.insertOne(newCampaigns);
      res.send(result) });

      app.put('/AllCampaigns/:id' , async(req , res)=>{
        const id = req.params.id;
        const filter = {_id : new ObjectId(id)}
        const options = {upsert : true}
        const uptadedCampaign = req.body;
        const campaign = {
          $set: {
            name: uptadedCampaign.name ,
            porpuse: uptadedCampaign.porpuse, 
            campaignType: uptadedCampaign.campaignType , 
            city: uptadedCampaign.city , 
            photo: uptadedCampaign.photo, 
            Description: uptadedCampaign.Description ,
          }
        }
        const result = await campaignsCollection.updateOne(filter , campaign ,options)
        res.send(result)
      });
      
      app.delete('/AllCampaigns/:id' , async(req , res) =>{
        const id = req.params.id;
        const query ={_id : new ObjectId(id)}
        const result = await campaignsCollection.deleteOne(query);
        res.send(result)
      });
      


      //user related apis
      app.get('/users' , async (req , res) =>{
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result)
      })

      app.post('/users' , async (req , res) =>{
        const newUser = req.body;
        console.log('Creating new user',newUser);
        const result = await userCollection.insertOne(newUser);
        res.send(result)
      });


      app.patch('/users' , async(req , res) =>{
        const email = req.body.email;
        const filter = { email };
        const updatedDoc={
          $set: {
            lastSignInTime: req.body?.lastSignInTime
          }
        }
        const result = await userCollection.updateOne(filter , updatedDoc)
        res.send(result)

      });


      app.delete('/users/:id' , async(req , res) =>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await userCollection.deleteOne(query);
        res.send(result)

      })
      

   
    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);






app.get('/' , (req , res) => {
    res.send('Donate in crowd fund')
})


app.listen(port , () =>{
    console.log(`Donation is stared in port: ${port} `)
})