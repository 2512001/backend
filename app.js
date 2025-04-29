require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const corsOption = {
    origin: "https://clientgiri.netlify.app",
    method: ['get', 'post', 'delete', 'put', 'patch'],
    credentials: true,
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOption));


const mongodbUrl  = process.env.databaseUrl;


//routes
const userRoutes = require('./routes/userRouter');
const projectRoutes = require('./routes/projectRouter');
const fileRoutes = require('./routes/fileRouter');

mongoose.connect(mongodbUrl)
    .then(() => {
        console.log('database is connected');
    })
    .catch((err) => {
        console.log(err.message)
    });


app.use('/api/user', userRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/file' , fileRoutes)



const port = process.env.PORT;
app.listen(port, () => {
    console.log(`app is  running  ${port} http://localhost:${port}`)
})