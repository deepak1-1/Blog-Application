

const get_create_blog = (req, res) => {
    res.render('blog/addBlog', {title: "Add new blog", stylesheet: "css/styles.css"});
};


module.exports = {
    get_create_blog
};