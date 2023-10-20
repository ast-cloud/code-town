// Route to save the solution of a particular problem for a particular language
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

    if(req.method=='POST'){
        try{
            await ensureDBConnected();
            var language = req.body.language;
            var code = req.body.code;
            var a = await Solution.findOne({problemCode: problemCode});
            if(a){
                a[language] = code;
                await a.save();
                res.status(200).json({message:'Solution saved successfully'});
            }
            else{
                var newSolutionSet = new Solution({problemCode: problemCode, [language]: code});
                await newSolutionSet.save();
                res.status(200).json({message:'Solution saved successfully'});
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