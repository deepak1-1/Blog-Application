

const get_login_page = (req, res)=> {
    res.render('login/sign_in_up', {
        title: 'Sign in | Sign Up', 
        stylesheet: "css/loginCss.css"
    });
}

const get_about = (req, res) => {
    res.render('basic/about', {title: 'About', stylesheet: "css/styles.css"});
}

const get_home_page = (req, res) => {
    res.render('basic/index', {title: 'Home Page', stylesheet: 'css/index.css'})
}
module.exports = {
    get_login_page,
    get_about,
    get_home_page

};