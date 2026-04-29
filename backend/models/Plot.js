const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema({
    owner:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    streetAddress: { type: String, default: null },
    postalCode:    { type: String, default: null },
    city:          { type: String, default: null },
    province:      { type: String, default: null },
    country:       { type: String, default: null },
    length:        { type: Number, required: true },
    width:         { type: Number, required: true },
    soilType:      { type: String, default: 'unknown' },
    topography:    { type: String, default: 'flat' },
    status:        { type: String, default: 'active' },
    hasWater:      { type: Boolean, default: false },
    hasElectricity:{ type: Boolean, default: false },
    hasGas:        { type: Boolean, default: false },
    hasSewer:      { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Plot', plotSchema);
