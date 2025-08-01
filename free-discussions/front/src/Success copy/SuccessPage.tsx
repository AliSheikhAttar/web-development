import { toast } from "react-toastify";
import userService from "../services/user-service";
import "./SuccessPage.css";
import { useNavigate } from 'react-router-dom';
import { AxiosError } from "axios";
import { useState } from "react";



const SuccessPage = () => {
  const navigate = useNavigate();
  const [errorCode, setErrorCode] = useState('400'); // Default selected option

  const handleErrorChange = (e:any) => {
    setErrorCode(e.target.value);
  };

  const errFunc = () => {
    userService
      .error_generator(errorCode)
      .then(() => {
        // Handle successful response if needed
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          const statusCode = error.response.status;
          userService
          .error_generator(String(statusCode))
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
  };

  return (
    <>
    <div className="success-page">
      <h1>Success!</h1>
    </div>
    <div className="error-page">
    <div className="error-selection">
    <label htmlFor="errorCode">Choose an error code:</label>
    <select id="errorCode" value={errorCode} onChange={handleErrorChange}>
    <option value="400">400 - Bad Request</option>
    <option value="401">401 - Unauthorized</option>
    <option value="403">403 - Forbidden</option>
    <option value="404">404 - Not Found</option>
    <option value="500">500 - Internal Server Error</option>
    </select>
    </div>
    <button onClick={errFunc} className="error-button">
    Don't Click Me
    </button>
    </div>
    </>
  );
};

export default SuccessPage;