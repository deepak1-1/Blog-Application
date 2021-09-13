const mainNotify = document.getElementById('mainfollowingNotification')

const contact_us = document.getElementById('contact_us'),
      logout = document.getElementById('logOut'),
      cancelBtns = document.querySelectorAll('.cancelBtn'),
      acceptBtns = document.querySelectorAll('.acceptBtn'),
      rejectBtns = document.querySelectorAll('.rejectBtn');


cancelBtns.forEach( cancelBtn =>{
    cancelBtn.addEventListener('click', async (e)=>{
        
        const mainDataDiv = e.target.parentElement.parentElement;
        const profilePath = mainDataDiv.querySelector('.sr_profile_image').getAttribute('src'),
              name = mainDataDiv.querySelector('.name').innerText.trim(),
              receiverUsername = mainDataDiv.querySelector('.username').innerText.trim();

        await fetch('/cancel-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( {receiverUsername, name, profilePath} )
        })
        .then( res => res.json())
        .then(data => {
            
            if(data.cancel){
                e.target.innerText = 'Cancelled!';
                e.target.setAttribute('disabled', 'disabled');
                
                setTimeout( ()=>{
                    mainNotify.innerHTML = '';
                    mainDataDiv.remove();

                    if( document.querySelectorAll('.cancelBtn').length === 0 ){
                        document.querySelector('.sent').innerHTML = '<h1 class="display-5 text-danger">No request Sent</h1>'; 
                    }
                },2000)
            } else {
                mainNotify.innerHTML = '<div class="alert alert-danger">Not Cancelled!</div>';

                setTimeout( ()=>{
                    mainNotify.innerHTML = '';
                },3000)
            }
        })
        .catch(err =>{
            console.log(err);
        })

    })
})

acceptBtns.forEach( acceptBtn =>{
    acceptBtn.addEventListener('click', async (e)=>{
        
        const mainDataDiv = e.target.parentElement.parentElement;
        const profilePath = mainDataDiv.querySelector('.sr_profile_image').getAttribute('src'),
              name = mainDataDiv.querySelector('.name').innerText.trim(),
              username = mainDataDiv.querySelector('.username').innerText.trim();

        await fetch('/accept-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( { username, name, profilePath } )
        })
        .then( res => res.json())
        .then(data => {
            
            if(data.accept){
                
                e.target.innerText = 'Accepted!';
                e.target.setAttribute('disabled', 'disabled');

                setTimeout( ()=>{
                    mainDataDiv.remove();
                    if( document.querySelectorAll('.acceptBtn').length === 0 ){
                        document.querySelector('.received').innerHTML = '<h1 class="display-5 text-danger">No request Received</h1>'; 
                    }
                },2000)
            } else {
                mainNotify.innerHTML = '<div class="alert alert-danger">Not Accepted!</div>';

                setTimeout( ()=>{
                    mainNotify.innerHTML = '';
                },3000)
            }
        })
        .catch(err =>{
            console.log(err);
        })

    })
})

rejectBtns.forEach( rejectBtn =>{
    rejectBtn.addEventListener('click', async (e)=>{
        const mainDataDiv = e.target.parentElement.parentElement;
        const profilePath = mainDataDiv.querySelector('.sr_profile_image').getAttribute('src'),
              name = mainDataDiv.querySelector('.name').innerText.trim(),
              username = mainDataDiv.querySelector('.username').innerText.trim();

        await fetch('/reject-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( { username, name, profilePath } )
        })
        .then( res => res.json())
        .then(data => {
            
            if(data.reject){
                e.target.innerText = 'Rejected!';
                e.target.setAttribute('disabled', 'disabled');

                setTimeout( ()=>{
                    mainNotify.innerHTML = '';
                    mainDataDiv.remove();

                    if( document.querySelectorAll('.acceptBtn').length === 0 ){
                        document.querySelector('.received').innerHTML = '<h1 class="display-5 text-danger">No request Received</h1>'; 
                    }
                },2000)
            } else {
                mainNotify.innerHTML = '<div class="alert alert-danger">Not rejected!</div>';

                setTimeout( ()=>{
                    mainNotify.innerHTML = '';
                },3000)
            }
        })
        .catch(err =>{
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