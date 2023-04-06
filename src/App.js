import React, { Component } from "react";
import "./App.css";
import ParticlesBg from 'particles-bg';
import Clarifai from 'clarifai';
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";

const app = new Clarifai.App({
	apiKey: '1c750faf49274fe5a5ef4fcd0603653c'
});


// const particlesInit = async (main) => {
// 	// console.log(main);
// 	await loadFull(main);
// };

// const particlesLoaded = (container) => {
// 	// console.log(container);
// };

// const particleEffect = {
// 	particles: {
// 		number: {
// 			value: 100,
// 			density: {
// 				enable: true,
// 				value_area: 800,
// 			},
// 		},
// 		color: {
// 			value: "#ffffff",
// 		},
// 		shape: {
// 			type: "triangle",
// 			stroke: {
// 				width: 0,
// 				color: "#000000",
// 			},
// 			polygon: {
// 				nb_sides: 5,
// 			},
// 			image: {
// 				src: "img/github.svg",
// 				width: 100,
// 				height: 100,
// 			},
// 		},
// 		opacity: {
// 			value: 0.5,
// 			random: false,
// 			anim: {
// 				enable: false,
// 				speed: 1,
// 				opacity_min: 0.1,
// 				sync: false,
// 			},
// 		},
// 		size: {
// 			value: 3,
// 			random: true,
// 			anim: {
// 				enable: false,
// 				speed: 40,
// 				size_min: 0.1,
// 				sync: false,
// 			},
// 		},
// 		line_linked: {
// 			enable: true,
// 			distance: 150,
// 			color: "#ffffff",
// 			opacity: 0.4,
// 			width: 1,
// 		},
// 		move: {
// 			enable: true,
// 			speed: 4,
// 			direction: "none",
// 			random: false,
// 			straight: false,
// 			out_mode: "out",
// 			bounce: false,
// 			attract: {
// 				enable: false,
// 				rotateX: 600,
// 				rotateY: 1200,
// 			},
// 		},
// 	},
// 	interactivity: {
// 		detect_on: "canvas",
// 		events: {
// 			onhover: {
// 				enable: true,
// 				mode: "repulse",
// 			},
// 			onclick: {
// 				enable: true,
// 				mode: "push",
// 			},
// 			resize: true,
// 		},
// 		modes: {
// 			grab: {
// 				distance: 400,
// 				line_linked: {
// 					opacity: 1,
// 				},
// 			},
// 			bubble: {
// 				distance: 400,
// 				size: 40,
// 				duration: 2,
// 				opacity: 8,
// 				speed: 3,
// 			},
// 			repulse: {
// 				distance: 200,
// 				duration: 0.4,
// 			},
// 			push: {
// 				particles_nb: 4,
// 			},
// 			remove: {
// 				particles_nb: 2,
// 			},
// 		},
// 	},
// 	retina_detect: true,
// };

const initialState = {
		input: '',
		imageUrl: '',
		box: {},
		route: 'signin',
		isSignedIn: false,
		user: {
		id: '',
		name: '',
		email: '',
		entries: 0,
		joined: ''
		}
	}

class App extends Component{
	constructor(){
		super();
		this.state = initialState;
	}

	loadUser = (data) => {
		// loadUser(data) {
		this.setState({user:{
			id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.joined
	}})
	}

	createGuest = () => {
        const email = 'guest@gmail.com';
        const password = 'password';
        const name = 'Guest';
        fetch('http://localhost:3000/signin', {
           method: 'post',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify({
               email: email,
               password: password
           }) 
        })
        .then(response => response.json())
        .then(user => {
            if(user.id){
                console.log('guest already created')
            } else {
                //delete and re-create guest.
                console.log('create guest')
                this.deleteUser(email, password);
                this.onSubmitRegister(email, password, name);
            }
        })
    }

    deleteUser = (email, password) => {
        console.log(email, password)
        fetch('http://localhost:3000/delete', {
           method: 'delete',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify({
               email: email ,
               password: password
           }) 
        })
        .then(response => response.json())
    }


	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
		  leftCol: clarifaiFace.left_col * width,
		  topRow: clarifaiFace.top_row * height,
		  rightCol: width - (clarifaiFace.right_col * width),
		  bottomRow: height - (clarifaiFace.bottom_row * height)
		// rightCol: width - clarifaiFace.right_col * width,
		//   bottomRow: height - clarifaiFace.bottom_row * height
		}
	  }
	 
	

	displayFaceBox = (box) => {
		this.setState({box: box});
	}


	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	//submits a route for the image URL into the Face detection thing
	onPictureSubmit = () => {
		this.setState({imageUrl: this.state.input});
		app.models
		.predict(
		  {
			id: 'face-detection',
			name: 'face-detection',
			version: '6dc7e46bc9124c5c8824be4822abe105',
			type: 'visual-detector',
		  }, this.state.input)
		.then(response => {
		  console.log('hi', response)
		  if (response) {
			fetch('https://pure-waters-47974.herokuapp.com/image', {
			  method: 'put',
			  headers: {'Content-Type': 'application/json'},
			  body: JSON.stringify({
				id: this.state.user.id
			  })
			})
			  .then(response => response.json())
			  .then(count => {
				this.setState(Object.assign(this.state.user, { entries: count}))
			  })
  
			}
			console.log(response);
			this.displayFaceBox(this.calculateFaceLocation(response))
		})
			//console.log(response);
			// console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
		.catch(err => console.log(err));
	}



  onRouteChange = (route) => {
	  if(route === 'signout') {
		  this.setState(initialState)
	  } else if (route === 'home') {
		  this.setState({isSignedIn: true})
	  } 
	  this.setState({route: route});
  }

  render () {
	const  { isSignedIn, imageUrl, route, box } = this.state;
    return (
			<div className="App">
				 <ParticlesBg type="cobweb" bg={true} />
      <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
	  { route === 'home' 
	  ?<div>
	  <Logo/>
	 <Rank name={this.state.user.name} entries={this.state.user.entries}
	 />
	 <ImageLinkForm 
	 onInputChange={this.onInputChange} 
	 onPictureSubmit={this.onPictureSubmit}
	   />
       <FaceRecognition box={box} imageUrl={imageUrl}/> 
	   </div>
	: (
		 route === 'signin' 
		? <Signin loadUser ={this.loadUser} onRouteChange={this.onRouteChange}/>
		: <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
	)
	} 	
	   </div>
  );
}
}

export default App;
