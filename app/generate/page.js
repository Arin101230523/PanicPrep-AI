'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../firebase.js';
import { writeBatch, doc, collection, getDoc } from 'firebase/firestore';
import { Container, Box, Typography, Paper, TextField, Button, Grid, Card, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { teal, deepOrange, grey } from '@mui/material/colors';
import Link from 'next/link';
import '../globals.css';

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [number, setNumber] = useState('');

  const router = useRouter();

  if (!isSignedIn || !user) {
    return (
      <Box sx={{ textAlign: 'center', mb: 6, p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2,}}>
      <Typography variant="h3" gutterBottom>Not Signed In</Typography>
      <Typography variant="h6" gutterBottom>
      You must be signed in to access this page. Signing up is completely free!
      </Typography>
      <Link href="/" passHref>
        <Button variant="contained" color="primary">Go to Home</Button>
      </Link>
    </Box>
    );
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    const combinedText = number + ' ' + text;
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: combinedText }),
      });
      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFlashcards = async () => {
    if (!isSignedIn || !user) {
      alert('You need to be signed in to save flashcards');
      return;
    }

    if (!name) {
      alert('Please enter a name for your collection');
      return;
    }

    setIsLoading(true);
    try {
      const batch = writeBatch(db);
      const userDocRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        if (collections.find((f) => f.name === name)) {
          alert('Flashcard collection with the same name already exists');
          return;
        } else {
          collections.push({ name });
          batch.set(userDocRef, { flashcards: collections }, { merge: true });
        }
      } else {
        batch.set(userDocRef, { flashcards: [{ name }] });
      }

      const colRef = collection(userDocRef, name);
      flashcards.forEach((flashcard) => {
        const cardDocRef = doc(colRef);
        batch.set(cardDocRef, flashcard);
      });

      await batch.commit();
      handleClose();
      router.push('/flashcards');
    } catch (error) {
      console.error('Error saving flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
  <div className = 'generate'>
  <Container maxWidth="md">
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

  <Box
    sx={{
      mt: 4,
      mb: 6,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: teal[50],
      borderRadius: 2,
      boxShadow: `0px 4px 10px ${grey[400]}`,
      p: 4
    }}
  >
    <Typography variant="h4" color={teal[900]} sx={{ mb: 2 }}>
      Generate Flashcards
    </Typography>
    <Paper sx={{ p: 4, width: '100%', backgroundColor: 'white' }}>
      <TextField
        value={text}
        onChange={(e) => setText(e.target.value)}
        label="Enter Topic and/or Difficulty"
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <TextField
        value={number}
        onChange={(e) => {
          let value = e.target.value;
          if (value === '') {
            setNumber('');
            return;
          }

          value = value.replace(/[^0-9]/g, '');
          if (value === '') {
            value = '1';
          } else if (parseInt(value, 10) > 10) {
            value = '10';
          }
          setNumber(value);
        }}
        onKeyPress={(e) => {
          if (['+', '-', '.', 'e'].includes(e.key)) {
            e.preventDefault();
          }
        }}
        label="Number of Flashcards (Limit 10)"
        type="text"
        fullWidth
        variant="outlined"
        sx={{ mb: 2 }}
        inputProps={{ min: 1, max: 10, step: 1 }}
      />
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading ? 'Generating...' : 'Generate'}
      </Button>
    </Paper>
  </Box>
  {isLoading && <Typography align="center" variant="h6" sx={{ mt: 2 }}>Loading...</Typography>}
  {flashcards.length > 0 && (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Flashcards Preview
      </Typography>
      <Grid container spacing={3}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                backgroundColor: grey[100],
                boxShadow: `0px 4px 10px ${grey[400]}`,
                '&:hover': {
                  backgroundColor: grey[200],
                  boxShadow: `0px 6px 15px ${grey[500]}`,
                },
              }}
            >
              <CardActionArea onClick={() => handleCardClick(index)}>
                <CardContent>
                  <Box
                    sx={{
                      perspective: '1000px',
                      '& > div': {
                        transition: 'transform 0.6s',
                        transformStyle: 'preserve-3d',
                        position: 'relative',
                        width: '100%',
                        height: '225px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
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
                        <Typography variant="h5" component="div">
                          {flashcard.front}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h5" component="div">
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
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}
        sx={{ mt: 4 }}
      >
        {isLoading ? 'Generating...' : 'Regenerate'}
      </Button>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleOpen}
          disabled={isLoading}
        >
          Save
        </Button>
      </Box>
    </Box>
  )}
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Save Flashcards</DialogTitle>
    <DialogContent>
      <DialogContentText>Please enter a name for your collection:</DialogContentText>
      <TextField
        autoFocus
        margin="dense"
        label="Collection Name"
        type="text"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        variant="outlined"
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} disabled={isLoading}>Cancel</Button>
      <Button onClick={saveFlashcards} disabled={isLoading}>Save</Button>
    </DialogActions>
  </Dialog>
</Container>
</div>
  );
  
}