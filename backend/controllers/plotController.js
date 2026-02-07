const Plot = require('../models/Plot');

/**
 * Get all plots for current user
 * GET /api/plots
 */
exports.getPlots = async (req, res, next) => {
    try {
        const plots = await Plot.find({ owner: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                plots
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get single plot
 * GET /api/plots/:id
 */
exports.getPlot = async (req, res, next) => {
    try {
        const plot = await Plot.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!plot) {
            return res.status(404).json({
                success: false,
                message: 'Plot not found'
            });
        }

        res.json({
            success: true,
            data: {
                plot
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Create new plot
 * POST /api/plots
 */
exports.createPlot = async (req, res, next) => {
    try {
        const plotData = {
            ...req.body,
            owner: req.user._id
        };

        const plot = await Plot.create(plotData);

        res.status(201).json({
            success: true,
            message: 'Plot created successfully',
            data: {
                plot
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Update plot
 * PUT /api/plots/:id
 */
exports.updatePlot = async (req, res, next) => {
    try {
        const plot = await Plot.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!plot) {
            return res.status(404).json({
                success: false,
                message: 'Plot not found'
            });
        }

        Object.assign(plot, req.body);
        await plot.save();

        res.json({
            success: true,
            message: 'Plot updated successfully',
            data: {
                plot
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Delete plot
 * DELETE /api/plots/:id
 */
exports.deletePlot = async (req, res, next) => {
    try {
        const plot = await Plot.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!plot) {
            return res.status(404).json({
                success: false,
                message: 'Plot not found'
            });
        }

        res.json({
            success: true,
            message: 'Plot deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};
