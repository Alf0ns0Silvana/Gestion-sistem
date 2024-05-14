const express = require('express');
const router = express.Router();
const clientSchema = require('../models/clients.js');

// Funcion para renderiza /perfilAdmin actualizado luego de peticiones 
 
async function renderPerfilAdmin(res) {
    try {
        const clients = await clientSchema.find();
        res.render('perfilAdmin.ejs', { clients });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error obteniendo los clientes' });
    }
}

// Get all clientes
router.get('/getAllclients', async (req, res, next) => { 
    renderPerfilAdmin(res);
});

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
        res.redirect('/perfilAdmin');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al crear el cliente' });
    }
}); 

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
        res.status(500).json({ message: 'Error obteniendo el cliente' });
    }
}); 

// Update cliente
router.put('/update/:id', async (req, res, next) => {
    const clientId = req.params.id;
    const { email, name, lastname, contact, details, role } = req.body;
    try {
        const updatedClient = await clientSchema.findByIdAndUpdate(clientId, {
            email,
            name,
            lastname,
            contact,
            details,
            role
        }, { new: true });
        if (updatedClient) {
            res.redirect('/perfilAdmin');
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el cliente' });
    }
}); 

router.post('/update/:id', async (req, res, next) => {
    const clientId = req.params.id;
    const { email, name, lastname, contact, details, role } = req.body;
    try {
        const updatedClient = await clientSchema.findByIdAndUpdate(clientId, {
            email,
            name,
            lastname,
            contact,
            details,
            role
        }, { new: true });
        if (updatedClient) {
            res.redirect('/perfilAdmin');
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el cliente' });
    }
});

// Delete cliente
router.delete('/delete/:id', async (req, res, next) => {
    const clientId = req.params.id;
    try {
        const deletedClient = await clientSchema.findByIdAndDelete(clientId);
        if (deletedClient) {
            res.redirect('/perfilAdmin');
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar el cliente' });
    }
});

router.post('/delete/:id', async (req, res, next) => {
    const clientId = req.params.id;
    try {
        const deletedClient = await clientSchema.findByIdAndDelete(clientId);
        if (deletedClient) {
            res.redirect('/perfilAdmin');
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar el cliente' });
    }
});

module.exports = router;