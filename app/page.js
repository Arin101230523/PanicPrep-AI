'use client';

import Image from "next/image";
import getStripe from '@/utils/get-stripe';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Container, AppBar, Toolbar, Typography, Button, Box, Grid } from '@mui/material';
import Head from 'next/head';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import './globals.css';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [flipped, setFlipped] = useState([]);

  const handleBasic = () => {
    const paying = false;
    router.push(`/generate?variable=${encodeURIComponent(paying)}`);
  }

  const handlePro = () => {
    const paying = true;
    router.push(`/generate?variable=${encodeURIComponent(paying)}`);
  }

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout-session', {
      method: 'POST',
      headers: {
        Origin: 'http://localhost:3000',
      }
    }).then(res => res.json());

    if (checkoutSession.statusCode === 500) {
      console.error('Error creating checkout session:', checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSession.id
    });

    if (error) {
      console.warn('Error redirecting to checkout:', error.message);
    }
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Container maxWidth="lg">
      <Head>
        <title>PanicPrep AI</title>
        <meta name="description" content="Create flashcards from text effortlessly" />
      </Head>

      <AppBar position="static" sx={{ mb: 4, backgroundColor: '#3f51b5' }}>
  <Toolbar>
    <Typography variant="h6" sx={{ flexGrow: 1 }}>
      PanicPrep AI
    </Typography>
    {isSignedIn &&
        <Link href="/flashcards" passHref>
        <Button variant="contained" sx={{ mr: 2, backgroundColor: '#5c6bc0', color: '#fff' }}>
          My Flashcards
        </Button>
        </Link>
    }
    <SignedOut>
      <Button color="inherit" href='/sign-in'>Login</Button>
      <Button color="inherit" href='/sign-up'>Sign Up</Button>
    </SignedOut>
    <SignedIn>
      <UserButton />
    </SignedIn>
  </Toolbar>
</AppBar>
      
      <Box sx={{ textAlign: 'center', mb: 6, p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2,}}>
        <Typography variant="h3" gutterBottom>Welcome to PanicPrep AI</Typography>
        <Typography variant="h6" gutterBottom>
          The easiest way to create, manage, and study flashcards for all of your last minute cramming sessions. 
          <br/>Simply sign up, put in your text or topic along with the number of flashcards you want, and let us do the rest!
        </Typography>
        <Button href='/generate' variant="contained" color="secondary" size="large" sx={{ mt: 2 }}>
          Get Started (Pro Functionality Demo)
        </Button>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" gutterBottom>Efficient Learning</Typography>
              <Typography>
                Create flashcards quickly with our intelligent text processing algorithms so that you can ace your exams.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" gutterBottom>Online Deck Storage</Typography>
              <Typography>
                Organize your flashcards into decks for easy management and access them anywhere.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" gutterBottom>Basic</Typography>
              <Typography variant="h5" gutterBottom>
                $FREE / month
              </Typography>
              <Typography gutterBottom>
                Access to unlimited flashcards, core features, and no cloud storage for saving flashcard sets.
              </Typography>
              <Button href = '/generate' variant="contained" color="secondary">Choose Basic</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" gutterBottom>Pro</Typography>
              <Typography variant="h5" gutterBottom>
                $15 / month
              </Typography>
              <Typography gutterBottom>
                Unlimited flashcards, advanced features, and cloud storage for all of your studying needs.
              </Typography>
              <Button variant="contained" color="primary" onClick={handleSubmit}>Choose Pro</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </Container>
  );
}