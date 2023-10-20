// Route to view all solved problems
import type { NextApiRequest, NextApiResponse } from 'next';
import { Problem, User } from "db";
import { ensureDBConnected } from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse){

    const session = await getServerSession(req, res, authOptions);
    if(!session){
        res.status(401).json({'Error':'Unauthenticated'});
        return;
    }
    await ensureDBConnected();
    var user = await User.findOne({email: session['user'].email},{solvedProblems:1});
    if(!user){
        res.status(404).json({'Error':'User not found'});
        return;
    }
    else{
        var solvedProblemsDetails = await Problem.find({_id:{$in: user.solvedProblems}});
        res.status(200).json({solvedProblemsDetails: solvedProblemsDetails});
    }
    
}

