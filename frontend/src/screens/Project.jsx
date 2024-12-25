import { useLocation } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import axios from '../config/axios';
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket';
import { UserContext } from '../context/user.context';

const Project = () => {
  const location = useLocation();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [project, setProject] = useState(location.state.project);
  const [message, setMessage] = useState([]);

  const [users, setUsers] = useState([]);

  const messageBox = React.createRef();

  const { user } = useContext(UserContext);

  useEffect(() => {

    initializeSocket(project._id);

    receiveMessage('project-message', data => {
      console.log("someone sent the message" , data);
      appendIncomingMessage(data);
    });

    axios.get(`/projects/get-project/${location.state.project._id}`).then((res) => {
      setProject(res.data.project);
    }).catch((err) => { console.log(err) });

    axios
      .get('/users/all')
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  const appendIncomingMessage = (messageObject) => {

    const messageBox = document.querySelector('.message-box');
    const message = document.createElement('div');
    message.classList.add('message' , 'max-w-56' , 'flex' , 'flex-col' , 'bg-slate-50' , 'p-2' , 'rounded-md' , 'w-fit');
    message.innerHTML = `
    <small class="opacity-65 text-xs"> ${messageObject.sender.email} </small>
    <p class="text-sm"> ${messageObject.message} </p>`

    messageBox.appendChild(message);
  }

  const appendOutGoingMessage = (messageObject) => {

    const messageBox = document.querySelector('.message-box');
    const message = document.createElement('div');
    message.classList.add('message', 'ml-auto' , 'max-w-56' , 'flex' , 'flex-col' , 'bg-slate-50' , 'p-2' , 'rounded-md' , 'w-fit');
    message.innerHTML = `
    <small class="opacity-65 text-xs"> ${user.email} </small>
    <p class="text-sm"> ${messageObject} </p>`

    messageBox.appendChild(message);

  }



  const handleUserClick = (id) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSet = new Set(prevSelectedUserId);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return Array.from(newSet);
    });
  };

  const addCollaborators = () => {
    axios
      .put('/projects/add-user', {
        projectId: location.state.project._id,
        users: selectedUserId,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setIsModalOpen(false);
    setSelectedUserId([]);
  }

  const send = () => {
    console.log("the user is ", user);
    console.log("the message is ", message);
    appendOutGoingMessage(message);
    sendMessage('project-message', {
      message,
      sender: user
    });

    

    console.log("message sent");

    setMessage('');
  };



  console.log(location.state);
  return (
    <main className='h-screen w-screen flex'>
      <section className='left relative h-full min-w-96 flex flex-col bg-slate-300'>
        <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-100'>
          <button className='flex' onClick={() => setIsModalOpen(true)}>
            <i className='ri-add-fill mr-1'></i>
            <p>Add Collaborator</p>
          </button>
          <button
            className='p-2'
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          >
            <i className='ri-group-fill'></i>
          </button>
        </header>
        <div className='conversation-area flex-grow flex flex-col'>
          <div ref={messageBox} className='message-box flex-grow flex flex-col gap-1 p-1 max-h-[86vh] overflow-auto'>
            
            <div className='text-center font-semibold text-xl text-red-600'>Team Conversation</div>

            
          </div>
          <div className='inputField w-full flex'>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type='text'
              placeholder='Type a message'
              className='p-2 px-4 border-none outline-none flex-grow'
            />
            <button
              onClick={send}
              className='px-5 bg-slate-950 text-white'>
              <i className='ri-send-plane-fill'></i>
            </button>
          </div>
        </div>
        <div
          className={`sidePanel w-full h-full bg-slate-100 absolute transition-all flex flex-col gap-2 ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'
            } top-0`}
        >
          <header className='flex justify-between items-center p-2 px-3 bg-slate-200'>
            <h1 className='font-semibold text-lg'>Collaborators</h1>
            <button
              className='p-2'
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            >
              <i className='ri-close-fill'></i>
            </button>
          </header>
          <div className='users flex flex-col gap-2 overflow-y-auto'>
            {project.users && project.users.map((user) => (
              <div
                key={user._id}
                className='user flex gap-2 items-center cursor-pointer hover:bg-slate-200 p-2'
                onClick={() => handleUserClick(user._id)}
              >
                <div className='aspect-square rounded-full w-fit h-fit flex justify-center items-center bg-slate-600 px-4 py-3 text-white'>
                  <i className='ri-user-fill'></i>
                </div>
                <h1 className='font-semibold text-lg'>{user.email}</h1>
              </div>
            ))}
          </div>
        </div>
      </section>
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-4 rounded-md w-96 relative flex flex-col'>
            <header className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold'>Select a User</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className='text-red-500'
              >
                <i className='ri-close-fill'></i>
              </button>
            </header>
            <div className='flex flex-col gap-2 overflow-y-auto max-h-96 mb-4'>
              {users.map((user) => (
                <div
                  key={user._id}
                  className={`user flex gap-2 items-center cursor-pointer hover:bg-slate-200 p-2 ${selectedUserId.includes(user._id) ? 'bg-slate-200' : ''
                    }`}
                  onClick={() => handleUserClick(user._id)}
                >
                  <div className='aspect-square rounded-full w-fit h-fit flex justify-center items-center bg-slate-600 px-4 py-3 text-white'>
                    <i className='ri-user-fill'></i>
                  </div>
                  <h1 className='font-semibold text-lg'>{user.email}</h1>
                </div>
              ))}
            </div>
            <button className='bg-blue-500 text-white px-4 py-2 rounded-md self-center' onClick={addCollaborators}>
              Add Collaborators
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
