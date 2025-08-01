import React from "react";
import "./temp.css"; // Add your styles here

const LoginPage: React.FC = () => {


  return (
    <div className="login-page">
       <div className="welcome-section">
        <h1>WELCOME BACK!</h1>
        <p>
          Lorem ipsum dolor amet, consectetur dipiscing elit. Praesent euismod ligula ut nisi interdum, vitae fringilla mauris.
        </p>
      </div>
      <div className="login-section">
        {/* <h2>Login</h2>
        <form className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Email" required />
            <span className="icon">📧</span>
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Password" required />
            <span className="icon">👁️</span>
          </div>
          <a href="#" className="forgot-password">Forget Password?</a>
          <button type="submit" className="login-button">Login</button>
        </form> */}
        {/* <p className="sign-up">
          Doesn’t have an account yet? <a href="#">Sign Up</a>
        </p> */}
      </div>

    </div>
  );
};

export default LoginPage;
