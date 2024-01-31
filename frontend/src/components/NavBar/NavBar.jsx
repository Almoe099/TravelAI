import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './NavBar.css';
import { logout } from '../../store/session';
import TravelAILogo from '../../../public/TravelAILogo.png';

function NavBar() {
  const loggedIn = useSelector(state => !!state.session.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutUser = e => {
    e.preventDefault();
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="NavBar">
      <Link to={'/profile'}>
        <img src={TravelAILogo} alt="TravelAI logo image" className="TravelAiLogo" />
      </Link>
  
      <div className="nav-links-container">
        <div className={loggedIn ? 'links-nav' : 'links-auth'}>
          {loggedIn ? (
            <>
              <Link to='/profile'>Profile</Link>
              {/* <Link to="/travel-recommendations">Travel Recommendations</Link>
              <Link to="/itinerary-planning">Itinerary Planning</Link>
              <Link to="/personal-notes">Personal Notes</Link>
              <Link to="/document-storage">Document Storage</Link> */}
            </>
          ) : (
            <>
              <Link to='/features'>Features</Link>
              <Link to='/about-us'>About Us</Link>
            </>
          )}
        </div>
        {loggedIn && (
          <button onClick={logoutUser} className="logout-button">
            <span className="button-text">Log Out</span>
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
