// Route to view all details of a particular problem
import type { NextApiRequest, NextApiResponse } from 'next';
import { ensureDBConnected } from '@/lib/dbConnect';
import { Problem } from "db";
import { adminAuth } from '@/lib/adminAuth';



export default async function handler(req: NextApiRequest, res: NextApiResponse){

    const problemCode = req.query.problemCode;

    var r = adminAuth(req);
    if(!r){
        res.status(401).json({'Error':'Unauthenticated'});
        return;
    }

    if(req.method=='GET'){
        try{
            await ensureDBConnected();
            var problem = await Problem.findOne({problemCode: problemCode});
            if(!problem){
                res.status(404).json({'Error':'Problem not found'});
                return;
            }
            res.json({problem: problem});
            return;
        }catch(error){
            res.status(500).send('Internal server error');
        }
    }
    else{
        res.status(404).json({'Error':'Not found'});
        return;
    }


}