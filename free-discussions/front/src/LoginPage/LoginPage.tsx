// LoginPage.tsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import userService from "../services/user-service";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "./LoginPage.css";
import { AxiosError } from "axios";

interface resetConfirmEmail {
  email: string;
}

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters for safety" }),
});

const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type FormData = z.infer<typeof schema>;
type EmailFormData = z.infer<typeof emailSchema>;

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
    reset: resetEmailForm,
  } = useForm<EmailFormData>({ resolver: zodResolver(emailSchema) });

  const [isLoading, setLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [resetStep, setResetStep] = useState<'email' | 'otp'>('email');
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [userEmail, setUserEmail] = useState<string>(''); // Store the user's email
  const navigate = useNavigate();

  // State variables for resend functionality
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendIntervalId, setResendIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isResending, setIsResending] = useState(false);

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (resendIntervalId) {
        clearInterval(resendIntervalId);
      }
    };
  }, [resendIntervalId]);

  const onSubmit = (data: FormData) => {
    addUser(data);
  };

  const addUser = (user: FormData) => {
    setLoading(true);
    userService
      .logInUser(user)
      .then((res) => {
        const token = res.data.access_token;
        if (!token) {
          throw new Error("Token not found in response");
        }
        localStorage.setItem("token", token);

        toast.success("Login Successful", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoading(false);
        navigate("/dashboard");
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

  const handleForgetPassword = (data: EmailFormData) => {
    setUserEmail(data.email); // Store the email for OTP verification
    const payload: resetConfirmEmail = { email: data.email };
    userService
      .resetConfirmPassword(payload)
      .then(() => {
        toast.success("Email sent successfully", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setResetStep('otp'); // Proceed to OTP input step
        startResendCooldown(); // Start cooldown timer
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.detail || "Failed to send email";
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
        };
      });
  };

  const handleOpenDialog = () => {
    resetEmailForm(); // Clear the email form
    setResetStep('email'); // Start with email input step
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    resetEmailForm(); // Clear the email form
    setResetStep('email'); // Reset to email step
    setVerificationCode(["", "", "", "", "", ""]); // Clear the verification code
    setDialogOpen(false);

    // Reset cooldown and clear interval
    setResendCooldown(0);
    if (resendIntervalId) {
      clearInterval(resendIntervalId);
      setResendIntervalId(null);
    }
  };

  const handleCodeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newCode = [...verificationCode];
    newCode[index] = e.target.value.slice(-1);
    setVerificationCode(newCode);

    if (e.target.value && index < 5) {
      document.getElementById(`code-input-${index + 1}`)?.focus();
    }

    if (newCode.every((digit) => digit)) {
      const code = newCode.join('');
      verifyOTP(code);
    }
  };

  const verifyOTP = (code: string) => {
    const payload = {
      otp: code,
    };

    console.log('Verifying OTP with payload:', payload);

    userService
      .PasswrodResetConfirm(payload)
      .then((res) => {
        const token = res.data.access_token;
        if (!token) {
          throw new Error("Token not found in response");
        }
        localStorage.setItem("token", token);
        toast.success("OTP verified successfully", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setDialogOpen(false); // Close the dialog
        navigate("/dashboard"); // Navigate to dashboard
      })
      .catch((err) => {
        console.error('OTP Verification Error:', err.response || err);
        const errorMsg = err.response?.data?.detail;
        toast.error(errorMsg, {
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

  // Start cooldown timer
  const startResendCooldown = () => {
    // Clear any existing interval
    if (resendIntervalId) {
      clearInterval(resendIntervalId);
    }

    setResendCooldown(120); // 2 minutes

    const intervalId = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setResendIntervalId(intervalId);
  };

  // Handle Resend Code functionality
  const handleResendCode = () => {
    if (resendCooldown > 0) return; // Prevent clicking if cooldown is active

    setIsResending(true);

    const payload: resetConfirmEmail = { email: userEmail };

    userService
      .ResendVerificatonEmail(payload)
      .then(() => {
        toast.success("Verification code resent successfully", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // Start the cooldown timer
        startResendCooldown();
      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.detail || "Failed to resend code";
        toast.error(errorMsg, {
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
      .finally(() => {
        setIsResending(false);
      });
  };

  return (
    <div className="login-page">
      <div className="welcome-section"></div>
      <div className="login-section">
        <h2 className="heading">Login</h2>
        <ToastContainer />
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              {...register("username")}
              className="Field"
              type="text"
              id="username"
              placeholder="Username"
            />
            <i className="fa fa-user-plus icon"></i>
            {errors.username && (
              <Alert style={{ width: "300px" }} severity="error">
                {errors.username.message}
              </Alert>
            )}
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              {...register("password")}
              type="password"
              id="password"
              placeholder="Password"
            />
            <i className="fa fa-key icon"></i>
            {errors.password && (
              <Alert style={{ width: "300px" }} severity="error">
                {errors.password.message}
              </Alert>
            )}
          </div>

          <p className="forgot-password">
            <span
              onClick={handleOpenDialog}
              style={{
                cursor: "pointer",
                textDecoration: "underline",
                color: "blue",
              }}
            >
              Forget Password?
            </span>
          </p>

          {!isLoading && (
            <button type="submit" className="button-18">
              Login
            </button>
          )}
          {isLoading && <CircularProgress className="Circular" />}
        </form>
        <p className="sign-up">
          Doesn’t have an account yet? <Link to="/signup">Sign Up</Link>
        </p>
      </div>

      {/* Modal for Forget Password */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            width: "400px",
            textAlign: "center",
            padding: "20px",
          },
        }}
      >
        <DialogTitle style={{ fontSize: "18px", fontWeight: "bold" }}>
          {resetStep === "email"
            ? "PLEASE ENTER YOUR EMAIL ADDRESS"
            : "ENTER YOUR VERIFICATION CODE"}
        </DialogTitle>
        <DialogContent>
          {resetStep === "email" ? (
            // Email Input Form
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <img
                src="src/gif/icons8-email-open-100.png" // Replace with the correct path to your email icon
                alt="Email Icon"
                style={{ width: "80px", height: "80px" }}
              />
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  margin: 0,
                }}
              >
                Enter your email address to reset your password
              </p>
              <form
                onSubmit={handleEmailSubmit(handleForgetPassword)}
                style={{ width: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    {...registerEmail("email")}
                    type="email"
                    id="email"
                    placeholder="Enter email address"
                    style={{
                      width: "90%",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      textAlign: "center",
                    }}
                  />
                  {emailErrors.email && (
                    <Alert
                      severity="error"
                      style={{ fontSize: "12px", width: "90%" }}
                    >
                      {emailErrors.email.message}
                    </Alert>
                  )}
                  <button
                    type="submit"
                    style={{
                      width: "90%",
                      padding: "10px",
                      backgroundColor: "#112D32",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // OTP Code Input Fields
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  margin: 0,
                }}
              >
                Enter the OTP code sent to your email
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                {verificationCode.map((digit, index) => (
                  <TextField
                    key={index}
                    id={`code-input-${index}`}
                    variant="outlined"
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: "center" },
                    }}
                    value={digit}
                    onChange={(e) => handleCodeChange(e, index)}
                    sx={{ width: "40px" }}
                  />
                ))}
              </div>

              {/* Resend Code Button */}
              <button
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || isResending}
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  backgroundColor:
                    resendCooldown > 0 || isResending
                      ? "#ccc"
                      : "#112D32",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor:
                    resendCooldown > 0 || isResending
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {isResending
                  ? "Resending..."
                  : "Resend Code"}
              </button>

              {/* Cooldown Timer */}
              {resendCooldown > 0 && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#999",
                    marginTop: "5px",
                  }}
                >
                  resend the code in{" "}
                  {resendCooldown} second
                  {resendCooldown !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginPage;