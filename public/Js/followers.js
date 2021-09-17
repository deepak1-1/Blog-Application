const contact_us = document.getElementById('contact_us'),
      logout = document.getElementById('logOut'),
      goBackBtn = document.getElementById('goBack'),
      removeBtns = document.querySelectorAll('.removeBtn');
const mainNotify = document.getElementById('mainNotification');
goBackBtn.addEventListener('click', (event)=>{
    window.location.href = '/home-page/profile';
});

removeBtns.forEach( removeBtn => {
    removeBtn.addEventListener('click', async (e)=>{

        const mainDataDiv = e.target.parentElement.parentElement;
        const username = mainDataDiv.querySelector('.username').innerText.trim();

        await fetch('/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( {username} )
        })
        .then(res => res.json())
        .then(data => {
            
            if(data.removed){

                e.target.innerText = 'Removed';
                setTimeout( ()=>{
                    mainDataDiv.remove();
                    if(document.querySelectorAll('.followers').length === 0){
                        document.querySelector('.followersDiv').innerHTML = '<h2 class="display-4 text-danger">No followers</h2>';
                    }
                },3000);
            } else {
                mainNotify.innerHTML = '<div class="alert alert-danger">Unable to Remove!</div>';
                setTimeout( ()=>{
                    mainNotify.innerHTML = '';
                }, 3000);
            }
        })
        .catch(err => {
            console.log(err);
        })

    });
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