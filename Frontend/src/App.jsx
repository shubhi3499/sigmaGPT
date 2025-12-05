import './App.css'
import Sidebar from './sidebar.jsx';
import ChatWindow from './chatWindow.jsx';
import { MyContext } from './MyContext.jsx';

function App() {
  const providerValues = {};

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
