import React, { useState } from 'react';
import axios from 'axios';
import './Nomina.css';
import LOGO_UNAPEC from '../../src/images/LOGO_UNAPEC.png'
const NominaTable = () => {
    const [nominaData, setNominaData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTable, setShowTable] = useState(false);

    const fetchNominaData = async () => {
        setLoading(true);
        const soapRequest = `
            <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://localhost:3000/soap">
                <soap:Body>
                    <tns:getNomina />
                </soap:Body>
            </soap:Envelope>`;

        try {
            const response = await axios.post('http://localhost:3000/soap', soapRequest, {
                headers: { 'Content-Type': 'text/xml' },
            });

            // Parsear la respuesta SOAP
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data, "application/xml");

            // Definir el namespace y el nombre local del elemento que deseas obtener
            const namespace = "http://localhost:3000/soap";
            const localName = "Nomina";

            // Obtener el elemento utilizando getElementsByTagNameNS
            const nominaElements = xmlDoc.getElementsByTagNameNS(namespace, localName);

            // Verificar si se encontró el elemento
            if (nominaElements.length > 0) {
                const nominaNode = nominaElements[0];
                const nominaJsonString = nominaNode.textContent.trim();
                if (!nominaJsonString) {
                    console.log('El nodo <Nomina> está vacío.');
                    return;
                }

                const nominaData = JSON.parse(nominaJsonString.replace(/&quot;/g, '"'));
                setNominaData(nominaData);
            } else {
                console.log("No se encontró el nodo <Nomina> en la respuesta.");
            }
        } catch (error) {
            console.error('Error al obtener la nómina:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleButtonClick = () => {
        if (!showTable) {
            fetchNominaData();
        }
        setShowTable(!showTable);
    };

    return (
        <div className="card">
               <img className="logo" src={LOGO_UNAPEC} alt="LOGO_UNAPEC" />
            <h1 className="card-title">Nómina de Empleados</h1>
         
            <button className="toggle-button" onClick={handleButtonClick}>
                {loading ? 'Cargando...' : showTable ? 'Ocultar Nómina' : 'Mostrar Nómina'}
            </button>
            {showTable && !loading && nominaData.length > 0 && (
                <table className="nomina-table">
                    <thead>
                        <tr>
                            <th>Tipo Registro</th>
                            <th>Cédula</th>
                            <th>Ocupación</th>
                            <th>Salario</th>
                            <th>Fecha Ingreso</th>
                            <th>Estatus Laboral</th>
                            <th>Estado de Pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nominaData.map((item) => (
                            <tr key={item.CedulaEmpleado}>
                                <td>{item.TipoRegistro}</td>
                                <td>{item.CedulaEmpleado}</td>
                                <td>{item.Ocupacion}</td>
                                <td>{item.Salario}</td>
                                <td>{item.FechaIngreso}</td>
                                <td>{item.EstatusLaboral}</td>
                                <td>{item.EstadoPago}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default NominaTable;
