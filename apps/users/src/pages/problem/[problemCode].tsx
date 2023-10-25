import { useEffect, useState } from 'react';
import {useRouter} from 'next/router';
import axios from 'axios';
import { useSession, signIn } from 'next-auth/react';
import { Typography, Button, Tab, Tabs, CircularProgress } from '@mui/material';
import { themeColors } from 'ui';
import dynamic from 'next/dynamic';


// type ProblemDetailsInfo = {
//     problemCode: string;
//     title: string;
//     description: string;
//     category: string;
//     difficulty: string;
//   }


const DynamicallyLoadedProblemComponent = dynamic(function(){return import('./Problem')}, {
    loading: ()=><div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'74vh'}}>
            <CircularProgress/>
        </div>
});

export default function LazyLoadedProblem(){

    const router = useRouter();

    const problemCode = router.query.problemCode;

    return <DynamicallyLoadedProblemComponent problemCode={problemCode} />
}