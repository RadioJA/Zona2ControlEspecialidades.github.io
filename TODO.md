# TODO: Implementar selección de modelos de certificados

## Pasos a completar:

1. **Agregar nueva pestaña "Modelo" en el menú de configuración**
   - Agregar la pestaña en el nav-tabs de certificados.html
   - Crear el tab-pane correspondiente

2. **Agregar dropdown de selección de plantilla en la pestaña Modelo**
   - Crear select con opciones: Diploma, Certificado, Reconocimiento
   - Mapear a los archivos: Diploma.png, certificado.png, Reconocimiento.png

3. **Actualizar globalConfig para incluir la plantilla seleccionada**
   - Agregar propiedad certificateTemplate en globalConfig
   - Guardar y cargar la selección

4. **Actualizar CSS para usar propiedad personalizada**
   - Definir --certificate-bg en :root
   - Cambiar background-image a usar var(--certificate-bg)

5. **Actualizar JavaScript para aplicar la plantilla seleccionada**
   - Función para actualizar la propiedad CSS basada en la selección
   - Aplicar al cargar y al cambiar selección

6. **Actualizar CSS de impresión**
   - Cambiar !important en @media print para usar var(--certificate-bg)

7. **Actualizar función downloadCertificate**
   - Usar la plantilla seleccionada en lugar de hardcodear Diploma.png

8. **Actualizar historial.html de manera similar**
   - Aplicar los mismos cambios para consistencia

9. **Probar la funcionalidad**
   - Verificar que se pueda cambiar entre plantillas
   - Verificar impresión y descarga con diferentes plantillas
