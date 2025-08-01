import { useForm } from "react-hook-form";
import "./SignUpPage.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { useRef, useState } from "react";
import userService from "../services/user-service";
import { Link } from "react-router-dom";
// import { Bounce, toast, ToastContainer } from ;
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { AxiosError } from "axios";
interface verifyEmailProps  {
  otp: string,
}
const schema = z.object({
  username: z.string().min(3, { message: "username must be at least 3 characters" }),
  email: z.string().email({ message: "please enter a valid e-mail" }),
  password: z.string().min(8, { message: "password must be at least 8 characters for safety" }),
});

type FormData = z.infer<typeof schema>;

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [isLoading, setLoading] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const nameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate(); 
  const onSubmit = (data: FormData) => {
    addUser(data);
  };

  const addUser = (user: FormData) => {
    setLoading(true);
    const confirmPassword = document.querySelector('#confirm-password') as HTMLInputElement;
    if (user.password != confirmPassword.value) {
        const errorMsg = "password dont match";
        setLoading(false);
        toast.error(`${errorMsg}`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          // transition: {Bounce},
          });
          return;
    }
    userService
      .createUser(user)
      .then((res) => {
        console.log(res.data);
        toast.info(`${res.data.message}`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          // transition: Bounce,
          });
        setLoading(false);
        setShowVerifyEmail(true);
      })
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
        };
      });
  };

  const verifyEmail = (code: string) => {
    const emailVerification: verifyEmailProps = {
      otp: code,
    };
    
    // if (code === "111111" )
    // {
    //   console.log("true");
    //     setShowVerifyEmail(false);
    //       closeModal();
    //     navigate("/success");

    // 
    userService
      .verifyEmail(emailVerification)
      .then((res) => { 
        setShowVerifyEmail(false); 
        toast.success(`${res.data}`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        closeModal();
        navigate("/success");
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
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const newCode = [...verificationCode];
    newCode[index] = e.target.value.slice(-1);
    setVerificationCode(newCode);

    if (e.target.value && index < 5) {
      document.getElementById(`code-input-${index + 1}`)!.focus();
    }

    if (newCode.every((digit) => digit)) {
      const code = [...verificationCode, e.target.value].join(""); // state variables update after completing all codes
      verifyEmail(code);
      console.log("verifying");
    }
  };

  return (
    <div className="login-page">
      <div className="welcome-section"></div>
      <div className="login-section">
        <h2 className="heading">Sign Up</h2>
        {/* {error && <Alert severity="error" sx={{ fontSize: "12px" }}>{error}</Alert>} */}
          <ToastContainer />
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input {...register("username")} className="Filed" type="text" id="username" placeholder="Username" />
            <i className="fa fa-user-plus icon"></i>
            {errors.username && <Alert severity="error" sx={{ fontSize: "12px" }}>{errors.username.message}</Alert>}
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input {...register("email")} className="Filed" id="email" placeholder="Email" />
            <i className="fa fa-envelope icon"></i>
            {errors.email && <Alert severity="error" sx={{ fontSize: "12px" }}>{errors.email.message}</Alert>}
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input {...register("password")} type="password" id="password" placeholder="Password" />
            <i className="fa fa-lock icon"></i>
            {errors.password && <Alert severity="error" sx={{ fontSize: "12px" }}>{errors.password.message}</Alert>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Confirm Password</label>
            <input type="password" id="confirm-password" placeholder="Password" />
            <i className="fa fa-lock icon"></i>
            {errors.password && <Alert severity="error" sx={{ fontSize: "12px" }}>{errors.password.message}</Alert>}
          </div>

          {showVerifyEmail && (
            <Button
              onClick={openModal}
              type="submit"
              sx={{
                alignItems: "center",
                backgroundColor: "#112D32",
                borderRadius: "100px",
                color: "#ffffff",
                cursor: "pointer",
                display: "inline-flex",
                fontFamily: '-apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
                fontSize: "20px",
                fontWeight: "600",
                justifyContent: "center",
                lineHeight: "50px",
                maxWidth: "480px",
                minHeight: "40px",
                padding: "0 20px",
                textAlign: "center",
                transition: "background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, color 0.2s ease-in-out",
                "&:hover": { backgroundColor: "#0A1E22" },
              }}
            >
              Verify Email
            </Button>
          )}

          {!isLoading && !showVerifyEmail && <button type="submit" className="button-18">Sign Up</button>}
          {isLoading && <CircularProgress className="Circular" />}
        </form>

        <p className="sign-up">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <Dialog
          open={isModalOpen}
          onClose={closeModal}
          sx={{
            "& .MuiDialog-container": { alignItems: "flex-start", justifyContent: "flex-end" },
            "& .MuiPaper-root": { marginTop: "300px", marginRight: "190px", maxWidth: "300px", width: "100%" },
          }}
        >
          <DialogTitle>Enter Verification Code</DialogTitle>
          <DialogContent>
            <div style={{ display: "flex", gap: "8px" }}>
              {verificationCode.map((digit, index) => (
                <TextField
                  key={index}
                  id={`code-input-${index}`}
                  ref={nameRef}
                  variant="outlined"
                  inputProps={{ maxLength: 1, style: { textAlign: "center" } }}
                  value={digit}
                  onChange={(e) => handleCodeChange(e, index)}
                  sx={{ width: "40px" }}
                />
              ))}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};
export default SignUpPage;
