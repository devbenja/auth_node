import express from 'express';

const app = express();

app.get('/', ( req, res ) => {
    res.send('Holap');
});

app.listen(3000);

