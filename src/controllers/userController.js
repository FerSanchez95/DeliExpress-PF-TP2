import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import supabase from '../../config/supabase.js';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';

export const home = (req, res) => {
    res.send(`<h1>Home de la API</h1>`)
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).json({error: "Error al obtener usuarios"})
    }
}

export const getUserByName = async (req, res) => {

    const {name} = req.param.name;

    if(!name){
        res.status(400).json({error: "Falta el nombre a buscar"})
        return;
    }

    try {

        const users = await User.find({
            name: { $regex: `^${name}`, $options: 'i'}
        })
        res.json(users)
    } catch (error) {
        res.status(500).json({error: "Error al obtener usuarios"})
    }
}

export const getUsersById = async (req, res) => {

    try {
        const user = await User.findById(req.params.id)
        if(user){
            res.json(user)
        }else{
            res.status(404).json({ error: 'usuario no encontrado'})
        }
    } catch (error) {
        res.status(500).json({ error: "ID Invalido"})
    }

}

export const CrearUsuario = async (req, res) => {  

    console.log("Req crear Usuario: ", 
        { reqUsuario: req.usuario,
          reqBody: req.body
        });
    


    const { name, email, password, phone, roles, address} = req.body;
    if(!name || !email || !password || !phone || !roles || !address){
        return res.status(400).json({error: "Faltan datos"})
    }

    if (!Array.isArray(roles)) {
        roles = [roles];
    } 

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const usuario = {
        name,
        email,
        password: hashedPassword,
        phone,
        roles,
        address
    }

    try {
        const nuevoUsuario = await User.create(usuario)
        res.status(201).json(nuevoUsuario)
    } catch (error) {
        res.status(500).json({error: "Error al crear Usuario"})
    }
    
}


export const login = async (req, res) =>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({ error: 'Faltan credenciales'})
    }

    try {

        const usuario = await User.findOne({email});

        if(!usuario){
            return res.status(404).json({ error: 'Usuario no encontrado'})
        }

        const match = await bcrypt.compare(password, usuario.password)

        if(!match){
            return res.status(401).json({ error: 'Password incorrecta'})
        }


        // JWT.SIGN
        // Primer argumento, lo que vas a encriptar
        // Segundo argumento, la llave para encriptar / desencriptar
        // Tercer argumento, el tiempo que va a durar ese token
        const datosEncriptados = { id: usuario._id, email: usuario.email, rol: usuario.roles}
        const JWT_KEY = process.env.JWT_SECRET
        const token = jwt.sign(
            datosEncriptados,
            JWT_KEY,
            { expiresIn: '1h'}
        )

        res.json({ accessToken: token})
        
    } catch (error) {
        res.status(500).json({error: 'Error al hacer login'})
    }
}

export const actualizarProfilePic = async (req, res) => {
    const { usuario } = req;
    const file = req.file;
    
    if(!file){
        return res.status(400).json({ error: 'No se proporciono ninguna imagen'})
    }

    // console.log("File: ", file);
    

    const fileName = `${Date.now()}_${file.originalname}`
    const filePath = `usuarios/${usuario.id}/profilePic/${fileName}`

    try {
        const { data, error } = await supabase.storage
                                .from(process.env.SUPABASE_BUCKET)
                                .upload(filePath, file.buffer, {
                                    contentType: file.mimetype,
                                    upsert: true
                                })

        if(error){
            return res.status(500).json({
                error: 'Error al subir la imagen a Supabase',
                errorMensaje: error
            })
        }

        const {data: publicUrlData } = supabase.storage.from(process.env.SUPABASE_BUCKET).getPublicUrl(filePath) 
        
        const profilePicUrl = publicUrlData.publicUrl;

        const usuarioActualizado = await User.findByIdAndUpdate(
            usuario.id,
            {profile_pic: profilePicUrl},
            {new: true}
        );

        res.json({
            msg: 'Imagen actualizada correctamente',
            usuario: usuarioActualizado
        })
        

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al actualizar la imagen'})
    }
}

export const asignarRepartidor = async (req, res) => {
  const { orderId, driverId } = req.body;

  if (!orderId || !driverId) {
    return res.status(400).json({ error: 'Faltan datos necesarios' });
  }

  try {
    // Verificar si el repartidor ya tiene un pedido activo
    const pedidoActivo = await Order.findOne({
      driver: driverId,
      status: { $in: ['pending', 'preparing', 'on_the_way'] }
    });

    if (pedidoActivo) {
      return res.status(400).json({ error: 'El repartidor ya tiene un pedido en curso.' });
    }

    // Asignar repartidor al pedido
    const pedidoActualizado = await Order.findByIdAndUpdate(
      orderId,
      { driver: driverId },
      { new: true }
    );

    if (!pedidoActualizado) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }

    res.json({ message: 'Repartidor asignado correctamente', pedido: pedidoActualizado });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al asignar repartidor' });
  }
};
