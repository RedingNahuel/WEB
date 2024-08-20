const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// Middleware para parsear datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Sirviendo archivos estáticos
app.use(express.static(path.join(__dirname, 'Frontend')));

// Ruta para manejar el envío del formulario
app.post('/send', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Configuración del transportador de Nodemailer con credenciales
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'lnahuelreding@gmail.com', // Tu correo
            pass: 'Cachetito275'  // Tu contraseña
        }
    });

    const mailOptions = {
        from: email,
        to: 'lnahuelreding@gmail.com',
        subject: `Contacto desde el formulario: ${subject}`,
        text: `Nombre: ${name}\nEmail: ${email}\nMensaje:\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error al enviar el mensaje');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Mensaje enviado con éxito');
        }
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
