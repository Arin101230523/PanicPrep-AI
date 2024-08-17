import Image from "next/image";
import getStripe from '@/utils/get-stripe';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Container, AppBar, Toolbar, Typography, Button, Box, Grid } from '@mui/material';
import Head from 'next/head';

export default function Home() {
  return (
    <Container width="100vw">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href='/sign-in'>Login</Button>
            <Button color="inherit" href = 'sign-up'>Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2">Welcome to Flashcard SaaS</Typography>
        <Typography variant="h5">
          The easiest way to make flashcards from your text
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Get Started
        </Button>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h2">Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Smart</Typography>
            <Typography>
              Literally garbage! Don't use!
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Smart</Typography>
            <Typography>
              Literally garbage! Don't use!
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4">Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>Basic</Typography>
              <Typography gutterBottom>
                $5 / month
              </Typography>
              <Typography gutterBottom>
                {' '}
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button variant = "contained" color = "primary">Choose Basic</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>Middle Tier</Typography>
              <Typography gutterBottom>
                $10 / month
              </Typography>
              <Typography gutterBottom>
                {' '}
                A homeless guy will break into your home and force you to memorize.
              </Typography>
              <Button variant = 'contained' color = 'primary'>Choose Middle</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>Sigma Tier</Typography>
              <Typography gutterBottom>
                $9999 / month
              </Typography>
              <Typography gutterBottom>
                {' '}
                Let the sigma come inside of you. I mean become the sigma of whatever you want.
              </Typography>
              <Button variant = 'contained' color = 'primary'>Become Sigma</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}