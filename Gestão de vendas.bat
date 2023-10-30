@echo off

cd backend
node index.js

cd ..\frontend
npm run dev

start "" http://localhost:5173/