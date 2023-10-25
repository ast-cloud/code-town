// Route to add a new probblem
import type { NextApiRequest, NextApiResponse } from 'next';
import { ensureDBConnected } from '@/lib/dbConnect';
import { Category } from "db";
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
            var newCategory = req.body;
            const requiredFields = ['categoryId', 'categoryName'];
            const allFieldsExist = requiredFields.every((field)=>{return field in newCategory});
            if(allFieldsExist){
                var a = new Category(newCategory);
                await a.save();
                res.status(200).json({message:'Category added successfully', categoryId: a.id});
            }
            else{
                res.status(400).send({'Bad request':'Insufficient parameters supplied'});
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