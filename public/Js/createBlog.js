const contact_us = document.getElementById('contact_us'),
      logout = document.getElementById('logOut'),
      createBtn = document.getElementById('createBtn');

const form = document.getElementById('blogForm');

const titleNotify = document.getElementById('titleNotification'),
      tagsNotify = document.getElementById('tagsNotification'),
      blogNotify = document.getElementById('blogNotification'),
      publicPrivateNotify = document.getElementById('publicPrivateNotification'),
      imageNotify = document.getElementById('imageNotification');

const title = document.getElementById('title'),
      tags = document.getElementById('tags'),
      blog = document.getElementById('blog'),
      publicPrivate = document.getElementsByName('publicPrivate');


form.addEventListener('submit', async function(e){
    e.preventDefault();

    const tagsValue = [], publicPrivateValue = [];

    let titlePass = false, tagsPass = false, blogPass=false, publicPrivatePass = false;

    for(let i=0; i< tags.options.length; i++){
        if(tags.options[i].selected === true)
            tagsValue.push( tags.options[i].value );
    }
    publicPrivate.forEach( eachData=>{
        if(eachData.checked){
            publicPrivateValue.push(eachData.value);
        }
    } )

    if(title.value.trim().length === 0){

        titleNotify.innerHTML = '<div class="alert alert-danger">Please enter title!</div>';
        setTimeout( ()=>{
            titleNotify.innerHTML = '';
        }, 3000)

    } else {titlePass = true}


    if(blog.value.trim().length === 0){
        blogNotify.innerHTML = '<div class="alert alert-danger">write some blog!</div>';
        setTimeout( ()=>{
            blogNotify.innerHTML = '';
        }, 3000)
    } else { blogPass = true}


    if(tagsValue.length === 0){
        tagsNotify.innerHTML = '<div class="alert alert-danger">select some tags</div>';
        setTimeout( ()=>{
            tagsNotify.innerHTML = '';
        }, 3000)
    } else { 
        tagsPass = true
    }


    if(publicPrivateValue.length === 0){
        publicPrivateNotify.innerHTML = '<div class="alert alert-danger">choose option</div>';
        setTimeout( ()=>{
            publicPrivateNotify.innerHTML = '';
        }, 3000)
    } else { publicPrivatePass = true}

    if( titlePass && blogPass && publicPrivatePass && tagsPass){

        const formData = new FormData(this);
        createBtn.innerText = 'Creating....'
        fetch('/blog/create-blog', {
            method: 'POST',
            body: formData
        }).then(res => res.json())
        .then(data => {
            createBtn.innerText = 'Created!';

            setTimeout( ()=>{
                window.location.href = '/home-page/create-blog'
            },3000)
        })
        .catch(err=>{
            console.log(err);
            createBtn.innerText = 'Some Issue!';
            createBtn.className = 'btn btn-danger col-4 offset-4'
            setTimeout( ()=>{
                createBtn.innerText = 'Create It';
                window.location.href = '/home-page/create-blog'
            },3000)
        })
    }
})






logout.addEventListener('click', (event)=>{

    fetch('/log-out', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( { logout: true } )
    })
    .then(res => res.json())
    .then(data =>{
        if(data.logOut){
            window.location.href = data.redirect;
        }
    })
    .catch(err => {
        console.log(err);
    })
})

contact_us.addEventListener('click', (event)=>{
    window.location.href = "mailto:deepaktewatia2000@gmail.com";
});