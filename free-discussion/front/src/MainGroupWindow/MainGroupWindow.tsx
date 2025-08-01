import styles from "./MainGroupWindow.module.scss";
import GroupMembers from "../GroupMembers/GroupMembers";
import GroupProfile from "../GroupProfile/GroupProfile";
import Header from "../Header/Header";
import LiveChat from "../LiveChat/LiveChat";

function MainGroupWindow() {
  return (
    <>
      <Header />
      <div className={styles.wholePage}>
        
          
          <div style={{ marginRight: "-6px", marginTop: "-30px" }}>
            <GroupProfile />
          </div>
          <div className={styles.Groupmember}>
            <GroupMembers></GroupMembers>
          </div>
          <div className={styles.liveChat}>
          <LiveChat />
        </div>
        
      </div>
    </>
  );
}

export default MainGroupWindow;
