'use client';
import {useEffect, useState} from 'react';
import getStripe from '@/utils/get-stripe';
import {useSearchParams, useRouter } from 'next/navigation';
import { Container, CircularProgress, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';
import '../globals.css';

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
                    <Box sx={{ textAlign: 'center', mb: 6, p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2,}}>
                    <Typography variant="h3" gutterBottom>Thanks for paying!!</Typography>
                    <Typography variant="h6" gutterBottom>
                    Session ID: {session_id}
                    </Typography>
                    <Typography variant = 'body1'>We have received your payment, you will receive a copy of your receipt shortly</Typography>
                    <Link href="/" passHref>
                        <Button variant="contained" color="primary" sx= {{mt:4}}>Go to Home</Button>
                    </Link>
                    </Box>
                </>
            ) : (
                <>
                    <Box sx={{ textAlign: 'center', mb: 6, p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2,}}>
                    <Typography variant="h3" gutterBottom>Payment Unsuccessful</Typography>
                    <Typography variant="h6" gutterBottom>
                    Session ID: {session_id}
                    </Typography>
                    <Typography variant = 'body1'>Try again</Typography>
                    <Link href="/" passHref>
                        <Button variant="contained" color="primary" sx= {{mt:4}}>Go to Home</Button>
                    </Link>
                    </Box>
                </>
            )}
        </Container>
    )
}

export default ResultPage;