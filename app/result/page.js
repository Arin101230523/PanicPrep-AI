'use client';
import {useEffect, useState} from 'react';
import getStripe from '@/utils/get-stripe';
import {useSearchParams, useRouter } from 'next/navigation';
import { Container, CircularProgress, Typography, Box } from '@mui/material';

const ResultPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');

    const [loading, setLoading] = useState(true);
    const [session, getSession] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCheckoutSession = async() => {
            if(!session_id) return null;

            try {
                const res = await fetch(`/api/checkout_session?session_id=${session_id}`);
                const sessionData = await res.json();
                if(res.ok) {
                    setSession(sessionData);
                } else {
                    setError(sessionData.error);
                }
            } catch(error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        fetchCheckoutSession();
    },[session_id]);

    if(loading) {
        return (
            <Container maxWidth = '100vw' sx = {{textAlign: 'center', mt: 4,}}>
                <CircularProgress />
                <Typography variant = 'h6'>Loading...</Typography>
            </Container>
        )
    }

    if(error) {
        return (
            <Container maxWidth = '100vw' sx = {{textAlign: 'center', mt: 4,}}>
                <Typography variant = 'h6'>Error: {error.message}</Typography>
            </Container>
        )
    }

    return (
        <Container maxWidth = '100vw' sx = {{textAlign: 'center', mt: 4,}}>
            {session.paymennt_status === 'paid' ? (
                <>
                    <Typography variant = 'h6'>Thanks for paying!!</Typography>
                    <Box sx = {{mt:22}}>
                        <Typography variant = 'h6'>Session ID: {session_id}</Typography>
                        <Typography variant = 'body1'>We have received your payment, you will receive a copy of your receipt shortly</Typography>
                    </Box>
                </>
            ) : (
                <>
                    <Typography variant = 'h6'>Payment Unsuccessful</Typography>
                    <Box sx = {{mt:22}}>
                        <Typography variant = 'h6'>Session ID: {session_id}</Typography>
                        <Typography variant = 'body1'>Try again</Typography>
                    </Box>
                </>
            )}
        </Container>
    )
}

export default ResultPage;