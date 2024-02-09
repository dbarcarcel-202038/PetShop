'use strict' 
import Animals from './animals.model.js'
import { checkUpdate} from '../utils/validator.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}
export const regis = async(req, res)=>{
    try{
        let data = req.body
        console.log(data)

        data.type = 'DOMESTICO'
        let animal = new Animals(data)
        await animal.save()
        return res.send({message: `Registered successfully, can be logged ${animal.name}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering animal', err: err})
    }
}
export const upda = async(req, res)=>{// datos generales, no password
    try{
        //Obtener el id del usuario a actualizar
        let { id } = req.params 
        //Obtener los datos a actualizar
        let data = req.body
        //Validar si data trae datos
        
        if(!upda) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        //Validar si tiene permiso (token)
        //Actualizar
        let updatedAnimal = await Animals.findOneAndUpdate(
            {_id: id}, //ObjetcId <- hexadecimales (hora sys, Version mongo, Llave privada ....)
            data, {new: true} // Los datos que se van a actualizar
        )
        //Validar la update
        if(!updatedAnimal) return res.status(401).send({message: 'Animal not found and not updated'})
        //Respondo al usuario
            return res.send({message: 'Updated animal', updatedAnimal})
    }catch(err){
    console.error(err)
    if(err.keyValue.name) return res.status(400).send({message: `Name ${err.keyValue.name} is already taken`})
    return res.status(500).send({message: 'Error updating animal'})}
} 
export const deleteA = async(req, res)=>{
    try{
        //Obtener el Id
        let { id } = req.params
        //Validar si esta loggeado y es el mismo
        //Eliminamos (deleteOne / findOneAndDelete)
        let deletedAnimal = await Animals.findOneAndDelete({_id: id})
        //Verificar que se elimine
        if(deletedAnimal) return res.status(404).send({message: 'Animal not found and not deleted'})
        //Responder
        return res.send({message: `Animal with name ${deletedAnimal.name} deleted succesfully`})//status 200
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}