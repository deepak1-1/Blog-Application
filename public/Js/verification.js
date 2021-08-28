

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
    'click', (e) => {

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

        fetch( '/verification', postOptions)
            .then(res => res.json())
            .then(data => {
                if(data.error){
                    
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
                } else {
                    
                    mainNotification.innerHTML = `<div class="alert alert-success">Registered Successfully!</div>`
                    getCodeBtn.setAttribute('disabled', 'disabled');
                    document.getElementById('submitBtn').setAttribute('disabled', 'disabled');

                    setTimeout( ()=>{
                        mainNotification.innerHTML = '';
                        window.location.href = data.redirect;
                    },3000);
                    // console.log('Everything is good');
                }
            })
            .catch(err => {
                console.log(err);
            })
    });