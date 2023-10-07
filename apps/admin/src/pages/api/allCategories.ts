// Route to view all categories
import type { NextApiRequest, NextApiResponse } from 'next';
import { Category } from "db";
import { ensureDBConnected } from '@/lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse){

    
    if(req.method=='GET'){
        try{
            await ensureDBConnected();
            var a = await Category.find({});   
            res.status(200).json({categories: a});
        }catch(error){
            res.status(500);
        }
    }

}