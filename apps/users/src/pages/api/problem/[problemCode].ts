// Route to view details of a particular problem
import type { NextApiRequest, NextApiResponse } from 'next';
import { ensureDBConnected } from '@/lib/dbConnect';
import { Problem } from "db";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    console.log('firsttttttttttttt')
    
    const problemCode = req.query.problemCode;

    if(req.method=='GET'){
        console.log('here')
        try{
            await ensureDBConnected();
            console.log('db connected');
            var problem = await Problem.findOne({problemCode: problemCode}, {problemCode:1, title:1, category:1, difficulty:1, description:1});
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