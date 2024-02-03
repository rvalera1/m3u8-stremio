const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const fs = require('fs');
const path = require('path');

const builder = new addonBuilder({
    id: 'org.m3u-stremio',
    version: '0.0.1a',
    name: 'm3u-stremio',
    catalogs: [],
    resources: ['stream'],
    types: ['movie'],
    idPrefixes: ['tt']
});

// Función para guardar la configuración y el archivo M3U
function guardarConfiguracionYArchivoM3U(configuracion, m3uData) {
    const directorioUsuario = path.join(__dirname, 'usuario_data');
    const rutaConfiguracion = path.join(directorioUsuario, 'config.json');
    const rutaArchivoM3U = path.join(directorioUsuario, 'archivo.m3u');

    // Crea el directorio de usuario si no existe
    if (!fs.existsSync(directorioUsuario)) {
        fs.mkdirSync(directorioUsuario);
    }

    // Guarda la configuración
    fs.writeFileSync(rutaConfiguracion, JSON.stringify(configuracion), 'utf8');

    // Guarda el archivo M3U
    fs.writeFileSync(rutaArchivoM3U, m3uData, 'utf8');
}

// Define el manejador para configurar el addon
builder.defineConfigurator(({ type, key, data }) => {
    if (type === 'movie' && key === 'config') {
        // Guarda la configuración y el archivo M3U
        guardarConfiguracionYArchivoM3U(data, data.m3uData);

        return Promise.resolve({ success: true });
    }
    return Promise.resolve({ success: false });
});

// Define el manejador de transmisiones
builder.defineStreamHandler((args) => {
    // Lógica para manejar las solicitudes de transmisión (puedes adaptar según tus necesidades)
});

// Iniciar el servidor HTTP para el addon
serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });

