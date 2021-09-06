

const CodeNotification = document.getElementById('codeNotification'),
      mainNotification = document.getElementById('mainNotification');

const getCodeBtn = document.getElementById('getCode');
let getCodeBtnShown = 0;


getCodeBtn.addEventListener(
    'click',async (e) => {
        console.log('inside get code')
        getOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await fetch('/get-code-again', getOptions)
                .then(res => res.json())
                .then(data => {
                    if(data.send){
                        CodeNotification.innerText = 'Sended successfully!';
                        CodeNotification.style.color = 'white';

                        setTimeout( ()=>{
                            CodeNotification.innerText = '';
                        }, 3000)
                    }
                })
                .catch(err => {
                    console.log(err);
                })
    });

document.getElementById('goBackBtn').addEventListener(
    'click', (e) => {
        window.location.href = '/'
    });



document.getElementById('submitBtn').addEventListener(
    'click', async (e) => {

        let verificationCode = document.getElementById('inputCode').value;

        const postData = {
            verificationCode
        }
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify( postData )
        };

        mainNotification.innerHTML = `<div class="alert alert-info">Registering...</div>`;
        await fetch( '/verification', postOptions)
            .then(res => res.json())
            .then(data => {
                if(data.error){
                    if(data.redirect){
                        mainNotification.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
                            console.log('Inside redirect');
                            setTimeout( ()=>{
                                window.location.href = data.redirect;
                            }, 2000);
                        } else {
                            mainNotification.innerHTML = '';
                            CodeNotification.innerText = data.error;
                            CodeNotification.style.color = "red";
                            CodeNotification.style.margin = '0px'

                            if (getCodeBtnShown === 0){
                                
                                getCodeBtn.style.display = 'block';
                                getCodeBtnShown = 1;
                            }

                            setTimeout( ()=>{
                                CodeNotification.innerText = '';
                            }, 3000);
                        }
                } else {

                    fetch(data.redirect)
                        .then( res => res.json() )
                        .then(data => {
                            getCodeBtn.setAttribute('disabled', 'disabled');
                            document.getElementById('submitBtn').setAttribute('disabled', 'disabled');
                            if(data.error){
                                mainNotification.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
                            } else {
                                mainNotification.innerHTML = `<div class="alert alert-success">Registered Successfully!</div>`;
                            }
                            setTimeout ( ()=> {
                                mainNotification.innerHTML = '';
                                window.location.href = data.redirect;
                            },3000);
                        })
                        .catch( err => {
                            console.log(err);
                        })
            }
        })
        .catch(err => {
            console.log(err);
        });
});