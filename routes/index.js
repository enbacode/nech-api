import express from 'express';
import app from '../app';

let router = express.Router();

router.get('/', (req, res) => {
    res.json({
        name: 'Nech API',
        version: '1.0',
    });
});

module.exports = router;