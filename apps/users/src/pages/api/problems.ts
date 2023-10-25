// Route to view all problems
import type { NextApiRequest, NextApiResponse } from 'next';
import { Problem } from "db";
import { ensureDBConnected } from '@/lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse){

    if(req.method=='GET'){
        try{
            await ensureDBConnected();
            var a = await Problem.find({}, {problemCode:1, title:1, category:1, difficulty:1});
            res.status(200).json({problems: a});
        }catch(error){
            res.status(500).json({'Error':'Internal server error'});
        }
    }

}

