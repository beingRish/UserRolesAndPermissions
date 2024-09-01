const mongoose = require('mongoose');

const routerPermissionSchema = new mongoose.Schema({

    router_endpoint: {
        type: String,
        required: true
    },

    role: { //0,1,2,3
        type: Number,
        required: true
    },

    permission: { //0,1,2,3
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('RouterPermission', routerPermissionSchema);