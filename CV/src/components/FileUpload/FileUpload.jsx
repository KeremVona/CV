import React from 'react'
import "./FileUpload.css"
import { useState } from 'react';
import axios from 'axios';

export default function FileUpload() {
    const [file, setFile] = useState(null);
    const [feedback, setFeedback] = useState(''); 

    const handleFileUpload = async () => {
      if (!file) {
        alert('Please select a file to upload.');
        return;
      }
    
      const formData = new FormData();
      formData.append('resume', file);
    
      try {
        const response = await axios.post('http://localhost:5000/api/evaluate', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Resume uploaded successfully!');
        setFeedback(response.data.feedback); // Display AI feedback
      } catch (err) {
        alert('File upload or evaluation failed');
      }
    };

  return (
    <div className="first-div">
    <div className="mt-4">
        <h2 className="text-2xl font-semibold mb-2">Upload Your Resume</h2>
        <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-2" />
        <button onClick={handleFileUpload} className="text-white px-4 py-2 rounded">Upload</button>
        {feedback && (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <h2 className="text-2xl font-semibold mb-2">AI Feedback:</h2>
          <p>{feedback}</p>
        </div>
        )}
    </div>
    </div>
  )
}