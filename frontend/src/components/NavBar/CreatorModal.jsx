import React from 'react';
import './CreatorModal.css'; 
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const CreatorModal = ({ show, onClose, creators }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="creator-modal-backdrop">
      <div className="creator-modal">
        <button onClick={onClose} className="close-modal-button">X</button>
        <h2>Our Team</h2>
        <div className="creators-info">
          {creators.map((creator, index) => (
            <div key={index} className="creator">
              <img src={creator.image} alt={creator.name} className="creator-image" />
              <h3>{creator.name}</h3>
              <p className="creator-role">{creator.role}</p> {/* Added role */}
              <div className="social-links">
                <a href={creator.github} target="_blank" rel="noopener noreferrer">
                  <FaGithub className="social-icon" />
                </a>
                <a href={creator.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="social-icon" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorModal;
