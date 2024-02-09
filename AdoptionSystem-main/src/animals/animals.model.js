import mongoose from "mongoose"

const animalSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    race: {
        type: String,
        required: true
    },
    type: {
        type: String,
        uppercase: true,
        enum: ['DOMESTICO', 'SALVAJE'],
        required: true
    },
    age: {
        type: String,
        minLength: 1
    },
    keeper: {
        
    }

})