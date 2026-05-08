import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const CATEGORIES_COL = 'categories';
const ITEMS_COL = 'menuItems';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export function subscribeCategories(callback) {
  const q = query(collection(db, CATEGORIES_COL), orderBy('order', 'asc'));
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(list);
  });
}

export function subscribeMenuItems(callback) {
  const q = query(collection(db, ITEMS_COL), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(list);
  });
}

export async function addMenuItem(data) {
  return addDoc(collection(db, ITEMS_COL), {
    ...data,
    price: Number(data.price) || 0,
    createdAt: serverTimestamp(),
  });
}

export async function updateMenuItem(id, data) {
  const ref = doc(db, ITEMS_COL, id);
  const payload = { ...data };
  if (payload.price !== undefined) payload.price = Number(payload.price) || 0;
  await updateDoc(ref, payload);
}

export async function deleteMenuItem(id) {
  await deleteDoc(doc(db, ITEMS_COL, id));
}

export async function addCategory(data) {
  return addDoc(collection(db, CATEGORIES_COL), data);
}

export async function updateCategory(id, data) {
  await updateDoc(doc(db, CATEGORIES_COL, id), data);
}

export async function deleteCategory(id) {
  await deleteDoc(doc(db, CATEGORIES_COL, id));
}

export async function uploadProductImage(file) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary yapılandırılmamış. VITE_CLOUDINARY_CLOUD_NAME ve VITE_CLOUDINARY_UPLOAD_PRESET environment variable\'ları gerekli.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'sushinova');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    let detail = '';
    try {
      const err = await res.json();
      detail = err?.error?.message || '';
    } catch {
      // ignore
    }
    throw new Error(`Görsel yüklenemedi (${res.status}). ${detail}`);
  }

  const data = await res.json();
  return { url: data.secure_url, path: data.public_id };
}

// Cloudinary'de güvenli silme imzalı istek gerektirir (API secret tarayıcıda
// kullanılmamalı). Eski görseller Cloudinary panelinden manuel temizlenebilir.
// Bu fonksiyon ürün silindiğinde sessizce no-op olur.
export async function deleteImageByPath() {
  return;
}

export async function seedFromStaticData(categories, menuItems) {
  const existing = await getDocs(collection(db, ITEMS_COL));
  if (!existing.empty) {
    throw new Error('Menü zaten yüklenmiş. Önce mevcut ürünleri silin veya bu adımı atlayın.');
  }

  const batchCats = writeBatch(db);
  categories.forEach((cat, i) => {
    const ref = doc(db, CATEGORIES_COL, cat.id);
    batchCats.set(ref, { name: cat.name, order: i });
  });
  await batchCats.commit();

  const chunks = [];
  for (let i = 0; i < menuItems.length; i += 400) {
    chunks.push(menuItems.slice(i, i + 400));
  }

  let order = 0;
  for (const chunk of chunks) {
    const batch = writeBatch(db);
    chunk.forEach((item) => {
      const ref = doc(collection(db, ITEMS_COL));
      batch.set(ref, {
        categoryId: item.categoryId,
        name: item.name,
        description: item.description || '',
        price: Number(item.price) || 0,
        image: item.image || '',
        imagePath: '',
        createdAt: new Date(Date.now() + order),
      });
      order += 1;
    });
    await batch.commit();
  }
}
