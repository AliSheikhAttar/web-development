import React, { useState, useEffect } from "react";
import styles from "./GroupMembers.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";



interface User {
  username: string;
  profile_image: string;
  level: string;
}

const GroupDetails: React.FC = () => {

  const userToken = localStorage.getItem("token") ?? ""; 

  


  const [loggedInUser, setLoggedInUser] = useState("");

  const [requested, setRequested] = useState<User[]>([]);

  const [members, setMembers] = useState<User[]>([]);

  const [owner_username, setOwner_username] = useState("");
  const{Title}=useParams();
  const navigate=useNavigate();


  useEffect(() => {
    axios
      .get(`https://freediscussion.liara.run/groups/${Title}/members/`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {setMembers(res.data.results)
    setMembersCount(res.data.count) });

    axios
      .get(`https://freediscussion.liara.run/groups/${Title}/pending/`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setRequested(res.data.results);
        setRequestedCount(res.data.count);
      });

    axios
      .get("https://freediscussion.liara.run/authentication/users/retrieve/", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => setLoggedInUser(res.data.username));

    axios
      .get(`https://freediscussion.liara.run/groups/${Title}/`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => setOwner_username(res.data.owner_username));
  }, []);
  

  const [ShowList, setShowList] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    "kick" | "accept" | "decline" | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const showMembers = () => {
    setShowList(true);
    axios
      .get(`https://freediscussion.liara.run/groups/${Title}/members/`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {setMembers(res.data.results)
    setMembersCount(res.data.count) });
    setCurrentPageUrl(
      `https://freediscussion.liara.run/groups/${Title}/members/`
    );
    setSelectedPaginate(null);
  };
  const showRequested = () => {
    setShowList(false);
    axios
      .get(`https://freediscussion.liara.run/groups/${Title}/pending/`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setRequested(res.data.results);
        setRequestedCount(res.data.count);
      });
    setCurrentPageUrl(
      `https://freediscussion.liara.run/groups/${Title}/pending/`
    );
    setSelectedPaginate(null);
  };

  const [MembersCount, setMembersCount] = useState(0);
  const [RequestedCount, setRequestedCount] = useState(0);

  const [selectedPaginate, setSelectedPaginate] = useState<
    "next" | "previous" | null
  >(null);

  const [currentPageUrl, setCurrentPageUrl] = useState(
    `https://freediscussion.liara.run/groups/${Title}/members/`
  );

  

  const next = () => {
    axios
      .get(currentPageUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.data.next) {
          setCurrentPageUrl(res.data.next);
          return axios.get(res.data.next, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
        } else {
          // Do nothing if res.data.next is null
          return Promise.reject("No more pages");
        }
      })
      .then((res) => {
        if (ShowList) {
          setMembers(res.data.results);
        } else {
          setRequested(res.data.results);
        }
      })
      .catch((error) => {
        console.error(error); // Optional: log an error if necessary
      });
  };
  
  const previous = () => {
    axios
      .get(currentPageUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.data.previous) {
          setCurrentPageUrl(res.data.previous);
          return axios.get(res.data.previous, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
        } else {
          // Do nothing if res.data.previous is null
          return Promise.reject("No more pages");
        }
      })
      .then((res) => {
        if (ShowList) {
          setMembers(res.data.results);
        } else {
          setRequested(res.data.results);
        }
      })
      .catch((error) => {
        console.error(error); // Optional: log an error if necessary
      });
  };
  

  useEffect(() => {
    if (selectedPaginate === "next") {
      next();
    } else if (selectedPaginate === "previous") {
      previous();
    }
  }, [selectedPaginate]);


  const paginateButtons = (direction: "next" | "previous") => {
    setSelectedPaginate(direction);
  };

  const acceptRequest = (user: User) => {
    axios
      .post(
        `https://freediscussion.liara.run/groups/${Title}/accept/`,
        { username: user.username },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(() =>
        axios
          .get(`https://freediscussion.liara.run/groups/${Title}/pending/`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {setRequested(res.data.results);
            setRequestedCount(res.data.count)})
      )
      .catch((error) => {
        console.error("Error accepting user:", error);
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

    axios
      .get(`https://freediscussion.liara.run/groups/${Title}/members/`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {setMembers(res.data.results)
        setMembersCount(res.data.count)
      });
  };

  const declineRequest = (user: User) => {
    axios
      .post(
        `https://freediscussion.liara.run/groups/${Title}/decline/`,
        { username: user.username },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(() =>
        axios
          .get(`https://freediscussion.liara.run/groups/${Title}/pending/`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {setRequested(res.data.results)
            setRequestedCount(res.data.count)})
      )
      .catch((error) => {
        console.error("Error declining user:", error);
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
  };

  const kickUser = (user: User) => {
    axios
      .post(
        `https://freediscussion.liara.run/groups/${Title}/kick/`,
        { username: user.username },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(() =>
        axios
          .get(`https://freediscussion.liara.run/groups/${Title}/members/`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {setMembers(res.data.results)
            setMembersCount(res.data.count)
          })
      )
      .catch((error) => {
        console.error("Error kicking user:", error);
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
  };

  const handleAction = () => {
    console.log(selectedAction)
    if (selectedAction === "kick" && selectedUser) {
      kickUser(selectedUser);
    } else if (selectedAction === "accept" && selectedUser) {
      acceptRequest(selectedUser);
    } else if (selectedAction === "decline" && selectedUser) {
      declineRequest(selectedUser);
    }

    setShowConfirmModal(false);
    setSelectedAction(null);
    setSelectedUser(null); 
  };

  const renderList = () => {
    if (ShowList) {
      if(MembersCount === 0){
        return(<div className={styles.noUser}>no users found</div>)
      }
      return (
        <ul className={styles.list}>
          {members.map((member) => (
            <li key={member.username} className={styles.ListItem}>
              <div className={styles.userInfo}>
                <div className={styles.profile}>
                  <img className={styles.image} src={member.profile_image} />
                </div>
                <div className={styles.UserName}>
                  <div>{member.username}</div>
                  <div className={styles.level}>{member.level}</div>
                </div>
              </div>
              {member.username !== owner_username ? (
                <div className={styles.HandleButton}>
                  <button
                    onClick={() => {
                      setSelectedUser(member);
                      setSelectedAction("kick");
                      console.log(selectedAction);
                      setShowConfirmModal(true);
                    }}
                  >
                    Kick
                  </button>
                </div>
              ) : (
                <div className={styles.HandleButton}>
                  owner
                </div>
              )}
              
            </li>
            
          ))}
          <div className={styles.paginateButtons}>
            <button
              className={styles.HandleButton}
              onClick={() => {
                paginateButtons("previous")
              }}
            >
              previous
            </button>
            <button
              className={styles.HandleButton}
              onClick={() => {
                paginateButtons("next")
              }}
            >
              next
            </button>
          </div>
        </ul>
      );
    } else {
      if(RequestedCount === 0){
        return(<div className={styles.noUser}>no users found</div>)
      }
      if(RequestedCount === 0){
        return(<div>no members found</div>)
      }
      return (
        <ul className={styles.list}>
          {requested.map((user) => (
            <li key={user.username} className={styles.ListItem}>
              <div className={styles.userInfo}>
                <div className={styles.profile}>
                  <img className={styles.image} src={user.profile_image} />
                </div>
                <div className={styles.UserName}>
                  <div>{user.username}</div>
                  <div className={styles.level}>{user.level}</div>
                </div>
              </div>
              <div className={styles.HandleButtonContainer}>
                <button
                  className={styles.HandleButton}
                  onClick={() => {
                    setSelectedUser(user);
                    setSelectedAction("accept");
                    setShowConfirmModal(true);
                  }}
                >
                  Accept
                </button>
                <button
                  className={styles.HandleButton}
                  onClick={() => {
                    setSelectedUser(user);
                    setSelectedAction("decline");
                    setShowConfirmModal(true);
                  }}
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
          <div className={styles.paginateButtons}>
            <button
              className={styles.HandleButton}
              onClick={() => {
                paginateButtons("previous")
              }}
            >
              previous
            </button>
            <button
              className={styles.HandleButton}
              onClick={() => {
                paginateButtons("next")
              }}
            >
              next
            </button>
          </div>
        </ul>
      );
    }
  };

  return (
    <div className={styles.GroupMembers}>
      {loggedInUser === owner_username ? (
        <div>
          <div className={styles.buttons}>
            <button onClick={showMembers} className={styles.button}>
              {MembersCount + " "}Members
            </button>
            <button onClick={showRequested} className={styles.button}>
              {RequestedCount + " "} Requested
            </button>
          </div>
          {renderList()}
        </div>
      ) : (
        <div>
          {(MembersCount === 0) && "no user found"}
          <button className={styles.button}>{MembersCount + " "}Members</button>
          <ul className={styles.list}>
            {members.map((member) => (
              <li className={styles.ListItem} key={member.username}>
                <div className={styles.userInfo}>
                  <div className={styles.profile}>
                    <img className={styles.image} src={member.profile_image} />
                  </div>
                  <div className={styles.UserName}>
                    <div>{member.username}</div>
                    <div className={styles.level}>{member.level}</div>
                  </div>
                </div>
              </li>
            ))}
            <div className={styles.paginateButtons}>
              <button className={styles.HandleButton} onClick={() => {
                paginateButtons("previous")
              }} >previous</button>
              <button className={styles.HandleButton} onClick={() => {
                paginateButtons("next")
              }}>next</button>
            </div>
          </ul>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedUser && (
        <div className={styles.confirmModal}>
          <div className={styles.confirmModalContent}>
            <p>
              {selectedAction === "kick"
                ? `Are you sure you want to kick ${selectedUser.username} out of this group?`
                : selectedAction === "accept"
                ? `Are you sure you want to accept ${selectedUser.username}'s request to join this group?`
                : selectedAction === "decline"
                ? `Are you sure you want to decline ${selectedUser.username}'s request to join this group?`
                : null}
            </p>

            <div className={styles.confirmModalButtons}>
              <button onClick={handleAction}>Yes</button>
              <button onClick={() => setShowConfirmModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
