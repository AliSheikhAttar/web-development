import { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import userService from "../services/user-service";
import locationService from "../services/location-service";
import apiClient from "../services/api-client";
import Popup from "reactjs-popup";
import {  IconButton } from "@mui/material";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';


interface UserProp {
  username: string;
  email: string;
  neighborhood: string;
  level: string;
  date_joined: string;
  city: string;
  profile_image: string;
}

interface LocationProps {
  neighborhoods: string;
}



function Profile() {



    const [locations, setLocations] = useState<LocationProps[]>([]);
    const [user, SetUser] = useState<UserProp | null>(null);
    const [BtnText, setBtnText] = useState("Edit Your Profile");
    const [Disable, SetDisable] = useState(true);

    const [UserenglishLevel, setUserEnglishLevel] = useState("");
    const [UserLocation, setUserLocation] = useState("");

    const [userimageUrl, setUserimageUrl] = useState("");
    const [userimagefile, setUserimagefile] = useState<File | null>(null);
    const[Showpass,SetShowpass]=useState(false);
    const[ShowNewPass,SetShowNewPass]=useState(false);
    const[ShowConfirmpass,SetShowConfirmpass]=useState(false);

    const[PassPopupOpen,SetPassPopupOpen]=useState(false)

    const[Pass,SetPass]=useState("");
    const[NewPass,SetNewpass]=useState("");
    const[ConfirmPass,SetConfirmPass]=useState("");    
    const[profilePopupOpen,setprofilePopupOpen]=useState(false)
    const[render,Setrender]=useState(false);
    const navigate = useNavigate();

// Add these states at the top of the `GroupProfile` component
  const [timeSlots, setTimeSlots] = useState<{ id: number; day_of_week: string; start_time: number; end_time: number }[]>([]);
  const [newTimeSlot, setNewTimeSlot] = useState<{ day_of_week: string; start_time: number; end_time: number }>({
    day_of_week: "",
    start_time: 0,
    end_time: 0,
  });
  const [timeSlotPopupOpen, setTimeSlotPopupOpen] = useState(false);
  


  const token = localStorage.getItem("token") || "";

// Fetch time slots from the API
const fetchTimeSlots = () => {
  apiClient
    .get(`/scheduling/user-time-slots/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setTimeSlots(res.data);
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

// Add a new time slot via API
const addTimeSlot = () => {
  if (!newTimeSlot.day_of_week || newTimeSlot.start_time >= newTimeSlot.end_time) {
    alert("Please provide valid time slot details.");
    return;
  }

  apiClient
    .post(
      `/scheduling/user-time-slots/create/`,
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
        toast.error(error.response?.data, {
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
    .delete(`/scheduling/user-time-slots/${id}/delete/`, {
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
    .catch((error) => {     if (error.response) {
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
      toast.error(error.response?.data, {
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


  
    const HandelImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setUserimagefile(file);
        setUserimageUrl(URL.createObjectURL(file)); 
      }
    };
  
    const HandelImageUpload = () => {
      if (!userimagefile) {
        console.log("Please select an image before uploading.");
        return;
      }
  
      const userToken = localStorage.getItem("token") ?? "";
      const formData = new FormData();
      formData.append("profile_image", userimagefile);
      formData.append("userToken", userToken);
  
      apiClient
        .patch("/authentication/users/update/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          SetUser((prevUser) =>
            prevUser
              ? {
                  ...prevUser,
                  profile_image: res.data.profile_image,
                }
              : null
          );
          setUserimageUrl(res.data.profile_image); 
          setUserimagefile(null);
          Setrender(prev=>!prev)
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
            //console.log(res.data)
            SetUser(res.data);
            setUserEnglishLevel(res.data.level);
            setUserLocation(res.data.neighborhood);
            setUserimageUrl(res.data.profile_image);
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
        GetUserInfo();
        fetchTimeSlots();
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
    
    }, [render]);  
  
    const UpdateUser = (newLoc: string, Englevel: string, userToken: string) => {
        const UpdatedUser = {
        neighborhood: newLoc,
        level: Englevel,
        };
        apiClient
        .patch("/authentication/users/update/", UpdatedUser, {
            headers: {
            Authorization: `Bearer ${userToken}`,
            },
        })
        .then((res) => {
            //console.log(res.data)
            SetUser((prevUser) =>
            prevUser
                ? {
                    ...prevUser,
                    neighborhood: res.data.neighborhood,
                    level: res.data.level,
                    profile_image: res.data.profile_image,
                }
                : null
            );
            setUserEnglishLevel(res.data.level);
            setUserLocation(res.data.neighborhood);

            SetDisable(true);
            setBtnText("Edit Your Profile");
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
      <>
          <div className={styles.profileCard}>
          <IconButton onClick={()=>setprofilePopupOpen(true)} style={{position:"absolute",backgroundColor:"white",maxWidth:"40px",width:"9%",marginLeft:"12px ",height:"1%",border: "1px solid #b92d2c",borderRadius:"100px",marginTop:"-3px"}} aria-label="delete" size="large" >
                  <DeleteIcon style={{color:"#b92d2c"}} />
              </IconButton>
              <Popup contentStyle={{position:"absolute",top:"10%",marginLeft:"1220px",width:"300px"}} open={profilePopupOpen} onClose={()=>setprofilePopupOpen(false)} >
                <button type="button" style={{lineHeight:"45px",marginLeft:"260px",display:"flex" }}  className="btn-close" aria-label="Close" onClick={() =>{ setprofilePopupOpen(false)}}></button>
                <h1 style={{fontSize:"16px",alignItems:"flex-start",lineHeight:"21px"}}>Are you sure you want to delete your profile image?</h1>
                <div style={{justifyContent:"space-evenly",display:"flex"}}>
                      <button className={styles.button2} onClick={()=>{setUserimagefile(null);setUserimageUrl("");
                      const userToken=localStorage.getItem("token")??"";
                      setprofilePopupOpen(false);
                      const formData=new FormData();
                      formData.append("profile_image", "");
                      apiClient
                        .patch("/authentication/users/update/", formData, {
                          headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${userToken}`,
                          },
                        })
                      .then(res=>{
                          SetUser((prevuser) =>
                              prevuser
                                  ? {
                                      ...prevuser,
                                      profile_image:res.data.profile_image,
                
                                  }
                                  : null
                              );
                              setUserimageUrl(res.data.profile_image)
                              setUserimagefile(null);
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
              <img className={styles.Profile} src={userimageUrl || user?.profile_image} />
              <div style={{height:"8px"}}></div>
              <div>
              <label htmlFor="fileInput" style={{cursor:"pointer"}}  className="custom-file-upload">Change Profile Image</label>
              <input type="file" id="fileInput" accept="image/*" style={{ display: "none"}} onChange={HandelImageChange}/>
              <div style={{height:"12px"}}/>
                  <div>
                      <button onClick={HandelImageUpload} style={{borderRadius: "15px",fontWeight: "bold",width:"50%",fontSize:"1rem"}} className={styles.btn}>Upload</button>
                  </div>
              
              </div>

          <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">Email</label>
              <input type="email" id="email" value={user?.email} readOnly className={styles.input}   disabled/>
          </div>

          <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="username">Username</label>
              <input type="text" id="username" value={user?.username} className={styles.input} disabled/>
          </div>

          <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="english-level">English Level</label>
              <select id="english-level" value={UserenglishLevel} onChange={(e) => setUserEnglishLevel(e.target.value)} className={styles.input} disabled={Disable}>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
              </select>
          </div>

          <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="location">Location</label>
              <select id="location" value={UserLocation} onChange={(e) => setUserLocation(e.target.value)} className={styles.input} disabled={Disable}>
              <option key={0} value={""}></option>
              {locations.map((location,index) => (
                <option key={index} value={location.neighborhoods}>
                  {Object.values(location)}
                  </option>
              ))}
              </select>
          </div>
          <button
              onClick={() => {
              if (BtnText === "Save Changes") {
                UpdateUser(
                  UserLocation,
                  UserenglishLevel,
                  localStorage.getItem("token") ?? ""
                );
              }
              SetDisable((prevState) => !prevState);
              setBtnText(BtnText === "Edit Your Profile" ? "Save Changes" : "Edit Your Profile");
            }}
            style={{borderRadius: "15px",marginTop: "12px",fontWeight: "bold",width:"50%",fontSize:"1rem"}}
            className={styles.btn}
            > {BtnText}</button>
          <ToastContainer style={{marginTop:"40px"}} limit={1} position="top-center"/>


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
          <button
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
        </div>
      ))}
    </div>
  ) : (
    <p>No time slots added yet.</p>
  )}
  <div>
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

    <button
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
    </button>
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
          style={{borderRadius: "15px", marginTop: "12px",fontWeight: "bold",width: "50%",fontSize:"1rem",height:"2.9rem"}}
          className={styles.btn}
            onClick={() => {setTimeSlotPopupOpen(true);fetchTimeSlots(); }}
          >
            Manage Time Slots
          </button>

          <div>
              <span onClick={()=>SetPassPopupOpen(true)} className={styles.ResetPass}>Change Password</span>
              <Popup contentStyle={{ width: '500px',height:"520px",marginTop:"80px",borderRadius:"30px",padding:"30px" }} position="center center" onClose={()=>SetPassPopupOpen(false)} open={PassPopupOpen} >
                <button style={{color:"black",padding:"0px",width:"20px",height:"20px"}} onClick={()=>SetPassPopupOpen(false)} className="btn-close" aria-label="Close" ></button>
                <h1 style={{fontSize:"25px" ,marginTop:"20px",display:"flex",justifyContent:"space-evenly"}}>Change Password</h1>
                <div style={{ marginTop: "20px", position: "relative" }}>
                      <label style={{marginTop:"40px",fontWeight:"bold",fontSize:"16px"}} className={styles.label} htmlFor="oldpass">Current Password</label>
                      <input onChange={e=>SetPass(e.target.value)} type={Showpass?"text":"password"} id="oldpass" className={styles.input1}/>
                      <svg onClick={()=>SetShowpass(prev=>!prev)} className={styles.Eye}>
                          {Showpass?<RemoveRedEyeIcon className={styles.Eye}></RemoveRedEyeIcon>:<VisibilityOffIcon  className={styles.Eye}></VisibilityOffIcon>}
                      </svg>
                </div>
                <div  style={{ marginTop: "20px", position: "relative" }}>
                      <label style={{marginTop:"20px",fontWeight:"bold",fontSize:"16px"}} className={styles.label} htmlFor="NewPass">New Password</label>
                      <input onChange={e=>SetNewpass(e.target.value)} type={ShowNewPass?"text":"password"} id="NewPass" className={styles.input1}/>
                      <svg  onClick={()=>SetShowNewPass(prev=>!prev)} className={styles.Eye} >
                      {ShowNewPass?<RemoveRedEyeIcon className={styles.Eye}></RemoveRedEyeIcon>:<VisibilityOffIcon  className={styles.Eye}></VisibilityOffIcon>}
                      </svg>

                      
                </div>
                <div style={{ marginTop: "20px", position: "relative" }}>
                      <label style={{marginTop:"20px",fontWeight:"bold",fontSize:"16px"}} className={styles.label} htmlFor="ConfirmPass">Confirm Password</label>
                      <input onChange={e=>SetConfirmPass(e.target.value)} type={ShowConfirmpass?"text":"password"} id="ConfirmPass" className={styles.input1}/>
                      <svg onClick={()=>SetShowConfirmpass(prev=>!prev)}  className={styles.Eye} >
                      {ShowConfirmpass?<RemoveRedEyeIcon className={styles.Eye}></RemoveRedEyeIcon>:<VisibilityOffIcon  className={styles.Eye}></VisibilityOffIcon>}
                      </svg>
                </div>
                <div >

                      <button className={styles.btn} style={{borderRadius: "15px",width:"150px",fontWeight: "bold",marginLeft:"160px",marginTop:"27px"}}
                      onClick={()=>{
                        if(NewPass!=ConfirmPass)
                        {
                          toast.error("your new password and confirm password are not the same")
                        }
                        else if (NewPass.length<8)
                        {
                          toast.error("password must be at least 8 characters")
                        }
                        else
                        {
                            const UpdatedPass={
                              old_password:Pass,
                              new_password:NewPass
                            }
                            apiClient.patch('/authentication/change-password/',UpdatedPass,
                              {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                              }).then(()=>{SetPassPopupOpen(false),toast.success("password changed successfully")})
                              .catch((error)=>{
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
                              })
                        }
                      }}
                        >Change Password</button>
                </div>
              </Popup>
          </div>
          </div>

      </>
    );
    }

    export default Profile;
