import React from "react";
import "./Team.css";
import Footer from "../Footer/Footer";
import ProfileCard from "../ProfileCard/ProfileCard";
import Header from "../Header/Header";
import AmirSaeidPic from "./AmirSaeid.jpg"
import MahzyarPic from "./Mahzyar.jpg"

const Team: React.FC = () => {
  // Example data for the team members
  const teamMembers = [
    {
      name: "Tina Mohammadpour",
      role: "Frontend Developer",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euism Lorem ipsum dolor sit amet.",
      linkedin: "https://www.linkedin.com/in/tina-mohammadpour-b9541627a",
      telegram: "https://t.me/tin_mp",
      github: "https://github.com/tinamohammadpour",
      image: "https://www.pngall.com/wp-content/uploads/16/Inside-Out-Sadness-PNG-Photo.png",
    },
    {
      name: "AmirSaed Haftbaradaran",
      role: "Frontend Developer",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euism Lorem ipsum dolor sit amet.",
      linkedin: "https://linkedin.com/in/amirsaeed-haftbaradaran-290a14343",
      telegram: "https://t.me/Amirsaeed7bn",
      github: "https://github.com/Amirsaeed7",
      image: AmirSaeidPic,
    },
    {
      name: "Saba Kianoosh",
      role: "Frontend Developer",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euism Lorem ipsum dolor sit amet.",
      linkedin: "https://www.linkedin.com/in/saba-kianoosh-35228a224/",
      telegram: "https://t.me/sabakian",
      github: "https://github.com/sabakianoosh",
      image: "https://www.pngall.com/wp-content/uploads/16/Inside-Out-Anxiety-Transparent.png",
    },
    {
      name: "Ali Sheikhattar",
      role: "Frontend Developer",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euism Lorem ipsum dolor sit amet.",
      linkedin: "https://www.linkedin.com/in/alisheikhattar/",
      telegram: "https://t.me/ASATTARR",
      github: "https://github.com/AliSheikhAttar/",
      image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/db9ed8c9-b18e-40d7-9b96-eb34d64138e6/dfdyv7o-cb4b3f0e-4269-4bc0-979f-d18ba9ed098f.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2RiOWVkOGM5LWIxOGUtNDBkNy05Yjk2LWViMzRkNjQxMzhlNlwvZGZkeXY3by1jYjRiM2YwZS00MjY5LTRiYzAtOTc5Zi1kMThiYTllZDA5OGYucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.xiSJocwicixu59Qx-Vk7eHh9IpSfihtbOIckghUxojs",
    },
    {
      name: "Kian Yari",
      role: "Backend Developer",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euism Lorem ipsum dolor sit amet.",
      linkedin: "https://www.linkedin.com/in/kian-yari-006093279?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      telegram: "https://t.me/kianyari",
      github: "https://github.com/KianYari",
      image: "https://www.pngall.com/wp-content/uploads/16/Inside-Out-Joy-PNG-HD-Image.png",
    },
    {
      name: "Mahziar Mirazimi",
      role: "Backend Developer",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euism Lorem ipsum dolor sit amet.",
      linkedin: "https://linkedin.com/in/mahziar-mirazimi",
      telegram: "https://t.me/SMM_1383",
      github: "https://github.com/smm-1383/",
      image: MahzyarPic,
    },
  ];

  return (
    <>
    <Header/>
    <div className="team-page">
      <div style={{marginLeft:"-32px"}}>
      </div>
      <div style={{padding:"5%"}}>
      <h1 className="team-title">Our Professional Team</h1>
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <ProfileCard
            key={index}
            name={member.name}
            role={member.role}
            description={member.description}
            linkedin={member.linkedin}
            telegram={member.telegram}
            github={member.github}
            image= {member.image}
          />
        ))}
      </div>
      </div>
    <Footer />

    </div>
  
  
  </>);
};

export default Team;
