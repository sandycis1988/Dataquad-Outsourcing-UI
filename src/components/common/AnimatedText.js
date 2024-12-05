import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AnimatedText = () => {
  const theme = useTheme();
  const [key, setKey] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // List of 10 quotes
  const quotes = [
    "Proven Partner With Right Software Solutions & IT Solutions",
    "Innovation Distinguishes Between a Leader and a Follower",
    "Empowering Your Digital Transformation Journey",
    "Turning Your Vision Into a Reality",
    "The Best Way to Predict the Future is to Create It",
    "Delivering Excellence With Every Solution",
    "Technology Solutions That Drive Success",
    "We Build Software That Builds Businesses",
    "Your Success is Our Mission",
    "Simplifying Complexity Through Innovation",
  ];

  // Restart the animation every 10 seconds and update the quote
  useEffect(() => {
    const interval = setInterval(() => {
      setKey((prevKey) => prevKey + 1); // Update the key to trigger re-render
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length); // Change to the next quote
    }, 10000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Get the current quote
  const currentQuote = quotes[quoteIndex];

  // Split the quote into individual letters (including spaces for gaps)
  const letters = currentQuote.split("");

  return (
    <Box
      key={key}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%', // Makes the container flexible across all screen sizes
        overflowWrap: 'normal', // Prevent breaking words
        wordBreak: 'keep-all', // Ensure words are not split
        justifyContent: 'center', // Center the text for all screen sizes
      }}
    >
      {letters.map((letter, index) => (
        <Typography
          key={index}
          variant="body1"
          sx={{
            color: 'black',
            fontSize: {
              xs: '1.2rem', // Smaller on extra small screens
              sm: '1.5rem', // Small screens (like tablets)
              md: '2rem', // Medium screens (like laptops)
              lg: '2.5rem', // Large screens
            },
            fontWeight: 300,
            opacity: 0,
            display: 'inline-block',
            animation: letter === ' ' ? 'none' : `fadeIn 0.8s forwards`,
            animationDelay: `${index * 0.1}s`,
            marginRight: letter === ' ' ? '10px' : '0',
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
                transform: 'scale(0.8)',
              },
              '100%': {
                opacity: 1,
                transform: 'scale(1)',
              },
            },
          }}
        >
          {letter}
        </Typography>
      ))}
    </Box>
  );
};

export default AnimatedText;
