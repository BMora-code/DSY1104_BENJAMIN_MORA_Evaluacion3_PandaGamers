#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const FRONT_DATA_PATH = path.join(process.cwd(), '..', 'frontend', 'src', 'data', 'dataStore.js');

function extractProductsArray(text) {
  const marker = /this\.products\s*=\s*\[/m;
  const m = text.match(marker);
  if (!m) return null;
  const start = text.indexOf('[', m.index);
  let pos = start;
  let depth = 0;
  for (; pos < text.length; pos++) {
    const ch = text[pos];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        return text.slice(start, pos + 1);
      }
    }
  }
  return null;
}

function parseObjectsFromArrayText(arrText) {
  const objs = [];
  let i = 0;
  while (i < arrText.length) {
    const ch = arrText[i];
    if (ch === '{') {
      let depth = 0;
      let j = i;
      for (; j < arrText.length; j++) {
        if (arrText[j] === '{') depth++;
        else if (arrText[j] === '}') {
          depth--;
          if (depth === 0) break;
        }
      }
      const objText = arrText.slice(i, j + 1);
      objs.push(objText);
      i = j + 1;
    } else {
      i++;
    }
  }
  return objs;
}

function extractNameAndImage(objText) {
  const nameMatch = objText.match(/name\s*:\s*'([^']*)'/);
  const imageMatch = objText.match(/image\s*:\s*'([^']*)'/);
  // Capturar números enteros o con decimales, y también posibles miles con puntos
  const priceMatch = objText.match(/price\s*:\s*([0-9\.,]+)/);
  let price = 0;
  if (priceMatch && priceMatch[1]) {
    // Normalizar: eliminar puntos como separador de miles y cambiar comas por punto
    const cleaned = priceMatch[1].replace(/\./g, '').replace(/,/g, '.');
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed)) {
      price = parsed;
    }
  }

  return {
    name: nameMatch ? nameMatch[1].trim() : null,
    image: imageMatch ? imageMatch[1].trim() : null,
    price: price || 0
  };
}

async function main() {
  console.log('Seed: leyendo', FRONT_DATA_PATH);
  if (!fs.existsSync(FRONT_DATA_PATH)) {
    console.error('No se encontró', FRONT_DATA_PATH);
    process.exit(1);
  }

  const txt = fs.readFileSync(FRONT_DATA_PATH, 'utf8');
  const arrText = extractProductsArray(txt);
  if (!arrText) {
    console.error('No se pudo extraer products array desde dataStore.js');
    process.exit(1);
  }

  const objTexts = parseObjectsFromArrayText(arrText);
  const entries = objTexts.map(extractNameAndImage).filter(e => e.name && e.image);
  console.log('Encontrados', entries.length, 'productos con imagen en dataStore');

  // conectar a MongoDB
  await mongoose.connect(process.env.MONGO_URI);
  const Product = (await import('../src/models/product.model.js')).default;

  let updated = 0;
  let created = 0;
  for (const e of entries) {
    try {
      const nameRegex = new RegExp('^' + e.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
      const existing = await Product.findOne({ nombre: nameRegex });
      if (existing) {
        existing.imagen = e.image;
        if (e.price && (!existing.precio || existing.precio === 0)) existing.precio = e.price;
        await existing.save();
        updated++;
      } else {
        const p = new Product({
          nombre: e.name,
          descripcion: e.name,
          precio: e.price || 0,
          stock: 0,
          categoria: '',
          imagen: e.image
        });
        await p.save();
        created++;
      }
    } catch (err) {
      console.error('Error actualizando/creando producto', e.name, err.message || err);
    }
  }

  console.log(`Seed completo. updated=${updated}, created=${created}`);
  await mongoose.disconnect();
}

main().catch(e => {
  console.error('Seed error', e);
  process.exit(1);
});
