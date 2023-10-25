import { useEffect, useState } from 'react';
import { Typography, Card, TextField, Button, IconButton, useMediaQuery, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, CircularProgress, Snackbar, Alert } from '@mui/material';
import {FormatBold, FormatItalic} from '@mui/icons-material';
import { themeColors } from 'ui';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { isAdminLoggedInState } from '@/store/atoms/user';
import {useRouter} from 'next/router';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { modules, formats } from "../components/EditorToolbar";


type CategoryInfo = {
    categoryId: string;
    categoryName: string;
  }

export default function AddProblem(){

    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useRecoilState(isAdminLoggedInState);

    const [problemCode, setProblemCode] = useState('');
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


    function handleDifficultyChange(event: SelectChangeEvent){
        setDifficulty(event.target.value as string);
    }
    function handleCategoryChange(event: SelectChangeEvent){
        setCategory(event.target.value as string);
    }
    
    async function handleAddProblem(){
        try{

            var res = await axios.post('/api/addProblem', {
                problemCode: problemCode,
                title: title,
                difficulty: difficulty,
                category: category,
                description: formattedDescription,
                inputCases: inputCases,
                expectedOutput: expectedOutput
            }, {
                headers:{
                    'Authorization':'Bearer '+localStorage.getItem('token')
                }
            });
            if(res.status==200){
                router.push('/');
                setSnackbar({
                    open: true,
                    text: 'Problem added successfully',
                    severity: 'success'
                });
            }
            else{
                console.log('res.status inside try block - ', res.status)
            }
        }catch(error){
            if(error.response.status==409){
                setSnackbar({
                    open: true,
                    text: 'Problem code already exists',
                    severity: 'error'
                });
            }
            else{
                setSnackbar({
                    open: true,
                    text: 'Cannot add problem. Please try again!',
                    severity: 'error'
                });
            }
        }

    }

    const handleSnackbarClose = () => {
        setSnackbar({...snackbar, open:false});
      };
      
    const QuillOnChange = (value)=>{
        setFormattedDescription(value);
    }

    if(allCategories===undefined){
        return(
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'74vh'}}>
              <CircularProgress/>
            </div>
        )
    }
    else if(allCategories===null){
        return(
            <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'74vh'}}>
              <Typography variant='h6' sx={{fontWeight:'bold'}}>Cannot load data!</Typography>
                <br /><br />
                <Button variant='contained' size='small' sx={{ textTransform:'none', backgroundColor:'#645cff'}} onClick={function(){setAllCategories(undefined); setReRender(!reRender);}}>Refresh</Button>
            </div>
        )
    }
    else{
        return (
            <div style={{display:'flex', flexDirection:'column'}}>
                <div style={{display:'flex', justifyContent:'center', marginTop:'8vh', marginBottom:'8vh'}}>
                    <Typography variant='h5'>Add new problem</Typography>
                </div>
                <div style={{display:'flex', marginLeft:'1vw', border:'0px solid black'}}>
                    <TextField variant='outlined' size='small' label='Problem Code' onChange={function(e){setProblemCode(e.target.value)}}></TextField>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <TextField variant='outlined' size='small' label='Title' sx={{width:'20vw'}} onChange={function(e){setTitle(e.target.value)}}></TextField>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <FormControl>
                        <InputLabel id='difficulty-dropdown' size='small'>Difficulty</InputLabel>
                        <Select label='Difficulty' labelId='difficulty-dropdown' size='small' sx={{width:200, fontSize:16}} value={difficulty} onChange={handleDifficultyChange}>
                            <MenuItem value='Easy'>Easy</MenuItem>
                            <MenuItem value='Medium'>Medium</MenuItem>
                            <MenuItem value='Hard'>Hard</MenuItem>
                        </Select>
                    </FormControl>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <FormControl>
                        <InputLabel id='category-dropdown' size='small'>Category</InputLabel>
                        <Select label='Category' labelId='category-dropdown' size='small' sx={{width:250, fontSize:16}} value={category} onChange={handleCategoryChange}>
                            {
                                allCategories.map(function(category){
                                    return <MenuItem value={category.categoryName}>{category.categoryName}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                </div>
    
                <br /><br />
    
                <div style={{display:'flex', flexDirection:'column', marginLeft:'1vw', marginRight:'1vw', border:'0px solid black'}}>
                    {/* <TextField variant='outlined' fullWidth label='Description' multiline minRows={15} maxRows={20} onChange={function(e){setDescription(e.target.value)}}></TextField> */}
                    <EditorToolbar />
                    <ReactQuill theme="snow" style={{height:'60vh', width:'90vw', marginBottom:'2vh', border:'1px solid black', borderRadius:'5px', overflow:'auto'}} placeholder='Description' modules={modules} formats={formats} value={formattedDescription} onChange={QuillOnChange} />
                </div>

                <br /><br />

                <div style={{display:'flex'}}>
                    <div style={{display:'flex', marginLeft:'1vw', marginRight:'1vw', border:'0px solid black', width:'50vw'}}>
                        <TextField variant='outlined' fullWidth label='Input cases' multiline minRows={15} maxRows={20} onChange={function(e){setInputCases(e.target.value)}}></TextField>
                    </div>  
                    <div style={{display:'flex', marginLeft:'1vw', marginRight:'1vw', border:'0px solid black', width:'50vw'}}>
                        <TextField variant='outlined' fullWidth label='Expected output' multiline minRows={15} maxRows={20} onChange={function(e){setExpectedOutput(e.target.value)}}></TextField>
                    </div>
                </div>    

                <br /><br />

                <div style={{display:'flex', justifyContent:'center', marginRight:'1vw', border:'0px solid black'}}>
                    <Button size='small' variant='contained' sx={{width:'85px', fontSize:'15px', textTransform:'none', backgroundColor:themeColors.Brown}} onClick={handleAddProblem}>Save</Button>
                </div>
                <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{vertical:'bottom', horizontal:'center'}}><Alert severity={snackbar.severity=='error'?"error":"success"}>{snackbar.text}</Alert></Snackbar>
            </div>
        );
    }

    
}

// function BoldIcon(){

//     const [active, setActive] = useState(false);

//     return <IconButton size='large' sx={{color:active?'brown':'grey'}} onClick={function(){setActive(!active);}}><FormatBold/></IconButton>
// }

// function ItalicsIcon(){

//     const [active, setActive] = useState(false);

//     return <IconButton size='large' sx={{color:active?'brown':'grey'}} onClick={function(){setActive(!active);}}><FormatItalic/></IconButton>
// }