import express from 'express';

const app = express();

app.use(express.json());//transforma o corpo da requisição em json

// Middleware para registrar as requisições no console
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


app.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' });
});


//Rota POST de teste
app.post('/echo', (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ error: 'O campo "nome" é obrigatório.' });
  }

  res.json({ message: `Olá, ${nome}!` });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});