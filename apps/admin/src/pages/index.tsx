import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { Typography, CircularProgress, useMediaQuery, Button, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { useRecoilState } from 'recoil';
import { isAdminLoggedInState } from '@/store/atoms/user';
import {useRouter} from 'next/router';
import axios from 'axios';


const inter = Inter({ subsets: ['latin'] });

type ProblemInfo = {
    problemCode: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    solution: string;
  }

export default function Home() {

  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isAdminLoggedInState);
  const [allProblems, setAllProblems] = useState<undefined|null|ProblemInfo[]>(undefined);


  useEffect(function(){

    const fetchData = async function(){

      try{
        var me = await axios.get('/api/me', {
          headers:{
            'Authorization':'Bearer '+localStorage.getItem('token')
          }
        });
        if(me.status==200){
          setIsLoggedIn(true);
        }
        else{
          setIsLoggedIn(false);
          router.push('/login');
        }
      }catch(e){
        setIsLoggedIn(false);
        router.push('/login');
      }

      if(isLoggedIn){
        try{
          var all_problems = await axios.get('/api/allProblems', {
            headers:{
              'Authorization':'Bearer '+localStorage.getItem('token')
            }
          });
          if(all_problems.status==200){
            setAllProblems(all_problems.data.problems);
          }
          else{
            setAllProblems(null);
          }
        }catch(e){
          setAllProblems(null);
        }
      }


    }
    
    fetchData();

  },[isLoggedIn]);

  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  return (
    <div style={{display:'flex', flexDirection:'column', minHeight:'78vh'}}>
      
      <div style={{display:'flex', justifyContent:isSmallScreen ? 'space-between' : 'space-between', marginTop:'7vh', marginBottom:'7vh', marginLeft:isSmallScreen ? '0' : '5vw', marginRight:isSmallScreen ? '0' : '5vw', fontWeight:'lighter'}}>
        <Typography variant='h5' fontWeight='normal'>All problems</Typography>
        <Button variant='outlined' size='small' sx={{textTransform:'none', fontSize:'15px', color:'green', borderColor:'green'}} onClick={()=>{router.push('/addproblem')}}>Add problem</Button>
      </div>

      {allProblems===undefined && <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'20%'}}> <CircularProgress/> </div>}

      {allProblems===null && <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'20%'}}> Could not load data! </div>}

      {allProblems && <TableContainer component={Paper} sx={{maxWidth:'95vw', justifySelf:'center', alignSelf:'center'}}>
                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                          <TableCell sx={{fontWeight:'bold', fontSize:'18px'}}>Problem Code</TableCell>
                          <TableCell sx={{fontWeight:'bold', fontSize:'18px'}}>Title</TableCell>
                          <TableCell sx={{fontWeight:'bold', fontSize:'18px'}}>Category</TableCell>
                          <TableCell sx={{fontWeight:'bold', fontSize:'18px'}}>Difficulty</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allProblems.map((problem) => (
                          <TableRow key={problem.title} sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor:'pointer' }}>
                            <TableCell component="th" scope="row" onClick={function(){router.push('/editproblem/'+problem.problemCode)}}>{problem.problemCode}</TableCell>
                            <TableCell onClick={function(){router.push('/editproblem/'+problem.problemCode)}}>{problem.title}</TableCell>
                            <TableCell onClick={function(){router.push('/editproblem/'+problem.problemCode)}}>{problem.category}</TableCell>
                            <TableCell onClick={function(){router.push('/editproblem/'+problem.problemCode)}}>{problem.difficulty}</TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                </Table>
            </TableContainer>
      }

    </div>
  )
}
