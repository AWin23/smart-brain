import { Component } from "react";
import "./App.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";

// const app = new Clarifai.App({
// 	apiKey: '1c750faf49274fe5a5ef4fcd0603653c'
// });


const particlesInit = async (main) => {
	// console.log(main);
	await loadFull(main);
};

const particlesLoaded = (container) => {
	// console.log(container);
};

const particleEffect = {
	particles: {
		number: {
			value: 100,
			density: {
				enable: true,
				value_area: 800,
			},
		},
		color: {
			value: "#ffffff",
		},
		shape: {
			type: "triangle",
			stroke: {
				width: 0,
				color: "#000000",
			},
			polygon: {
				nb_sides: 5,
			},
			image: {
				src: "img/github.svg",
				width: 100,
				height: 100,
			},
		},
		opacity: {
			value: 0.5,
			random: false,
			anim: {
				enable: false,
				speed: 1,
				opacity_min: 0.1,
				sync: false,
			},
		},
		size: {
			value: 3,
			random: true,
			anim: {
				enable: false,
				speed: 40,
				size_min: 0.1,
				sync: false,
			},
		},
		line_linked: {
			enable: true,
			distance: 150,
			color: "#ffffff",
			opacity: 0.4,
			width: 1,
		},
		move: {
			enable: true,
			speed: 4,
			direction: "none",
			random: false,
			straight: false,
			out_mode: "out",
			bounce: false,
			attract: {
				enable: false,
				rotateX: 600,
				rotateY: 1200,
			},
		},
	},
	interactivity: {
		detect_on: "canvas",
		events: {
			onhover: {
				enable: true,
				mode: "repulse",
			},
			onclick: {
				enable: true,
				mode: "push",
			},
			resize: true,
		},
		modes: {
			grab: {
				distance: 400,
				line_linked: {
					opacity: 1,
				},
			},
			bubble: {
				distance: 400,
				size: 40,
				duration: 2,
				opacity: 8,
				speed: 3,
			},
			repulse: {
				distance: 200,
				duration: 0.4,
			},
			push: {
				particles_nb: 4,
			},
			remove: {
				particles_nb: 2,
			},
		},
	},
	retina_detect: true,
};

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
		this.setState({imageUrl: this.state.input})
		fetch('https://pure-waters-47974.herokuapp.com/imageurl', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
			  input: this.state.input
			})
		})
		.then(response => response.json())
		.then(response => {
			if(response){
			fetch('https://pure-waters-47974.herokuapp.com/image', {
				method: 'put',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					id: this.state.user.id
				})
			})
			}
			this.displayFaceBox(this.calculateFaceLocation(response))
		})

			//console.log(response);
			// console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
		.catch(err => console.log(err));
	}

   particlesOptions = async (main) => {
    console.log(main);

    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(main);
  };

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
				<Particles className="particles" id="tsparticles" init={particlesInit} loaded={particlesLoaded} options={particleEffect} 
				/>

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
