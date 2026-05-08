# Sushinova Admin Paneli — Kurulum Rehberi

Bu rehberde **Firebase**, **Cloudinary** ve **Vercel** üzerinde admin panelini çalışır hale getirmek için yapmanız gereken her şey adım adım anlatılmıştır.

> **Tahmini süre:** 25-30 dakika
> **Gereksinim:** Bir Google hesabı (Firebase için), Vercel hesabınız (zaten var), bir email (Cloudinary için)
> **Maliyet:** Tamamen ücretsiz, kredi kartı gerekmez.

---

## 1. Firebase projesi oluştur

1. https://console.firebase.google.com adresine gidin (Google hesabınızla giriş yapın).
2. **"Add project" / "Proje ekle"** butonuna tıklayın.
3. Proje adı: `sushinova` (veya istediğiniz bir ad).
4. Google Analytics: **Devre dışı bırakabilirsiniz** (gerek yok), "Create project" deyin.
5. Proje hazırlanınca devam edin.

## 2. Web uygulamasını ekle

1. Sol menüde **Project Overview** sayfasında **"+ Add app"** butonuna tıklayın.
2. Platform seçenekleri çıkacak — **Web `</>`** ikonunu seçin.
3. App nickname: `sushinova-web`
4. **"Also set up Firebase Hosting"** kutusunu **işaretlemeyin** (Vercel kullanıyoruz).
5. "Register app" deyin.
6. Karşınıza çıkan **`firebaseConfig`** nesnesini görüyor musunuz? Şuna benzer:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "sushinova.firebaseapp.com",
     projectId: "sushinova",
     storageBucket: "sushinova.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abc123"
   };
   ```
   Bu değerleri **bir kenara not edin** — birazdan Vercel'e gireceğiz. Continue / Next deyip kapatabilirsiniz.

## 3. Authentication (giriş sistemi) ayarla

1. Sol menüde **Build → Authentication** → **Get started**.
2. **Sign-in method** sekmesi → **Email/Password** → "Enable" → Save.
3. **Users** sekmesi → **"Add user"** butonu:
   - Email: `admin@sushinova.com.tr` (veya kendi email'iniz)
   - Şifre: güçlü bir şifre belirleyin (en az 8 karakter)
   - "Add user" deyin.

> Bu, panele giriş yapacağınız hesabınız. **Şifrenizi güvenli bir yere kaydedin.**

## 4. Firestore (veritabanı) oluştur

1. Sol menüde **Build → Firestore Database** → **Create database**.
2. **Adım 1 (Select edition):** **Standard edition** seçili kalsın → Next.
3. **Adım 2 (Database ID & location):** Database ID'yi `(default)` bırakın, Location: `eur3 (europe-west)` veya size en yakın bölge → Next.
4. **Adım 3 (Configure):** **Production mode** → Create / Enable.
5. Veritabanı oluşunca **"Rules" sekmesine** geçin ve aşağıdaki kuralı yapıştırın:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
   **"Publish"** deyin.

   Bu kural: herkes menüyü okuyabilir (siteden), ama sadece giriş yapmış admin yazabilir.

## 5. Cloudinary hesabı oluştur (görseller için)

Firebase Storage artık Spark planında ücretsiz değil, bu yüzden görsel depolaması için **Cloudinary** kullanıyoruz. Tamamen ücretsiz, kredi kartı gerektirmez.

1. https://cloudinary.com/users/register/free adresine gidin.
2. Email + şifreyle hesap açın (ya da Google ile devam edin).
3. Giriş yaptıktan sonra **Dashboard**'a düşersiniz. Sayfanın üst kısmında şu bilgi var:
   ```
   Cloud Name: dxxx12345
   API Key: ...
   API Secret: ...
   ```
   **`Cloud Name`** değerini bir kenara not edin. (API key / secret bize gerekmiyor — daha güvenli.)

### 5.1. Upload Preset oluştur (görsel yükleme izni)

1. Sol menüde **Settings (dişli ikonu)** → **Upload** sekmesi.
2. Sayfayı aşağı kaydırın → **"Upload presets"** bölümü → **"Add upload preset"** linki.
3. Şu ayarları yapın:
   - **Preset name:** `sushinova_unsigned` (bu ismi aynen yazın)
   - **Signing Mode:** **Unsigned** seçin (önemli — bu sayede tarayıcıdan direkt yükleme yapılabilir)
   - **Folder:** `sushinova` (opsiyonel, dosyaları düzenli tutmak için)
4. Aşağıdaki **"Save"** butonuna basın.

> Tamamlandığında preset listesinde `sushinova_unsigned (Unsigned)` görünmeli.

## 6. Yerel geliştirme için `.env.local` oluşturun (opsiyonel)

Bilgisayarınızda `npm run dev` ile siteyi test etmek isterseniz, projenin kök dizinine `.env.local` adında bir dosya oluşturup şunları yazın (kendi değerlerinizle):

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=sushinova.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sushinova
VITE_FIREBASE_STORAGE_BUCKET=sushinova.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abc123
VITE_ADMIN_EMAIL=admin@sushinova.com.tr
VITE_CLOUDINARY_CLOUD_NAME=dxxx12345
VITE_CLOUDINARY_UPLOAD_PRESET=sushinova_unsigned
```

> Bu dosya `.gitignore`'da, GitHub'a yüklenmeyecek. Güvenli.

## 7. Vercel'e environment variable'ları ekle

