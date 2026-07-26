const XLSX = require('xlsx');

const workbook = XLSX.utils.book_new();

const clientesHeaders = [["COD_CLIENTE", "ESTADO", "RAZON_SOCIAL", "NIT", "DIRECCION", "TELEFONO_TEC", "CUIDAD", "EMAIL_TEC", "CONTACTO_TEC", "COD_CLIENTE_2", "EMAIL_COM", "CONTACTO_COM", "TELEFONO_COM", "Observaciones"]];
const clientesSheet = XLSX.utils.aoa_to_sheet(clientesHeaders);
XLSX.utils.book_append_sheet(workbook, clientesSheet, "Clientes");

const cotizacionesHeaders = [["Cotizacion", "Fecha_Solicitud", "Cliente", "NIT", "Contacto", "Fecha emisión de Cotización", "ID Cotización", "Valor", "Aprobado", "Observaciones", "Fecha pactada de la Prestación del Servicio", "ID Orden de Trabajo", "ID Requisición", "Fecha de Reporte", "ID Reporte de Servicio", "Fecha de Recepción de Equipos", "ID Recepción de Equipos", "Fecha de entrega OC", "ID Orden de Compra", "Fecha de Ingreso a Lab. Externo", "Laboratorio Externo", "Fecha de Entrega del Equipo Lab Externo", "Fecha de Recoger el Equipo", "Fecha de Entrega del Equipo al Cliente", "ID Reporte Entrega de Servicios", "Fecha de Reporte Entrega de Servicio", "Fecha de Emisión del Certificado", "ID Certificado", "Fecha de Entrega Certificado", "ID Factura", "Fecha de Factura", "Fecha de Pago", "Comprobante de Egreso"]];
const cotizacionesSheet = XLSX.utils.aoa_to_sheet(cotizacionesHeaders);
XLSX.utils.book_append_sheet(workbook, cotizacionesSheet, "Cotizaciones");

const recepcionHeaders = [["Cotizacion", "N_Recepcion", "Fecha recepción", "Cantidad", "Cliente", "Magnitud", "Acreditacion", "Lugar_Calibracion", "Descripcion", "Fecha de devolución", "Consecutivo Entrega", "Entregado por", "Fecha de Recepción", "Fecha de Calibración", "Fecha de envio de Certificado", "No. Certificado"]];
const recepcionSheet = XLSX.utils.aoa_to_sheet(recepcionHeaders);
XLSX.utils.book_append_sheet(workbook, recepcionSheet, "Recepción Equi");

const listasHeaders = [["Estado", "Acreditación", "Magnitud", "Aprobado", "Instrumentos", "Personal", "Modalidad"]];
const listasData = [
    ["Activo", "Tercero", "Masa", "Si", "IPFNA", "Andrés Muñoz", "Sitio"],
    ["Inactivo", "Propio", "Humedad y temperatura", "No", "Pesas OIML", "Favian Martínez", "Laboratorio"],
    ["", "", "Temperatura", "Pendiente", "Pesas no normalizada", "Leidi Muñoz", ""],
    ["", "", "Longitud", "", "Termohigrómetro", "Edelmira Rodríguez", ""],
    ["", "", "Volumen", "", "Termómetro", "Luz Marina", ""],
    ["", "", "Presión", "", "", "", ""],
    ["", "", "Condiciones Ambientales", "", "", "", ""],
    ["", "", "Eléctrica", "", "", "", ""],
    ["", "", "Electroquímica", "", "", "", ""],
    ["", "", "Tiempo", "", "", "", ""],
    ["", "", "Mantenimiento preventivo", "", "", "", ""],
    ["", "", "Frecuencia", "", "", "", ""],
    ["", "", "Otros", "", "", "", ""],
    ["", "", "Suministro", "", "", "", ""]
];
const listasSheet = XLSX.utils.aoa_to_sheet([listasHeaders[0], ...listasData]);
XLSX.utils.book_append_sheet(workbook, listasSheet, "listas");

XLSX.writeFile(workbook, "Datos_Prueba.xlsx");
console.log("Excel file Datos_Prueba.xlsx created successfully.");
