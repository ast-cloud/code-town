import { useEffect, useState, useRef } from 'react';
import {useRouter} from 'next/router';
import axios from 'axios';
import { Typography, Button, Tab, Tabs, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { themeColors } from 'ui';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { EditorView } from '@codemirror/view';
import {ArrowBack} from '@mui/icons-material';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';

type ProblemDetailsInfo = {
    problemCode: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
  }

const myTheme = createTheme({
    theme: 'dark',
    settings: {
      background: 'yellow',
      backgroundImage: '',
      foreground: '#75baff',
      caret: '#5d00ff',
      selection: '#036dd626',
      selectionMatch: '#036dd626',
      lineHighlight: '#8a91991a',
      gutterBorder: '1px solid #ffffff10',
      gutterBackground: '#fff',
      gutterForeground: '#8a919966',
    },
    styles: [
      { tag: t.comment, color: '#787b8099' },
      { tag: t.variableName, color: '#0080ff' },
      { tag: [t.string, t.special(t.brace)], color: '#5c6166' },
      { tag: t.number, color: '#5c6166' },
      { tag: t.bool, color: '#5c6166' },
      { tag: t.null, color: '#5c6166' },
      { tag: t.keyword, color: '#5c6166' },
      { tag: t.operator, color: '#5c6166' },
      { tag: t.className, color: '#5c6166' },
      { tag: t.definition(t.typeName), color: '#5c6166' },
      { tag: t.typeName, color: '#5c6166' },
      { tag: t.angleBracket, color: '#5c6166' },
      { tag: t.tagName, color: '#5c6166' },
      { tag: t.attributeName, color: '#5c6166' },
    ],
  });
  
export default function Problem(props: {problemCode:string|string[]|undefined}){

    const router = useRouter();

    //const problemCode = router.query.problemCode;

    const [problemDetails, setProblemDetails] = useState<undefined|null|ProblemDetailsInfo>(undefined);
    const [reRender, setReRender] = useState(false);
    
    const [cCode, setCCode] = useState('');
    const [cppCode, setCppCode] = useState('');
    const [javascriptCode, setJavascriptCode] = useState('');
    const [pythonCode, setPythonCode] = useState('');
    const [language, setLanguage] = useState('c');

    const editorRef = useRef(null);

    useEffect(function(){

        const fetchData = async function(){
            
            try{

                const problem_details = await axios.get('/api/problem/'+props.problemCode);
                
                if(problem_details.status==200){
                    console.log('problemDetails.data.problem - ', problem_details.data.problem);
                    setProblemDetails(problem_details.data.problem);
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

    const handleCodeSubmit = function(){
        
    }
    

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

        const languageModes = {
            'javascript': javascript(),
            'c': cpp(),
            'cpp': cpp(),
            'python': python()
        };
        const languageExtensions = {
            'javascript': [javascript()],
            'c': [cpp()],
            'cpp': [cpp()],
            'python': [python()]
        };
        const codeValue = {
            'javascript': javascriptCode,
            'c': cCode,
            'cpp': cppCode,
            'python': pythonCode
        };
        const setCodeFunction = function(val){
            if(language==='c'){
                setCCode(val);
            }
            else if(language==='cpp'){
                setCppCode(val);
            }
            else if(language==='javascript'){
                setJavascriptCode(val);
            }
            else if(language==='python'){
                setPythonCode(val);
            }
        }
        return(
            <div>
                <div style={{display:'flex', marginTop:'4vh', marginBottom:'4vh', paddingLeft:'10px'}}>
                    <Button sx={{color:themeColors.Brown}} onClick={()=>{router.back()}}><ArrowBack/></Button>
                    <Typography variant='h5' textAlign='end' justifyContent='center' color='#363636'>{problemDetails.title}</Typography>
                    &nbsp;&nbsp;
                    <Typography variant='body1' marginTop='5px'>{`(P Code : ${problemDetails.problemCode})`}</Typography>
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
                        <Typography style={{fontWeight:'lighter', fontSize:'17px', whiteSpace:'pre-wrap'}}>
                            {problemDetails.description}
                            <br /><br />
                        </Typography>
                    </div>
                    <div style={{display:'flex', flexDirection:'column'}}>

                        <div style={{width:'50vw', height:'74vh', border:'5px solid lightgrey'}}>
                            <CodeMirror value={codeValue[language]} lang={languageModes[language]} onChange={(val) => setCodeFunction(val)} ref={editorRef} minHeight="74vh" maxHeight="74vh" basicSetup={{highlightActiveLineGutter: true, highlightActiveLine: true, syntaxHighlighting: true}} style={{fontSize:'20px'}} theme={'dark'} extensions={languageExtensions[language]} onClick={()=>{}} />
                        </div>
                        <br />
                        <Button variant='contained' sx={{width:'100px', alignSelf:'flex-end', backgroundColor:themeColors.Brown}} onClick={handleCodeSubmit}>Submit</Button>
                    </div>
                </div>
            </div>
        );
    }

    
}