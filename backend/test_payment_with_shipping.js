import jwt from 'jsonwebtoken';

// Node >=18 incluye `fetch` global; el proyecto usa "type": "module"
const fetchGlobal = typeof fetch !== 'undefined' ? fetch : null;

 (async () => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'superclave123';
    // payload minimal
    const payload = { id: '000000000000000000000001', email: 'testuser@example.com', nombre: 'Usuario Prueba' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    const baseUrl = process.env.BASE_URL || 'http://localhost:4000';

    const body = {
      total: 15000,
      items: [
        { id: null, nombre: 'Prueba Producto Seed', cantidad: 1, precio: 15000 }
      ],
      shippingInfo: { deliveryOption: 'express', firstName: 'Test', lastName: 'User' }
      // note: intentionally NOT including shippingCost to test fallback
    };

    console.log('Usando token (resumen):', token.slice(0,20) + '...');

    const res = await (fetchGlobal || fetch)(baseUrl + '/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify(body)
    });

    const j = await res.json();
    console.log('\nPOST /api/payment -> status', res.status);
    console.log(JSON.stringify(j, null, 2));

    // esperar un segundo y consultar GET /api/payment
    await new Promise(r => setTimeout(r, 1000));
    const res2 = await (fetchGlobal || fetch)(baseUrl + '/api/payment', { headers: { Authorization: 'Bearer ' + token } });
    const list = await res2.json();
    console.log('\nGET /api/payment -> status', res2.status);
    console.log(JSON.stringify(list.slice(0,3), null, 2));
  } catch (err) {
    console.error('Error en test:', err);
    process.exit(1);
  }
})();
