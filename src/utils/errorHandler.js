class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 500;
    }
}

const handleError = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ 
        error: err.message || "Erreur interne du serveur"
    });
};

module.exports = { AppError, handleError };

