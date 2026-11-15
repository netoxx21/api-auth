import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {   
    const header = req.headers.authorization ?? '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {    
        return res.status(401).json({ error: 'Token não informado'});
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256']
        });
        req.userId = payload.sub;
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido ou expirado'});
    }
}