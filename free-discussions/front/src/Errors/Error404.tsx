import React from 'react';
import './ErrorPage.css';
import errorpng from "./image.png"
import error500png from "./images1-removebg-preview.png"

const Error404: React.FC = () => {
  return (
    <div className="error-container">
          <img src={errorpng} alt="Error 403" className="error-image-main" />
          <h1>404 Error: Not Found</h1>
          <p>!The page you are looking for does not exist</p>
      <img src={error500png} alt="Error 404" className="error-image" />
    </div>
  );
};

export default Error404;