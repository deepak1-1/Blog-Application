
const mainNotify = document.getElementById('mainfollowingNotification');

const contact_us = document.getElementById('contact_us'),
      logout = document.getElementById('logOut'),
      goBackBtn = document.getElementById('goBack'),
      followBtns = document.querySelectorAll('.followBtn'),
      unfollowBtns = document.querySelectorAll('.unfollowBtn');


followBtns.forEach( followBtn =>{
    followBtn.addEventListener('click', (event)=>{

        const fullDataDiv = event.target.parentElement.parentElement;
        const receiverUsername = fullDataDiv.querySelector('.username').innerText.trim();
        const name = fullDataDiv.querySelector('.name').innerText;
        const profilePath = fullDataDiv.querySelector('.follow_profile_image').getAttribute('src');

        if(event.target.innerText === 'Follow'){

            fetch('/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ receiverUsername, name, profilePath })
            })
                .then(res => res.json())
                .then(data =>{

                    if(data.send && !data.already){
                        event.target.className = 'mt-2 btn btn-outline-danger followBtn';
                        event.target.innerText = 'Cancel Request';
                    } else if(!data.send && !data.already){
                        mainNotify.innerHTML = '<div class="alert alert-danger">Unable to send request!</div>';
                        setTimeout( ()=>{
                            mainNotify.innerHTML = '';
                        }, 3000);
                    } else if( !data.send && data.already ){
                        mainNotify.innerHTML = '<div class="alert alert-info">Already sent! Please check request</div>';
                        setTimeout( ()=>{
                            mainNotify.innerHTML = '';
                        }, 3000);
                    }
                })
                .catch(err =>{
                    console.log(err)
                })

        } else if(event.target.innerText === 'Cancel Request'){
            
            fetch('/cancel-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( {receiverUsername, name, profilePath } )
            })
              .then(res => res.json())
              .then(data => {
                
                    if(data.cancel){
                        event.target.className = 'mt-2 btn btn-primary followBtn';
                        event.target.innerText = 'Follow';
                    } else {
                        mainNotify.innerHTML = '<div class="alert alert-danger">Unable to cancel request!</div>';
                        setTimeout( ()=>{
                            mainNotify.innerHTML = '';
                        }, 3000);
                    }
              })
              .catch(err =>{
                console.log(err);
              })
        }
    })
})

unfollowBtns.forEach( unfollowBtn => {
    unfollowBtn.addEventListener('click', async (e)=>{

        const mainDataDiv = e.target.parentElement.parentElement;
        const username = mainDataDiv.querySelector('.username').innerText.trim();

        await fetch('/unfollow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( {username} )
        })
        .then(res => res.json())
        .then(data => {
            
            if(data.unfollowed){

                e.target.innerText = 'Unfollowed';
                setTimeout( ()=>{
                    mainDataDiv.remove();
                },3000);
            } else {
                mainNotify.innerHTML = '<div class="alert alert-danger">Unable to Unfollow!</div>';
                setTimeout( ()=>{
                    mainNotify.innerHTML = '';
                    if(document.querySelectorAll('.unfollowBtn').length === 0){
                        document.getElementById('followingDiv').innerHTML = '<h2 class="display-5 text-danger">No following</h2>';
                    }
                }, 3000);
            }
        })
        .catch(err => {
            console.log(err);
        })
    })
});

goBackBtn.addEventListener('click', (event)=>{
    window.location.href = '/home-page/profile';
});


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