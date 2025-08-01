import React from 'react';
import './ErrorPage.css';
import errorpng from "./image.png"
import error500png from "./images1-removebg-preview.png"

const Error403: React.FC = () => {
  return (
    <div className="error-container">
         <img src={errorpng} alt="Error 403" className="error-image-main" />
         <h1>403 Error: Forbidden</h1>
         <p>!You do not have permission to access this resource</p>
      <img src={error500png} alt="Error 403" className="error-image" />
    </div>
  );
};

export default Error403;