import {useRouter} from 'next/router';
import { CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';


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