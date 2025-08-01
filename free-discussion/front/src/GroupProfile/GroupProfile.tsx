import React, { useEffect, useState } from "react";
import styles from "./GroupProfile.module.scss";
import apiClient from "../services/api-client";
import locationService from "../services/location-service";
import userService from "../services/user-service";
import { useParams } from "react-router-dom";
import {  IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Popup from "reactjs-popup";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from 'react-router-dom';


interface GroupProp {
  title: string;
  description: string;
  image:string;
  level: string;
  neighborhood: string;
  meeting_url: URL|null;
  owner_username: string;
  
}

interface LocationProps {
  neighborhoods: string;
}


function GroupProfile() {
  const{Title}=useParams();
  const navigate = useNavigate();
  //console.log(Title);
  
  const [Locations, setLocations] = useState<LocationProps[]>([]);

  const [Grouplocation, setGrouplocation] = useState<string>("");
  const [Notice, setnotice] = useState<string>("");
  const [Link, setLink] = useState<URL|undefined>();

  const [ProfileUrl, setProfileUrl] = useState("");
  const [ProfileFile, setProfileFile] = useState<File | null>(null);

  const [buttonText, SetButtonText] = useState("Edit Group Profile");
  const [Disable, SetDisable] = useState(true);
  const [group, setGroup] = useState<GroupProp | null>(null);
  const [level, setLevel] = useState("");
  const[Rerender,setRerender]=useState(false);

  const[ownerusername,SetOwnerusername]=useState("a");
  const[localusername,setLocalusername]=useState('b');
  const[hidden,Sethidden]=useState(true);
  const[profilePopupOpen,setprofilePopupOpen]=useState(false);
  


// Add these states at the top of the `GroupProfile` component
  const [timeSlots, setTimeSlots] = useState<{ id: number; day_of_week: string; start_time: number; end_time: number }[]>([]);
  const [newTimeSlot, setNewTimeSlot] = useState<{ day_of_week: string; start_time: number; end_time: number }>({
    day_of_week: "",
    start_time: 0,
    end_time: 0,
  });
  const [timeSlotPopupOpen, setTimeSlotPopupOpen] = useState(false);
  const [noticePopupOpen, setNoticePopupOpen] = useState<boolean>(false);
  const [noticeContent, setNoticeContent] = useState<string>("");


  const token = localStorage.getItem("token") || "";

// Fetch time slots from the API
const fetchTimeSlots = () => {
  apiClient
    .get(`/scheduling/group-time-slots/${Title}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setTimeSlots(res.data);
    })
    .catch((error) => {
      console.error("Error fetching time slots:", error.message);
      if (error.response) {
        const statusCode = error.response.status;
        // Navigate to the appropriate error page based on status code
        switch (statusCode) {
          case 400:
            navigate("/Error400");
            break;
          case 401:
            navigate("/Error401");
            break;
          case 403:
            navigate("/Error403");
            break;
          case 404:
            navigate("/Error404");
            break;
          case 500:
            navigate("/Error500");
            break;
          default:
            // For other status codes, navigate to a generic error page or show a message
            navigate("/Error500");
            break;
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response received from the server.', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error(`An unexpected error occurred: ${error.message}`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      };

    });
};

// Add a new time slot via API
const addTimeSlot = () => {
  if (!newTimeSlot.day_of_week || newTimeSlot.start_time >= newTimeSlot.end_time) {
    alert("Please provide valid time slot details.");
    return;
  }

  apiClient
    .post(
      `/scheduling/group-time-slots/${Title}/create/`,
      newTimeSlot,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      setTimeSlots((prev) => [...prev, res.data]); // Add the new time slot to the state
      setNewTimeSlot({ day_of_week: "", start_time: 0, end_time: 0 }); // Reset input fields
      toast.success("Time added successfully", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    })
    .catch((error) => {
      console.log(error.response?.data);
      if (error.response) {
        const statusCode = error.response.status;
        // Navigate to the appropriate error page based on status code
        switch (statusCode) {
          case 400:
            navigate("/Error400");
            break;
          case 401:
            navigate("/Error401");
            break;
          case 403:
            navigate("/Error403");
            break;
          case 404:
            navigate("/Error404");
            break;
          case 500:
            navigate("/Error500");
            break;
          default:
            // For other status codes, navigate to a generic error page or show a message
            navigate("/Error500");
            break;
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response received from the server.', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error(`An unexpected error occurred: ${error.message}`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      };
    });
};

// Delete a time slot via API
const deleteTimeSlot = (id: number) => {
  apiClient
    .delete(`/scheduling/group-time-slots/${Title}/${id}/delete/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      setTimeSlots((prev) => prev.filter((slot) => slot.id !== id)); // Remove the deleted time slot
      toast.success("Time deleted successfully", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    })
    .catch((error) => {
      console.error("Error deleting time slot:", error.message);
      if (error.response) {
        const statusCode = error.response.status;
        // Navigate to the appropriate error page based on status code
        switch (statusCode) {
          case 400:
            navigate("/Error400");
            break;
          case 401:
            navigate("/Error401");
            break;
          case 403:
            navigate("/Error403");
            break;
          case 404:
            navigate("/Error404");
            break;
          case 500:
            navigate("/Error500");
            break;
          default:
            // For other status codes, navigate to a generic error page or show a message
            navigate("/Error500");
            break;
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response received from the server.', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error(`An unexpected error occurred: ${error.message}`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      };
    });
};

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
      GetGroupInfo();
      setNoticePopupOpen(false);
      SetDisable(true);
      SetButtonText("Edit Group Profile");
      
    })
    .catch((error) => {
      console.log(error.response?.data?.detail);
      if (error.response) {
        const statusCode = error.response.status;
        // Navigate to the appropriate error page based on status code
        switch (statusCode) {
          case 400:
            navigate("/Error400");
            break;
          case 401:
            navigate("/Error401");
            break;
          case 403:
            navigate("/Error403");
            break;
          case 404:
            navigate("/Error404");
            break;
          case 500:
            navigate("/Error500");
            break;
          default:
            // For other status codes, navigate to a generic error page or show a message
            navigate("/Error500");
            break;
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response received from the server.', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error(`An unexpected error occurred: ${error.message}`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      };
    });
};

    const HandelChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setProfileFile(file);
        setProfileUrl(URL.createObjectURL(file));
      }
    };

  const HandelUploadImage=()=>{
      if(!ProfileFile)
      {
          console.log("Please select an image before uploading.")
          return;
      }
      const userToken=localStorage.getItem("token")??"";
      const formData=new FormData()
      formData.append("image", ProfileFile);
      formData.append("level",level)      
      apiClient
        .patch(`/groups/${Title}/update/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
          },
        })
      .then(res=>{
          setGroup((prevGroup) =>
              prevGroup
                  ? {
                      ...prevGroup,
                      image:res.data.image,

                  }
                  : null
              );
              setProfileUrl(res.data.image)
              setProfileFile(null);
              setRerender(prev=>!prev);
            })
            .catch((error) => {
              if (error.response) {
                const statusCode = error.response.status;
                // Navigate to the appropriate error page based on status code
                switch (statusCode) {
                  case 400:
                    navigate("/Error400");
                    break;
                  case 401:
                    navigate("/Error401");
                    break;
                  case 403:
                    navigate("/Error403");
                    break;
                  case 404:
                    navigate("/Error404");
                    break;
                  case 500:
                    navigate("/Error500");
                    break;
                  default:
                    // For other status codes, navigate to a generic error page or show a message
                    navigate("/Error500");
                    break;
                }
              } else if (error.request) {
                // The request was made but no response was received
                toast.error('No response received from the server.', {
                  position: "top-center",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              } else {
                // Something happened in setting up the request that triggered an Error
                toast.error(`An unexpected error occurred: ${error.message}`, {
                  position: "top-center",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              };
              });
  }

  const GetGroupInfo = () => {
    apiClient
      .get<GroupProp>(`/groups/${Title}/`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setGroup(res.data);
        setGrouplocation(res.data.neighborhood || "");
        setLink(res.data.meeting_url ? new URL(res.data.meeting_url) : undefined);
        setnotice(res.data.description || "");
        setLevel(res.data.level || "");
        setProfileUrl(res.data.image);
        SetOwnerusername(res.data.owner_username);
  
       
      })
      .catch((error) => {
        if (error.response) {
          const statusCode = error.response.status;
          // Navigate to the appropriate error page based on status code
          switch (statusCode) {
            case 400:
              navigate("/Error400");
              break;
            case 401:
              navigate("/Error401");
              break;
            case 403:
              navigate("/Error403");
              break;
            case 404:
              navigate("/Error404");
              break;
            case 500:
              navigate("/Error500");
              break;
            default:
              // For other status codes, navigate to a generic error page or show a message
              navigate("/Error500");
              break;
          }
        } else if (error.request) {
          // The request was made but no response was received
          toast.error('No response received from the server.', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          // Something happened in setting up the request that triggered an Error
          toast.error(`An unexpected error occurred: ${error.message}`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        };
      });
  };

  const GetUserInfo = () => {
    userService
      .UserProfileInfo(localStorage.getItem("token") ?? "")
      .then((res) => {
        setLocalusername(res.data.username);
  

      })
      .catch((error) => {
        if (error.response) {
          const statusCode = error.response.status;
          // Navigate to the appropriate error page based on status code
          switch (statusCode) {
            case 400:
              navigate("/Error400");
              break;
            case 401:
              navigate("/Error401");
              break;
            case 403:
              navigate("/Error403");
              break;
            case 404:
              navigate("/Error404");
              break;
            case 500:
              navigate("/Error500");
              break;
            default:
              // For other status codes, navigate to a generic error page or show a message
              navigate("/Error500");
              break;
          }
        } else if (error.request) {
          // The request was made but no response was received
          toast.error('No response received from the server.', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          // Something happened in setting up the request that triggered an Error
          toast.error(`An unexpected error occurred: ${error.message}`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        };
      });
  };
  
    
  
  

  useEffect(() => {
    if (localusername === ownerusername) {
       Sethidden(false)
    }
    GetUserInfo();
    GetGroupInfo();
    locationService
      .Getneighborhoods()
      .then((res) => setLocations(res.data))
      .catch((error) => {
        if (error.response) {
          const statusCode = error.response.status;
          // Navigate to the appropriate error page based on status code
          switch (statusCode) {
            case 400:
              navigate("/Error400");
              break;
            case 401:
              navigate("/Error401");
              break;
            case 403:
              navigate("/Error403");
              break;
            case 404:
              navigate("/Error404");
              break;
            case 500:
              navigate("/Error500");
              break;
            default:
              // For other status codes, navigate to a generic error page or show a message
              navigate("/Error500");
              break;
          }
        } else if (error.request) {
          // The request was made but no response was received
          toast.error('No response received from the server.', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          // Something happened in setting up the request that triggered an Error
          toast.error(`An unexpected error occurred: ${error.message}`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        };
      });
  
    fetchTimeSlots(); // Fetch time slots when the component loads
  }, [Rerender, localusername, ownerusername]);
  

  const UpdateGroup = (newlocation: string,newlevel: string,newDescription: string,newLink:URL|undefined) => 
    {
    const Updated = {
      //title: newtitle,
      description: newDescription || Notice,
      level: newlevel || level,
      neighborhood: newlocation || Grouplocation,
      meeting_url: newLink?.toString() || null,
    };
    apiClient
      .patch(`/groups/${Title}/update/`, Updated, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        //console.log(res.data)
        setGroup((prevGroup) =>
          prevGroup
            ? {
                ...prevGroup,
                //title: res.data.title,
                level: res.data.level,
                description: res.data.description,
                image:res.data.image,
                neighborhood: res.data.neighborhood,
                meeting_url: res.data.meeting_url,
              }
            : null
        );
        setRerender(prev=>!prev);
        setGrouplocation(res.data.neighborhood);
        //setGrouptitle(res.data.title);
        setLevel(res.data.level);
        setLink(res.data.meeting_url ? new URL(res.data.meeting_url) : undefined);
        setnotice(res.data.description);
        SetDisable(true);
        SetButtonText("Edit Group Profile");
        console.log(res.data);
      })
      .catch((error) => {
    if (error.response) {
              const statusCode = error.response.status;
              // Navigate to the appropriate error page based on status code
              switch (statusCode) {
                case 400:
                  navigate("/Error400");
                  break;
                case 401:
                  navigate("/Error401");
                  break;
                case 403:
                  navigate("/Error403");
                  break;
                case 404:
                  navigate("/Error404");
                  break;
                case 500:
                  navigate("/Error500");
                  break;
                default:
                  // For other status codes, navigate to a generic error page or show a message
                  navigate("/Error500");
                  break;
              }
            } else if (error.request) {
              // The request was made but no response was received
              toast.error('No response received from the server.', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            } else {
              // Something happened in setting up the request that triggered an Error
              toast.error(`An unexpected error occurred: ${error.message}`, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            };
      });
  };

  return (
    <div>
        <div className={styles.profileCard} style={hidden?{height:"auto"}:{height:"auto"}}>
        <div>
        <ToastContainer position="top-center" newestOnTop={true}  role="alert" limit={1}/>
              
              <IconButton hidden={hidden}  onClick={()=>setprofilePopupOpen(true)} style={{position:"absolute",backgroundColor:"white",maxWidth:"40px",width:"9%",marginLeft:"12px ",height:"1%",border: "1px solid #b92d2c",borderRadius:"100px",marginTop:"-3px"}} aria-label="delete" size="large" >
                  <DeleteIcon style={{color:"#b92d2c"}} />
              </IconButton>
              <Popup contentStyle={{position:"absolute",top:"10%",marginLeft:"1220px",width:"300px"}} open={profilePopupOpen} onClose={()=>setprofilePopupOpen(false)} >
                <button  type="button" style={{lineHeight:"45px",marginLeft:"260px",display:"flex" }}  className="btn-close" aria-label="Close" onClick={() =>{ setprofilePopupOpen(false)}}></button>
                <h1 style={{fontSize:"16px",alignItems:"flex-start",lineHeight:"21px"}}>Are you sure you want to delete your profile image?</h1>
                <div style={{justifyContent:"space-evenly",display:"flex"}}>
                      <button className={styles.button2} onClick={()=>{setProfileFile(null);setProfileUrl("");
                      const userToken=localStorage.getItem("token")??"";
                      setprofilePopupOpen(false);
                      const formData=new FormData();
                      formData.append("image", "");
                      formData.append("level",level);     
                      apiClient
                        .patch(`/groups/${Title}/update/`, formData, {
                          headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${userToken}`,
                          },
                        })
                      .then(res=>{
                          setGroup((prevGroup) =>
                              prevGroup
                                  ? {
                                      ...prevGroup,
                                      image:res.data.image,
                
                                  }
                                  : null
                              );
                              setProfileUrl(res.data.image)
                              setProfileFile(null);
                              setRerender(prev=>!prev);
                            })
                            .catch((error) => {
                              if (error.response) {
                                const statusCode = error.response.status;
                                // Navigate to the appropriate error page based on status code
                                switch (statusCode) {
                                  case 400:
                                    navigate("/Error400");
                                    break;
                                  case 401:
                                    navigate("/Error401");
                                    break;
                                  case 403:
                                    navigate("/Error403");
                                    break;
                                  case 404:
                                    navigate("/Error404");
                                    break;
                                  case 500:
                                    navigate("/Error500");
                                    break;
                                  default:
                                    // For other status codes, navigate to a generic error page or show a message
                                    navigate("/Error500");
                                    break;
                                }
                              } else if (error.request) {
                                // The request was made but no response was received
                                toast.error('No response received from the server.', {
                                  position: "top-center",
                                  autoClose: 2000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                  theme: "light",
                                });
                              } else {
                                // Something happened in setting up the request that triggered an Error
                                toast.error(`An unexpected error occurred: ${error.message}`, {
                                  position: "top-center",
                                  autoClose: 2000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                  theme: "light",
                                });
                              };
                              });
                              }}
                        style={{alignItems:"flex-start",width:"140px",height:"40px"}}>Yes</button>
                      <button className={styles.button1} onClick={()=>setprofilePopupOpen(false)} style={{alignItems:"flex-end",width:"140px",height:"40px",fontWeight:"normal"}}>No</button>
                </div>
              </Popup>
                <img className={styles.Profile} src={ProfileUrl || group?.image} />
          </div>
          <div style={{ height: "8px" }}></div>
          <div>
            <label hidden={hidden}  style={{cursor:"pointer"}} htmlFor="fileInput" className="custom-file-upload" >Change Profile Image</label>
            <input type="file" id="fileInput" accept="image/*" style={{ display: "none" }} onChange={HandelChangeImage} />
            <div style={{ height: "12px" }} />
            <div>
              <button hidden={hidden}  onClick={HandelUploadImage}
                style={{borderRadius: "15px",fontWeight: "bold",width:"50%",fontSize:"1rem"}}
                className={styles.btn}
              >
                Upload
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="name" >Group name</label>
            <input id="name" value={Title} className={styles.input}  disabled={true}/>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="Notice">Notice Board</label>
            <button
              className={styles.btn}
              style={{borderRadius: "15px",fontWeight: "bold",width:"50%",fontSize:"1rem",marginTop:"2px"}}
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

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="Group-level">Group Level</label>
              <select
                id="Group-level"
                value={level}
                className={styles.input}
                onChange={(e) => setLevel(e.target.value)}
                disabled={Disable}
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>

          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="location"> Location</label>
            <select id="location" value={Grouplocation||""} className={styles.input} onChange={(e) => setGrouplocation(e.target.value)} disabled={Disable}>
              <option key={-10} value={""}></option>
              {Locations.map((loc,index) => (
                <option key={index} value={loc.neighborhoods}>
                  {Object.values(loc)}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="meet">Meet link</label>
            <input type="text" id="meet" value={Link?.toString()||""} onChange={(e)=>setLink(e.target.value ? new URL(e.target.value) : undefined)} className={styles.input} disabled={Disable} />
          </div>
          
          <Popup
  open={timeSlotPopupOpen}
  onClose={() => setTimeSlotPopupOpen(false)}
  contentStyle={{
    width: "400px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    backgroundColor: "#fff",
  }}
>
  <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Manage Time Slots</h2>
  {timeSlots.length > 0 ? (
    <div style={{ marginBottom: "20px" }}>
      {timeSlots.map((slot) => (
        <div
          key={slot.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
            padding: "10px",
            background: "#f9f9f9",
            borderRadius: "5px",
          }}
        >
          <span>
            {slot.day_of_week}: {slot.start_time} - {slot.end_time}
          </span>
          {!hidden && (
                <button className={styles.btn}
                hidden={hidden}
            onClick={() => deleteTimeSlot(slot.id)}
            style={{
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p>No time slots added yet.</p>
  )}
  <div hidden={hidden}> 
    <label style={{ display: "block", marginBottom: "5px" }}>Day of Week:</label>
    <select
      value={newTimeSlot.day_of_week}
      onChange={(e) =>
        setNewTimeSlot((prev) => ({ ...prev, day_of_week: e.target.value }))
      }
      style={{
        display: "block",
        width: "100%",
        padding: "8px",
        marginBottom: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
      }}
    >
      <option value="">Select a Day</option>
      <option value="Monday">Monday</option>
      <option value="Tuesday">Tuesday</option>
      <option value="Wednesday">Wednesday</option>
      <option value="Thursday">Thursday</option>
      <option value="Friday">Friday</option>
      <option value="Saturday">Saturday</option>
      <option value="Sunday">Sunday</option>
    </select>

    <label style={{ display: "block", marginBottom: "5px" }}>Start Time:</label>
    <input
      type="number"
      value={newTimeSlot.start_time || ""}
      onChange={(e) =>
        setNewTimeSlot((prev) => ({
          ...prev,
          start_time: parseInt(e.target.value, 10) || 0,
        }))
      }
      placeholder="Start time (e.g., 2)"
      style={{
        display: "block",
        width: "100%",
        padding: "8px",
        marginBottom: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
      }}
    />

    <label style={{ display: "block", marginBottom: "5px" }}>End Time:</label>
    <input
      type="number"
      value={newTimeSlot.end_time || ""}
      onChange={(e) =>
        setNewTimeSlot((prev) => ({
          ...prev,
          end_time: parseInt(e.target.value, 10) || 0,
        }))
      }
      placeholder="End time (e.g., 5)"
      style={{
        display: "block",
        width: "100%",
        padding: "8px",
        marginBottom: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
      }}
    />

    {!hidden && (
        <button className={styles.btn}
        hidden={hidden}
        onClick={addTimeSlot}
      style={{
        background: "#007BFF",
        color: "white",
        border: "none",
        borderRadius: "5px",
        padding: "10px 15px",
        cursor: "pointer",
        width: "100%",
        marginBottom: "10px",
      }}
    >
      Add Time Slot
    </button>)}
  </div>
    
  <button
    onClick={() => setTimeSlotPopupOpen(false)}
    style={{
      background: "#6c757d",
      color: "white",
      border: "none",
      borderRadius: "5px",
      padding: "10px 15px",
      cursor: "pointer",
      width: "100%",
    }}
  >
    Close
  </button>
</Popup>

          <button

            hidden={hidden} 
            style={{borderRadius: "15px", marginTop: "12px",fontWeight: "bold",width: "150px",}}
            
            className={styles.btn}
            onClick={() => {
              if (buttonText == "Save Changes") {
                UpdateGroup(Grouplocation, level, Notice,Link);
              }
              SetDisable((prev) => !prev);
              SetButtonText(
                buttonText === "Edit Group Profile"
                  ? "Save Changes"
                  : "Edit Group Profile"
              );
            }}
          >
            {buttonText}
          </button>
          <button
          style={{borderRadius: "15px",marginTop: "12px",fontWeight: "bold",width:"50%",fontSize:"1rem"}}
          className={styles.btn}
            onClick={() => {setTimeSlotPopupOpen(true);fetchTimeSlots(); }}
          >
            Manage Time Slots
          </button>
        </div>
    </div>
  );
}

export default GroupProfile;
