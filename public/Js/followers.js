const contact_us = document.getElementById('contact_us'),
      logout = document.getElementById('logOut'),
      goBackBtn = document.getElementById('goBack'),
      removeBtns = document.querySelectorAll('.removeBtn');

goBackBtn.addEventListener('click', (event)=>{
    window.location.href = '/home-page/profile';
});

removeBtns.forEach( removeBtn => {
    removeBtn.addEventListener('click', (event)=>{

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