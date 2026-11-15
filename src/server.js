import express from 'express';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';

const app = express();

//transforma o corpo da requisição em json
app.use(express.json());

// Registra cada requisição no terminal
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

//Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

//Tratamento de erros
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido' });
  }

  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});