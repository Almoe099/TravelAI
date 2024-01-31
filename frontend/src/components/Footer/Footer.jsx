import { FaGithub, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <>
      <div className='footer-space'></div>
      <div className='footer-container'>
      <h1 className='rights'>@TravelAI All Rights Reserved</h1>
        <div className='footer-column'>
          <div className='column'>
            <h3>Christopher Green</h3>
            <div className='LinkList'>
              <a href='https://github.com/cgreen66' target='_blank' rel='noopener noreferrer'>
                <FaGithub size={30} color='#fff' />
              </a>
              <a
                href='https://www.linkedin.com/in/christophergreenn'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaLinkedin size={30} color='#fff' />
              </a>
            </div>
          </div>

          <div className='column'>
            <h3>Nick Cioffi</h3>
            <div className='LinkList'>
              <a href='https://github.com/ncioffi1' target='_blank' rel='noopener noreferrer'>
                <FaGithub size={30} color='#fff' />
              </a>
              <a
                href='https://github.com/ncioffi1'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaLinkedin size={30} color='#fff' />
              </a>
            </div>
          </div>

          <div className='column'>
            <h3>Almutasim Mohamed</h3>
            <div className='LinkList'>
              <a href='https://github.com/almoe099' target='_blank' rel='noopener noreferrer'>
                <FaGithub size={30} color='#fff'  className="icons"/>
              </a>
              <a
                href='https://github.com/almoe099'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaLinkedin size={30} color='#fff' />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
