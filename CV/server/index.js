import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

import OpenAI from 'openai';
import fs from 'fs';
import pdfParse from 'pdf-parse'; // For reading PDFs
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
const apiKey = process.env.API_KEY;
const { Pool } = pkg;
const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cv_database',
  password: '6853',
  port: 5432,
});

const SECRET_KEY = 'your_secret_key';
//const uploadsDir = path.resolve(__dirname, '../uploads');
// 🔽 Multer Setup
const upload = multer({ dest: 'uploads/' });
//const upload = multer({ dest: uploadsDir });

// 🚀 Resume Upload Route
app.post('/api/upload', upload.single('resume'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.status(200).json({ message: 'File uploaded successfully', filePath: req.file.path });
});

// Existing Routes...
app.post('/api/register', async (req, res) => { 
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'User registration failed' });
  }
});

app.post('/api/login', async (req, res) => { 
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});


const genAI = new GoogleGenerativeAI(apiKey);

app.post('/api/evaluate', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Read and parse PDF
    const fileBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(fileBuffer);

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
      Analyze the following resume and provide structured feedback.
      1. Provide strengths and areas for improvement.
      2. Rate the resume on the following criteria (1 to 10):
         - Content
         - Formatting
         - Skills Relevance
         - Clarity
      Return your response in JSON format like this:
      {
        "feedback": "Your detailed feedback here...",
        "ratings": {
          "Content": 8,
          "Formatting": 7,
          "Skills Relevance": 9,
          "Clarity": 6
        }
      }

      Resume Text:
      ${pdfData.text}
    `;

    const result = await model.generateContent(prompt);
    // ✅ Extract text correctly from Gemini response
    // ✅ Extract text correctly from Gemini response
    const responseText = result.response.candidates[0].content.parts[0].text;

    // ✅ Remove potential Markdown formatting
    const cleanText = responseText.replace(/```json|```/g, '').trim();

    // ✅ Parse cleaned JSON response
    const parsedResponse = JSON.parse(cleanText);

    const { feedback, ratings } = parsedResponse;

    res.json({ feedback, ratings }); // ✅ Send response
  } catch (err) {
    console.error("AI Response Error:", err);
    res.status(500).json({ error: 'Resume evaluation failed' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));