import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './NavBar.css';
import { logout } from '../../store/session';
import TravelAILogo from '../../Pictures/TravelAILogo.png';
import CreatorModal from './CreatorModal';
import { FaReact, FaNodeJs } from 'react-icons/fa';
import { DiMongodb } from 'react-icons/di';
import { SiExpress, SiOpenai } from 'react-icons/si';
import { FaGitAlt, FaGithub, FaNpm, FaAws } from 'react-icons/fa';
import { SiEslint, SiPrettier, SiPostman, SiRedux, SiVisualstudiocode } from 'react-icons/si';

function NavBar() {
  const loggedIn = useSelector(state => !!state.session.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const projectInfo = {
    summary: `TravelAI transforms travel planning by utilizing AI to offer customized destination recommendations based on users' detailed preferences, including specific interests and dietary requirements. The platform's design, built with React.js and Node.js, delivers a smooth and visually appealing user experience, while MongoDB ensures secure and efficient data management.
     \n\n Beyond simplifying destination selection, TravelAI enhances itinerary planning by allowing users to effortlessly organize their schedule and explore a rich collection of travel guides and cultural insights. Essentially, TravelAI redefines travel planning, serving as a personalized guide to crafting unforgettable travel experiences.`,
    technologies: [
      { name: 'MongoDB', icon: DiMongodb, color: "#47A248", link: 'https://www.mongodb.com/' },
      { name: 'Express.js', icon: SiExpress, color: "#000000", link: 'https://expressjs.com/' },
      { name: 'React', icon: FaReact, color: "#61DAFB", link: 'https://reactjs.org/' },
      { name: 'Node.js', icon: FaNodeJs, color: "#339933", link: 'https://nodejs.org/' },
      { name: 'OpenAI', icon: SiOpenai, color: "#412991", link: 'https://openai.com/' },
      { name: 'Git', icon: FaGitAlt, color: "#F05032", link: 'https://git-scm.com/' },
      { name: 'GitHub', icon: FaGithub, color: "#181717", link: 'https://github.com/' },
      { name: 'npm', icon: FaNpm, color: "#CB3837", link: 'https://www.npmjs.com/' },
      { name: 'ESLint', icon: SiEslint, color: "#4B32C3", link: 'https://eslint.org/' },
      { name: 'Prettier', icon: SiPrettier, color: "#F7B93E", link: 'https://prettier.io/' },
      { name: 'Postman', icon: SiPostman, color: "#FF6C37", link: 'https://www.postman.com/' },
      { name: 'Redux', icon: SiRedux, color: "#764ABC", link: 'https://redux.js.org/' },
      // { name: 'AWS', icon: FaAws, color: "#FF9900", link: 'https://aws.amazon.com/' },
      { name: 'AWS S3', icon: FaAws, color: "#569A31", link: 'https://aws.amazon.com/s3/' },
      { name: 'Visual Studio Code', icon: SiVisualstudiocode, color: "#007ACC", link: 'https://code.visualstudio.com/' },
    ],
    
  };

  const [showModal, setShowModal] = useState(false);
  const creators = [
    { 
      name: 'Christopher Green', 
      role: 'Team Lead',
      github: 'https://github.com/cgreen66', 
      linkedin: 'https://linkedin.com/in/christophergreenn',
      email: 'christophergreennyc@gmail.com',
      image: 'https://amasphere-seeds1.s3.amazonaws.com/IMG_1978.jpg'
    },
    { 
      name: 'Nick Cioffi',
      role: 'Backend',
      github: 'https://github.com/ncioffi1', 
      linkedin: 'https://www.linkedin.com/in/nicholas-cioffi-373913139/',
      email: 'imnickcioffi@gmail.com',
      image: 'https://amasphere-seeds1.s3.amazonaws.com/nicks_picture.jpg' 
    },
    { 
      name: 'Almutasim Mohamed', 
      role: 'Frontend',
      github: 'https://github.com/almoe099', 
      linkedin: 'https://linkedin.com/in/creator2',
      email: 'almoe099@gmail.com',
      image: 'https://amasphere-seeds1.s3.amazonaws.com/Screenshot+2024-02-01+at+2.59.16+PM.png'
    }
  ];
  

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const logoutUser = e => {
    e.preventDefault();
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="NavBar">
      <Link to={'/profile'}>
        <img src={TravelAILogo} alt="TravelAI logo" className="TravelAiLogo" />
      </Link>
      <div className="nav-links-container">
        <div className={loggedIn ? 'links-nav' : 'links-auth'}>
          {loggedIn ? (
            <>
              <Link to='/profile'>Profile</Link>
              <a onClick={openModal} className="nav-link">About</a>
              {/* other links */}
            </>
          ) : (
            <>
              <a onClick={openModal} className="nav-link">About</a>
              {/* other links */}
            </>
          )}
        </div>
        {loggedIn && (
          <button onClick={logoutUser} className="logout-button">
            <span className="button-text">Log Out</span>
          </button>
        )}
      </div>
      <CreatorModal show={showModal} onClose={closeModal} creators={creators} projectInfo={projectInfo} />
    </nav>
  );
}

export default NavBar;
