# Hisse Detay Sayfası

Hisse listesinden bir hisseye tıklandığında açılan detay sayfası.
Tarihsel fiyat grafiği ve temel bilgileri gösterir.

## Veri Kaynağı

**Yahoo Finance v8 API** — Ücretsiz, API key gerektirmez.

```
https://query2.finance.yahoo.com/v8/finance/chart/{SEMBOL}.IS?range={ARALIK}&interval={SIKLIK}
```

BIST hisseleri `.IS` soneki ile çağrılır (örn: `THYAO.IS`, `GARAN.IS`).

## Zaman Aralıkları

| Buton | Range | Interval | X Ekseni Formatı | Kullanım |
|-------|-------|----------|-------------------|----------|
| 1G | `1d` | `5m` | 14:35 | Gün içi dalgalanma |
| 1H | `5d` | `60m` | Pzt 10:00 | Haftalık trend |
| 1A | `1mo` | `1d` | 15 Oca | Kısa-orta vade |
| 3A | `3mo` | `1d` | Oca 2026 | Orta vadeli analiz |
| 1Y | `1y` | `1d` | Şub '25 | Uzun vadeli trend |
| 5Y | `5y` | `1wk` | 2024 Q1 | Çok uzun vade |

Sayfa ilk açıldığında **1A (1 Aylık)** seçili gelir.

## API Endpoint

```
GET /api/stocks/{symbol}/chart?range=1mo&interval=1d
```

**Parametreler:**
- `symbol` — Hisse kodu (THYAO, GARAN, ASELS vb.)
- `range` — Zaman aralığı (1d, 5d, 1mo, 3mo, 1y, 5y)
- `interval` — Veri sıklığı (5m, 60m, 1d, 1wk)

**Örnek Yanıt:**
```json
{
  "symbol": "THYAO",
  "range": "1mo",
  "interval": "1d",
  "currency": "TRY",
  "previousClose": 310.25,
  "regularMarketPrice": 315.50,
  "shortName": "TURK HAVA YOLLARI",
  "data": [
    {
      "timestamp": 1707800400,
      "open": 308.0,
      "high": 316.5,
      "low": 306.0,
      "close": 315.5,
      "volume": 12500000
    }
  ]
}
```

## Sayfa İçeriği

### Başlık Alanı
- Hisse sembolü ve şirket adı
- Güncel fiyat (₺)
- Değişim yüzdesi (yeşil/kırmızı chip)

### Fiyat Grafiği
- **Recharts** AreaChart kullanılır
- Pozitif değişimde yeşil, negatif değişimde kırmızı gradient
- Hover'da tooltip: Tarih, Açılış, Yüksek, Düşük, Kapanış, Hacim

### Hacim Grafiği
- Fiyat grafiğinin altında bar chart
- Aynı zaman aralığını paylaşır

### İstatistik Kartları
| Kart | Açıklama |
|------|----------|
| Dönem Değişimi | Seçili dönemdeki % değişim |
| En Yüksek | Dönemin en yüksek fiyatı |
| En Düşük | Dönemin en düşük fiyatı |
| Ort. Hacim | Ortalama günlük işlem hacmi |
| Güncel Fiyat | Son piyasa fiyatı |
| Önceki Kapanış | Bir önceki kapanış fiyatı |

## Dosya Yapısı

```
backend/
  service/StockChartService.java       → Yahoo Finance API çağrısı + cache
  controller/StockDataController.java  → /api/stocks/{symbol}/chart endpoint

frontend/
  services/api.ts                      → ChartResponse tipi + stockApi.getChart()
  hooks/useFinanceData.ts              → useStockChart() hook'u
  pages/StockDetail.tsx                → Detay sayfası UI
```

## Cache

| Katman | TTL | Açıklama |
|--------|-----|----------|
| Backend (Caffeine) | 5 dk | `stockChart` cache adıyla |
| Frontend (React Query) | 3 dk stale, 2 dk refetch | queryKey: `['stockChart', symbol, range, interval]` |

## Navigasyon

```
/stocks → Hisse listesi → Kart'a tıkla → /stocks/:symbol → Detay sayfası
```

Detay sayfasında "Geri" butonu ile listeye dönülebilir.
