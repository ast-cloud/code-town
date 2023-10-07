// Route to view some attributes of all problems
import type { NextApiRequest, NextApiResponse } from 'next';
import { Problem } from "db";
import { ensureDBConnected } from '@/lib/dbConnect';
import { adminAuth } from '@/lib/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse){

    var r = adminAuth(req);
    if(!r){
        res.status(401).json({'Error':'Unauthenticated'});
        return;
    }
    if(req.method=='GET'){
        try{
            await ensureDBConnected();
            var a = await Problem.find({}, {problemCode:1, title:1, category:1, difficulty:1});   
            res.status(200).json({problems: a});
        }catch(error){
            res.status(500);
        }
    }

}

