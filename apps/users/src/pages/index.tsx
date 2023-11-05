import { Inter } from 'next/font/google';
import { Grid, Button, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import {themeColors} from 'ui';
import {signIn, useSession, signOut} from 'next-auth/react';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const session = useSession();

  return (
    <div>

      <div style={{display:'flex'}}>
        <Grid container style={{marginTop:85, marginBottom:0, marginLeft:0, marginRight:0}}>

          <Grid item container xs={12} md={5} sx={{order:{xs: 2, md: 1}, height:{xs:'65vh', sm:'45vh', md:'50vh'}, backgroundColor:'', display:'flex', flexDirection:'column'}} justifyContent='space-evenly' alignItems='center'>
            <div style={{marginTop:0}}>  
              <Typography variant='h5' style={{fontWeight: 'normal', alignSelf:'center'}}>Start your coding journey now</Typography>
            </div>
            <div style={{marginTop:0, width:'90%', alignSelf:'center'}}>
              <Typography variant='h6' style={{fontWeight: 'normal'}}>Unleash your inner programmer and embark on a digital journey like no other. Whether you&apos;re a seasoned developer or just taking your first steps into the world of code, you&apos;ve arrived at the perfect destination. </Typography>
            </div>
            {session.data && <div style={{display:'flex', width:'80%', justifyContent:'space-evenly', alignItems:'flex-start', marginBottom:0}}>
              <Button variant='contained' size='small' sx={{ height: '100%', backgroundColor: themeColors.Brown, textTransform:'none', fontSize:15}} onClick={function(){signIn();}}>Login</Button>
              <Button variant='contained' size='small' sx={{ height: '100%', backgroundColor: themeColors.Brown, textTransform:'none', fontSize:15}} onClick={function(){signIn();}}>Signup</Button>
            </div>}
          </Grid>

          <Grid item container xs={12} md={7} sx={{order:{xs: 1, md: 2},  backgroundColor:''}} justifyContent='center'>
            <div className='carousel-item'>
              <Image src='/coding_boy.svg' fill alt='' className='image'/>
            </div>
          </Grid>

        </Grid>
      </div>

      <div style={{display:'flex'}}>
        <Grid container style={{marginTop:65, marginBottom:0, marginLeft:0, marginRight:0}}>

          <Grid item container xs={12} md={6} sx={{order:{xs: 1, md: 1},  backgroundColor:''}} justifyContent='center' alignItems='center'>
            <div style={{}}>
              <video autoPlay muted loop playsInline width={280} height={280}>
                <source src='idea.mp4' type='video/mp4'/>
              </video>
            </div>
          </Grid>

          <Grid item container xs={12} md={6} sx={{order:{xs: 2, md: 2}, height:{xs:'65vh', md:'50vh'}, backgroundColor:'', display:'flex', flexDirection:'column', border:'0px solid black'}} justifyContent='space-evenly' alignItems='center'>
            <div style={{marginTop:0, alignSelf:'center', marginRight:20, border:'0px solid black'}}>  
              <Typography variant='h5' style={{fontWeight: 'normal', alignSelf:'center'}}>Learn, Grow, Innovate</Typography>
            </div>
            <div style={{marginTop:0, width:'90%', alignSelf:'center'}}>  
              <Typography variant='h6' style={{fontWeight: 'normal'}}>Coding is more than just writing lines of text, it&apos;s about solving real-world problems, sparking creativity, and shaping the future. Our carefully curated courses and projects are designed to nurture your skills and push your boundaries. Start with the basics and work your way up to advanced concepts. Tackle hands-on projects that mimic real-world scenarios and learn from practical experience. </Typography>
            </div>
            
          </Grid>

        </Grid>
      </div>

      <div style={{display:'flex'}}>
        <Grid container style={{marginTop:20, marginBottom:0, marginLeft:0, marginRight:0}}>

          <Grid item container xs={12} md={5} sx={{order:{xs: 2, md: 1}, height:{xs:'65vh', md:'55vh'}, backgroundColor:'', display:'flex', flexDirection:'column'}} justifyContent='space-evenly' alignItems='center'>
            <div style={{marginTop:0}}>  
              <Typography variant='h5' style={{fontWeight: 'normal', alignSelf:'center'}}>Launch Your Career</Typography>
            </div>
            <div style={{marginTop:0, width:'90%', alignSelf:'center'}}>  
              <Typography variant='h6' style={{fontWeight: 'normal'}}>Are you ready to turn your passion for code into a fulfilling career? Coding is an art, and we're here to help you become a virtuoso. Challenge yourself with coding competitions, participate in hackathons, and contribute to open-source projects. Your dream job in tech is not just a goal, it&apos;s a realistic destination that we can help you achieve.</Typography>
            </div>
          </Grid>

          <Grid item container xs={12} md={7} sx={{order:{xs: 1, md: 2},  backgroundColor:''}} justifyContent='center' alignItems='center'>
            <div >
              <video autoPlay muted loop playsInline width={280} height={280}>
                <source src='rocket.mp4' type='video/mp4'/>
              </video>
            </div>
          </Grid>

        </Grid>
      </div>

    </div>
  )
}
