import jwt from 'jsonwebtoken';
import User from '../src/models/User.js';

export const protegerRuta = (req, res, next) => {

    const authHeader = req.headers.authorization

    console.log("AuthHeader: ", authHeader);
    

    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({error: "Token no proporcionado"})
    }

    // let tokenImaginario = 'Bearer d238as78e7s7s'

    const token = authHeader.split(" ")[1]

    console.log("token: ", token);


    // 
    try {
        
        const decodificado = jwt.verify(token, process.env.JWT_SECRET)

        console.log("decodificado: ", decodificado);


        req.usuario = decodificado;
       
        next()

    } catch (error) {
        return res.status(403).json({ error: 'Token invalido o expirado'})
    }
}

export const protegerRutaAdmin = (req, res, next) => {

    const authHeader = req.headers.authorization

    console.log("AuthHeader: ", authHeader);
    

    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({error: "Token no proporcionado"})
    }

    // let tokenImaginario = 'Bearer d238as78e7s7s'

    const token = authHeader.split(" ")[1]

    console.log("token: ", token);

    try {
        
        const decodificado = jwt.verify(token, process.env.JWT_SECRET)

        console.log("decodificado: ", decodificado);


        req.usuario = decodificado;

        if(req.usuario.rol !== 'admin'){
            return res.status(401).json({ error: 'No eres admin'})

        }
       
        next()

    } catch (error) {
        return res.status(403).json({ error: 'Token invalido o expirado'})
    }
}

export const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Missing token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export const requireRole = (requiredRoles) => {
  return (req, res, next) => {
    const user = req.usuario;

    if (!user || !user.roles) {
      return res.status(403).json({ message: 'Acceso denegado. Usuario no autenticado o sin roles.' });
    }

    const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles];
    const hasRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: 'Acceso denegado. Requiere rol: ' + requiredRoles.join(', ') });
    }

    next();
  };
};

