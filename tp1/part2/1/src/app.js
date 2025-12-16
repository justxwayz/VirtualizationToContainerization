const express = require('express');
const app = express();

// Inline html parce que j'ai la flemme en fait, moins y'a de fichiers, mieux c'est pour nos exemples :d
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>HTTP Cat</title>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f0f0f0;
          }
          img {
            max-width: 90vw;
            max-height: 90vh;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          }
        </style>
      </head>
      <body>
      <h1>HOT RELOAD</h1>
        <img src="https://http.cat/images/200.jpg" alt="HTTP Cat 200 - OK">
      </body>
    </html>
  `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
