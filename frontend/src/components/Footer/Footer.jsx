import './Footer.css'
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {

    return (
        <>
        <div className='footer-space'></div>
    <div className="footer-container">
        <div className='footer-column'>
      <div className="column">
        <h3>Chris</h3>
        <div className='LinkList'>
            <img src="https://amasphere-seeds1.s3.amazonaws.com/IMG_1978.jpg" alt="" className='link' />
            <img src={FaGithub } alt="" className='link' />
            <img src={FaLinkedin } alt="" className='link' />
        </div>
      </div>

      <div className="column">
        <h3>Nick</h3>
        <div className='LinkList'>
            <img src="https://amasphere-seeds1.s3.amazonaws.com/IMG_1978.jpg" alt="" className='link' />
            <img src={FaGithub } alt="" className='link' />
            <img src={FaLinkedin } alt="" className='link' />
        </div>
      </div>

      <div className="column">
        <h3>Almutasim</h3>
        <div className='LinkList'>
            <img src="https://amasphere-seeds1.s3.amazonaws.com/IMG_1978.jpg" alt="" className='link' />
            <img src={FaGithub } alt="" className='link' />
            <img src={FaLinkedin } alt="" className='link' />
        </div>
      </div>
      </div>
    </div>
    </>
  );

};

export default Footer