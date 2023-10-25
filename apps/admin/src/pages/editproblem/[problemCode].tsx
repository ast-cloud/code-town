import { useEffect, useState, useRef } from 'react';
import { Typography, Card, TextField, Button, IconButton, useMediaQuery, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, CircularProgress, Snackbar, Alert, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { isAdminLoggedInState } from '@/store/atoms/user';
import { themeColors } from 'ui';
import {useRouter} from 'next/router';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { modules, formats } from "../../components/EditorToolbar";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { EditorView } from '@codemirror/view';

type ProblemDetailsInfo = {
    problemCode: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    inputCases: string;
    expectedOutput: string;
  }

type CategoryInfo = {
    categoryId: string;
    categoryName: string;
  }

var javaPresetCode = `/* package codetown; // don't place package name! */

  import java.util.*;
  import java.lang.*;
  import java.io.*;
      
  /* Name of the class has to be "Main" only if the class is public. */
  class Codetown
  {
      public static void main (String[] args) throws java.lang.Exception
      {
          // your code goes here
              
      }
  }
`

export default function EditProblem(){

    const router = useRouter();


    const [isLoggedIn, setIsLoggedIn] = useRecoilState(isAdminLoggedInState);
    const [problemDetails, setProblemDetails] = useState<undefined|null|ProblemDetailsInfo>(undefined);

    const [problemCode, setProblemCode] = useState(String(router.query.problemCode));
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [category, setCategory] = useState('');
    const [formattedDescription, setFormattedDescription] = useState('');
    const [inputCases, setInputCases] = useState('');
    const [expectedOutput, setExpectedOutput] = useState('');

    const [allCategories, setAllCategories] = useState<undefined|null|CategoryInfo[]>(undefined);


    const [reRender, setReRender] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        text: '',
        severity: ''
      });

    const [selectedTab, setSelectedTab] = useState(0);


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
                  var problem_details = await axios.get('/api/problem/'+problemCode, {
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token')
                    }
                  });
                  if(problem_details.status==200){
                    setProblemDetails(problem_details.data.problem);
                  }
                  else{
                    setProblemDetails(null);
                  }
                }catch(e){
                  setProblemDetails(null);
                }
                try{
                    var all_categories = await axios.get('/api/allCategories');
                    if(all_categories.status==200){
                      setAllCategories(all_categories.data.categories);
                    }
                    else{
                      setAllCategories(null);
                    }
                }catch(e){
                    setAllCategories(null);
                }
              }
        }

        fetchData();

    },[isLoggedIn, reRender]);

    function handleEditProblem(){
        axios.put('/api/editProblem/'+problemCode, {
            problemCode: problemCode,
            title: title===''?problemDetails.title:title,
            difficulty: difficulty===''?problemDetails.difficulty:difficulty,
            category: category===''?problemDetails.category:category,
            description: formattedDescription===''?problemDetails.description:formattedDescription,
            inputCases: inputCases===''?problemDetails.inputCases:inputCases,
            expectedOutput: expectedOutput===''?problemDetails.expectedOutput:expectedOutput
        }, {
            headers:{
                'Authorization':'Bearer '+localStorage.getItem('token')
            }
        }).then(function(res){
            if(res.status==200){
                router.push('/');
                setSnackbar({
                    open: true,
                    text: 'Problem edited successfully',
                    severity: 'success'
                });
            }
        }).catch(function(res){
            setSnackbar({
                open: true,
                text: 'Cannot edit problem. Please try again!',
                severity: 'error'
            });
        });
    }

    function handleDeleteProblem(){
        axios.delete('/api/deleteProblem/'+problemCode, {
            headers:{
                'Authorization':'Bearer '+localStorage.getItem('token')
            }
        }).then(function(res){
            if(res.status==200){
                router.push('/');
                setSnackbar({
                    open: true,
                    text: 'Problem deleted successfully',
                    severity: 'success'
                });
            }
        }).catch(function(res){
            setSnackbar({
                open: true,
                text: 'Cannot delete problem. Please try again!',
                severity: 'error'
            });
        });
    }

    function handleDifficultyChange(event: SelectChangeEvent){
        setDifficulty(event.target.value as string);
    }
    function handleCategoryChange(event: SelectChangeEvent){
        setCategory(event.target.value as string);
    }

    const handleSnackbarClose = () => {
        setSnackbar({...snackbar, open:false});
      };

    const handleTabChange = (event: React.SyntheticEvent, newValue: any) => {
        setSelectedTab(newValue);
    };

    const QuillOnChange = (value)=>{
        setFormattedDescription(value);
    }


    if(problemDetails===undefined || allCategories===undefined){
        return(
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'74vh'}}>
              <CircularProgress/>
            </div>
        )
    }
    else if(problemDetails===null || allCategories===null){
        return(
            <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'74vh'}}>
              <Typography variant='h6' sx={{fontWeight:'bold'}}>Cannot load data!</Typography>
                <br /><br />
                <Button variant='contained' size='small' sx={{ textTransform:'none', backgroundColor:'#645cff'}} onClick={function(){setProblemDetails(undefined); setAllCategories(undefined); setReRender(!reRender);}}>Refresh</Button>
            </div>
        )
    }
    else{

        return (
            <div style={{display:'flex', flexDirection:'column'}}>
                <div style={{display:'flex', justifyContent:'center', marginTop:'8vh', marginBottom:'8vh'}}>
                    {/* <Typography variant='h5'>Edit problem</Typography> */}
                    <Tabs value={selectedTab} onChange={handleTabChange} >
                        <Tab label='Edit problem details' sx={{fontSize:'18px', textTransform:'none'}}/>
                        <Tab label='Edit / Add solutions' sx={{fontSize:'18px', textTransform:'none'}}/>
                    </Tabs>
                </div>
                {selectedTab==0 && <div>

                    <div style={{display:'flex', marginLeft:'1vw', marginRight:'1vw', border:'0px solid black'}}>
                        <TextField variant='outlined' size='small' label='Problem Code' defaultValue={problemDetails.problemCode} onChange={()=>{}} disabled></TextField>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <TextField variant='outlined' size='small' label='Title' sx={{width:'20vw'}} defaultValue={problemDetails.title} onChange={function(e){setTitle(e.target.value)}}></TextField>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <FormControl>
                            <InputLabel id='difficulty-dropdown' size='small'>Difficulty</InputLabel>
                            <Select label='Difficulty' labelId='difficulty-dropdown' size='small' sx={{width:200, fontSize:16}} defaultValue={problemDetails.difficulty}  onChange={handleDifficultyChange}>
                                <MenuItem value='Easy'>Easy</MenuItem>
                                <MenuItem value='Medium'>Medium</MenuItem>
                                <MenuItem value='Hard'>Hard</MenuItem>
                            </Select>
                        </FormControl>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <FormControl>
                            <InputLabel id='category-dropdown' size='small'>Category</InputLabel>
                            <Select label='Category' labelId='category-dropdown' size='small' sx={{width:250, fontSize:16}} defaultValue={problemDetails.category} onChange={handleCategoryChange}>
                                {
                                    allCategories.map(function(category){
                                        return <MenuItem value={category.categoryName}>{category.categoryName}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <Button variant='contained' size='small' sx={{justifySelf:'flex-end', marginLeft:'auto', textTransform:'none', backgroundColor:'#C70000', fontSize:'15px', width:'75px', height:'35px'}} onClick={handleDeleteProblem}>Delete</Button>
                    </div>
        
                    <br /><br />
        
                    <div style={{display:'flex', flexDirection:'column', marginLeft:'1vw', marginRight:'1vw', border:'0px solid black'}}>
                        {/* <TextField variant='outlined' fullWidth label='Description' multiline minRows={15} maxRows={20} onChange={function(e){setDescription(e.target.value)}}></TextField> */}
                        <EditorToolbar />
                        <ReactQuill theme="snow" style={{height:'60vh', width:'90vw', marginBottom:'2vh', border:'1px solid black', borderRadius:'5px', overflow:'auto'}} placeholder='Description' modules={modules} formats={formats} defaultValue={problemDetails.description} onChange={QuillOnChange} />
                    </div>

                    <br /><br />

                    <div style={{display:'flex'}}>
                        <div style={{display:'flex', marginLeft:'1vw', marginRight:'1vw', border:'0px solid black', width:'50vw'}}>
                            <TextField variant='outlined' fullWidth label='Input cases' multiline minRows={15} maxRows={20} defaultValue={problemDetails.inputCases} onChange={function(e){setInputCases(e.target.value)}}></TextField>
                        </div>  
                        <div style={{display:'flex', marginLeft:'1vw', marginRight:'1vw', border:'0px solid black', width:'50vw'}}>
                            <TextField variant='outlined' fullWidth label='Expected output' multiline minRows={15} maxRows={20} defaultValue={problemDetails.expectedOutput} onChange={function(e){setExpectedOutput(e.target.value)}}></TextField>
                        </div>
                    </div>    

                    <br /><br />

                    <div style={{display:'flex', justifyContent:'center', marginRight:'1vw', border:'0px solid black'}}>
                        <Button size='small' variant='contained' sx={{width:'85px', fontSize:'15px', textTransform:'none', backgroundColor:themeColors.Brown}} onClick={handleEditProblem}>Save</Button>
                    </div>
                    
                
                </div>}

                {selectedTab==1 && <AddSolutions problemCode={problemCode} setSnackbar={setSnackbar}/>}

                <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{vertical:'bottom', horizontal:'center'}}><Alert severity={snackbar.severity=='error'?"error":"success"}>{snackbar.text}</Alert></Snackbar>
            </div>
        );
    }
}

function AddSolutions({problemCode, setSnackbar}){

    const [cCode, setCCode] = useState('');
    const [cppCode, setCppCode] = useState('');
    const [javaCode, setJavaCode] = useState(javaPresetCode);
    const [javascriptCode, setJavascriptCode] = useState('');
    const [pythonCode, setPythonCode] = useState('');
    const [language, setLanguage] = useState('c');

    const [solutions, setSolutions] = useState(undefined);

    const [codeSubmissionLoading, setCodeSubmissionLoading] = useState(false);

    const [reRender, setReRender] = useState(false);

    const editorRef = useRef(null);
    
    useEffect(function(){
        const fetchData = async function(){

            try{
                var all_solutions = await axios.get('/api/solutions/'+problemCode, {
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token')
                    }
                });
                if(all_solutions.status==200){
                    setSolutions(all_solutions.data.solutions);
                }
                else if(all_solutions.status==204){
                    setSolutions(false);
                }
                else{
                    setSolutions(null);
                }
            }catch(e){
                setSolutions(null);
            }
        }
        
        fetchData();
    },[reRender]);

    useEffect(function(){
        if(solutions){
            setCCode(solutions.c||'');
            setCppCode(solutions.cpp||'');
            setJavaCode(solutions.java||javaPresetCode);
            setJavascriptCode(solutions.javascript||'');
            setPythonCode(solutions.python||'');
        }
    },[solutions]);

    const codeValue = {
        'c': cCode,
        'cpp': cppCode,
        'java':javaCode,
        'javascript': javascriptCode,
        'python': pythonCode
    };

    const handleLanguageChange = function(event){
        setLanguage(event.target.value as string);
    }

    const languageModes = {
        'c': cpp(),
        'cpp': cpp(),
        'java': java(),
        'javascript': javascript(),
        'python': python()
    };
    const languageExtensions = {
        'c': [cpp()],
        'cpp': [cpp()],
        'java': [java()],
        'javascript': [javascript()],
        'python': [python()]
    };
    
    const setCodeFunction = function(val){
        if(language==='c'){
            setCCode(val);
        }
        else if(language==='cpp'){
            setCppCode(val);
        }
        else if(language==='java'){
            setJavaCode(val);
        }
        else if(language==='javascript'){
            setJavascriptCode(val);
        }
        else if(language==='python'){
            setPythonCode(val);
        }
    }

    const handleCodeSubmit = async function(){
        setCodeSubmissionLoading(true);
        try{
            var results = await axios.post('/api/saveSolution/'+problemCode, {
                language: language,
                code: codeValue[language]
            }, {
                headers:{
                    'Authorization':'Bearer '+localStorage.getItem('token')
                }
            });
            if(results.status==200){
                setCodeSubmissionLoading(false);
                setSnackbar({
                    open: true,
                    text: 'Solution saved successfully for '+language,
                    severity: 'success'
                });
            }
            else{
                setCodeSubmissionLoading(false);
                setSnackbar({
                    open: true,
                    text: 'Cannot submit code. Please try again!',
                    severity: 'error'
                });
            }
        }catch(e){
            setCodeSubmissionLoading(false);
            setSnackbar({
                open: true,
                text: 'Cannot submit code. Please try again!',
                severity: 'error'
            });
        }
    }

    if(solutions===undefined){
        return(
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'74vh'}}>
              <CircularProgress/>
            </div>
        )
    }
    else if(solutions===null){
        return(
            <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'74vh'}}>
              <Typography variant='h6' sx={{fontWeight:'bold'}}>Cannot load data!</Typography>
                <br /><br />
                <Button variant='contained' size='small' sx={{ textTransform:'none', backgroundColor:'#645cff'}} onClick={function(){setSolutions(undefined); setReRender(!reRender);}}>Refresh</Button>
            </div>
        );
    }
    else{
        return (
            <div style={{marginLeft:'2vw'}}>
                <div style={{}}>
                    <FormControl>
                        <InputLabel id='language-dropdown' size='small'>Language</InputLabel>
                        <Select label='Language' labelId='language-dropdown' size='small' sx={{width:200, fontSize:16}} value={language} onChange={handleLanguageChange}>
                            <MenuItem value='c'>C</MenuItem>
                            <MenuItem value='cpp'>C++ 14</MenuItem>
                            <MenuItem value='java'>Java</MenuItem>
                            {/* <MenuItem value='javascript'>JavaScript</MenuItem> */}
                            <MenuItem value='python'>Python</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div style={{width:'50vw', height:'70vh', marginTop:'2vh', border:'5px solid #282C34', borderRadius:'5px'}}>
                    <CodeMirror value={codeValue[language]} lang={languageModes[language]} onChange={(val) => setCodeFunction(val)} ref={editorRef} minHeight="70vh" maxHeight="70vh" basicSetup={{highlightActiveLineGutter: true, highlightActiveLine: true, syntaxHighlighting: true}} style={{fontSize:'18px'}} theme={'dark'} extensions={[languageExtensions[language], EditorView.lineWrapping]} onClick={()=>{}} />
                </div>
                <br />
                <Button variant='contained' sx={{width:'100px', alignSelf:'flex-end', textTransform:'none', letterSpacing:2, backgroundColor:themeColors.Brown}} onClick={handleCodeSubmit}>Save</Button>
                
            </div>
        );
    }

    
}