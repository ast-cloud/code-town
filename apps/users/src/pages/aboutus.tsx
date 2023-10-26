import { Typography, Card, TextField, Button, Grid } from '@mui/material';
import {themeColors} from 'ui';




export default function AboutUs(){

    return (
        <div>
            
            <div style={{display:'flex'}}>
                <Grid container sx={{marginTop:'8vh', justifyContent:'center'}}>

                    <Grid item container xs={12} md={5} sx={{height:{xs:'65vh', sm:'45vh', md:'50vh'}, backgroundColor:'', display:'flex', flexDirection:'column'}} justifyContent='space-evenly' alignItems='center'>
                        <div style={{marginTop:0}}>  
                            <Typography variant='h5' style={{fontWeight: 'normal', alignSelf:'center'}}>Who are we</Typography>
                        </div>
                        <div style={{marginTop:0, width:'90%', alignSelf:'center'}}>
                            <Typography variant='h6' style={{fontWeight: 'normal'}}>At CodeTown, we are a dedicated team of coding enthusiasts and technology aficionados. Our founders envisioned a platform that would provide a stage for programmers of all skill levels to challenge themselves, learn, and compete. With a deep-rooted love for coding and problem-solving, we embarked on this journey to create a platform that caters to both novices and experts in the world of competitive coding.</Typography>
                        </div>
                    </Grid>
                    
                </Grid>
            </div>
            <div style={{display:'flex'}}>
                <Grid container sx={{marginTop:'5vh', justifyContent:'center'}}>

                    <Grid item container xs={12} md={5} sx={{height:{xs:'65vh', sm:'45vh', md:'50vh'}, backgroundColor:'', display:'flex', flexDirection:'column'}} justifyContent='space-evenly' alignItems='center'>
                        <div style={{marginTop:0}}>  
                            <Typography variant='h5' style={{fontWeight: 'normal', alignSelf:'center'}}>Our Mission</Typography>
                        </div>
                        <div style={{marginTop:0, width:'90%', alignSelf:'center'}}>
                            <Typography variant='h6' style={{fontWeight: 'normal'}}>Our mission is to democratize coding excellence. We believe that every individual should have the opportunity to enhance their coding skills, and that's why we offer a level playing field where you can showcase your abilities, learn from others, and grow as a programmer. We are committed to promoting inclusivity, diversity, and equal opportunity within our community.</Typography>
                        </div>
                    </Grid>

                </Grid>
            </div>

        </div>
    )
}