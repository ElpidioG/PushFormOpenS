const express = require('express');
const soap = require('soap');
const cors = require('cors');
const db = require('./db'); // Conexión a MySQL
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Definir el servicio SOAP
const service = {
    NominaService: {
        NominaPort: {
            getNomina: function (args, callback) {
                const query = 'SELECT * FROM Nomina'; // Asegúrate de que la tabla existe

                db.query(query, (err, results) => {
                    if (err) {
                        console.error('Error al obtener datos:', err);
                        return callback({ message: 'Error al obtener datos' });
                    }

                    console.log('Datos obtenidos de la BD:', results); // 🔍 Verifica los datos en la consola
                    

                    if (!results || results.length === 0) {
                        return callback({ Nomina: JSON.stringify([]) }); // Evita errores si la BD está vacía
                    }

                    // Envuelve los datos en el nodo <Nomina>
                    const response = { Nomina: JSON.stringify(results) };
                    callback(null, response);
                });
            }
        }
    }
};

// Cargar el archivo WSDL
const wsdlPath = path.join(__dirname, 'nomina.wsdl');
const wsdlXML = fs.readFileSync(wsdlPath, 'utf8');

// Iniciar el servidor SOAP
const port = 3000;
app.listen(port, () => {
    soap.listen(app, '/soap', service, wsdlXML);
    console.log(`Servidor SOAP corriendo en http://localhost:${port}/soap`);
});
