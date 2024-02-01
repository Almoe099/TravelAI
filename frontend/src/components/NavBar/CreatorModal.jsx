import React, { useState, useEffect } from 'react';
import './CreatorModal.css';
import { CSSTransition } from 'react-transition-group';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import logo from '../../Pictures/TravelAI-1-31-2024_1.png';
import gsap from 'gsap';

const CreatorModal = ({ show, onClose, creators, projectInfo }) => {
    const [activeTab, setActiveTab] = useState('team'); // Set 'team' as the initial tab

    useEffect(() => {
        if (show && activeTab === 'about') {
            // Animate the summary paragraphs
            gsap.fromTo('.about-section p', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.7 });
    
            // Delay the start of the technologies animation so it happens after the summary
            gsap.fromTo('.technology-icon', { y: -20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, delay: 0.5 });
        } else if (show && activeTab === 'team') {
            gsap.fromTo('.creator', { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.2, duration: 0.7 });
        }
    }, [activeTab, show]);
    

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <CSSTransition
            in={show}
            timeout={300}
            classNames="modal"
            unmountOnExit
        >
            <div className="creator-modal-backdrop">
                <div className="creator-modal">
                    <button onClick={onClose} className="close-modal-button">X</button>
                    <div className="logo-container">
                        <img src={logo} alt="Logo" className="logo-image" />
                    </div>
                    <div className="modal-tabs">
                        <button 
                            onClick={() => handleTabClick('team')}
                            className={`tab ${activeTab === 'team' ? 'active' : ''}`}
                        >
                            Meet the Team
                        </button>
                        <button 
                            onClick={() => handleTabClick('about')}
                            className={`tab ${activeTab === 'about' ? 'active' : ''}`}
                        >
                            About This Project
                        </button>
                    </div>

                    <div className={`tab-content ${activeTab === 'team' ? 'active' : ''}`}>
                        <div className="creators-info">
                            {/* Team section content */}
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
                                        <a href={`mailto:${creator.email}`} target="_blank" rel="noopener noreferrer">
                                            <FaEnvelope className="social-icon" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`tab-content ${activeTab === 'about' ? 'active' : ''}`}>
                        <div className="about-section">
                            {/* About section content */}
                            {projectInfo.summary.split("\n\n").map((paragraph, index) => (
                                <p key={index}>{paragraph.trim()}</p>
                            ))}
                            <h2 className="technologies-title">Technologies Used</h2>
                            <div className="technologies-used">
                                {projectInfo.technologies.map((tech, index) => (
                                    <a key={index} href={tech.link} target="_blank" rel="noopener noreferrer" className="technology-icon">
                                        {React.createElement(tech.icon, {
                                            color: tech.color,
                                            size: '48px'
                                        })}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </CSSTransition>
    );
};

export default CreatorModal;
