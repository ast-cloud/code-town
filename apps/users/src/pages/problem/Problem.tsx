import { useEffect, useState } from 'react';
import {useRouter} from 'next/router';
import axios from 'axios';
import { Typography, Button, Tab, Tabs, CircularProgress } from '@mui/material';
import { themeColors } from 'ui';


type ProblemDetailsInfo = {
    problemCode: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
  }

export default function Problem(props: {problemCode:string|string[]|undefined}){

    const router = useRouter();

    //const problemCode = router.query.problemCode;

    const [problemDetails, setProblemDetails] = useState<undefined|null|ProblemDetailsInfo>(undefined);
    const [reRender, setReRender] = useState(false);

    useEffect(function(){

        const fetchData = async function(){
            
            try{

                const problemDetails = await axios.get('/api/problem/'+props.problemCode);
                
                if(problemDetails.status==200){
                    console.log('problemDetails.data.problem - ', problemDetails.data.problem);
                    setProblemDetails(problemDetails.data.problem);
                }
                else{
                    setProblemDetails(null);
                }
            }catch(error){
                setProblemDetails(null);
            }

        }

        fetchData();

    },[reRender]);

    if(problemDetails===undefined){
        return(
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'74vh'}}>
            <CircularProgress/>
          </div>
        )
    }
    else if(problemDetails===null){
        return(
          <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'74vh'}}>
            <Typography variant='h6' sx={{fontWeight:'bold'}}>Cannot load data!</Typography>
              <br /><br />
              <Button variant='contained' size='small' sx={{ textTransform:'none', backgroundColor:themeColors.Brown}} onClick={function(){setProblemDetails(undefined); setReRender(!reRender);}}>Refresh</Button>
          </div>
        )
    }
    else{
        
        return(
            <div>
                <div style={{marginTop:'2vh', marginBottom:'4vh', paddingLeft:'10px'}}>
                    <Typography variant='h5'>{problemDetails.title}</Typography>
                </div>
                <div style={{height:'7vh', backgroundColor:'#F8F8F8', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <Typography variant='subtitle1' sx={{fontWeight:'bold', marginLeft:'1vw'}}>Statement</Typography>
                    <Typography variant='subtitle1' sx={{fontWeight:'bold', marginRight:'1vw'}}>Difficulty: {problemDetails.difficulty}</Typography>
                </div>
                <div style={{display:'flex'}}>
                    <div style={{width:'50vw', height:'68vh', paddingLeft:'15px', paddingRight:'15px', paddingTop:'22px', paddingBottom:'20px', overflowX:'auto', border:'1px solid black'}}>
                        <p style={{fontWeight:'lighter', fontSize:'18px', whiteSpace:'pre-wrap'}}>
                            {problemDetails.description}
                            <br /><br />
                        </p>
                    </div>
                    <div style={{width:'50vw', height:'74vh', border:'1px solid black'}}>

                    </div>
                </div>
            </div>
        );
    }

    
}