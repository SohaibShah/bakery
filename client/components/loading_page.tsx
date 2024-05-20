import React, { useEffect, useState } from 'react'
import Loading from './loading'
import { useRouter } from 'next/router';

const LoadingPage = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleStart = (url : any) => (url !== router.asPath) && setLoading(true);
        const handleComplete = (url : any) => (url === router.asPath) && setLoading(false);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    if (!loading) return null;

    return (
        <div className="absolute w-full-h-full bg-black flex flex-col items-center justify-center">
            <Loading />
        </div>
    )
}

export default LoadingPage