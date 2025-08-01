import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import ResetPasswordGif from "../gif/R.gif";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../Header/Header";
import userService from "../services/user-service";
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  password: z.string().min(12, { message: "Password must be at least 12 characters for safety" }),
});

type FormData = z.infer<typeof schema>;

const ForgotPassword: React.FC = () => {
  const { param1, param2 } = useParams<{ param1: string; param2: string }>(); // Extract uidb64 and token from the URL

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [error, setError] = useState("");
  const navigate=useNavigate();

  // Log uidb64 and token to the console
  useEffect(() => {
    console.log("UIDB64:", param1);
    console.log("Token:", param2);
  }, [param1, param2]);

  const onSubmit = (data: FormData) => {
    const newPassword = (document.querySelector("#newPassword") as HTMLInputElement).value;
    const confirmPassword = (document.querySelector("#confirmPassword") as HTMLInputElement).value;
    console.log(data)

    if (newPassword !== confirmPassword) {
      const errorMsg = "Passwords do not match";
      setError(errorMsg);
      toast.error(`${errorMsg}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    userService
    .resetPassword({password:newPassword}, param1 || "default", param2 || "default")
    .then(()=>{    
      console.log("Password reset successfully");
      toast.success("Password reset successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });})
    
      .catch((error)=> {
        const errorMsg = error.response?.data?.detail || "failed to reset password";
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
            toast.error(`An unexpected error occurred: ${errorMsg}`, {
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
    console.log(error)
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f9",
        overflow: "hidden",
      }}
    >
      <Header />
      <ToastContainer/>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "80%",
          maxWidth: "1200px",
          padding: "1rem",
          backgroundColor: "#ffffff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <img src={ResetPasswordGif} alt="Reset Password" style={{ maxWidth: "100%", height: "auto" }} />
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "2.3rem",
              color: "#112D32",
              marginBottom: "2rem",
              marginTop: "-4rem",
              borderBottom: "5px solid #112D32",
              paddingBottom: "0.5rem",
            }}
          >
            Reset Password
          </h2>
          <form
            style={{
              width: "100%",
              maxWidth: "300px",
              display: "flex",
              flexDirection: "column",
            }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div
              style={{
                position: "relative",
                marginBottom: "1.5rem",
                width: "100%",
              }}
            >
              <label
                htmlFor="newPassword"
                style={{
                  fontSize: "1.2rem",
                  color: "#112D32",
                  marginTop: "2rem",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                {/* New Password */}
              </label>
              <input
                {...register("password")}
                type="password"
                id="newPassword"
                placeholder="New Password"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  fontSize: "1rem",
                }}
              />
              {errors.password && (
                <span style={{ color: "red", fontSize: "0.9rem" }}>{errors.password.message}</span>
              )}
            </div>
            <div
              style={{
                position: "relative",
                marginBottom: "1.5rem",
                width: "100%",
              }}
            >
              <label
                htmlFor="confirmPassword"
                style={{
                  fontSize: "1.2rem",
                  color: "#112D32",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                {/* Confirm New Password */}
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm New Password"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  fontSize: "1rem",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#112D32",
                color: "#ffffff",
                border: "none",
                borderRadius: "5px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;