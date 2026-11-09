import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});