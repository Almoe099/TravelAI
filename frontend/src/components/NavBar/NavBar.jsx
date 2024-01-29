import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './NavBar.css';
import { logout } from '../../store/session';

function NavBar() {
  const loggedIn = useSelector(state => !!state.session.user);
  const dispatch = useDispatch();

  const logoutUser = e => {
    e.preventDefault();
    dispatch(logout());
  };

  return (
    <nav className="NavBar">
      <h1>TravelAI</h1>
      <div className={loggedIn ? 'links-nav' : 'links-auth'}>
        {loggedIn ? (
          <>
            <Link to='/profile'>Profile</Link>
            <Link to="/travel-recommendations">Travel Recommendations</Link>
            <Link to="/itinerary-planning">Itinerary Planning</Link>
            <Link to="/personal-notes">Personal Notes</Link>
            <Link to="/document-storage">Document Storage</Link>
            <button onClick={logoutUser}>Logout</button>
          </>
        ) : (
          <>
            <Link to='/features'>Features</Link>
            <Link to='/about-us'>About Us</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
