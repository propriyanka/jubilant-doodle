// src/Quote.js
import React from 'react';

const Quote = ({ text }) => {
  return (
    <div className="p-4 m-2 border rounded-lg shadow-md">
      <p className="text-lg">{text}</p>
    </div>
  );
};

export default Quote;
