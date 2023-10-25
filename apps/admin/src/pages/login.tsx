//import React from 'react';
import { useState, useEffect } from 'react';
import {useRouter} from 'next/router';
import { Typography, Card, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useRecoilState } from 'recoil';
import { isAdminLoggedInState } from '@/store/atoms/user';
import axios from 'axios';

export default function Login() {

  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isAdminLoggedInState);  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    text: '',
    severity: ''
  });

  useEffect(function(){
    axios.get('/api/me', {
      headers:{
        'Authorization':'Bearer '+localStorage.getItem('token')
      }
    }).then(function(res){
      if(res.status==200){
        setIsLoggedIn(true);
        router.push('/');
      }
      else{
        setIsLoggedIn(false);
      }
    }).catch(function(){
      setIsLoggedIn(false);
    });
  },[]);
    
  function handleSignIn(){
    axios.post('/api/login', {
      username: email,
      password: password
    }).then(function(res){
        if(res.status==200){
            localStorage.setItem('token', res.data.token);
            setIsLoggedIn(true);
            router.push('/');
            setSnackbar({
                open: true,
                text: 'Login successful',
                severity: 'success'
            });
        }
      }).catch(function(res){
        setSnackbar({
            open: true,
            text: 'Login Failed. Please try again!',
            severity: 'error'
        });
      });      
  }

  const handleSnackbarClose = () => {
    setSnackbar({...snackbar, open:false});
  };

  return <div style={{height:'70vh', border:'0px solid black'}}>
        <div style={{display:'flex', justifyContent:'center', marginTop:75}}>     
            <Typography variant="h6">Code Town admin sign In</Typography>
        </div>
        <div style={{display:'flex', justifyContent:'center'}}>
            <Card variant="outlined" style={{width:400, padding:70, marginTop:20, borderRadius:'8px'}}>
                <TextField variant="outlined" fullWidth={true} label='Email' onChange={function(e){setEmail(e.target.value)}}></TextField>
                <br/><br/>
                <TextField variant="outlined" fullWidth={true} label='Password' type='password' onChange={function(e){setPassword(e.target.value)}} onKeyUp={function(e){if(e.key=='Enter'){handleSignIn();}}}></TextField>
                <br/><br/><br/><br/>
                <Button variant="contained" fullWidth={true} sx={{backgroundColor:'#645cff'}} onClick={handleSignIn}>Sign In</Button>
            </Card>
        </div>
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{vertical:'bottom', horizontal:'center'}}><Alert severity={snackbar.severity=='error'?"error":"success"}>{snackbar.text}</Alert></Snackbar>
    </div>
}
