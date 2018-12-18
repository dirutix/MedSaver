'use strict';

const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');
const autoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const MedcineSchema = new Schema({
    name: {
        type: String
    },
    child: {
        type: Boolean
    },
    adult: {
        type: Boolean
    },
    kilogramsDozing: {
        type: Boolean
    },
    childAgeRangeEl: {
        type: Array
    },
    childDozes: {
        type: Array
    },
    adultDoze: {
        type: String
    }

});

MedcineSchema.plugin(paginate);
MedcineSchema.plugin(autoIncrement, {
    inc_field: 'medcine_id'
});

function createMedcine(MedcineObject) {
    return Medcine.create(MedcineObject).then(data => {
        return Promise.resolve("created");
    }).catch(err => {
        console.log(err);
        return Promise.reject(err);
    });
}

async function getAllMedcines(page) {
    return await Medcine.paginate({}, { limit: 10, page: page }, (err, data) => {
        if (err) {
            return err;
        } else {
            return data;
        }
    });
}

MedcineModel = mongoose.model("Medcine", MedcineSchema);

module.exports = {
    MedcineModel: MedcineModel,
    getAllMedcines: getAllMedcines,
    createMedcine: createMedcine
};