// chatWindow.jsx
import './chatWindow.css';
import Chat from "./chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext,useState,useEffect } from 'react';
import {ScaleLoader} from "react-spinners";

function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, currThreadId,prevChats,setPrevChats,setNewChat } = useContext(MyContext);
  const [loading,setLoading] = useState(false);
  const [isOpen,setIsOpen] = useState(false);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    const options = {
      method: "POST",
      headers: {                           // <-- correct key (lowercase)
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: prompt,                  // <-- match server field name
        threadId: currThreadId
      })
    };

    try {
      const response = await fetch("http://localhost:8080/api/chat", options);

      // read JSON body (and handle non-2xx)
      const data = await response.json();
      if (!response.ok) {
        console.error("Server returned error:", data);
        return;
      }

      console.log("server reply:", data);
      setReply(data.reply);
    } catch (error) {
      console.log("Network or parse error:", error);
    }
    setLoading(false);
  };

  //Append new chats to previous chats
  useEffect(()=>{
    if(prompt && reply){
        setPrevChats(prevChats => (
            [...prevChats,{
                role:"user",
                content:prompt
            },{
                role:"assistant",
                content:reply
            }]
        ))
    }
    setPrompt("");
  },[reply])

  const handleProfileClick = () =>{
    setIsOpen(!isOpen);
  }
  return (
    <div className='chatWindow'>
      <div className="navbar">
        <span>SigmaGPT<i className="fa-solid fa-chevron-down"></i></span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className='userIcon'><i className="fa-solid fa-user"></i></span>
        </div>
      </div>
      {
        isOpen && <div className="dropDown">
          <div className="dropDownItem"><i className="fa-solid fa-gear"></i>Settings</div>
          <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan</div>
          <div className="dropDownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i>Logout</div>
        </div>
      }

      <Chat />
      <ScaleLoader color='#fff' loading={loading}></ScaleLoader>

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' ? getReply() : null}
          />
          <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
        </div>
        <p className='info'>
          SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
