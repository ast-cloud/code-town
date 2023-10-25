import jwt from 'jsonwebtoken';
import type { NextApiRequest } from 'next';


export function adminAuth(req: NextApiRequest){
    var authHeader = req.headers.authorization;
    var authResult = false;
    if(authHeader){
        var t = authHeader.split(' ')[1];
        jwt.verify(t, process.env.JWT_SECRET as string, function(err, decodedPayload){
            if(err){
                authResult = false;
            }
            else if(!decodedPayload){
                authResult = false;
            }
            else if(typeof decodedPayload == 'string'){
                authResult = false;
            }
            else if(decodedPayload.role == 'admin'){
                authResult = true;
            }
            else{
                authResult = false;
            }

        });
    }
    else{
        authResult = false;
    }
    return authResult;
}