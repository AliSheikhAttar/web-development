import styles from "./LandingPage.module.css";
import LandingPagephoto1 from "./LandingPage.png";
import PhoneImage from "./PhoneImage.png";
import PhoneImage2 from "./PhoneImage2.png";
import { RiUserVoiceFill } from "react-icons/ri";
import { GiDiscussion } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { MdGroups } from "react-icons/md";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { BiHappyHeartEyes } from "react-icons/bi";
import Footer from "../Footer/Footer";
import HeaderLanding from "../Header/HeaderLanding";

const LandingPage = () => {
  return (
    <>
    <HeaderLanding />
    <div className={styles.LandingPage}>
      <div className={styles.FirstPage}>
        <div className={styles.Image}>
          <img className={styles.img} src={LandingPagephoto1}></img>
        </div>
        <div className={styles.BigParagraphDiv}>
          <div className={styles.Topic}>
            <h1 className={styles.TopicHeader}>Speak with App Name</h1>
            <p className={styles.TopicParagraph}>
              conquer your insecurities and evaluate your discussion skills in
              no time!
            </p>
          </div>
          <div className={styles.Count}>
            <div className={styles.UserCount}>
              <RiUserVoiceFill size={100} className={styles.icon}/>
              <p className={styles.UserCountParagraph}>
                50+ million active users
              </p>
            </div>
            <div className={styles.GroupCount}>
              <GiDiscussion size={110} className={styles.icon2} />
              <p className={styles.UserCountParagraph}>
                1+ million active groups
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.SecondPage}>
        <div className={styles.SecondPageColumns}>
          <div className={styles.Features}>
            <CgProfile size={90} />
            <h2 className={styles.TopicParagraph}>Profile</h2>
            <p className={styles.FeaturesParagraphs}>
              make your own profile and filter the groups based on your profile
              info.
            </p>
          </div>

          <div className={styles.Features}>
            <MdGroups size={90} />
            <h2 className={styles.TopicParagraph}>Groups</h2>
            <p className={styles.FeaturesParagraphs}>
              join the groups that match your circumestanses the best.
            </p>
          </div>
        </div>

        <div className={styles.SecondPageColumns}>
          <div className={styles.Features}>
            <BsFillChatLeftTextFill size={90} />
            <h2 className={styles.TopicParagraph}>Chat</h2>
            <p className={styles.FeaturesParagraphs}>
              use the group chat to get to know each member and learn from each
              other.
            </p>
          </div>
          <div className={styles.Features}>
            <BiHappyHeartEyes size={90} />
            <h2 className={styles.TopicParagraph}>Share Experience</h2>
            <p className={styles.FeaturesParagraphs}>
              share your experience with your friends and let them have the same
              experience as you!
            </p>
          </div>
        </div>
      </div>

      <div className={styles.ThirdPage}>
        <div className={styles.Image2}>
          <img className={styles.img} src={PhoneImage2}></img>
        </div>

        <div className={styles.BigParagraphDiv2}>
          <h2 className={styles.TopicHeader2}>
            All you need to select the perfect group
          </h2>
          <p className={styles.FeaturesParagraphs2}>
            you can choose the days you are most free to attend free discussion.
          </p>
          <p className={styles.FeaturesParagraphs2}>
            you are also able to choose the group that matches your level.
          </p>
          <p className={styles.FeaturesParagraphs2}>
            also you can have your free discussion in person or online based on
            your preferation.
          </p>
        </div>
      </div>

      <div className={styles.FourthPage}>
        <div className={styles.BigParagraphDiv2}>
          <h2 className={styles.TopicHeader2}>
            Explore through groups available
          </h2>
          <p className={styles.FeaturesParagraphs2}>
            you can join multiple groups at the same time so if one group wasn’t
            available the other one is.
          </p>
          <p className={styles.FeaturesParagraphs2}>
            there are many groups suggested based on your free time and your
            speaking level which can help you to choose alot easier.
          </p>
          <p className={styles.FeaturesParagraphs2}>
            and also you can make your own group and tell your friends to join.
          </p>
        </div>

        <div className={styles.Image2}>
          <img className={styles.img} src={PhoneImage}></img>
        </div>
      </div>
      <Footer />

    </div>
    </>
  );
};

export default LandingPage;
