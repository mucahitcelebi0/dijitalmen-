import { useEffect, useState } from 'react';
import {
  addMenuItem,
  updateMenuItem,
  uploadProductImage,
  deleteImageByPath,
} from '../../services/menuService';

const blank = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
  image: '',
  imagePath: '',
};

export default function ProductForm({ item, categories, onClose }) {
  const [form, setForm] = useState(blank);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        description: item.description || '',
        price: item.price ?? '',
        categoryId: item.categoryId || '',
        image: item.image || '',
        imagePath: item.imagePath || '',
      });
      setPreview(item.image || '');
    } else {
      setForm({
        ...blank,
        categoryId: categories[0]?.id || '',
      });
      setPreview('');
    }
    setFile(null);
    setErr('');
  }, [item, categories]);

  const change = (k) => (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    if (k === 'image') setPreview(v);
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setErr('Lütfen bir görsel dosyası seçin.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErr('Görsel 5 MB\'dan büyük olamaz.');
      return;
    }
    setErr('');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    if (!form.name.trim()) return setErr('Ürün adı boş olamaz.');
    if (!form.categoryId) return setErr('Kategori seçin.');
    if (form.price === '' || isNaN(Number(form.price))) return setErr('Geçerli bir fiyat girin.');

    setBusy(true);
    try {
      let imageUrl = form.image;
      let imagePath = form.imagePath;

      if (file) {
        const uploaded = await uploadProductImage(file);
        imageUrl = uploaded.url;
        const oldPath = form.imagePath;
        imagePath = uploaded.path;
        if (oldPath && oldPath !== imagePath) {
          await deleteImageByPath(oldPath);
        }
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        categoryId: form.categoryId,
        image: imageUrl || '',
        imagePath: imagePath || '',
      };

      if (item) {
        await updateMenuItem(item.id, payload);
      } else {
        await addMenuItem(payload);
      }
      onClose(true);
    } catch (e) {
      setErr('Kayıt başarısız: ' + e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={() => !busy && onClose(false)}>
      <form
        className="admin-modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <header className="admin-modal-head">
          <h2>{item ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={() => onClose(false)}
            disabled={busy}
            aria-label="Kapat"
          >
            ×
          </button>
        </header>

        <div className="admin-modal-body">
          <div className="admin-form-grid">
            <label className="admin-field">
              Ürün Adı *
              <input
                type="text"
                value={form.name}
                onChange={change('name')}
                required
                placeholder="ör. Karides cipsi"
              />
            </label>

            <label className="admin-field">
              Kategori *
              <select value={form.categoryId} onChange={change('categoryId')} required>
                <option value="">Seçin...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>

            <label className="admin-field">
              Fiyat (₺) *
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={change('price')}
                required
                placeholder="ör. 160"
              />
            </label>

            <label className="admin-field admin-field-wide">
              Açıklama / İçerik
              <textarea
                rows="3"
                value={form.description}
                onChange={change('description')}
                placeholder="ör. Tatlı ekşi sos ile servis edilir."
              />
            </label>

            <div className="admin-field admin-field-wide">
              <label>Görsel</label>
              <div className="admin-image-row">
                <div className="admin-image-preview">
                  {preview ? (
                    <img src={preview} alt="önizleme" />
                  ) : (
                    <span>Görsel önizlemesi</span>
                  )}
                </div>
                <div className="admin-image-controls">
                  <label className="admin-btn ghost as-label">
                    Bilgisayardan yükle
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      hidden
                    />
                  </label>
                  <span className="admin-or">veya</span>
                  <input
                    type="url"
                    placeholder="Görsel URL'si yapıştır"
                    value={file ? '' : form.image}
                    onChange={change('image')}
                    disabled={!!file}
                  />
                  {file && (
                    <button
                      type="button"
                      className="admin-btn small ghost"
                      onClick={() => {
                        setFile(null);
                        setPreview(form.image || '');
                      }}
                    >
                      Dosyayı kaldır
                    </button>
                  )}
                </div>
              </div>
              <small className="admin-hint">
                Bilgisayardan yüklediğiniz görsel Firebase Storage'a kaydedilir.
                Maksimum 5 MB. JPG / PNG / WebP önerilir.
              </small>
            </div>
          </div>

          {err && <div className="admin-error">{err}</div>}
        </div>

        <footer className="admin-modal-foot">
          <button
            type="button"
            className="admin-btn ghost"
            onClick={() => onClose(false)}
            disabled={busy}
          >
            İptal
          </button>
          <button type="submit" className="admin-btn primary" disabled={busy}>
            {busy ? 'Kaydediliyor...' : item ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'}
          </button>
        </footer>
      </form>
    </div>
  );
}
