import React from 'react';
import './CreatorModal.css'; // Make sure to import the CSS styles

const TechnologyStack = ({ technologies }) => {
    return (
      <div className="technologies-used">
        {technologies.map((tech, index) => (
          <a key={index} href={tech.link} target="_blank" rel="noopener noreferrer" className="technology-item">
            {React.createElement(tech.icon, { className: "technology-icon", style: { color: tech.color } })}
            <span className="technology-name">{tech.name}</span>
          </a>
        ))}
      </div>
    );
  };

export default TechnologyStack;