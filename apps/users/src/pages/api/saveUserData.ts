import {User} from 'db';
import { ensureDBConnected } from '@/lib/dbConnect';

export async function saveUserData(email: string, name: string){

    try{

        await ensureDBConnected();
        
        var user = await User.findOne({email: email});
    
        if(user){
            if(name){
                user.name = name;
            }
            await user.save();            
        }
        else{
            var newUser = new User({email: email, name: name});
            await newUser.save();
        }

        return true;

    }catch(error){
        return false;
    }

    
}