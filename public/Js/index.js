const contact_us = document.getElementById('contact_us'),
      logout = document.getElementById('logOut'),
      deletePosts = document.querySelectorAll('.deleteBtn'),
      likeBtns = document.querySelectorAll('.likeBtn');

likeBtns.forEach( likeBtn => {

    likeBtn.addEventListener('click', (e)=>{
        const postDiv = e.target.parentElement.parentElement.parentElement.parentElement;

        if(e.target.className === 'far fa-heart likeBtn'){

            fetch('/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({postId: postDiv.getAttribute('data-doc')})
            })
            .then( res=> res.json())
            .then( data=> {
                
                console.log();

                if(data.like){

                    // var sendData = '<%- JSON.stringify(sendData) %>'
                    // console.log(sendData);

                    // if(likeData.length === 4){

                    // } else if(likeData.length === 1){

                    // } else if(likeData.length === 2){

                    // }

                    const likeData = e.target.parentElement.parentElement.querySelector('.likeData');
                    let splittedLikeData = likeData.innerText.split(' ');
                    likeData.innerText = `${Number(splittedLikeData[0]) + 1 } Likes`;

                    e.target.className = 'fas fa-heart likeBtn'
                }
            })
            .catch(err=>{
                console.log(err);
            })

        } else if( e.target.className === 'fas fa-heart likeBtn' ){
            
            fetch('/dislike', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({postId: postDiv.getAttribute('data-doc')})
            })
            .then( res=> res.json())
            .then( data=> {

                if(data.dislike){
                    e.target.className = 'far fa-heart likeBtn'
                    const likeData = e.target.parentElement.parentElement.querySelector('.likeData');
                    let splittedLikeData = likeData.innerText.split(' ');
                    likeData.innerText = `${Number(splittedLikeData[0]) - 1 } Likes`;
                }
            })
            .catch(err=>{
                console.log(err);
            })
        }
    })
})



deletePosts.forEach( deletePost => {

    deletePost.addEventListener('click', (e)=>{
        const postDiv = e.target.parentElement.parentElement.parentElement;
        const postData = {postId: postDiv.getAttribute('data-doc'), private: false };

        fetch('/home-page/delete-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        }).then(res => res.json())
        .then(data => {
            if(data.deleted){
                postDiv.remove()
            } else {
                console.log('some Issue!')
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })
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