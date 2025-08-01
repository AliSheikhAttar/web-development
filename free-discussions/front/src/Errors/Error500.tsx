import React from 'react';
import './ErrorPage.css';
import errorpng from "./image.png"
import error500png from "./images1-removebg-preview.png"

const Error500: React.FC = () => {
  return (
    
    <div className="error-container">
     <img src={errorpng} alt="Error 500" className="error-image-main" />
     <h1>500 Error: Internal Server Error</h1>
     <p>!We're sorry, but something went wrong on our end</p>
     <img src={error500png} alt="Error 500" className="error-image" />

    </div>
    
  );
};

export default Error500;