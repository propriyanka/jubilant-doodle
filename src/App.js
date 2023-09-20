// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quote = ({ text }) => {
  return (
    <div className="p-4 m-2 border rounded-lg shadow-md">
      <p className="text-lg">{text}</p>
    </div>
  );
};

function App() {
  const [quotes, setQuotes] = useState([]);
  const [pollingInterval, setPollingInterval] = useState(5000); // Initial polling interval (5 seconds)
  const maxPollingInterval = 120000; // Maximum polling interval (2 minutes)

  const fetchQuote = async () => {
    try {
      const response = await axios.get('https://api.adviceslip.com/advice');
      const quoteText = response.data.slip.advice;
      setQuotes((prevQuotes) => [...prevQuotes, quoteText]);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  useEffect(() => {
    let timer;
    let fetchCount = 0;

    const fetchQuotesWithPolling = async () => {
      timer = setInterval(() => {
        if (fetchCount < 5) {
          fetchQuote();
          fetchCount++;
        } else {
          clearInterval(timer);
          fetchCount = 0;

          // Double the polling interval, but not exceeding the maximum
          if (pollingInterval < maxPollingInterval) {
            setPollingInterval((prevInterval) => prevInterval * 2);
          } else {
            setPollingInterval(maxPollingInterval);
          }

          // Continue fetching after doubling the interval
          setTimeout(fetchQuotesWithPolling, pollingInterval);
        }
      }, pollingInterval);
    };

    // Start fetching quotes
    fetchQuotesWithPolling();

    // Clean up the timer when the component unmounts
    return () => clearInterval(timer);
  }, [pollingInterval]);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Random Quotes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {quotes.map((quote, index) => (
          <Quote key={index} text={quote} />
        ))}
      </div>
    </div>
  );
}

export default App;
