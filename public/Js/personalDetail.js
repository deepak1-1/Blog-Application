const mainNotify = document.getElementById('mainNotification');

const goBackBtn = document.getElementById('gobackbtn'),
	  nextBtn = document.getElementById('nextbtn');

const agriculture = document.getElementById('agricultureTag'),
	  sports = document.getElementById('sportsTag'),
	  technology = document.getElementById('technologyTag'),
	  art = document.getElementById('artTag'),
	  homeScience = document.getElementById('homeScienceTag'),
	  politics = document.getElementById('politicsTag'),
	  photography = document.getElementById('photographyTag'),
	  others = document.getElementById('othersTag'),
	  name = document.getElementById('name'),
	  gender = document.getElementsByName('gender'),
	  username = document.getElementById('username'),
	  email = document.getElementById('email'),
	  bio = document.getElementById('bio'),
	  dob = document.getElementById('DOB');

const Taglist = [ agriculture, sports, technology, art, homeScience, politics, photography, others]

goBackBtn.addEventListener('click', (e)=>{

	//delete register cookie
	window.location.href = '/';
});

nextBtn.addEventListener('click', async (e)=>{

	let genderValue = false;
	gender.forEach( element=>{
		if(element.checked){
			genderValue = element.value;
		}
	})

	const nameValue = name.value,
		  emailValue = email.value,
		  usernameValue = username.value,
		  bioValue = bio.value.trim(),
		  dobValue = dob.value;
	
	let genderPass = false, namePass = false, dobPass = false;

	if(!genderValue){
		const alertDiv = document.createElement('div');
		alertDiv.className = 'my-0 col-8 offset-2 alert alert-danger'
		alertDiv.innerText = 'Please select gender';		
		mainNotify.appendChild( alertDiv );

		setTimeout( ()=>{
			mainNotify.removeChild( alertDiv )
		},3000);
	} else { genderPass = true}

	if(nameValue.trim() === ''){
		const nameAlert = document.createElement('div')
		nameAlert.className = 'my-0 col-8 offset-2 alert alert-danger'
		nameAlert.innerText = 'Please enter name!';
		mainNotify.appendChild( nameAlert );

		setTimeout( ()=>{
			mainNotify.removeChild( nameAlert )
		},3000);
	} else { namePass = true}


	if(dobValue === ''){
		const dobAlert = document.createElement('div');
		dobAlert.className = 'my-0 col-8 offset-2 alert alert-danger';
		dobAlert.innerText = 'Please select Date of birth!';
		mainNotify.appendChild( dobAlert );

		setTimeout( ()=>{
			mainNotify.removeChild( dobAlert );
		}, 3000);
	} else {

		const dobDate = new Date(dobValue),
			  nowDate = new Date();

		if(dobDate > nowDate){
			const dobAlert = document.createElement('div');
			dobAlert.className = 'my-0 col-8 offset-2 alert alert-danger';
			dobAlert.innerText = 'Please select valid Date of birth!';
			mainNotify.appendChild( dobAlert );

			setTimeout( ()=>{
				mainNotify.removeChild( dobAlert );
			}, 3000);
		} else {
			dobPass = true;
		}
	}

	if(namePass && genderPass && dobPass){

		const interestedTag = [];
		Taglist.forEach( element =>{

			if(element.checked)
				interestedTag.push( element.value );
		})

		postData = {
			name: nameValue,
			email: emailValue,
			username: usernameValue,
			gender: genderValue,
			bio: bioValue,
			dob: dobValue,
			interestedTag
		}
		postOptions = {
			method: 'POST',
			headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify( postData )
		}

		fetch( '/register/', postOptions)
			 .then(res => res.json())
			 .then(data =>{
			 	if(data.successfull){
			 		mainNotify.innerHTML = '<div class="col-8 offset-2 alert alert-success">Successfull!</div>';
			 		setTimeout( ()=>{
			 			mainNotify.innerHTML = '';
			 			window.location.href = data.redirect
			 		}, 3000)
			 	}
			 	console.log(data)
			 });
	}
});