'use client';

import Image from "next/image";
import getStripe from '@/utils/get-stripe';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Container, AppBar, Toolbar, Typography, Button, Box, Grid } from '@mui/material';
import Head from 'next/head';

export default function Home() {
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

  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text effortlessly" />
      </Head>

      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href='/sign-in'>Login</Button>
            <Button color="inherit" href='/sign-up'>Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" gutterBottom>Welcome to Flashcard SaaS</Typography>
        <Typography variant="h6" gutterBottom>
          The easiest way to create, manage, and study flashcards.
        </Typography>
        <Button variant="contained" color="secondary" size="large" sx={{ mt: 2 }}>
          Get Started
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
                Create flashcards quickly with our intelligent text processing algorithms.
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
              <Typography variant="h6" gutterBottom>Customizable Decks</Typography>
              <Typography>
                Organize your flashcards into customizable decks for easy management.
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
                $5 / month
              </Typography>
              <Typography gutterBottom>
                Access to basic flashcard features.
              </Typography>
              <Button variant="contained" color="secondary">Choose Basic</Button>
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
                Unlimited flashcards, advanced features, and 1 GB of storage for all your studying needs.
              </Typography>
              <Button variant="contained" color="primary" onClick={handleSubmit}>Choose Pro</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}