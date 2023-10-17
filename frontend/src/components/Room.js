import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";



export default function Room({leaveRoomCallback}) {
  const navigate = useNavigate()
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuth, setSpotifyAuth] = useState(false);
  const { roomCode  } = useParams();

  const [song, setSong] = useState({});

  useEffect(() => {
    const intervalId = setInterval(getCurrentSong, 1000);

    return () => {
      // This function will be called when the component unmounts
      clearInterval(intervalId);
    };
  }, []);

  const getRoomDetails = async () => {
    try {
      const response = await fetch("/api/get-room?code=" + roomCode);
      if (!response.ok) {
          leaveRoomCallback();
          navigate("/");
          return;
        }

      const data = await response.json();
      setVotesToSkip(data.votes_to_skip);
      setGuestCanPause(data.guest_can_pause);
      setIsHost(data.is_host);
      
      console.log(data)
      if(data.is_host){
        authenticateSpotify()
      }
    } 
      catch (error) {
      console.error("Error fetching room details:", error);
    }    
  };

  useEffect(() => {
     const getDetails = ()  => getRoomDetails()
        getDetails();
        getCurrentSong()
      }, [roomCode]);


    const authenticateSpotify=()=> {
        fetch("/spotify/is-authenticated")
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setSpotifyAuth({status:data.status});
            console.log(data.status);
            if (!data.status) {
              fetch("/spotify/get-auth-url")
                .then((response) => response.json())
                .then((data) => {
                  window.location.replace(data.url);
                });
            }
          });
      }

     const getCurrentSong=() =>{
        fetch("/spotify/current-song")
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch current song data.");
            } else {
              return response.json();
            }
          })
          .then((data) => {
            setSong(data);
            console.log(data);
          });
      }

      const leaveButtonPressed=() =>{
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        };
        fetch("/api/leave-room", requestOptions).then((_response) => {
          leaveRoomCallback();
          navigate("/");
        });
      }

      const updateShowSettings=(value) =>{
          setShowSettings(value)
      }
    
     
      const renderSettings=() =>{
        return (
          <Grid container spacing={1}>
            <Grid item xs={12} align="center">
              <CreateRoomPage
                update={true}
                votesToSkipProp={votesToSkip}
                guessCanPauseProp={guestCanPause}
                roomCode={roomCode}
                updateCallback={getRoomDetails}
              />
            </Grid>
            <Grid item xs={12} align="center">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => updateShowSettings(false)}
              >
                Close
              </Button>
            </Grid>
          </Grid>
        );
      }

      const renderSettingsButton=() =>{
        return (
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => updateShowSettings(true)}
            >
              Settings
            </Button>
          </Grid>
        );
      }

    return (
        <div>
            {showSettings ? renderSettings(): 
        <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {roomCode}
          </Typography>
        </Grid>
        <MusicPlayer {...song}/>
        {isHost ? renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={leaveButtonPressed}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
}
    </div>
 
    );
    
  }
