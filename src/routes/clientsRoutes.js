const express = require('express');
const router = express.Router();
const clientSchema = require('../models/clients.js');

// Get all clientes
router.get('/getAllclients', async (req, res, next) => { 
    try {
        const clients = await clientSchema.find();
        res.render('perfilAdmin.ejs', { clients });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error obteniendo los clientes');
    }
}); // funciona desp de crearse en la bd aparece en la lista !!!!!

// Create cliente 
router.post('/createClient',async (req, res, next) => {
    const { email, name, lastname, contact, details, role } = req.body;
    try {
        const newClient = new clientSchema({
            email,
            name,
            lastname,
            contact,
            details,
            role
        });
        await newClient.save();
        res.status(201).send('Cliente creado exitosamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al crear el cliente');
    }
}); // funciona se crea ok !!!!!

// Get byId clientes
router.get('/:id', async (req, res, next) => { 
    const clientId = req.params.id;
    try {
        const client = await clientSchema.findById(clientId);
        if (client) {
            res.status(200).json(client);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error obteniendo el cliente');
    }
}); // funciona se trae mediante su id ok !!!!!

// Update cliente
router.put('/update/:id', async (req, res, next) => {
    const clientId = req.params.id; // Obtiene el ID del cliente de los parámetros de la solicitud
    const { email, name, lastname, contact, details, role } = req.body; // Obtiene los datos actualizados del cliente
    try {
        const updatedClient = await clientSchema.findByIdAndUpdate(clientId, {
            email,
            name,
            lastname,
            contact,
            details,
            role
        }, { new: true }); // Busca/actualiza el cliente en la base de datos/devuelve cliente actualizado
        if (updatedClient) {
            res.status(200).json(updatedClient);// Si se actualiza correctamente:
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el cliente' });
    }

});
// Delete cliente
router.delete('/delete/:id', (req, res, next) => {
});

module.exports = router;