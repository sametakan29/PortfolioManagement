# RSS Feed ile Otomatik Haber Çekme

## Özellikler

✅ **Otomatik Haber Çekme**
- RSS feed kaynaklarından her 30 dakikada bir otomatik haber çeker
- Türkiye'deki önde gelen finans haber sitelerinden haberler

✅ **Duplicate Kontrolü**
- Aynı başlık ve kaynaktan haber tekrar eklenmez
- Veritabanında temiz ve düzenli veri

✅ **Kategorilere Göre Sınıflandırma**
- Her feed kaynağı için kategori tanımlı
- Genel Ekonomi, Hisse Senedi, Döviz, Tahvil, vb.

✅ **Zamanlanmış Görevler**
- Spring @Scheduled ile otomatik çalışma
- İlk başlatmadan 1 dakika sonra başlar
- Sonraki çalışmalar 30 dakika aralıklarla

## Yapılandırma

### application.yml

```yaml
news:
  rss:
    enabled: true  # RSS çekmeyi aktif/pasif yapma
    fetch-interval-minutes: 30  # Çekme aralığı (dakika)
    sources:
      - name: "Bloomberg HT"
        url: "https://www.bloomberght.com/rss"
        category: GENERAL_ECONOMY
        enabled: true
```

### Haber Kaynakları

**Aktif Kaynaklar:**
1. **Bloomberg HT** - Genel Ekonomi
2. **Dünya Gazetesi** - Genel Ekonomi
3. **Hürriyet Ekonomi** - Genel Ekonomi
4. **Investing.com** - Hisse Senedi
5. **Para Analiz** - Döviz
6. **Mynet Finans** - Hisse Senedi

## API Endpoints

### Manuel Feed Çekme (Admin)

```bash
POST /api/news/fetch-rss
Authorization: Bearer <admin-token>
```

Otomatik çalışmayı beklemeden manuel olarak RSS feed'leri çeker.

### Örnek Kullanım

```bash
# Manuel feed çekme
curl -X POST http://localhost:8081/api/news/fetch-rss \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Teknik Detaylar

### Kullanılan Teknolojiler
- **Rome RSS Parser** - RSS/Atom feed parsing
- **Spring Scheduling** - Zamanlanmış görevler
- **JPA Repository** - Veritabanı işlemleri

### Sınıflar

1. **RssFeedConfig** - Yapılandırma yönetimi
2. **RssFeedService** - RSS çekme ve parse işlemleri
3. **NewsRepository** - Duplicate kontrolü ve kaydetme
4. **NewsController** - Manuel çekme endpoint'i

### İşleyiş

```
1. @Scheduled tetiklenir (her 30 dk)
2. Her feed kaynağı için:
   - RSS feed'i indirir
   - XML parse eder
   - News entity'sine çevirir
   - Duplicate kontrolü yapar
   - Yeni haberleri kaydeder
3. Loglarda sonuçları gösterir
```

## Loglar

```
2026-01-14 21:00:00 INFO  RSS feed'lerden haber çekme başlatıldı...
2026-01-14 21:00:01 INFO  Feed çekiliyor: Bloomberg HT - https://www.bloomberght.com/rss
2026-01-14 21:00:03 INFO  Feed tamamlandı: Bloomberg HT - 15 haber çekildi
2026-01-14 21:00:10 INFO  RSS feed çekme tamamlandı. Toplam: 87 çekildi, 23 yeni haber kaydedildi
```

## Yeni Feed Kaynağı Ekleme

1. **application.yml** dosyasını aç
2. `news.rss.sources` listesine yeni kaynak ekle:

```yaml
- name: "Yeni Haber Sitesi"
  url: "https://yenihaber.com/rss"
  category: FOREX  # Kategori seç
  enabled: true
```

3. Backend'i yeniden başlat

## Devre Dışı Bırakma

Tüm RSS çekmeyi durdurmak için:

```yaml
news:
  rss:
    enabled: false
```

Tek bir kaynağı durdurmak için:

```yaml
- name: "Bloomberg HT"
  url: "https://www.bloomberght.com/rss"
  category: GENERAL_ECONOMY
  enabled: false  # Bu kaynağı devre dışı bırak
```

## Performans

- Her feed çekme ~5-10 saniye sürer
- 6 kaynak için toplam ~1 dakika
- Duplicate kontrolü hızlı (indexed)
- Asenkron çalışma - uygulamayı bloklamaz

## Gelecek Geliştirmeler

- [ ] AI ile kategori otomatik belirleme
- [ ] Haber kalite skorlaması
- [ ] Benzer haber tespiti
- [ ] Haber önem derecesi
- [ ] Email/Push notification
- [ ] Admin dashboard'da istatistikler
