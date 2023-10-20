// Route to get the solutions of a particular problem for all languages
import type { NextApiRequest, NextApiResponse } from 'next';
import { ensureDBConnected } from '@/lib/dbConnect';
import { Problem, Solution } from "db";
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
            var a = await Solution.findOne({problemCode: problemCode});
            if(a){
                res.status(200).json({solutions: a});
            }
            else{
                res.status(204).end();
            }
            
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