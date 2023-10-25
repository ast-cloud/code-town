// Route to add a new probblem
import type { NextApiRequest, NextApiResponse } from 'next';
import { ensureDBConnected } from '@/lib/dbConnect';
import { Problem } from "db";
import { adminAuth } from '@/lib/adminAuth';


export default async function handler(req: NextApiRequest, res: NextApiResponse){

    var r = adminAuth(req);
    if(!r){
        res.status(401).json({'Error':'Unauthenticated'});
        return;
    }

    if(req.method=='POST'){
        try{
            await ensureDBConnected();
            var newProblem = req.body;
            const requiredFields = ['problemCode', 'title', 'description', 'difficulty', 'category', 'inputCases', 'expectedOutput'];
            const allFieldsExist = requiredFields.every((field)=>{return field in newProblem});
            if(allFieldsExist){
                var duplicate = await Problem.findOne({problemCode: req.body.problemCode});
                if(duplicate){
                    res.status(409).json({'Conflict':'Problem code already exists.'});
                    return;
                }
                var a = new Problem(newProblem);
                await a.save();
                res.status(200).json({message:'Problem added successfully', problemId: a.id});
            }
            else{
                res.status(400).send({'Bad request':'Insufficient parameters supplied'});
            }

            return;

        }catch(error){
            console.log('Error - ', error);
            res.status(500).send('Internal server error');
        }
    }
    else{
        res.status(404).json({'Error':'Not found'});
        return;
    }
}