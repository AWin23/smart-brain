import React from 'react';
//import Tilt from 'react-tilt';
import brain from './brain.png';
import './Logo.css';


const Logo = () => {
	return (
		<div className='ml4 mt0' style={{ height: 150, width: 150 }}>
             <div className="Tilt-inner"><img alt='logo' src={brain}/></div>
		
		</div>
	);
}

export default Logo;