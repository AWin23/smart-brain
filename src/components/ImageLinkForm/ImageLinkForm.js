import React from 'react';
import './ImageLinkForm.css';


const ImageLinkForm = ({onInputChange, onPictureSubmit}) => {
	return (
		<div>
            <p className='f3'>
                {'This Magic Brain will detect faces in your pictures. Give it a try'}
            </p>
            <p><strong>{'Copy image URl or image address to the bar below'}</strong></p>
            <p><strong><mark>{'NOTICE: Smart Brain only scans for 1 face as of right now, so please submit an image with 1 face'}</mark></strong></p>
            <div className='center'>
                <div className='form center pa br3 shadow-1'>
                <input className = 'f4 p2 w-70 center' type='tex' onChange={onInputChange}/>
                <button 
                className = 'w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
                onClick={onPictureSubmit}
                >Detect</button>
                </div>
            </div>
		</div>
	);
}

export default ImageLinkForm;