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
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
      if (existing) {
        return res.status(409).json({ error: 'Email já cadastrado.' });
    }

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


//POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body ?? {};

    if (!isText(email) || !isText(password)) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const user = db
    .prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?')
    .get(email.toLowerCase().trim());

    const passwordMatches = user && (await bcrypt.compare(password, user.password_hash));
    if (!passwordMatches) {
        return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    //temporario
    res.status(200).json({ user: { id: user.id, name: user.name, email: user.email } });
})

export default router;