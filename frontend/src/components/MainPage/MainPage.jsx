import { useState } from 'react';
import LoginForm from '../SessionForms/LoginForm';
import SignupForm from '../SessionForms/SignupForm';
import './MainPage.css';

function MainPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleDemoLogin = () => {
    // Placeholder for demo login logic
    // Implement your demo login functionality here
    console.log("Demo login clicked");
  };

  return (
    <div className="main-page">
      <div className="content-section">
        <div className="info-section">
          <h2>Welcome to TravelAI</h2>
          <p>Your smart companion for travel planning!</p>
        </div>
        <div className="form-section">
          <div className="form-container">
            {isLogin ? <LoginForm /> : <SignupForm />}
            <button onClick={handleDemoLogin} className="demo-login-btn">
              Demo Login
            </button>
            <button onClick={() => setIsLogin(!isLogin)} className="toggle-form">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  }  

export default MainPage;
