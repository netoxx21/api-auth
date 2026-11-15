import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

//GET /users/me
router.get('/me', requireAuth, (req, res) => {
    res.json({ message: 'Rota protegida acessada com sucesso!' });
});

export default router;