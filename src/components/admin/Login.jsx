import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import './Admin.css';

export default function Login() {
  const { login, user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (loading) {
    return <div className="admin-loading"><p>Yükleniyor...</p></div>;
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate('/admin', { replace: true });
    } catch {
      setErr('Giriş başarısız. Email veya şifre hatalı.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-auth-screen">
      <form className="admin-auth-card" onSubmit={handleSubmit}>
        <h1>Sushinova Yönetim</h1>
        <p className="admin-auth-sub">Restoran sahibi girişi</p>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label>
          Şifre
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {err && <div className="admin-error">{err}</div>}

        <button className="admin-btn primary" type="submit" disabled={busy}>
          {busy ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>

        <Link to="/" className="admin-back-link">← Siteye geri dön</Link>
      </form>
    </div>
  );
}
