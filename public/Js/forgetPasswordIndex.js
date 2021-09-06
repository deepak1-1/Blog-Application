
const usernameNotify = document.getElementById('usernameNotification'),
      emailNotify = document.getElementById('emailNotification'),
      verificationCodeNotify = document.getElementById('verficationcodeNotification');
const goBackBtn = document.getElementById('goBack'),
      getCodeBtn = document.getElementById('getCodeBtn');
const usernameInput = document.getElementById('username'),
      emailInput = document.getElementById('email'),
      verificationInput = document.getElementById('verificationCode');

const verificationDiv = document.getElementById('Verificationdiv');
let userName, email, verificationCode,usernameLists;


function  disableInput(input){
        input.setAttribute( 'disabled', 'disabled');
    };
function  enableInput(input){
        input.removeAttribute( 'disabled', 'disabled');
    };

goBackBtn.addEventListener('click', (e)=>{

    if(goBackBtn.innerText === 'Go Back'){
        window.location.href = '/';
    } else if(goBackBtn.innerText === 'Edit Details?'){

        goBackBtn.innerText = 'Go Back';
        getCodeBtn.innerText = 'Get Code'
        enableInput(emailInput);
        enableInput(usernameInput);
    }
})



getCodeBtn.addEventListener( 'click', async (e)=>{

    if( e.target.innerText === 'Get Code'){

        goBackBtn.innerText = 'Edit Details?'
        let emailPass = 0, usernamePass = 0;
        email = emailInput.value;
        username = usernameInput.value;
        
        if( email.trim().length === 0 ){
            
            emailNotify.innerText = 'fill details!';
            emailNotify.style.color = 'red';
            setTimeout( ()=> {
                emailNotify.innerText = '';
            },3000);

        } else { emailPass = 1 }; // email close

        if( username.trim().length === 0 ){

            usernameNotify.innerText = 'fill details!';
            usernameNotify.style.color = 'red';
            setTimeout( ()=> {
                usernameNotify.innerText = '';
            },3000);

        } else { usernamePass = 1}

        if( emailPass === 1, usernamePass === 1 ){

            const userpostOptions = {   
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( { email, username } )
            }

            await fetch('/forget-password/check-user', userpostOptions)
                    .then(res => res.json())
                    .then(data => {

                        if(!data.email){
                            emailNotify.innerText = 'No account for this email!';
                            emailNotify.style.color = 'red';
                            setTimeout( ()=> {
                                emailNotify.innerText = '';
                            },3000);
                        }
                        if(!data.username){
                            usernameNotify.innerText = 'Don\'t Exists';
                            usernameNotify.style.color= 'red';
                            setTimeout( ()=> {
                                usernameNotify.innerText = '';
                            },3000);
                        }
                        
                        if(data.email && data.username){

                            disableInput(emailInput);
                            disableInput(usernameInput);
                            disableInput(getCodeBtn);
                            verificationDiv.style.display = 'block';
                            verificationCodeNotify.innerText = 'Sending...';
                            let codepostOptions = {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify( { data} )
                            }
                            fetch( 'forget-password/get-code', codepostOptions)
                                  .then(res => res.json())
                                  .then(data => {

                                        if(data.codeSend){

                                            verificationCodeNotify.innerText = 'Code sended to above email!';
                                            verificationCodeNotify.style.color = 'green';
                                            getCodeBtn.innerText = 'Submit Code';
                                            setTimeout( ()=>{
                                                verificationCodeNotify.innerText = '';
                                                enableInput(getCodeBtn);
                                            },4000);
                                        }

                                  })
                                  .catch(err => {
                                      console.log(err);
                                  })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
        }
        
    } else if( e.target.innerText === 'Submit Code' ){

        verificationCode = verificationInput.value;
        if( verificationCode.length === 6 ){

            verificationCode = Number(verificationCode);
            let verificationpostOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( { email, username, verificationCode} )
            };

            await fetch('/forget-password/code-verification', verificationpostOptions)
                        .then(res => res.json())
                        .then(data => {
                            if(data.redirect){
                                window.location.href = data.redirect;
                            } else {
                                verificationCodeNotify.innerText = 'Code not Valid!'
                                verificationCodeNotify.style.color = 'red';

                                setTimeout( ()=> {
                                    verificationCodeNotify.innerText = '';
                                }, 8000);
                                
                            }
                        })
                        .catch( err => {
                            console.log(err)
                        })
        } else {

            verificationCodeNotify.innerText = 'Code must be of 6 digit!';
            verificationCodeNotify.style.color = 'red';

            setTimeout( () => {
                verificationCodeNotify.innerText = '';
            }, 3000);
        }
    }
});