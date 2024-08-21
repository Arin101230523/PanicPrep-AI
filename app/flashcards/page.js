'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { useRouter } from 'next/navigation';
import { CardActionArea, Container, Card, CardContent, Grid, Typography, Box, Button } from '@mui/material';
import '../globals.css';
import Link from 'next/link';

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const Router = useRouter();

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return;
            const docRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || [];
                setFlashcards(collections);
            } else {
                await setDoc(docRef, { flashcards: [] });
            }
        }
    
        getFlashcards();
    }, [user]);
    

    if (!isLoaded || !isSignedIn) {
        return (
            <div>
                <p>You must be signed in to access this page. Signing up is completely free!</p>
            </div>
        );
    }

    const handleCardClick = (id) => {
        Router.push(`/flashcard?id=${id}`);
    };

    return (
        <div className = 'generate'>
        <Container maxWidth='100vw'>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Box>
      <Link href="/" passHref>
        <Button variant="contained" color="primary" sx={{ mr: 2, mt: 4 }}>
          Home
        </Button>
      </Link>
    </Box>
  </Box>
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        {console.log(flashcard)}
                        <Card>
                            <CardActionArea onClick={() => {handleCardClick(flashcard.name)}}>
                                <CardContent>
                                    <Typography variant='h6'>{flashcard.name}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
        </div>
    );
}