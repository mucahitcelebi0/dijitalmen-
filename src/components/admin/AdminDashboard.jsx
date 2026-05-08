import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import {
  subscribeCategories,
  subscribeMenuItems,
  deleteMenuItem,
  deleteImageByPath,
  seedFromStaticData,
} from '../../services/menuService';
import { categories as staticCategories, menuItems as staticItems } from '../../data';
import ProductForm from './ProductForm';
import CategoryManager from './CategoryManager';
import './Admin.css';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showCats, setShowCats] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const unsubC = subscribeCategories(setCategories);
    const unsubI = subscribeMenuItems(setItems);
    return () => {
      unsubC();
      unsubI();
    };
  }, []);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (filter !== 'all' && it.categoryId !== filter) return false;
      if (search.trim()) {
        const s = search.trim().toLowerCase();
        if (!it.name?.toLowerCase().includes(s) && !it.description?.toLowerCase().includes(s)) {
          return false;
        }
      }
      return true;
    });
  }, [items, filter, search]);

  const categoryName = (id) =>
    categories.find((c) => c.id === id)?.name || '—';

  const handleDelete = async (item) => {
    if (!window.confirm(`"${item.name}" ürününü silmek istediğinize emin misiniz?`)) return;
    try {
      await deleteMenuItem(item.id);
      if (item.imagePath) {
        await deleteImageByPath(item.imagePath);
      }
      setMsg({ type: 'ok', text: 'Ürün silindi.' });
    } catch (e) {
      setMsg({ type: 'err', text: 'Silme başarısız: ' + e.message });
    }
  };

  const handleSeed = async () => {
    if (!window.confirm(
      'Mevcut menü (data.js dosyasındaki tüm ürünler) Firestore veritabanına yüklenecek. ' +
      'Bu işlem yalnızca veritabanı boşken yapılabilir. Devam edilsin mi?'
    )) return;
    setSeeding(true);
    setMsg(null);
    try {
      await seedFromStaticData(staticCategories, staticItems);
      setMsg({ type: 'ok', text: 'Mevcut menü başarıyla veritabanına aktarıldı!' });
    } catch (e) {
      setMsg({ type: 'err', text: e.message });
    } finally {
      setSeeding(false);
    }
  };

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setShowForm(true);
  };

  const closeForm = (saved) => {
    setShowForm(false);
    setEditing(null);
    if (saved) {
      setMsg({ type: 'ok', text: 'Kaydedildi.' });
    }
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div>
          <h1>Sushinova Yönetim Paneli</h1>
          <span className="admin-user">{user?.email}</span>
        </div>
        <div className="admin-topbar-actions">
          <Link to="/" className="admin-btn ghost">Siteyi görüntüle</Link>
          <button className="admin-btn ghost" onClick={() => logout()}>Çıkış</button>
        </div>
      </header>

      {msg && (
        <div className={`admin-banner ${msg.type === 'ok' ? 'ok' : 'err'}`}>
          {msg.text}
          <button onClick={() => setMsg(null)} aria-label="Kapat">×</button>
        </div>
      )}

      {items.length === 0 && !seeding && (
        <div className="admin-empty-card">
          <h2>Veritabanı boş</h2>
          <p>
            Henüz veritabanında ürün yok. Mevcut menüyü tek tıkla yüklemek için aşağıdaki butona tıklayın.
            Bu işlemi yalnızca bir kez yapmanız yeterli.
          </p>
          <button className="admin-btn primary" onClick={handleSeed}>
            Mevcut menüyü veritabanına yükle
          </button>
          <p className="admin-hint">
            Veya boş bir menüyle başlamak için aşağıdan "Yeni Ürün Ekle" butonunu kullanabilirsiniz.
          </p>
        </div>
      )}

      <section className="admin-controls">
        <div className="admin-controls-left">
          <button className="admin-btn primary" onClick={openNew}>
            + Yeni Ürün Ekle
          </button>
          <button className="admin-btn ghost" onClick={() => setShowCats(true)}>
            Kategorileri Yönet
          </button>
        </div>

        <div className="admin-controls-right">
          <input
            type="text"
            placeholder="Ürün ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="admin-filter"
          >
            <option value="all">Tüm Kategoriler ({items.length})</option>
            {categories.map((c) => {
              const count = items.filter((i) => i.categoryId === c.id).length;
              return (
                <option key={c.id} value={c.id}>
                  {c.name} ({count})
                </option>
              );
            })}
          </select>
        </div>
      </section>

      <section className="admin-product-grid">
        {filtered.length === 0 ? (
          <div className="admin-empty-state">
            <p>Bu kriterlere uygun ürün yok.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <article key={item.id} className="admin-product-card">
              <div className="admin-product-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} loading="lazy" />
                ) : (
                  <div className="admin-no-image">Görsel yok</div>
                )}
              </div>
              <div className="admin-product-body">
                <span className="admin-product-cat">{categoryName(item.categoryId)}</span>
                <h3>{item.name}</h3>
                {item.description && <p>{item.description}</p>}
                <div className="admin-product-footer">
                  <span className="admin-product-price">
                    {Number(item.price).toFixed(2)} ₺
                  </span>
                  <div className="admin-product-actions">
                    <button className="admin-btn small" onClick={() => openEdit(item)}>
                      Düzenle
                    </button>
                    <button
                      className="admin-btn small danger"
                      onClick={() => handleDelete(item)}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {showForm && (
        <ProductForm
          item={editing}
          categories={categories}
          onClose={closeForm}
        />
      )}

      {showCats && (
        <CategoryManager
          categories={categories}
          items={items}
          onClose={() => setShowCats(false)}
        />
      )}
    </div>
  );
}
