import "./App.css";
import { BrowserRouter as Router, Route, Routes, useParams, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage/LoginPage";
import SignUpPage from "./SignUpPage/SignUpPage";
import ForgotPassword from './ForgotPassword/ForgotPassword';
import AboutUs from './AboutUs/AboutUs';
import LandingPage from './LandingPage/LandingPage';
import MergedPage from './merge/mergedpage';
import MainGroupWindow from "./MainGroupWindow/MainGroupWindow";
import { useEffect,useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import Team from "./Team/Team";
import userService from "./services/user-service";
import apiClient from "./services/api-client";
import CircularProgress from "@mui/material/CircularProgress";
import NoticeBoard from "./NoticeBoard/NoticeBoard";
import Error404 from "./Errors/Error404";
import SuccessPage from "./Success copy/SuccessPage";
import GroupProfile from "./GroupProfile/GroupProfile";
import Error400 from "./Errors/Error400";
import Error401 from "./Errors/Error401";
import Error403 from "./Errors/Error403";
import Error500 from "./Errors/Error500";

//import 'react-toastify/dist/ReactToastify.css';


function App() {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (socketRef.current) return; 

    const socket = new WebSocket(`wss://freediscussion.liara.run/ws/notifications/${localStorage.getItem("token") ?? ""}/`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Notification received:', data["message"]);
      toast.success(data.message); 
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
    };

  },[])
  

  const PrivateRoute = () => {
    interface GroupMemberProp 
    {
      username: string;
      profile_image: string;
      level: string;
    }
    const { Title } = useParams<{ Title: string }>();
    const [isMember, setIsMember] = useState(false);
    const [localUsername, setLocalUsername] = useState("");
    const [groupMembers, setGroupMembers] = useState<GroupMemberProp[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      userService
        .UserProfileInfo(localStorage.getItem("token") ?? "")
        .then((res) => {
          setLocalUsername(res.data.username);
        })
        .catch((err) => {
          console.error(err.message);
        });
    }, []);

    useEffect(() => {
      apiClient
        .get(`/groups/${Title}/members`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setGroupMembers(res.data.results);
        })
        .catch((err) => {
          console.error(err.message);
        });
    }, [Title]);

    useEffect(() => {
      if (localUsername && groupMembers.length > 0) {
        const isUserMember = groupMembers.some(
          (member) => member.username === localUsername
        );
        setIsMember(isUserMember);
        setLoading(false);
      }
    }, [localUsername, groupMembers]);

    if (loading) return <CircularProgress style={{marginTop:"350px",marginLeft:"750px"}} />;

    return isMember ? <MainGroupWindow /> : <Navigate to="/dashboard" />;
  };

  

  return (
    
    <Router>
      <ToastContainer position="top-center" newestOnTop={true} role="alert" limit={1} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<MergedPage />} />
        <Route path="/AboutUs" element={<AboutUs Heading='About us'/>}/>
        <Route path="/main-group-window/:Title" element={<PrivateRoute />}/>
        <Route path="/team" element={<Team/>}/>
        <Route path="/Error400" element={<Error400/>}/>
        <Route path="/Error401" element={<Error401/>}/>
        <Route path="/Error403" element={<Error403/>}/>
        <Route path="/notice" element={<NoticeBoard/>}/>
        <Route path="/Error404" element={<Error404/>}/>
        <Route path="/Error500" element={<Error500/>}/>
        <Route path="/Errors" element={<SuccessPage/>}/>
        <Route path="/profile" element={<GroupProfile/>}/>
      </Routes>
    </Router>
  );
}

export default App
