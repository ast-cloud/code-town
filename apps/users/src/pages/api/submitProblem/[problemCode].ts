// Route to submit the solution of a particular problem
import type { NextApiRequest, NextApiResponse } from 'next';
import { ensureDBConnected } from '@/lib/dbConnect';
import { Problem } from "db";
import axios from 'axios';


export default async function handler(req: NextApiRequest, res: NextApiResponse){

    const problemCode = req.query.problemCode;

    if(req.method=='POST'){

        try{
            await ensureDBConnected();
            var problem = await Problem.findOne({problemCode: problemCode}, {problemCode:1, inputCases:1, expectedOutput:1});
            if(!problem){
                res.status(404).json({'Error':'Problem not found'});
                return;
            }
            console.log('Problem found - '+JSON.stringify(problem));
            const language = String(req.body.language);
            console.log('language -------------------------- '+language);
            var codeExecutionOutput = await axios.post(`${process.env.CODE_RUNNER_URL}/${language}`, {
                code: req.body.code,
                input: problem.inputCases
            });

            if(codeExecutionOutput.data.error=='none'){
   
                var co = JSON.stringify( (codeExecutionOutput.data.output.slice(-1)==='\n'||codeExecutionOutput.data.output.slice(-1)===' ') ? (codeExecutionOutput.data.output.slice(0,-1)) : (codeExecutionOutput.data.output) );
                console.log('JSON.stringify(codeExecutionOutput) - '+ co );
                var eo = JSON.stringify(problem.expectedOutput);
                console.log('Expected output - '+eo);
                
                console.log('Result - '+String(eo===co));
                if(eo===co){
                    res.status(200).json({'accepted':true, 'result':'Hoorray! All test cases passed successfully'});
                }
                else{
                    res.status(200).json({'accepted':false, 'result':'Wrong answer'});
                }

            }
            else{
                res.status(200).json({'accepted':false, 'result':`${codeExecutionOutput.data.error} : ${codeExecutionOutput.data.output}`});
            }
                
        }catch(e){
            console.log('Error in submitProblem - '+e)
            res.status(500).send('Internal server error');
        }
        
    }
    else{
        res.status(404).json({'Error':'Not found'});
        return;
    }


}