import { useNavigate, useParams } from "react-router-dom"
import style from "./DeleteGroup.module.css"
import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import userService from "../services/user-service";
import Popup from "reactjs-popup";

function DeleteGroup() {
  const[ownerusername,SetOwnerusername]=useState("a");
  const[localusername,setLocalusername]=useState('b');
  const {Title}=useParams();
  const[hidden,Sethidden]=useState(true);
  const navigate=useNavigate();
  const[popupopen,Setpopupopen]=useState(false);

  const GetGroupInfo = () => {
    apiClient
      .get(`/groups/${Title}/`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        SetOwnerusername(res.data.owner_username);
      })
      .catch((err) => {
        console.log(err.message);
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
  
  GetGroupInfo();
  GetUserInfo();
  useEffect(() => {
    if (localusername === ownerusername) {
       Sethidden(false)
    }
    GetUserInfo();
    GetGroupInfo();

  }, [localusername, ownerusername]);
  

  return (
    <div>
        <button  hidden={hidden} className={style.btn} onClick={()=>{
             Setpopupopen((prev)=>!prev)
        }}>Delete Group</button>
        <Popup contentStyle={{position: "absolute",top: "50%",left: "50%",transform: "translate(-50%, -50%)",width: "300px",borderRadius: "8px",}} open={popupopen} onClose={() => Setpopupopen(false)}>
        <button  type="button" style={{lineHeight:"45px",marginLeft:"260px",display:"flex" }}  className="btn-close" aria-label="Close" onClick={() =>{ Setpopupopen(false)}}></button>
        <h1 style={{fontSize:"16px",alignItems:"flex-start",lineHeight:"21px"}}>Are you sure you want to delete this Group?</h1>
        <div style={{justifyContent:"space-evenly",display:"flex"}}>
                      <button className={style.button2} onClick={()=>{
                        apiClient.delete(`/groups/${Title}/delete/`,{
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                          }).then(()=>{
                            navigate("/dashboard")
                          }).catch((err)=>{
                            console.log(err.message)
                          })
                      Setpopupopen(false);
                      }} 
                        style={{alignItems:"flex-start",width:"140px",height:"40px"}}>Yes</button>
                      <button className={style.button1} onClick={()=>Setpopupopen(false)} style={{alignItems:"flex-end",width:"140px",height:"40px",fontWeight:"normal"}}>No</button>
                </div>
        </Popup>
    </div>
  )
}

export default DeleteGroup