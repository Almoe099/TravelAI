import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './NavBar.css';
import { logout } from '../../store/session';
import TravelAILogo from '../../Pictures/TravelAILogo.png';
import CreatorModal from './CreatorModal';
import { FaReact, FaNodeJs, FaDatabase } from 'react-icons/fa';
import { DiMongodb, DiJavascript1 } from 'react-icons/di';
import { SiExpress, SiOpenai } from 'react-icons/si';
import { FaGitAlt, FaGithub, FaNpm, FaAws } from 'react-icons/fa';
import { SiEslint, SiPrettier, SiPostman, SiRedux, SiVisualstudiocode } from 'react-icons/si';

function NavBar() {
  const loggedIn = useSelector(state => !!state.session.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const projectInfo = {
    summary: `TravelAI revolutionizes travel planning by harnessing the power of AI to provide highly personalized destination recommendations and streamlined itinerary planning. Upon setting up a profile, users have the opportunity to define their travel preferences with precision, ranging from specific interests to dietary requirements. Our AI-driven system then rapidly curates a range of travel options tailored to each individual's unique tastes and budget constraints.

    \n\n
    The platform's interface, meticulously crafted using cutting-edge technologies such as React.js and Node.js, guarantees a user-friendly and visually appealing experience. Behind the scenes, MongoDB handles data management with utmost efficiency, ensuring that your travel plans are securely stored and readily accessible.\n\n
    Our platform takes the hassle out of the entire travel planning process, from selecting a destination to creating a comprehensive itinerary. Thanks to an intuitive drag-and-drop interface, users can effortlessly organize their travel schedules, incorporating activities, dining experiences, and more. Additionally, TravelAI provides access to a wealth of travel guides and cultural insights, empowering modern travelers with valuable information and local knowledge.
    In summary, TravelAI is not just a travel planning tool; it's your ultimate companion for crafting personalized travel experiences that cater to your every need and desire.`,
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
      { name: 'AWS', icon: FaAws, color: "#FF9900", link: 'https://aws.amazon.com/' },
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
      linkedin: 'https://linkedin.com/in/creator1',
      email: 'imnickcioffi@gmail.com',
      image: 'https://amasphere-seeds1.s3.amazonaws.com/Panigale-V4R-MY23-Model-Preview-1050x650.png' 
    },
    { 
      name: 'Almutasim Mohamed', 
      role: 'Frontend',
      github: 'https://github.com/almoe099', 
      linkedin: 'https://linkedin.com/in/creator2',
      email: 'almoe099@gmail.com',
      image: 'https://amasphere-seeds1.s3.amazonaws.com/MY-21-Superleggera-V4-01-Model-Blocks-630x390-v03.png'
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
              <a onClick={openModal} className="nav-link">About Us</a>
              {/* other links */}
            </>
          ) : (
            <>
              <Link to='/features'>Features</Link>
              <a onClick={openModal} className="nav-link">About Us</a>
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
