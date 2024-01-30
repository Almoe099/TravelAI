import { useState } from 'react';
import LoginForm from '../SessionForms/LoginForm';
import SignupForm from '../SessionForms/SignupForm';
import './MainPage.css';
import { login } from '../../store/session';
import { useDispatch } from 'react-redux';

function MainPage() {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();

  const handleDemoLogin = async () => {
    console.log("Attempting to log in with demo user");
  
    const demoUser = {
      email: 'demo-user@appacademy.io',
      password: 'starwars'
    };
  
    try {
      await dispatch(login(demoUser));
      console.log("Login successful");
    } catch (error) {
      console.error("Error during demo login:", error);
    }
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
