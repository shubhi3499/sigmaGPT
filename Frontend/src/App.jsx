import './App.css'
import Sidebar from './sidebar.jsx';
import ChatWindow from './chatWindow.jsx';
import { MyContext } from './MyContext.jsx';
import { useState } from 'react';
import {v1 as uuidv1} from "uuid";

function App() {
  const [prompt,setPrompt] = useState("");
  const [reply,setReply] = useState(null);
  const [currThreadId,setCurrThreadId] = useState(uuidv1());
  const [prevChats,setPrevChats] = useState([]);//stores all prev chats of the current thread
  const [newChat,setNewChat] = useState(true);

  const providerValues = {
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setCurrThreadId,
    newChat,setNewChat,
    prevChats,setPrevChats
  };

  return (
    <div className='app'>
      <MyContext.Provider value = {providerValues}>
        <Sidebar></Sidebar>
        <ChatWindow>
        </ChatWindow>
      </MyContext.Provider>
    </div>
  )
}

export default App
