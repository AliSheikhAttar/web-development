import React from 'react';
import './ErrorPage.css';
import errorpng from "./image.png"
import error500png from "./images1-removebg-preview.png"

const Error400: React.FC = () => {
  return (
    <div className="error-container">
     <img src={errorpng} alt="Error 400" className="error-image-main" />
     <h1>400 Error: Bad Request</h1>
     <p>!We're sorry, but your request could not be processed</p>
      <img src={error500png} alt="Error 400" className="error-image" />
    </div>
  );
};

export default Error400;