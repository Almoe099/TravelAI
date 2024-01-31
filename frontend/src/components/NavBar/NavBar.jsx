import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './NavBar.css';
import { logout } from '../../store/session';
import TravelAILogo from '../../Pictures/TravelAILogo.png';
import CreatorModal from './CreatorModal';

function NavBar() {
  const loggedIn = useSelector(state => !!state.session.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const creators = [
    { 
      name: 'Christopher Green', 
      role: 'Team Lead',
      github: 'https://github.com/cgreen66', 
      linkedin: 'https://linkedin.com/in/christophergreenn',
      image: 'https://amasphere-seeds1.s3.amazonaws.com/IMG_1978.jpg'
    },
    { 
      name: 'Nick Cioffi',
      role: 'Backend',
      github: 'https://github.com/ncioffi1', 
      linkedin: 'https://linkedin.com/in/creator1',
      image: 'https://amasphere-seeds1.s3.amazonaws.com/Panigale-V4R-MY23-Model-Preview-1050x650.png' 
    },
    { 
      name: 'Almutasim Mohamed', 
      role: 'Frontend',
      github: 'https://github.com/almoe099', 
      linkedin: 'https://linkedin.com/in/creator2',
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
      <CreatorModal show={showModal} onClose={closeModal} creators={creators} />
    </nav>
  );
}

export default NavBar;
