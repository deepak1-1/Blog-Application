
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const basicRoutes = require('./routes/basicRoutes');
const blogRoutes = require('./routes/blogRoutes');
const signRoutes = require('./routes/sign_in_upRoutes');
const hompageRoutes = require('./routes/homepageRoutes');
const registerRoutes = require('./routes/registerRoutes');
const forgetpasswordRoutes = require('./routes/forgetpasswordRoutes');
const cookieParser = require('cookie-parser');
const Auth = require('./middleware/authMiddleware');
const consoleFuntions = require("./middleware/consoleFunctions");



// express app
const app = express();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// connect to database
const dbURI = 'mongodb://localhost:27017/Blog_Data'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result)=>{

        //listen over requests
        app.listen(3500, ()=>{
            console.log('Listening to port 3500');
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
app.use(cookieParser());




// basic routes
// app.use('/', auth.checkLoginAccess, basicRoutes);
app.use('/', consoleFuntions.Basic, basicRoutes);


// sign in and up routes
app.use('/sign', consoleFuntions.Sign, signRoutes);

// forget password routes
app.use('/forget-password', consoleFuntions.ForgetPassword, forgetpasswordRoutes);

// register routes
app.use('/register', consoleFuntions.Register, registerRoutes)

// home page routes
app.use('/home-page', consoleFuntions.HomePage, Auth.checkLoginAccess, hompageRoutes);

// blog routes
app.use('/blog', consoleFuntions.Blog, blogRoutes);

// default route
app.use((req, res)=>{
    res.status(404).render('basic/404', { title: '404' , stylesheet: "/css/index.css", sendData: false});
});