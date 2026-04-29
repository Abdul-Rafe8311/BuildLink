const Plot = require('../models/Plot');

exports.getPlots = async (req, res, next) => {
    try {
        const plots = await Plot.find({ owner: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: { plots } });
    } catch (err) {
        next(err);
    }
};

exports.getPlot = async (req, res, next) => {
    try {
        const plot = await Plot.findOne({ _id: req.params.id, owner: req.user._id });
        if (!plot) return res.status(404).json({ success: false, message: 'Plot not found' });
        res.json({ success: true, data: { plot } });
    } catch (err) {
        next(err);
    }
};

exports.createPlot = async (req, res, next) => {
    try {
        const { streetAddress, postalCode, city, province, country,
                length, width, soilType, topography, status,
                hasWater, hasElectricity, hasGas, hasSewer } = req.body;

        const plot = await Plot.create({
            owner: req.user._id,
            streetAddress, postalCode, city, province, country,
            length, width, soilType, topography, status,
            hasWater, hasElectricity, hasGas, hasSewer
        });

        res.status(201).json({ success: true, message: 'Plot created successfully', data: { plot } });
    } catch (err) {
        next(err);
    }
};

exports.updatePlot = async (req, res, next) => {
    try {
        const plot = await Plot.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!plot) return res.status(404).json({ success: false, message: 'Plot not found' });
        res.json({ success: true, message: 'Plot updated successfully', data: { plot } });
    } catch (err) {
        next(err);
    }
};

exports.deletePlot = async (req, res, next) => {
    try {
        const plot = await Plot.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!plot) return res.status(404).json({ success: false, message: 'Plot not found' });
        res.json({ success: true, message: 'Plot deleted successfully' });
    } catch (err) {
        next(err);
    }
};
