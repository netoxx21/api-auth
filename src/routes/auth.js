import { Router } from 'express';

const router = Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isText = (value) => typeof value === 'string' && value.trim() !== '';

//POST /auth/register
router.post('/register', (req, res) => {
    const { name, email, password } = req.body ?? {};

    if (!isText(name) || !isText(email) || !isText(password)) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email inválido.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    res.status(200).json({ message: 'Registro bem-sucedido!' });
});

export default router;