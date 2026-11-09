# Gestion de reservas Agencia de viajes

Jonathan David Lozano Calderón

Alexis Rodriguez Betancur  

Juan Sebastian Garcia Gonzalez 

Luis Stevan Quijano Perilla 

Jimmy Andrés Peralta Gordillo

## Deploy
- **Sitio web (público):** https://sebastiangarcia333.github.io/Proyecto_Gestion_de_reservas/
- **Panel Administrador (CRUD):** https://sebastiangarcia333.github.io/Proyecto_Gestion_de_reservas/HTML/CRUD.html

## Destinos del administrador

- Las cinco cards escritas en `HTML/servicios.html` permanecen fijas.
- Los destinos nuevos se guardan desde `JS/crud.js` en la clave `pasionViajera.destinos` de `localStorage`.
- `JS/catalogo.js` lee esa misma clave y añade sus cards, sin duplicar las originales. También refleja las ediciones y eliminaciones.
- Las imágenes son opcionales: JPG, PNG o WebP de hasta 500 KB. Se guardan como texto con `FileReader` para conservarlas al recargar.
- Usa un servidor local o GitHub Pages y abre ambas vistas en el mismo navegador y origen. Los datos pertenecen a ese navegador; no se comparten entre dispositivos ni entre el sitio local y el publicado.
