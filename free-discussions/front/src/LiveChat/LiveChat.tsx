import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import styles from "./LiveChat.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import NoticeBoard from "../NoticeBoard/NoticeBoard";
import DeleteGroup from "../DeleteGroup/DeleteGroup";

interface Message {
  message: string;
  username: string;
  timestamp: string;
}

const LiveChat = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const { Title } = useParams<{ Title: string }>();
  const token = localStorage.getItem("token") ?? "";

  useEffect(() => {
    axios
      .get("https://freediscussion.liara.run/authentication/users/retrieve/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setLoggedInUser(res.data.username));
  }, []);

  useEffect(() => {
    if (socketRef.current) return;

    const socket = new WebSocket(
      `wss://freediscussion.liara.run/ws/chat/${Title}/${token}/`
    );
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (Array.isArray(data.messages)) {
        setMessages(data.messages.reverse());
      } else {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    socket.onerror = (event) => {
      console.log("error: ", event)

    }
    

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
    };
  }, []);

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not open.");
      return;
    }

    const messageData = { message: input };

    socketRef.current.send(JSON.stringify(messageData));

    setInput("");
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
  };

  return (
    <div className={styles.chatContainer} onKeyDown={(e) => {
      if (e.key === "Escape") {
        setShowEmojiPicker(false);
      }
       
    }}>
      <div className={styles.header}>
        <h1>{Title}</h1>
        <div className="noticeButton"><NoticeBoard /></div>
                <div style={{marginLeft:"auto",marginTop:"1%"}}>
          <DeleteGroup/>
          <div style={{height:"12px"}}/>
        </div>
      </div>
      <div className={styles.messageBox} ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              loggedInUser === msg.username
                ? styles.myMessage
                : styles.otherMessage

            }`}
          >
            <div className={styles.messageInfo}>
              <strong>
                {loggedInUser === msg.username ? "You" : msg.username}

              </strong>
              : {msg.message}

            </div>
            <span className={styles.timestamp}>
              <div></div>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.InputEmoji}>
      {showEmojiPicker && (
          <div className={styles.emojiPicker}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      <div className={styles.inputContainer}>
        
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={styles.emojiButton}
        >
          😊
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
              setShowEmojiPicker(false);
            } else if(e.key === "Escape") {
              setShowEmojiPicker(false);
            }
             

          }}
          placeholder="Type a message"
          className={styles.inputField}
        />

        <button onClick={sendMessage} className={styles.sendButton}>
          Send
        </button>
      </div>
      </div>
    </div>
  );
};

export default LiveChat;
