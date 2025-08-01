import React from 'react';
import './ErrorPage.css';
import errorpng from "./image.png"
import error500png from "./images1-removebg-preview.png"

const Error401: React.FC = () => {
  return (
    <div className="error-container">
        <img src={errorpng} alt="Error 401" className="error-image-main" />
        <h1>401 Error: Unauthorized</h1>
        <p>!You need to log in to access this resource</p>
      <img src={error500png} alt="Error 401" className="error-image" />
    </div>
  );
};

export default Error401;