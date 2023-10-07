import { useState } from 'react';
import {Button, Typography, Card, Grid, IconButton, Menu, MenuItem} from '@mui/material';
import { useRecoilState, useSetRecoilState } from 'recoil';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import { themeColors } from './colors';

export function AppBar(props:any){

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event:any) => {
        setAnchorEl(event.currentTarget);
        setMobileMenuOpen(true);
      };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMobileMenuOpen(false);
      };
    console.log('Inside AppBar, session - ', JSON.stringify(props.session));
    return (
        <Grid container sx={{border:'0px solid black', backgroundColor:'white', marginTop:'-7px', paddingTop:'7px', paddingBottom:'7px'}}>

            <Grid item xs={6} sm={4}>
                <Card variant='outlined' onClick={function(){props.router.push('/')}} style={{border:'none', boxShadow:'none', cursor:'pointer', backgroundColor:'transparent'}}><Typography variant="h4" color='#6F4E37'>CodeTown</Typography></Card>
                {/* <Image src={logo} width={100} height={20} alt=''/> */}
            </Grid>

            <Grid item container sm={4} justifyContent='center' sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <Button sx={{textTransform:'none', fontSize:20, fontWeight:'bold', color:'black', '&:hover':{color:'#645cff'}}} onClick={function(){props.router.push('/')}}>Home</Button>
                <Button sx={{textTransform:'none', fontSize:20, fontWeight:'bold', color:'black', '&:hover':{color:'#645cff'}}} onClick={function(){props.router.push('/problems')}}>Problems</Button>
                <Button sx={{textTransform:'none', fontSize:20, fontWeight:'bold', color:'black', '&:hover':{color:'#645cff'}}} onClick={function(){props.router.push('/aboutus')}}>About Us</Button>
                <Button sx={{textTransform:'none', fontSize:20, fontWeight:'bold', color:'black', '&:hover':{color:'#645cff'}}} onClick={function(){props.router.push('/contact')}}>Contact</Button>
            </Grid>

            <Grid item container xs={6} sm={4} justifyContent='flex-end' sx={{maxHeight:'1vh'}}>

                { props.session.data ? 
                <div style={{display:'flex'}}>
                    <Typography sx={{marginTop:1}}>Hi {props.session.data.user.name!=''?props.session.data.user.name:'there'}</Typography>
                    <Button variant="outlined" sx={{display: {xs: 'none', sm: 'flex'}, fontWeight:'bold', marginLeft:2, marginTop:1}} size="small" onClick={function(){props.signOut();}}>Logout</Button>
                </div>
                :<div style={{display:'flex'}}>
                    <Button variant="contained" size="small" sx={{display: {xs: 'none', sm: 'block'},  backgroundColor: themeColors.Brown, marginRight:2, textTransform:'none'}} onClick={function(){props.signIn();}}>Login</Button>
                    <Button variant="contained" size="small" sx={{display: {xs: 'none', sm: 'block'},  backgroundColor: themeColors.Brown, textTransform:'none'}} onClick={function(){props.signIn();}}>SignUp</Button>
                </div>}

                <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleMenuOpen} sx={{display: {xs: 'block', sm: 'none'} }}>
                    <MenuIcon />
                </IconButton>
                
                <Menu anchorEl={anchorEl} open={mobileMenuOpen} onClose={handleMenuClose} sx={{display: {xs: 'block', sm: 'none'} }} >
                    <MenuItem onClick={handleMenuClose}>Home</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Problems</MenuItem>
                    <MenuItem onClick={handleMenuClose}>About Us</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Contact</MenuItem>
                    {props.session.data?<MenuItem onClick={() => {
                            handleMenuClose();
                            props.signOut();
                        }}>
                        Logout
                    </MenuItem>:<div></div>}
                </Menu>
            </Grid>
        </Grid>)
}

