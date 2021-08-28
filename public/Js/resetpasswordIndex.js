
const passwordInput = document.getElementById('password'),
      cpasswordInput = document.getElementById('cpassword');

const passwordNotify = document.getElementById('passwordNotification'),
      cpasswordNotify = document.getElementById('cpasswordNotification'),
      mainNotify = document.getElementById('mainNotification');

const goBackBtn = document.getElementById('goBack'),
      resetBtn = document.getElementById('resetPassword');
    

goBackBtn.addEventListener('click', (e) => {

    window.location.href = '/forget-password';
});


resetBtn.addEventListener('click', (e) => {

    let password = passwordInput.value,
        cpassword = cpasswordInput.value;

    if(password === ''){

        passwordNotify.innerText = 'Password can\'t be Empty';
        passwordNotify.style.color = 'red';
        setTimeout( ()=>{
            passwordNotify.innerText = '';
        },3000);

    }

    if(cpassword === ''){

        cpasswordNotify.innerText = 'Password can\'t be Empty';
        cpasswordNotify.style.color = 'red';
        setTimeout( ()=>{
            cpasswordNotify.innerText = '';
        },3000);
    }

    if(password !== '' && cpassword !== ''){
        
        if(password === cpassword){
            
            let postOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( { password } )
            }

            fetch('/forget-password/reset', postOptions)
                 .then(res => res.json())
                 .then(data => {
                    if(data.ok){
                       
                        mainNotify.innerHTML = '<div class=\'alert alert-success\'>Password Changed</div>'
                        setTimeout( ()=> {
                            mainNotify.innerHTML = '';
                            window.location.href = data.redirect;
                        },3000);

                    } else {
                        mainNotify.innerHTML = '<div class=\'alert alert-danger\'>failed!!</div>'
                        setTimeout( ()=> {
                            mainNotify.innerHTML = '';
                        },3000);
                    }
                 })
                 .catch( err => {
                     console.log(err);
                 })
        } else {
            cpasswordNotify.innerText = 'Password not matches!';
            cpasswordNotify.style.color = 'red';

            setTimeout( ()=>{
                cpasswordNotify.innerText = '';
            }, 3000);
        }
    }
});