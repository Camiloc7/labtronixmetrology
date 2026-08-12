# Riesgos y preparacion de seguridad para despliegue futuro

El proyecto se usa actualmente solo en una maquina local. Los puntos siguientes no implican exposicion publica hoy; son requisitos antes de publicar, compartir el repositorio o abrir puertos mediante un tunel.

## Ya corregido en el codigo

- Requisiciones e importacion masiva requieren sesion y rol autorizado.
- Las cargas de Excel e imagenes validan extension, firma y un limite local configurable.
- Los secretos JWT son obligatorios cuando `NODE_ENV=production`.
- Swagger no se publica en produccion a menos que `ENABLE_SWAGGER=true`.
- Los endpoints de login y refresh tienen limite local por IP. En produccion debe complementarse en Nginx o un servicio distribuido.

## Obligatorio antes del VPS

1. Configurar `NODE_ENV=production`, `JWT_SECRET` y `JWT_REFRESH_SECRET` distintos, aleatorios y de al menos 32 caracteres. No usar valores de ejemplo ni guardar `.env` en Git.
2. Crear el primer administrador mediante un mecanismo de provision seguro. `npm run seed` exige las variables `SEED_*_PASSWORD`; usalo una sola vez y retira esas variables despues.
3. Publicar unicamente Nginx en 80/443. Backend, frontend y PostgreSQL deben permanecer en `127.0.0.1` o en una red interna; PostgreSQL nunca debe quedar abierto a Internet.
4. Configurar TLS valido, redireccion HTTP a HTTPS, HSTS y una Content-Security-Policy probada con la interfaz. Mantener cookies `secure`, que la aplicacion activa con `NODE_ENV=production`.
5. Definir `FRONTEND_URL` como una URL HTTPS exacta. No usar comodines en CORS. Activar `TRUST_PROXY=true` solo si Nginx es el proxy de confianza; de lo contrario se podrian falsificar IPs mediante encabezados `X-Forwarded-*`.
6. Restringir `/api/docs` o dejar `ENABLE_SWAGGER=false`. Si se habilita, anadir autenticacion adicional o una regla de IP en Nginx.
7. Implementar rate limiting en Nginx o Redis para login, refresh, cargas y APIs costosas. El guard local no comparte estado entre procesos o replicas.
8. Actualizar dependencias y ejecutar `npm audit --omit=dev` en frontend y backend hasta resolver los hallazgos de produccion, especialmente Next.js y ExcelJS.
9. Establecer copias de seguridad cifradas de PostgreSQL, retencion definida, restauracion probada y permisos minimos para el usuario de BD.
10. Centralizar logs de acceso/error, sin registrar cookies, contrasenas, JWT ni documentos con datos personales. Configurar alertas para fallos de login, cargas rechazadas y errores 5xx.
11. Mantener el proxy configurado para WebSockets (`/work-orders` y Upgrade/Connection) y permitir solo el origen exacto de `FRONTEND_URL`. Si se ejecutan varias instancias del backend, usar un adaptador compartido como Redis para propagar los eventos entre instancias.

## Limites que requieren seguimiento

- `UPLOAD_MAX_EXCEL_MB` y `UPLOAD_MAX_IMAGE_MB` permiten ajustar las cargas sin cambiar codigo (100 MB y 50 MB por defecto). El maximo tecnico por archivo es 250 MB porque Multer mantiene la carga en memoria; elevarlo exige dimensionar la RAM y, para el VPS, migrar a almacenamiento temporal o en streaming.
- La validacion local de archivos reduce riesgos comunes, pero no sustituye antivirus/sandbox si se recibiran archivos de terceros. Excel sigue siendo un ZIP: un archivo comprimido malicioso puede expandirse mucho al procesarse, por lo que conviene establecer tambien limites de filas y analizar documentos no confiables fuera del proceso web antes de abrir el sistema a terceros.
- Los permisos son por rol. Si cada cliente o empleado debe ver solo sus propios registros, se requerira autorizacion por recurso (propietario/tenant), no solo roles globales.
- La proteccion CSRF depende hoy de `SameSite=Strict` en produccion. Si frontend y API se separan en sitios distintos, hay que disenar tokens CSRF antes de cambiar esa arquitectura.
- El seed contiene cuentas de desarrollo conocidas y debe tratarse como exclusivo de desarrollo.
