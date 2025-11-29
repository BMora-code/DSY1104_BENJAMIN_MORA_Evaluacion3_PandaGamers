# Documentación OpenAPI / Swagger

Se añadió documentación OpenAPI mediante `swagger-jsdoc` y `swagger-ui-express`.

- URL UI: `http://localhost:4000/api-docs`
- Esquema JSON: `http://localhost:4000/api-docs.json`

Pasos para usar localmente:
```bash
cd backend
npm install
# Asegúrate de crear backend/.env con MONGO_URI y JWT_SECRET
npm run dev
# Abrir http://localhost:4000/api-docs
```

Notas:
- El generador usa `./src/routes/*.js` y `./src/controllers/*.js` para extraer comentarios JSDoc `@openapi` si existen.
- Para enriquecer la documentación, añade comentarios `@openapi` en controladores o crea un archivo `openapi.yml`.
