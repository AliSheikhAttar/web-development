import { useEffect, useState } from 'react'
import styles from "./CreatGroup.module.scss";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import locationService from '../services/location-service';
import apiClient, { AxiosError } from '../services/api-client';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface locationProp
{
    neighborhoods:string
}
 
function CreatGroup() {
    const[popupopen,setPopupOpen]=useState(false)
    const[Title,setTitle]=useState("");
    const[Level,setLevel]=useState("A1")
    const[Notice,setNotice]=useState("");
    const[Location,setLocation]=useState("");
    const[Link,setLink]=useState('');
    const[locations,setLocations]=useState<locationProp[]>([])
    const navigate=useNavigate();

    useEffect(() => {
        locationService
        .Getneighborhoods()
        .then((res) => setLocations(res.data))
        .catch((error: AxiosError) => {
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
            }
          });
    
    }, []);  
    

    
    const CreatGroup=()=>{
        const newGroup={
            title:Title,
            description:Notice,
            level:Level,
            neighborhood:Location,
            meeting_url:Link,
        }

        apiClient.post("/groups/create/",newGroup,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
         .then(res=>{console.log(res.data),navigate(`/main-group-window/${Title}`);})
         .catch(error =>{console.log(error);     
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
            } else if(error.response&& error.response.data){
                 if (error.response.data["meeting_url"] && Array.isArray(error.response.data["meeting_url"]))
                {
                    toast.error("Invalid URL")
                }
                else{
                    
                    if (Title!="")
                    {

                        toast.error("Group Title Already exists")
                    }
                    else{
                        toast.error("Name field may not be blanck.")
                    }
                }
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
            }
         });
    }

  return (
    
    <div>
        <ToastContainer  position="bottom-right" newestOnTop={true} role="alert" limit={1}/>
        <button className={styles.btn} style={{width:"120px"}} onClick={()=>setPopupOpen(true)}>Create Group </button>
        <Popup contentStyle={{ width: '500px' ,height:"570px",marginTop:"80px",borderRadius:"30px",padding:"18px"}} position="center center" open={popupopen} onClose={() => setPopupOpen(false)}>
            <button style={{padding:"0px",width:"20px",height:"20px"}}  className="btn-close" aria-label="Close" onClick={() =>{ setPopupOpen(false)}}></button>
            <div className={styles.formGroup}>
                <label htmlFor='Name' className={styles.label}>Group Name</label>
                <input value={Title} onChange={(e)=>setTitle(e.target.value)} id="Name" className={styles.input}></input>            
                
            </div>
            <div className={styles.formGroup}>
                <label htmlFor='Notice' className={styles.label}>Notice board</label>
                <input id="Notice" value={Notice} onChange={(e)=>setNotice(e.target.value)} className={styles.input}></input>
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Select group level</label>
                <select value={Level} onChange={e=>setLevel(e.target.value)} className={styles.input}>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                </select>
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Select your location</label>
                <select value={Location} onChange={e=>setLocation(e.target.value)} className={styles.input}>
                <option key={0} value={""}></option>
                   {locations.map((loc)=>(
                    <option key={Math.random()} value={loc.neighborhoods}>{Object.values(loc)}</option>
                   ))}
                </select>
            </div>
            <div className={styles.formGroup}>
                <label htmlFor='Link' className={styles.label}>Enter the link of your online meet</label>
                <input value={Link} onChange={e=>setLink(e.target.value)}  id="Link" className={styles.input}></input>

                
            </div>
            <div>
                <button onClick={
                    CreatGroup
                } className={styles.btn} style={{marginTop:"1px",marginBottom:"25px",marginLeft:"190px",marginRight:"190px",width:"120px"}}>Creat Group</button>
            </div>

        </Popup>
    </div>
  )
}

export default CreatGroup