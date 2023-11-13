import  { useEffect, useState } from 'react';
import {TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography, Button, CircularProgress, Tabs, Tab} from '@mui/material';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import {selectedProblemTab} from 'store';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import {useRouter} from 'next/router';


type ProblemInfo = {
    problemCode: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    inputCases: String;
    expectedOutput: String;
  }
  
export default function Problems({session}: any){

    const [problems, setProblems] = useState<undefined|null|ProblemInfo[]>(undefined);
    const [solvedProblems, setSolvedProblems] = useState<undefined|null|ProblemInfo[]>(undefined);

    const [selectedTab, setSelectedTab] = useRecoilState(selectedProblemTab);

    const [reRender, setReRender] = useState(false);

    const router = useRouter();

    useEffect(function(){
        
        const fetchData = async function (){

          if(problems===undefined || problems===null){
  
            try{
              const allProblems = await axios.get('/api/problems');
              
              if(allProblems.status==200){
                setProblems(allProblems.data.problems);
              }
              else{
                setProblems(null);
              }
              
            }catch(error){
              setProblems(null);
            }
            
          }
              
          try{
  
            var solved_problems_details = await axios.get('/api/solvedProblems');
            if(solved_problems_details.status==200){
              setSolvedProblems(solved_problems_details.data.solvedProblemsDetails);
            }
            else{
              setSolvedProblems(null);
            }
  
          }catch(error){
            setSolvedProblems(null);
          }
        }
        
        fetchData();

    },[reRender]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: any) => {
      setSelectedTab(newValue);
    };

    if(problems===undefined){
      return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'74vh'}}>
          <CircularProgress/>
        </div>
      )
    }
    else if(problems===null){
      return (
        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'74vh'}}>
          <Typography variant='h6' sx={{fontWeight:'bold'}}>Cannot load data!</Typography>
            <br /><br />
            <Button variant='contained' size='small' sx={{ textTransform:'none', backgroundColor:'#645cff'}} onClick={function(){setProblems(undefined); setReRender(!reRender);}}>Refresh</Button>
        </div>
      )
    }
    else{
      return (
        <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>

          <div style={{marginTop:'4vh', marginBottom:'8vh'}}>
            <Tabs value={selectedTab} onChange={handleTabChange} centered sx={{display:'flex', justifyContent: 'space-between'}}>
              <Tab label="Problems" />
              {session && <Tab label="Solved Problems" />}
            </Tabs>
          </div>


          {selectedTab===0 && <TableContainer component={Paper} sx={{maxWidth:'95vw', minHeight:'55vh', alignSelf:'center'}}>
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
                      {problems.map((problem) => (
                          <TableRow key={problem.problemCode} sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor:'pointer' }}>
                            <TableCell component="th" scope="row" onClick={function(){router.push('/problem/'+problem.problemCode)}}>{problem.problemCode}</TableCell>
                            <TableCell onClick={function(){router.push('/problem/'+problem.problemCode)}}>{problem.title}</TableCell>
                            <TableCell onClick={function(){router.push('/problem/'+problem.problemCode)}}>{problem.category}</TableCell>
                            <TableCell onClick={function(){router.push('/problem/'+problem.problemCode)}}>{problem.difficulty}</TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                </Table>
            </TableContainer>}

            {selectedTab===1 && solvedProblems && solvedProblems?.length!=0 && <TableContainer component={Paper} sx={{maxWidth:'95vw', minHeight:'55vh', alignSelf:'center'}}>
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
                      {solvedProblems.map((problem) => (
                          <TableRow key={problem.problemCode} sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor:'pointer' }}>
                            <TableCell component="th" scope="row" onClick={function(){router.push('/problem/'+problem.problemCode)}}>{problem.problemCode}</TableCell>
                            <TableCell onClick={function(){router.push('/problem/'+problem.problemCode)}}>{problem.title}</TableCell>
                            <TableCell onClick={function(){router.push('/problem/'+problem.problemCode)}}>{problem.category}</TableCell>
                            <TableCell onClick={function(){router.push('/problem/'+problem.problemCode)}}>{problem.difficulty}</TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                </Table>
            </TableContainer>}

            {selectedTab===1 && solvedProblems===undefined && <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'20%'}}> <CircularProgress/> </div>}

            {selectedTab===1 && solvedProblems===null && <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'64vh'}}> <Typography variant='h6' sx={{fontWeight:'bold'}}>Cannot load data!</Typography> <br /><br /> <Button variant='contained' size='small' sx={{ textTransform:'none', backgroundColor:'#645cff'}} onClick={function(){setSolvedProblems(undefined); setReRender(!reRender);}}>Refresh</Button> </div>}

            {selectedTab === 1 && solvedProblems?.length==0 && <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'64vh', border:'0px solid black'}}> No solved problems yet! </div> }
          
            
        </div>
      );
    }

    
}

export async function getServerSideProps(context: any){

  const session = await getServerSession(context.req, context.res, authOptions);  
  return { props: {session} };
}