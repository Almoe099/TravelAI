import { useState } from 'react';
import LoginForm from '../SessionForms/LoginForm';
import SignupForm from '../SessionForms/SignupForm';
import './MainPage.css';
import { login } from '../../store/session';
import { useDispatch } from 'react-redux';
import airplaneGlobeImage from '../../Pictures/Noun_15537_ccElliotVerhaeren_travel.svg.png';
import { gsap } from 'gsap';
import { useEffect } from 'react';


function MainPage() {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    gsap.fromTo(".info-image", { opacity: 0, y: -50, scale: 1.1 }, { duration: 1.2, y: 0, scale: 1, opacity: 1, ease: 'bounce.out' });
    gsap.fromTo(".info-section h2", { opacity: 0, x: -100 }, { duration: 1.2, delay: 0.7, x: 0, opacity: 1, ease: 'power3.out' });
    gsap.fromTo(".info-section p", { opacity: 0, x: 100 }, { duration: 1.2, delay: 1.4, x: 0, opacity: 1, ease: 'power3.out' });
  }, []);
  
  useEffect(() => {
    // Set initial opacity for the elements to be animated
    gsap.set([".form-section", ".demo-login-btn", ".toggle-form", ".divider"], { opacity: 0 });
  
    // Fade in the form, buttons, and divider with a slight delay after the main content
    gsap.to([".form-section", ".demo-login-btn", ".toggle-form", ".divider"], {
      duration: 1.2, 
      opacity: 1, 
      ease: 'power2.inOut', 
      delay: 1.2 // adjust the delay as needed
    });
  }, []);
  
  
  

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
  
  const formContainerClass = isLogin ? "form-container login" : "form-container signup";
  
  return (
    <>
    <div className="main-page">
      <div className="content-section">
        <div className="info-section">
          <img src={airplaneGlobeImage} alt="Airplane flying over a globe" className="info-image" />
          <h2>Welcome to TravelAI</h2>
          <p>Your smart companion for travel planning!</p>
        </div>
        <div className="form-section">
          <div className={formContainerClass}>
            {isLogin ? <LoginForm /> : <SignupForm />}
            <div className="divider"></div>
            <button onClick={handleDemoLogin} className="demo-login-btn">
              Demo Login
            </button>
            <button onClick={() => setIsLogin(!isLogin)} className="toggle-form">
              {isLogin ? "Create new account" : "Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
  }  

export default MainPage;
