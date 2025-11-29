import fs from 'fs';
import path from 'path';
import swaggerSpec from '../src/swagger.js';

const out = path.resolve(process.cwd(), 'api-docs.generated.json');
try {
  fs.writeFileSync(out, JSON.stringify(swaggerSpec, null, 2), 'utf8');
  console.log('Swagger JSON generado en:', out);
} catch (err) {
  console.error('Error escribiendo swagger JSON:', err);
  process.exit(1);
}
