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
    const { email, name, lastname, contact, details, role, eventDate, salonType  } = req.body;
    try {
        const newClient = new clientSchema({
            email,
            name,
            lastname,
            contact,
            details,
            role,
            eventDate: new Date(eventDate),
            salonType
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

// Render clientDetails view

router.get('/clientDetails/:id', async (req, res) => {
    console.log(`Recibiendo solicitud para cliente con ID: ${req.params.id}`);
    const clientId = req.params.id;
    try {
        const client = await clientSchema.findById(clientId);
        if (client) {
            res.render('clientDetails.ejs', { client }); //este tiene que quedar .ejs
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error obteniendo el cliente' });
    }
});

// Redirección a clientDetails 
// router.get('/clientDetails/:id', (req, res) => {
//     const clientId = req.params.id;
//     res.redirect(`/clientDetails/${clientId}`);
// }); esto parece q esta al pedo pero no se 

// chekear disponibilidad de salon segun fecha 
router.post('/checkAvailability', async (req, res) => {
    const { eventDate, salonType } = req.body;
    console.log('Solicitud recibida con:', req.body);

    if (!eventDate || !salonType) {
        return res.status(400).json({ message: 'Faltan parámetros' });
    }
    const date = new Date(eventDate);
    if (isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Fecha no válida' });
    }
    try {
        const client = await clientSchema.findOne({ eventDate: date.toISOString().split('T')[0], salonType });
        if (client) {
            res.json({ available: false });
        } else {
            res.json({ available: true });
        }
    } catch (error) {
        console.error('Error en la consulta', error);
        res.status(500).send('Error al verificar la disponibilidad');
    }
});

// router.post('/checkAvailability', async (req, res) => {
//     const { eventDate, salonType } = req.body;
//     console.log('Solicitud recibida con:', req.body);

//     if (!eventDate || !salonType) {
//         return res.status(400).json({ message: 'Faltan parámetros' });
//     }
//     const date = new Date(eventDate);
//     if (isNaN(date.getTime())) {
//         return res.status(400).json({ message: 'Fecha no válida' });
//     }
//     try {
//         const client = await clientSchema.findOne({ eventDate, salonType });
//         if (client) {
//             res.json({ available: false });
//         } else {
//             res.json({ available: true });
//         }
//     } catch (error) {
//         console.error('Error en la consulta', error);
//         res.status(500).send('Error al verificar la disponibilidad');
//     }
// });


// Update cliente
router.put('/update/:id', async (req, res, next) => {
    const clientId = req.params.id;
    const { email, name, lastname, contact, details, role, amountChild, amountAdult, specificDetails } = req.body;
    try {
        const client = await clientSchema.findById(clientId);
        if (client) {
            client.email = email;
            client.name = name;
            client.lastname = lastname;
            client.contact = contact;
            client.details = details;
            client.role = role;
            // Registrar el pago
            client.payments.push({
                date: new Date(),
                amountChild: amountChild,
                amountAdult: amountAdult,
                specificDetails: specificDetails
            });
            await client.save();
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
    const { email, name, lastname, contact, details, role, amountChild, amountAdult, specificDetails } = req.body;
    try {
        const client = await clientSchema.findById(clientId);
        if (client) {
            client.email = email;
            client.name = name;
            client.lastname = lastname;
            client.contact = contact;
            client.details = details;
            client.role = role;
            // Registrar el pago
            client.payments.push({
                date: new Date(),
                amountChild: amountChild,
                amountAdult: amountAdult,
                specificDetails: specificDetails
            });
            await client.save();
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