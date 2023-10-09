import { useEffect, useState, useRef } from 'react';
import {useRouter} from 'next/router';
import axios from 'axios';
import { Typography, Button, Tab, Tabs, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { themeColors } from 'ui';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import {ArrowBack} from '@mui/icons-material';


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
    
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('c');

    const editorRef = useRef(null);

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

    const handleLanguageChange = function(event){
        setLanguage(event.target.value as string);
    }

    const handleClick = (event) => {
        
      };
    

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
                <div style={{display:'flex', marginTop:'4vh', marginBottom:'4vh', paddingLeft:'10px'}}>
                    <Button sx={{color:themeColors.Brown}} onClick={()=>{router.back()}}><ArrowBack/></Button>
                    <Typography variant='h5'>{problemDetails.title}</Typography>
                </div>
                <div style={{height:'7vh', backgroundColor:'#F8F8F8', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <div style={{display:'flex', justifyContent:'space-between', width:'48vw', border:'0px solid black'}}>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', marginLeft:'1vw'}}>Statement</Typography>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', marginRight:'1vw'}}>Difficulty: {problemDetails.difficulty}</Typography>
                    </div>
                    <div style={{display:'flex', justifyContent:'flex-end', width:'52vw', border:'0px solid black'}}>
                        <FormControl>
                            <InputLabel id='language-dropdown' size='small'>Language</InputLabel>
                            <Select label='Language' labelId='language-dropdown' size='small' sx={{width:200, fontSize:16}} value={language} onChange={handleLanguageChange}>
                                <MenuItem value='c'>C</MenuItem>
                                <MenuItem value='cpp'>C++ 14</MenuItem>
                                <MenuItem value='javascript'>JavaScript</MenuItem>
                                <MenuItem value='python'>Python</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    
                </div>
                <div style={{display:'flex'}}>
                    <div style={{width:'50vw', height:'auto', paddingLeft:'15px', paddingRight:'15px', paddingTop:'22px', paddingBottom:'20px', overflowX:'auto', border:'0px solid black'}}>
                        <p style={{fontWeight:'lighter', fontSize:'18px', whiteSpace:'pre-wrap'}}>
                            {problemDetails.description}
                            <br /><br />
                        </p>
                    </div>
                    <div style={{display:'flex', flexDirection:'column'}}>

                        <div style={{width:'50vw', height:'74vh', border:'5px solid lightgrey'}}>
                            <CodeMirror value={code} lang="js" onChange={(val) => setCode(val)} ref={editorRef} minHeight="74vh" maxHeight="74vh" basicSetup={{highlightActiveLineGutter: true, highlightActiveLine: true}} theme={'dark'} onClick={()=>{}} />
                        </div>
                        <br />
                        <Button variant='contained' sx={{width:'100px', alignSelf:'flex-end', backgroundColor:themeColors.Brown}} onClick={()=>{alert(code)}}>Submit</Button>
                    </div>
                </div>
            </div>
        );
    }

    
}