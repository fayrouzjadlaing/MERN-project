import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";
const Chat = () => {
  const [currentChat, setCurrentChat] = useState(undefined);

  const navigate = useNavigate();
  const socket = useRef();

  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
      );
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    }

    fetchData();
  }, [currentUser]);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  /*useEffect(() => {
    let isMounted = true;
    const fetchData = () => {
      if (currentUser && currentUser.isAvatarImageSet) {
        return axios.get(`${allUsersRoute}/${currentUser._id}`);
      } else {
        return Promise.reject(new Error("Avatar image is not set."));
      }
    };

    fetchData()
      .then((response) => {
        if (isMounted) {
          setContacts(response.data);
        }
      })
      .catch((error) => {
        // Handle error
        if (isMounted) {
          navigate("/setAvatar");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser]);*/

  /*useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);*/
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} changeChat={handleChatChange} />
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </Container>
  );
};

export default Chat;
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
