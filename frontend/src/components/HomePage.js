import React, {useState, useEffect} from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import {BrowserRouter,Routes,Route,Link,useNavigate,} from "react-router-dom";


function HomePage() {
    const [roomCode, setRoomCode] = useState(null)

    useEffect(() => {
        async function fetchData() {
          try {
            const response = await fetch("/api/user-in-room");
            const data = await response.json();
            setRoomCode(data.code);
          } catch (error) {
            console.error("Error fetching room code:", error);
          }
        }
        fetchData();
      }, []);
   
      function RenderHomePage() {
        const navigate = useNavigate();
    
        useEffect(() => {
            if (roomCode) {
              navigate(`/room/${roomCode}`);
            }
          }, [roomCode, navigate]);
    
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} align="center">
              <Typography variant="h3" compact="h3">
                House Party
              </Typography>
            </Grid>
            <Grid item xs={12} align="center">
              <ButtonGroup disableElevation variant="contained" color="primary">
                <Button color="primary" to="/join" component={Link}>
                  Join a Room
                </Button>
                <Button color="secondary" to="/create" component={Link}>
                  Create a Room
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        );
      }
     const clearRoomCode=()=> {
        setRoomCode(null)
      }
    return (
            <BrowserRouter>
            <Routes>
                <Route exact path="/"  element={<RenderHomePage/>} /> 
                <Route path="/join" element={<RoomJoinPage />} />
                <Route path="/create" element={<CreateRoomPage />} />
                <Route path="/room/:roomCode" element={<Room leaveRoomCallback={clearRoomCode} />} />
            </Routes>
        </BrowserRouter>
    );
}


export default HomePage;
