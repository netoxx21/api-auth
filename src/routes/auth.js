import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';

const router = Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isText = (value) => typeof value === 'string' && value.trim() !== '';

//POST /auth/register
router.post('/register', async (req, res) => {
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

    const normalizedEmail = email.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(password, 10);

    const result = db
        .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
        .run(name.trim(), normalizedEmail, passwordHash);

    res.status(201).json({
        id: result.lastInsertRowid,
        name: name.trim(),
        email: normalizedEmail,
     });
});

export default router;