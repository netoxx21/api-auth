import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import db from '../db.js';

const router = Router();

//GET /users/me
router.get('/me', requireAuth, (req, res) => {
    const user = db
        .prepare('SELECT id, name, email, created_at FROM users WHERE id = ?')
        .get(req.userId);

    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado'});
     }
    res.json(user);
});

export default router;