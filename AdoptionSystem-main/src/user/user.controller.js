'use strict' //Modo estricto

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate} from '../utils/validator.js'


export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const register = async(req, res)=>{
    try{
        //Capturar el formulario (body)
        let data = req.body
        console.log(data)
        //Encriptar la contraseña
        data.password = await encrypt(data.password)

        //Asignar el rol por defecto
        data.role = 'CLIENT'
        //Guardar la información en la BD
        let user = new User(data)
        await user.save()
        //Responder al usuario
        return res.send({message: `Registered successfully, can be logged with username ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err: err})
    }
}

export const login = async(req, res)=>{
    try {
        //Capturar el body (los datos)
        let {username, password} = req.body
        //Validar que el usuario exista
        let user = await User.findOne({username: username }) //Buscar el registro
        //Verifico que la contraseña coincida
        if(user && await checkPassword(password, user.password)){
            let logedUser = {
                username: user.username, 
                name:  user.name,
                role: user.role 
            }
            return res.send({message: `Welcome ${logedUser.name}`, logedUser})
        }
        if(!user) return res.status(404).send({message: 'User not found'})


    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error to login'})
    }
}
export const update = async(req, res)=>{// datos generales, no password
    try{
        //Obtener el id del usuario a actualizar
        let { id } = req.params 
        //Obtener los datos a actualizar
        let data = req.body
        //Validar si data trae datos
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        //Validar si tiene permiso (token)
        //Actualizar
        let updatedUser = await User.findOneAndUpdate(
            {_id: id}, //ObjetcId <- hexadecimales (hora sys, Version mongo, Llave privada ....)
            data, {new: true} // Los datos que se van a actualizar
        )
        //Validar la update
        if(!updatedUser) return res.status(401).send({message: 'User not found and not updated'})
        //Respondo al usuario
            return res.send({message: 'Updated user', updatedUser})
    }catch(err){
    console.error(err)
    if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is already taken`})
    return res.status(500).send({message: 'Error updating account'})}
} 

export const deleteU = async(req, res)=>{
    try{
        //Obtener el Id
        let { id } = req.params
        //Validar si esta loggeado y es el mismo
        //Eliminamos (deleteOne / findOneAndDelete)
        let deletedUser = await User.findOneAndDelete({_id: id})
        //Verificar que se elimine
        if(deletedUser) return res.status(404).send({message: 'Account not found and not deleted'})
        //Responder
        return res.send({message: `Account with username ${deletedUser.username} deleted succesfully`})//status 200
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}