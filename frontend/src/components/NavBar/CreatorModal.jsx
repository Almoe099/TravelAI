import React, { useState } from 'react';
import './CreatorModal.css'; 
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import TechnologyStack from './TechnologyStack';
import logo from '../../Pictures/TravelAI-1-31-2024_1.png'

const CreatorModal = ({ show, onClose, creators, projectInfo }) => {
    const [activeTab, setActiveTab] = useState('about'); // default to 'about'
  
    if (!show) {
      return null;
    }
  
    const handleTabClick = (tab) => {
        console.log("Switching to tab: ", tab);
        setActiveTab(tab);
    }
  
    return (
        <div className="creator-modal-backdrop">
          <div className="creator-modal">
            <button onClick={onClose} className="close-modal-button">X</button>
      
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo-image" />
            </div>
            
            <div className="modal-tabs">
              <button 
                onClick={() => handleTabClick('about')}
                className={`tab ${activeTab === 'about' ? 'active' : ''}`}
              >
                About This Project
              </button>
              <button 
                onClick={() => handleTabClick('team')}
                className={`tab ${activeTab === 'team' ? 'active' : ''}`}
              >
                Meet the Team
              </button>
            </div>
            
            {activeTab === 'about' && (
              <div className="about-section">
                {projectInfo.summary.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))}
                <h2 className="technologies-title">Technologies Used</h2>
                <div className="technologies-used">
                  {projectInfo.technologies.map((tech, index) => (
                    <a key={index} href={tech.link} target="_blank" rel="noopener noreferrer" className="technology-icon">
                      {React.createElement(tech.icon, {
                        color: tech.color,
                        size: '48px' // Adjust the size as needed
                      })}
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'team' && (
              <div className="creators-info">
                {creators.map((creator, index) => (
                  <div key={index} className="creator">
                    <img src={creator.image} alt={creator.name} className="creator-image" />
                    <h3>{creator.name}</h3>
                    <p className="creator-role">{creator.role}</p>
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
            )}
          </div>
        </div>
      );
      
      
                }      
  
export default CreatorModal;
