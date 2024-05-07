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
router.get('/getById/:id', (req, res, next) => { 
});
// Update cliente
router.put('/update/:id', (req, res, next) => {
});
// Delete cliente
router.delete('/delete/:id', (req, res, next) => {
});

module.exports = router;