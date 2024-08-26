'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState, useRef } from 'react';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { useRouter } from 'next/navigation';
import { CardActionArea, Container, Card, CardContent, Grid, Typography, Box, Button } from '@mui/material';
import '../globals.css';
import Link from 'next/link';
import { FaTrash } from "react-icons/fa";

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const Router = useRouter();
    const isFetching = useRef(false); // To track if fetching is already happening

    useEffect(() => {
        async function getFlashcards() {
            if (!user || isFetching.current) return; // Avoid multiple fetches
            isFetching.current = true; // Set fetching flag
            const docRef = doc(collection(db, 'users'), user.id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || [];
                setFlashcards(collections);
            } else {
                await setDoc(docRef, { flashcards: [] });
                setFlashcards([]); // Ensure state is initialized properly
            }
            isFetching.current = false; // Reset fetching flag
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

    const handleDelete = async (id) => {
        const docRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(docRef);
        const collections = docSnap.data().flashcards || [];
        const newCollections = collections.filter((collection) => collection.name !== id);
        await setDoc(docRef, { flashcards: newCollections });
        setFlashcards(newCollections);
    }

    return (
        <div className='generate'>
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
                        <Link href="/generate" passHref>
                            <Button variant="contained" color="primary" sx={{ mr: 2, mt: 4 }}>
                                Generate
                            </Button>
                        </Link>
                    </Box>
                </Box>
                {flashcards.length === 0 ? (
                    <Typography>
                        You currently have no saved flashcards: <br/>
                        <Link href="/generate" passHref>
                            <Button variant="contained" color="primary" sx={{ mr: 2, mt: 4 }}>
                                Generate Some Now!
                            </Button>
                        </Link>
                    </Typography>
                ) : (
                    <Grid container spacing={3} sx={{ mt: 4 }}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea>
                                        <CardContent onClick={() => handleCardClick(flashcard.name)} sx={{
                                            cursor: 'pointer',
                                            '&:hover': { textDecoration: 'underline' }
                                        }}>
                                            <Typography variant='h6'>{flashcard.name}</Typography>
                                        </CardContent>
                                        <Button>
                                            <Typography onClick={() => handleDelete(flashcard.name)}>
                                                <FaTrash />
                                            </Typography>
                                        </Button>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </div>
    );
}