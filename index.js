const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = '';

/* * App.get for Homepage */
app.get('/', async (req, res) => {
    const customObjectUrl = 'https://api.hubspot.com/crm/v3/objects/custom_object'; // Replace with actual endpoint
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(customObjectUrl, { headers });
        const data = resp.data.results; // Adjust this according to the actual response structure
        res.render('homepage', { title: 'Homepage | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error'); // Handle errors appropriately
    }
});

/* * App.get for Contacts */
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

/* * App.post for Update */
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers });
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
