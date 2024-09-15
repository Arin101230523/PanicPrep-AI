'use client'
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Button, Box, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';

export default function SignInPage() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    
    setIsReady(true);
  }, []);

  return (
    <Container maxWidth="sm">
      <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link href = '/' passHref>
            PanicPrep AI
            </Link>
          </Typography>
          <Button color="inherit" component={Link} href="/sign-in">
            Login
          </Button>
          <Button color="inherit" component={Link} href="/sign-up">
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(80vh - 64px)',
          textAlign: 'center',
          mt: 8,
        }}
      >
        {isReady ? (
          <>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Sign Up
            </Typography>
            <SignUp />
          </>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Container>
  );
}