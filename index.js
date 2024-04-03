import express from 'express';
import pg from 'pg';
import { config } from 'dotenv';
import cors from 'cors';

config();
const app = express();
app.use(express.json());
app.use(cors());

const connection = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
}); 

connection.connect( ( err ) => {
    if (err) {
        console.error('Error de conexión a Postgres:', err);
        return;
    }

    console.log('Conexión a Postgres Establecida');
});

app.get('/', ( req, res ) => {
    res.send('Holap');
});

// Endpoint Get Users
app.get('/v1/get_usuarios', (req, res) => {
    connection.query('SELECT * FROM "user"', (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        
        res.status(200).json({ users: results.rows });
        //console.log('Usuarios', results.rows );

    });
});

// Endpoint Login
app.post('/v1/login', async (req, res) => {
    
    const { username, password } = req.body;

    connection.query(`SELECT * FROM "user" WHERE user_name = $1 AND user_password = $2`, [username, password], (error, results) => {
        if (error) {
            console.error( error );
            return res.status(500).json({ message: 'error interno del servidor' });
        }

        if (results.rows.length === 0) {
            return res.status(401).json({ message: 'usuario o contraseña incorrectos' });
        }

        console.log( results.rows );
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
        console.log("Inicio Correcto");

    });
});

// Register EndPoint
app.post('/v1/register', async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Insert Username and Password' });
    }

    connection.query(`INSERT INTO "user" (user_name, user_password) VALUES ($1, $2) RETURNING *`, [username, password], (error, results) => {
        if (error) {
            console.error( error );
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        console.log(results.rows[0]);

        res.status(201).json({ message: 'Usuario ingresado exitosamente', user_data: results.rows[0] });
        console.log( results.rows[0] );

    });
});



app.listen(3000);

