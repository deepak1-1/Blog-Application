
const Basic = (req, res, next) => {
    console.log("I am inside basics Route");
    next();
}

const Sign = (req, res, next) => {
    console.log("I am inside Sign Route");
    next();
}

const ForgetPassword = (req, res, next) => {
    console.log("I am inside Forget Password Route");
    next();
}

const Register = (req, res, next) => {
    console.log("I am inside register Route");
    next();
}
const HomePage = (req, res, next) => {
    console.log("I am inside HomePage Route");
    next();
}
const Blog = (req, res, next) => {
    console.log("I am inside Blog Route");
    next();
}

module.exports = {
	Basic,
    Sign,
    ForgetPassword,
    Register,
    HomePage,
    Blog
}