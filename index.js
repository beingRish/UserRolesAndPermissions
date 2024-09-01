require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/user-roles-perm");

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// auth route
const authRoute = require('./routes/authRoute');
app.use('/api', authRoute);

// admin route
const adminRoute = require('./routes/adminRoute');
app.use('/api/admin', adminRoute);

// common route
const commonRoute = require('./routes/commonRoute');
app.use('/api', commonRoute);



const auth = require('./middlewares/authMiddleware')
const { onlyAdminAccess } = require('./middlewares/adminMiddleware')
const routerController = require('./controllers/admin/routerController');

app.get(
    '/api/admin/all-routes',
    auth,
    onlyAdminAccess,
    routerController.getAllRoutes
)


const port = process.env.SERVER_PORT | 3000;

app.listen(port, () => {
    console.log("Server is running on Port: ", port)
});