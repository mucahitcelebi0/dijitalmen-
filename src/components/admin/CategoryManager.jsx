import { useState } from 'react';
import {
  addCategory,
  updateCategory,
  deleteCategory,
} from '../../services/menuService';

export default function CategoryManager({ categories, items, onClose }) {
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState({});
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const itemCount = (catId) => items.filter((i) => i.categoryId === catId).length;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setBusy(true);
    setErr('');
    try {
      const order = categories.length;
      await addCategory({ name: newName.trim(), order });
      setNewName('');
    } catch (e) {
      setErr('Kategori eklenemedi: ' + e.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSaveEdit = async (id) => {
    const name = (editing[id] || '').trim();
    if (!name) return;
    setBusy(true);
    try {
      await updateCategory(id, { name });
      setEditing((s) => {
        const n = { ...s };
        delete n[id];
        return n;
      });
    } catch (e) {
      setErr('Kategori güncellenemedi: ' + e.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (cat) => {
    const count = itemCount(cat.id);
    if (count > 0) {
      alert(
        `"${cat.name}" kategorisinde ${count} ürün var. Önce ürünleri başka bir kategoriye taşıyın veya silin.`
      );
      return;
    }
    if (!window.confirm(`"${cat.name}" kategorisini silmek istediğinize emin misiniz?`)) return;
    setBusy(true);
    try {
      await deleteCategory(cat.id);
    } catch (e) {
      setErr('Kategori silinemedi: ' + e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={() => !busy && onClose()}>
      <div
        className="admin-modal admin-modal-narrow"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="admin-modal-head">
          <h2>Kategorileri Yönet</h2>
          <button
            className="admin-modal-close"
            onClick={onClose}
            disabled={busy}
            aria-label="Kapat"
          >
            ×
          </button>
        </header>

        <div className="admin-modal-body">
          <form onSubmit={handleAdd} className="admin-cat-add">
            <input
              type="text"
              placeholder="Yeni kategori adı"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button type="submit" className="admin-btn primary" disabled={busy || !newName.trim()}>
              Ekle
            </button>
          </form>

          {err && <div className="admin-error">{err}</div>}

          <ul className="admin-cat-list">
            {categories.map((c) => {
              const isEditing = editing[c.id] !== undefined;
              return (
                <li key={c.id} className="admin-cat-row">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={editing[c.id]}
                        onChange={(e) =>
                          setEditing((s) => ({ ...s, [c.id]: e.target.value }))
                        }
                      />
                      <button
                        className="admin-btn small primary"
                        onClick={() => handleSaveEdit(c.id)}
                        disabled={busy}
                      >
                        Kaydet
                      </button>
                      <button
                        className="admin-btn small ghost"
                        onClick={() =>
                          setEditing((s) => {
                            const n = { ...s };
                            delete n[c.id];
                            return n;
                          })
                        }
                      >
                        İptal
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="admin-cat-name">
                        {c.name}
                        <small> ({itemCount(c.id)} ürün)</small>
                      </span>
                      <button
                        className="admin-btn small"
                        onClick={() =>
                          setEditing((s) => ({ ...s, [c.id]: c.name }))
                        }
                      >
                        Düzenle
                      </button>
                      <button
                        className="admin-btn small danger"
                        onClick={() => handleDelete(c)}
                        disabled={busy}
                      >
                        Sil
                      </button>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <footer className="admin-modal-foot">
          <button className="admin-btn ghost" onClick={onClose} disabled={busy}>
            Kapat
          </button>
        </footer>
      </div>
    </div>
  );
}
