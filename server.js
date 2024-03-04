const express=require('express');
const bodyParser=require('body-parser');
const DotEnv=require('dotenv')
const cors=require('cors');
const ConnectMongoDb=require('./config/Db')

DotEnv.config();
const app=express();

ConnectMongoDb()

//***body parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//***cors */
app.use(cors());

const AuthRouter= require('./Route/authRoutes')
app.use(AuthRouter)


const Port=process.env.PORT || 6000
app.listen(Port,()=>{
    console.log(`server running at http://localhost:${Port}`);
})

