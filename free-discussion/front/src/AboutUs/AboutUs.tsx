import Pic from "./Pic2.jpg";
import styles from "./AboutUs.module.scss";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

interface AboutUsProp {
  Heading: string;
}

let Txt =
  "Welcome to [AppName], a free discussion platform dedicated to helping Iranians learn and practice English in a supportive community. Our goal is to make language learning accessible and enjoyable for everyone, considering their background and level. Here, you can connect with fellow learners, engage in lively discussions, and receive guidance from experienced English speakers. We believe that conversation is the key to fluency, and our platform offers a safe space to build confidence in speaking and comprehension. Join us on this journey to improve your language skills and make new friends along the way!";

function AboutUs(props: AboutUsProp) {
  return (
    <>
    <Header />
    <div className={styles.Font}>
      <div className={styles.TextImage}>
        <img className={styles.img} src={Pic}></img>

        <div className={styles.GeneralTxt}>
          <p className={styles.Topic}>{props.Heading}</p>
          <div className={styles.Body}>{Txt}</div>
        </div>
      </div>

      <div className={styles.Topic2}>
        <p>Why [App Name]?</p>
      </div>

      <div className={styles.item__row}>
        <div className={styles.WhyUsContents}>
          <h1 className={styles.WhyUsTopics}>Simple</h1>
          <p className={styles.WhyUsParagraphs}>
            [App Name] is so user-friendly and you already know How to use it
          </p>
        </div>
        <div className={styles.WhyUsContents}>
          <h1 className={styles.WhyUsTopics}>Real Conversations, Real Progress</h1>
          <p className={styles.WhyUsParagraphs}>
            Your discussion topics can cover everything from daily life to global issues, helping you learn vocabulary and expressions that matter.
          </p>
        </div>

        <div className={styles.WhyUsContents}>
          <h1 className={styles.WhyUsTopics}>Free and Accessible</h1>
          <p className={styles.WhyUsParagraphs}>
            Our app is 100% free to use, with no hidden fees or premium tiers,
            making it accessible to everyone, anytime, anywhere.
          </p>
        </div>
      </div>
      <div className={styles.item__row}>
        <div className={styles.WhyUsContents}>
          <h1 className={styles.WhyUsTopics}>Safe and Secure Environment</h1>
          <p className={styles.WhyUsParagraphs}>
          At [App Name], your safety is our priority. We’re committed to creating a respectful and secure space where everyone can feel comfortable learning and practicing English. 
          </p>
        </div>

        <div className={styles.WhyUsContents}>
          <h1 className={styles.WhyUsTopics}>Supportive Community</h1>
          <p className={styles.WhyUsParagraphs}>
          our app fosters a positive, encouraging environment. Our community is full of learners like you who are eager to connect, share ideas, and learn together.
          You’ll find a safe space where mistakes are seen as stepping stones to success.
          </p>
        </div>

        <div className={styles.WhyUsContents}>
          <h1 className={styles.WhyUsTopics}>Flexible Learning Options</h1>
          <p className={styles.WhyUsParagraphs}>
            Join group discussions, one-on-one exchanges, or guided events.our app offers 
            multiple ways to practice at your comfort level and at your own pace. With [App Name], you’re in control of your learning journey.
          </p>
        </div>
      </div>

    </div>
    <Footer />

    </>
  );
}

export default AboutUs;
