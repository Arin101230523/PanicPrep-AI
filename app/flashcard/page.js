"use client";

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Box, Typography, Paper, TextField, Button, Grid, Card, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import '../globals.css';
import Link from 'next/link';

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);

    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {
        async function getFlashcards() {
            if (!search || !user) return;
            try {
                const colRef = collection(doc(collection(db, 'users'), user.id), search);
                const docs = await getDocs(colRef);
                const flashcards = [];
    
                docs.forEach((doc) => {
                    flashcards.push({ id: doc.id, ...doc.data() });
                });
                setFlashcards(flashcards);
                console.log('Retrieved Flashcards:', flashcards);
            } catch (error) {
                console.error('Error fetching flashcards:', error);
            }
        }
    
        getFlashcards();
    }, [user, search]);    
    
    const handleCardClick = (id) => {
        setFlipped((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
      };

    if(!isLoaded || !isSignedIn) {
        return null;
    }

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
                <Box>
                <Link href="/flashcards" passHref>
                    <Button variant="contained" color="primary" sx={{ mt: 4 }}>
                    My Flashcards
                    </Button>
                </Link>
                </Box>
            </Box>    
    <Grid container spacing={3} sx={{ mt: 4 }}>
  {flashcards.map((flashcard, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardActionArea onClick={() => handleCardClick(index)} sx={{ flexGrow: 1 }}>
          <CardContent sx={{ height: '220px', display: 'flex', flexDirection: 'column'}}>
            <Box
              sx={{             
                perspective: '1000px',
                '& > div': {
                  transition: 'transform 0.6s',
                  transformStyle: 'preserve-3d',
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                  transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                },
                '& > div > div': {
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 2,
                  boxSizing: 'border-box',
                },
                '& > div > div:nth-of-type(2)': {
                  transform: 'rotateY(180deg)',
                },
              }}
            >
              <div>
                <div>
                  <Typography variant="h6" component="div" sx = {{fontSize: '0.100rem'}}>
                    {flashcard.front}
                  </Typography>
                </div>
                <div>
                  <Typography variant="h6" component="div">
                    {flashcard.back}
                  </Typography>
                </div>
              </div>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  ))}
</Grid>
        </Container>
        </div>
    )
}