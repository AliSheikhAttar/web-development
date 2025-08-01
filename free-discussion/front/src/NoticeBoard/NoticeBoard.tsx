import React, { useEffect, useState } from "react";
import styles from "./NoticeBoard.module.scss";
import apiClient from "../services/api-client";
import userService from "../services/user-service";
import { useParams } from "react-router-dom";
import Popup from "reactjs-popup";
import { toast, ToastContainer } from "react-toastify";


interface GroupProp {
  title: string;
  description: string;
  image:string;
  level: string;
  neighborhood: string;
  meeting_url: URL|null;
  owner_username: string;
  
}

function NoticeBoard() {
  const{Title}=useParams();
  //console.log(Title);
  

  const [Notice, setnotice] = useState<string>("");
  const [Disable, SetDisable] = useState(true);
  const [group, setGroup] = useState<GroupProp | null>(null);
  const[Rerender,setRerender]=useState(false);

  const[ownerusername,SetOwnerusername]=useState("a");
  const[localusername,setLocalusername]=useState('b');
  const[hidden,Sethidden]=useState(true)

  const [noticePopupOpen, setNoticePopupOpen] = useState<boolean>(false);
  const [noticeContent, setNoticeContent] = useState<string>("");

  const GetNotice = () => {
    apiClient
    .get<GroupProp>(`/groups/${Title}/`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      setnotice(res.data.description || "");
      SetOwnerusername(res.data.owner_username);

    })
    .catch((err) => {
      console.log(err.message);
    });
  }

const UpdateNotice = (newNoticeContent: string) => {
  // Prepare the updated data
  const updatedData = {
    description: newNoticeContent,
  };

  apiClient
    .patch(`/groups/${Title}/update/`, updatedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      setnotice(res.data.description);
      setGroup((prevGroup) =>
        prevGroup ? { ...prevGroup, description: res.data.description } : null
      );
      GetNotice();
      setNoticePopupOpen(false);
      SetDisable(true);
      
    })
    .catch((err) => {
      console.log(err.response?.data?.detail);
      toast.error(err.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
};


  const GetUserInfo = () => {
    userService
      .UserProfileInfo(localStorage.getItem("token") ?? "")
      .then((res) => {
        setLocalusername(res.data.username);
  

      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  
    
  
  

  useEffect(() => {
    if (localusername === ownerusername) {
       Sethidden(false)
    }
    GetUserInfo();
    GetNotice();
  
  }, [Rerender, localusername, ownerusername]);
  

 
  return (
    <div>
      <div className={styles.Font}>
        {/* <div className={styles.profileCard} style={hidden?{height:"650px"}:{height:"760px"}}>
          <div className={styles.formGroup}> */}
          <button
              className={styles.btn}
              style={{borderRadius: "15px", marginTop: "2px",fontWeight: "bold",width: "100px",}}
              onClick={() => {
                setNoticeContent(Notice);
                setNoticePopupOpen(true);
              }}
            >
              View Notice
            </button>
          </div>
          <Popup
          open={noticePopupOpen}
          onClose={() => setNoticePopupOpen(false)}
          contentStyle={{
            width: "400px",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            backgroundColor: "#fff",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "15px", fontWeight: "bold" }}>
              Notice Board
            </h2>
            {!hidden ? (
              <textarea
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                style={{
                  width: "100%",
                  height: "150px",
                  marginBottom: "15px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "10px",
                  fontSize: "14px",
                  resize: "none",
                }}
              />
            ) : (
              <p
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  maxHeight: "150px",
                  overflowY: "auto",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {noticeContent}
              </p>
            )}

            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              {!hidden && (
                <button className={styles.btn}
                hidden={hidden}
                  onClick={() => {
                    UpdateNotice(noticeContent);
                  }}
                  style={{borderRadius: "15px", marginTop: "12px",fontWeight: "bold",width: "130px",}}
                >
                  Save Changes
                </button>
              )}
              <button className={styles.btn}
                onClick={() => setNoticePopupOpen(false)}
                style={{borderRadius: "15px", marginTop: "12px",fontWeight: "bold",width: "80px",}}
              >
                Close
              </button>
            </div>


          </div>
        </Popup>
        </div>
    //   </div>
    // </div>
  );
}

export default NoticeBoard;
