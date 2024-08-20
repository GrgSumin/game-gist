const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
 name: String,
 team: String,
 points: Number,
 price: Number,
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;