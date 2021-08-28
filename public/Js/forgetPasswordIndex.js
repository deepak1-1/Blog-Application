
const usernameNotify = document.getElementById('usernameNotification'),
      emailNotify = document.getElementById('emailNotification'),
      verificationCodeNotify = document.getElementById('verficationcodeNotification');
const goBackBtn = document.getElementById('goBack'),
      getCodeBtn = document.getElementById('getCodeBtn');
const usernameInput = document.getElementById('username'),
      emailInput = document.getElementById('email'),
      verificationInput = document.getElementById('verificationCode');

const verificationDiv = document.getElementById('Verificationdiv'),
      usernameDiv = document.getElementById('usernamediv');
let userName, email, routeToRequest, verificationCode,usernameLists;


function  disableInput(input){
        input.setAttribute( 'disabled', 'disabled');
    };
function  enableInput(input){
        input.removeAttribute( 'disabled', 'disabled');
    };

function emptyInput(input){
    if(input.value === '')
        return true
    return false
}

goBackBtn.addEventListener('click', (e)=>{

    if(goBackBtn.innerText === 'Go Back'){
        window.location.href = '/';
    } else if(goBackBtn.innerText === 'Edit Email?'){

        goBackBtn.innerText = 'Go Back';
        getCodeBtn.innerText = 'Fetch Usernames'
        enableInput(emailInput);
        usernameDiv.style.display = 'none';
        usernameInput.innerHTML = '';
        usernameLists = [];
    }
    else if(goBackBtn.innerText === 'Edit Username?'){
    
        goBackBtn.innerText = 'Edit Email?';
        getCodeBtn.innerText = 'Select Username'
        verificationDiv.style.display = 'none';
        enableInput( usernameInput );
    }
})



getCodeBtn.addEventListener( 'click', async (e)=>{

    if( e.target.innerText === 'Fetch Usernames'){

        if( !emptyInput(emailInput) ){

            email = emailInput.value;
            let emailpostOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( {email} )
            }

            await fetch('/forget-password/fetch-username', emailpostOptions)
                    .then( res => res.json())
                    .then( data => {

                        if(data.userNamelist.length === 0){

                            emailNotify.innerText = 'No account for provided email!';
                            emailNotify.style.color = 'red';

                            setTimeout( ()=> {
                                emailNotify.innerText = '';
                            }, 3000);
                        } else{
                            usernameLists = data.userNamelist
                            let options = '';
                            usernameLists.forEach(username => {
                                options += `<option value='${username}'>${username}</option>`
                            });

                            usernameInput.innerHTML = options;
                            usernameDiv.style.display = 'block';

                            getCodeBtn.innerText = 'Select Username';
                            goBackBtn.innerText = 'Edit Email?';
                            disableInput( emailInput );
                        }
                    })
                    .catch( err=> {
                        console.log(err);
                    })

        } else {
            emailNotify.innerText = 'fill Email!';
            emailNotify.style.color = 'red';

            setTimeout( ()=>{
                emailNotify.innerText = '';
            }, 3000)
        }
    } else if ( e.target.innerText === 'Select Username') {

        username = usernameInput.value;
        getCodeBtn.innerText = 'Submit Code';
        goBackBtn.innerText = 'Edit Username?';
        disableInput( usernameInput );
        verificationDiv.style.display = 'block';

        let codepostOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( { email, username } )
        }

        await fetch( '/forget-password/get-code', codepostOptions)
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        if(data.codeSend){
                            verificationCodeNotify.innerText = 'A 6 digit code sended to above email. Fill it! '
                            verificationCodeNotify.style.color = 'green';
                            disableInput( getCodeBtn );

                            setTimeout( ()=> {
                                verificationCodeNotify.innerText = '';
                                enableInput( getCodeBtn );
                            }, 8000);
                        }
                    })
                    .catch( err => {
                        console.log(err);
                    })
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
        console.log('inside verification code')
    }
});