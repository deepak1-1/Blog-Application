
const toggle_btn = document.querySelectorAll('.toggle_btn');
const signIn = document.getElementById('signIn');
const signUp = document.getElementById('signUp');
const sliderBtn = document.getElementById('btn');
const signInBtn = document.getElementById('signInBtn');
const verificationBtn = document.getElementById('verificationCode');



// toggling signup and signin button and data
toggle_btn.forEach(element => {
    element.addEventListener('click', (e)=> {
        
        if(e.target.innerText === "Sign In"){

            signIn.style.display = 'block';
            signUp.style.display = 'none';
            sliderBtn.style.left = 0;

        } else if( e.target.innerText === "Sign Up") {
            
            signIn.style.display = 'none';
            signUp.style.display = 'block';
            sliderBtn.style.left = "120px";
        
        }
    })
});


// signIn handling
signInBtn.addEventListener('click', async (e)=>{

    let username = document.getElementById('usernamesignIn').value,
        password = document.getElementById('pwdSignIn').value,
        rememberADay = document.getElementById('remember').checked;
    let userNotify = document.querySelector('.usernameNotificationSignIn'),
        passwordNotify = document.querySelector('.passwordNotificationSignIn');

    console.log(rememberADay);

    let userPass = 0, passwordPass = 0;

    if( username.trim().length === 0 ){

        userNotify.innerText = 'Please fill username!';
        userNotify.style.color = 'red';
        setTimeout( ()=>{
            userNotify.innerText = '';
        },3000);
    
    } else { userPass = 1; }

    if(password.trim().length === 0){

        passwordNotify.innerText = 'Please fill password!';
        passwordNotify.style.color = 'red';
        setTimeout( ()=>{
            passwordNotify.innerText = '';
        },3000);

    } else { passwordPass = 1; }


    if(userPass === 1 && passwordPass === 1){

        let postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( { username, password, rememberADay} )
        }

        await fetch('/login', postOptions)
                .then(res => res.json())
                .then( data => {
                    
                    if ( !data.userfound){
                        userNotify.innerText = 'Invalid username or user don\'t exist';
                        userNotify.style.color = 'red';

                        setTimeout( () => {
                            userNotify.innerText = '';
                        }, 3000)
                    } else {
                        if (!data.match){
                            passwordNotify.innerText = 'Password Incorrect!';
                            passwordNotify.style.color = 'red';

                            setTimeout( ()=>{
                                passwordNotify.innerText = '';
                            }, 3000)
                        } else {
                            console.log('everything is fine!');
                        }
                    }
                })
                .catch( err => {
                    console.log(err);
                })
    }

});

//  signup Verification handling
verificationBtn.addEventListener('click',async (e)=> {

        let userName = document.getElementById('userName').value,
            email = document.getElementById('emailsignUp').value,
            password = document.getElementById('pwdsignUp').value,
            confirmpassword = document.getElementById('CpwdsignUp').value;
        let userNotify = document.querySelector('.usernameNotification'),
            emailNotify = document.querySelector( '.emailNotificationSignUp' ),
            passNotify = document.querySelector('.passwordNotificationSignUp'),
            confpassNotify = document.querySelector('.confirmpasswordNotificationSignUp');

        let userPass = 0, emailPass = 0, passwordPass = 0, cPasswordPass = 0;
        
        if(userName.trim().length === 0){
            userNotify.innerText = 'username can\'t be empty or only spaces!';
            userNotify.style.color = 'red';
            userNotify.style.margin = '0';

            setTimeout( () => {
                userNotify.innerText = '';
            }, 3000)
        } else { userPass = 1; }

        if(email.trim().length === 0){

            emailNotify.innerText = 'Email can\'t be empty or only spaces!';
            emailNotify.style.color = 'red';
            
            setTimeout( ()=>{
                emailNotify.innerText = '';
            }, 3000)
        } else { emailPass = 1; }

        if(password.trim().length === 0){
            passNotify.innerText = 'Password can\'t be empty or only spaces!';
            passNotify.style.color = 'red';

            setTimeout( ()=>{
                passNotify.innerText = '';
            }, 3000)
        } else {

            if(password.length >= 6){
                passwordPass = 1;
            } else {
                passNotify.innerText = 'Atleast 6 length password!'
                passNotify.style.color = 'red';

                setTimeout( ()=> {
                    passNotify.innerText = '';
                }, 3000);
            }
        }

        if(confirmpassword.trim().length === 0){
            confpassNotify.innerText = 'password can\'t be empty or only spaces!';
            confpassNotify.style.color = 'red';

            setTimeout( ()=>{
                confpassNotify.innerText = '';
            }, 3000)
        } else { cPasswordPass = 1; }

        if( userPass===1 && emailPass===1 && passwordPass===1 && cPasswordPass===1) {

            const postDataUserCheck = { userName, email };
            const postOptionsUserCheck = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( postDataUserCheck )
            }

            emailNotify.innerText = 'Sending Code...';
            emailNotify.style.color = 'white';

            await fetch('/check-user', postOptionsUserCheck)
                .then(res => (res.json()))
                .then(data => {
                    if(data.found){

                        emailNotify.innerText = '';
                        userNotify = document.querySelector('.usernameNotification');
                        userNotify.innerText = 'Already exists!';
                        userNotify.style.color = 'red';
                        userNotify.style.margin = '0px';
                        setTimeout(()=>{
                            userNotify.innerText = "";
                        }, 2000);

                    } else if(data.limitExceed){

                        emailNotify.innerText = "Already 5 account with this email!";
                        emailNotify.style.color = 'red';
                        setTimeout( ()=>{
                            emailNotify.innerText = '';
                        },2000)

                    } else if (!data.found && !data.limitExceed){

                        if(password === confirmpassword){
                            
                            const postDataVerification = {
                                userName,
                                email,
                                password,
                                confirmpassword
                            }
                            const postOptionsVerification = {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify( postDataVerification ),
                                onUploadProgress: (p) => {
                                    console.log(p);
                                }

                            }
                            fetch( '/get-code', postOptionsVerification)
                                .then( res => res.json())
                                .then( data => {
                                    // console.log(data);
                                    emailNotify.innerText = '';
                                    if(data.error){

                                        emailNotify.innerText = 'Email not valid!';
                                        emailNotify.style.color = 'red';

                                        setTimeout( ()=> {
                                            emailNotify.innerText = '';
                                        }, 3000)

                                    } else {
                                        window.location.href = data.redirect;
                                    }
                                })
                                .catch( err => {
                                    console.log(err);
                                })
                        } else {

                            emailNotify.innerText = '';
                            confpassNotify.innerText = 'password don\'t matches';
                            confpassNotify.style.color = 'red';
                            confpassNotify.style.margin = '0px';
                            setTimeout(()=>{
                                confpassNotify.innerText = "";
                            }, 2000);
                        }
                    }
                })
                .catch(err => {
                    emailNotify.innerText = '';
                    console.log(err);
                });
        }    
});