1. https://vercel.com/dashboard → sushinova projeniz.
2. **Settings → Environment Variables**.
3. Aşağıdaki **9 değişkeni** tek tek ekleyin (Name + Value).  Her biri için "Production", "Preview", "Development" üçünü de **işaretleyin**:

| Name | Value (örnek) |
|---|---|
| `VITE_FIREBASE_API_KEY` | AIzaSy... |
| `VITE_FIREBASE_AUTH_DOMAIN` | sushinova.firebaseapp.com |
| `VITE_FIREBASE_PROJECT_ID` | sushinova |
| `VITE_FIREBASE_STORAGE_BUCKET` | sushinova.appspot.com |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 1234567890 |
| `VITE_FIREBASE_APP_ID` | 1:1234567890:web:abc123 |
| `VITE_ADMIN_EMAIL` | admin@sushinova.com.tr |
| `VITE_CLOUDINARY_CLOUD_NAME` | dxxx12345 |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | sushinova_unsigned |

> `VITE_ADMIN_EMAIL`: Sadece bu email'le giriş yapan kişi admin yetkisine sahip olacak. **Adım 3'te oluşturduğunuz email ile aynı olmalı.**

4. Save.

## 8. Firebase Authentication'a Vercel domainini ekle

1. Firebase Console → **Authentication** → **Settings** sekmesi → **Authorized domains**.
2. **"Add domain"** ile şunları ekleyin:
   - `sushinova.com.tr`
   - `www.sushinova.com.tr`
   - Vercel'in size verdiği `*.vercel.app` adresi (örn. `sushinova.vercel.app`)

> `localhost` zaten ekli olur — yerel testte sorun yaşamazsınız.

## 9. Yeni kodu deploy edin

```bash
git add .
git commit -m "Add admin panel with Firebase + Cloudinary"
git push
```

Vercel otomatik olarak deploy yapacak (1-2 dakika).

## 10. İlk girişi yapın ve menüyü yükleyin

1. Tarayıcıda: **`https://sushinova.com.tr/admin/login`**
2. Adım 3'te oluşturduğunuz email + şifreyle giriş yapın.
3. Admin paneli açılacak. Veritabanı boş olduğu için **"Mevcut menüyü veritabanına yükle"** butonu görünür.
4. Tıklayın — `data.js` dosyasındaki tüm kategoriler ve ürünler Firestore'a aktarılır.
5. Tamam! Artık menüde değişiklik yapabilirsiniz.

---

## Kullanım

### Admin paneline giriş
- URL: `https://sushinova.com.tr/admin/login`
- Email + şifre ile giriş yapın.

### Yeni ürün ekleme
1. **"+ Yeni Ürün Ekle"** butonu.
2. Ad, kategori, fiyat zorunlu. Açıklama opsiyonel.
3. Görsel: bilgisayardan dosya yükleyebilir veya URL yapıştırabilirsiniz. Yüklediğiniz dosyalar Cloudinary'ye gider.
4. **"Ürünü Ekle"** — anında siteye yansır.

### Ürün düzenleme / silme
- Her ürün kartında **Düzenle** ve **Sil** butonları var.

### Kategori yönetimi
- **"Kategorileri Yönet"** butonundan kategori ekleyebilir, adını değiştirebilir, silebilirsiniz.
- İçinde ürün olan kategori silinemez.

### Çıkış
- Sağ üstte **"Çıkış"** butonu.

---

## Sorun giderme

**"Permission denied" hatası alıyorum:**
- Firestore Rules adımını (4) yaptınız mı? Kuralları "Publish" demeyi unutmadınız mı?

**Giriş yapamıyorum:**
- Email/şifre doğru mu? Firebase Console → Authentication → Users sayfasından şifre sıfırlayabilirsiniz.
- Vercel'deki `VITE_ADMIN_EMAIL` ile giriş yaptığınız email birebir aynı mı?

**Görseller yüklenmiyor:**
- Cloudinary'de upload preset'i **Unsigned** modda mı? (Settings → Upload → Upload presets)
- Preset adı tam olarak Vercel env variable'ı ile aynı mı? (`sushinova_unsigned`)
- `VITE_CLOUDINARY_CLOUD_NAME` doğru mu?
- Görsel 10 MB'dan küçük mü?

**Ana sayfada menü görünmüyor:**
- Vercel environment variable'larından sonra **yeniden deploy** ettiniz mi? (Vercel → Deployments → en son deploy → "..." menüsü → "Redeploy")

---

## Maliyetler

- **Firebase Spark plan (ücretsiz):**
  - Firestore: 50K okuma / 20K yazma / gün
  - Authentication: sınırsız
- **Cloudinary Free plan (ücretsiz):**
  - 25 GB depolama
  - 25 GB / ay bandwidth
  - Sushinova için fazlasıyla yeterli (yıllarca bitmez)
- **Vercel Hobby plan (ücretsiz):** zaten yeterli

Hiçbir hizmette kredi kartı bilgisi vermenize gerek yok.

---

## Cloudinary'de görsel temizliği (opsiyonel)

Bir ürünü silseniz bile görsel Cloudinary'de kalır. 25 GB sınırı çok büyük olduğu için bu pratikte sorun değil, ama temizlemek isterseniz:

1. Cloudinary Dashboard → **Media Library**.
2. `sushinova` klasörü altında ürün görselleri.
3. Kullanılmayanları seçip silebilirsiniz.
