

const get_home = (req, res)=> {
    res.render('login/sign_in_up', {
        title: 'Sign in | Sign Up', 
        stylesheet: "css/loginCss.css",
        javascript: ''
    });
}

const get_about = (req, res) => {
    res.render('basic/about', {title: 'About', stylesheet: "css/styles.css"});
}

module.exports = {
    get_home,
    get_about
};