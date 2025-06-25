import express from 'express';
import {
    home,
    getUsers,
    getUsersById,
    getUserByName,
    CrearUsuario,
    actualizarProfilePic,
    login,
    asignarRepartidor
} from '../controllers/userController.js'
import { protegerRuta } from '../../middlewares/authMiddlewares.js';
import { allowUpload } from '../../middlewares/uploadMiddleware.js';

const router = express.Router()

router.post('/api/login', login)

router.get('/', home)
router.get('/usuarios', getUsers)
router.get('/search/usuarios/:id', getUsersById)
router.get('/search/usuarios/:name', getUserByName)


router.post('/usuarios', CrearUsuario)
router.put('/usuarios', protegerRuta, allowUpload.single('imagen'), actualizarProfilePic)
router.post('/api/usuario', protegerRuta, asignarRepartidor)


export default router