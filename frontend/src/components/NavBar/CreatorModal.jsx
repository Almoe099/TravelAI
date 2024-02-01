import React, { useState } from 'react';
import './CreatorModal.css';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { gsap } from 'gsap';
import { useEffect } from 'react';

// Assuming TechnologyStack and logo are correctly imported elsewhere in your project
import TechnologyStack from './TechnologyStack';
import logo from '../../Pictures/TravelAI-1-31-2024_1.png';

const CreatorModal = ({ show, onClose, creators, projectInfo }) => {
    const [activeTab, setActiveTab] = useState('about'); // Default to 'about'

    useEffect(() => {
        // If the modal is shown, animate it in
        if (show) {
            gsap.to(".creator-modal-backdrop", { autoAlpha: 1 });
            gsap.to(".creator-modal", {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                display: "block"
            });
        } else {
            // Animate out only if the modal is already visible (prevents animation on initial render)
            if (gsap.getProperty(".creator-modal", "opacity") > 0) {
                gsap.to(".creator-modal", {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.in",
                    onComplete: () => {
                        gsap.set(".creator-modal-backdrop", { autoAlpha: 0 });
                    }
                });
            }
        }
    }, [show]);


    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // You can remove the `return null` if you are animating the modal in and out instead.
    // if (!show) {
    //     return null;
    // }

    return (
        <div className="creator-modal-backdrop" style={{ display: show ? 'flex' : 'none' }}>
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
                                        size: '48px'
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
                                    <a href={`mailto:${creator.email}`} target="_blank" rel="noopener noreferrer">
                                        <FaEnvelope className="social-icon" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreatorModal;
