const { ZodError } = require("zod");

exports.validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        next(error);
    }
};
