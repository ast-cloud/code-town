import { Typography, Card, TextField, Button } from '@mui/material';
import {themeColors} from 'ui';




export default function Contact(){

    return (
        <div>
            <div style={{display:'flex', justifyContent:'center', marginTop:'10vh'}}>
                <Typography variant='h5'>Contact Us</Typography>
            </div>
            <div style={{display:'flex', justifyContent:'center', marginTop:20}}>
                <Card variant='elevation' style={{width:500, padding:40, borderRadius:10, justifyContent:'center'}}>
                    <TextField variant='outlined' fullWidth={true} label='Name'></TextField>
                    <br /><br />
                    <TextField variant='outlined' fullWidth={true} label='Phone number'></TextField>
                    <br /><br />
                    <TextField variant='outlined' fullWidth={true} label='Email'></TextField>
                    <br /><br />
                    <TextField variant='outlined' fullWidth={true} label='Message' multiline={true} minRows={4}></TextField>
                    <br /><br />
                    <Button variant='contained' sx={{backgroundColor: themeColors.Brown}}>Submit</Button>
                </Card>
            </div>
        </div>
    )
}