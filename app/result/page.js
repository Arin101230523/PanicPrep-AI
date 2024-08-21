'use client';
import {useEffect, useState} from 'react';
import getStripe from '@/utils/get-stripe';
import {useSearchParams, useRouter } from 'next/navigation';
import { Container, CircularProgress, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';

const ResultPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');

    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCheckoutSession = async() => {
            if(!session_id) return null;

            try {
                const res = await fetch(`/api/checkout-session?session_id=${session_id}`);
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
                    <Link href="/" passHref>
                        <Button variant="contained" color="primary" sx={{ mr: 2, mt: 4}}>
                            Home
                        </Button>
                    </Link>
                </>
            ) : (
                <>
                    <Typography variant = 'h6'>Payment Unsuccessful</Typography>
                    <Box sx = {{mt:22}}>
                        <Typography variant = 'h6'>Session ID: {session_id}</Typography>
                        <Typography variant = 'body1'>Try again</Typography>
                    </Box>
                    <Link href="/" passHref>
                        <Button variant="contained" color="primary" sx={{ mr: 2, mt: 4 }}>
                            Home
                        </Button>
                    </Link>
                </>
            )}
        </Container>
    )
}

export default ResultPage;