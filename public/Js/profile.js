
const contact_us = document.getElementById('contact_us'),
	  followers = document.getElementById('followers'),
	  following = document.getElementById('following'),
	  posts = document.getElementById('posts'),
	  logout = document.getElementById('logOut');

const profilepic = document.querySelector('.profileImage'),
	  imageModal = document.getElementById('imageModal');

profilepic.addEventListener('click', (event)=>{

	console.log(event.target.parentElement, event.target.src);
	imageModal.style.display = "block";

});

followers.addEventListener('click', (event)=>{
	window.location.href = '/home-page/followers';
});

following.addEventListener('click', (event)=>{
	window.location.href = '/home-page/following';
});

posts.addEventListener('click', (event)=>{
	window.location.href = '/home-page/posts';
});

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