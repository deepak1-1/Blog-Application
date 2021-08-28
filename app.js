
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const basicRoutes = require('./routes/basicRoutes');
const blogRoutes = require('./routes/blogRoutes');
const signRoutes = require('./routes/sign_in_upRoutes');
const forgetpasswordRoutes = require('./routes/forgetpasswordRoutes');





// express app
const app = express();

// connect to database
const dbURI = 'mongodb://localhost:27017/Blog_Data'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result)=>{

        //listen over requests
        app.listen(4000, ()=>{
            console.log('Listening to port 4000');
        });
    })
    .catch(err => {console.log(err)});


// registered view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// public
app.use(express.static('public'));

// middle-ware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan('dev'));


// basic routes
app.use('/', basicRoutes);

// sign in and up routes
app.use('/', signRoutes);

// forget password routes
app.use('/forget-password', forgetpasswordRoutes);

// blog routes
app.use('/blog', blogRoutes);



// default route
app.use((req, res)=>{
    res.status(404).render('basic/404', { title: '404' , stylesheet: "css/styles.css"});
});