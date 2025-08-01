import React from "react";
import "./ProfileCard.css";
import { FaGithub, FaLinkedin, FaTelegram } from "react-icons/fa";

interface ProfileCardProps {
  name: string;
  role: string;
  description: string;
  linkedin: string;
  telegram: string;
  github: string;
  image: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  description,
  linkedin,
  telegram,
  github,
  image,
}) => {
  return (
    <div className="profile-card">
      <div className="profile-content">
        <img src={image} alt={`${name}'s avatar`} className="avatar" />
        <div className="details">
          <h3 className="name">{name}</h3>
          <p className="role">{role}</p>
          <p className="description">{description}</p>
          <div className="icons">
            <a href={linkedin} className="social-icon" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href={telegram} className="social-icon" aria-label="Telegram">
              <FaTelegram />
            </a>
            <a href={github} className="social-icon" aria-label="Github">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;