package com.toyotaborsa.finance.dto;

import com.toyotaborsa.finance.entity.NewsCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Haber Oluşturma/Güncelleme DTO (Data Transfer Object)
 * 
 * Amaç:
 * Frontend'den gelen haber verilerini server'a taşımak
 * POST /api/news ve PUT /api/news/{id} endpoint'leri için kullanılır
 * 
 * Validasyon:
 * - title: Zorunlu (NotBlank) - boş string kabul edilmez
 * - source: Zorunlu (NotBlank) - haber kaynağı belirtilmeli
 * - category: Zorunlu (NotNull) - kategori seçilmeli
 * - publishedDate: Zorunlu (NotNull) - yayınlanma tarihi belirtilmeli
 * - content, summary, sourceUrl, imageUrl: Opsiyonel
 * 
 * Lombok Anotasyonları:
 * - @Data: getter/setter/toString/equals/hashCode otomatik oluştur
 * - @NoArgsConstructor: Boş constructor oluştur (deserialize için)
 * - @AllArgsConstructor: Tüm alanlar için constructor oluştur
 * 
 * Akış:
 * 1. Frontend JSON gönderir: { "title": "...", "content": "...", "category":
 * "STOCK_MARKET" }
 * 2. Spring Jackson ile JSON → NewsCreateDto'ya dönüştürür (deserialize)
 * 3. @Valid anotasyonu ile validasyon kuralları kontrol edilir
 * 4. Hata varsa 400 Bad Request, yoksa service'e iletilir
 */
@Data
// Lombok: getter/setter/toString/equals/hashCode otomatik oluştur
@NoArgsConstructor
// Lombok: Constructor() {} şeklinde boş constructor oluştur
// Gerekçe: JSON deserialize'ı için Spring'in parametre olmadan constructor'a
// ihtiyacı var
@AllArgsConstructor
// Lombok: Constructor(title, content, ...) oluştur (tüm alanlar için)
public class NewsCreateDto {

    /**
     * Haber Başlığı
     * 
     * Zorunlu: Evet (@NotBlank)
     * Format: String (en az 1 karakter, boş string değil)
     * Örnek: "Borsa İstanbul Yeni Rekorlar Kırıyor"
     * 
     * @NotBlank - Null, boş string ("") kabul edilmez
     *           - message: Validasyon başarısızsa bu mesaj döndürülür
     */
    @NotBlank(message = "Başlık boş olamaz")
    private String title;

    /**
     * Haber İçeriği (Gövde)
     * 
     * Zorunlu: Hayır (opsiyonel)
     * Format: String (tam haber metni, HTML markup olabilir)
     * 
     * Örnek:
     * "Borsa İstanbul endeksleri bu hafta %2.5 artış gösterdi.
     * Bankacılık sektörü güçlü performans sergiledi..."
     */
    private String content;

    /**
     * Haber Özeti (Kısa İçerik)
     * 
     * Zorunlu: Hayır (opsiyonel)
     * Format: String (content'in kısa versiyonu, 1-2 cümle)
     * 
     * Kullanım: Liste görünümünde preview göstermek için
     * Örnek: "Borsa'da bugün %2.5 artış yaşandı"
     */
    private String summary;

    /**
     * Haber Kaynağı
     * 
     * Zorunlu: Evet (@NotBlank)
     * Format: String (haber nereden alındı)
     * 
     * Örnek: "Bloomberg", "Reuters", "DHA", "RSS - Investing.com"
     * 
     * @NotBlank - Kaynak belirtilmek zorundadır
     *           - Kimliğini kaybetmiş haberler kabul edilmez
     */
    @NotBlank(message = "Kaynak boş olamaz")
    private String source;

    /**
     * Haber Kaynağı URL'i
     * 
     * Zorunlu: Hayır (opsiyonel)
     * Format: String (orijinal haber sayfasının URL'i)
     * 
     * Örnek: "https://www.bloomberght.com/haber/2026/01/25/..."
     * 
     * Kullanım: Kullanıcı "Kaynağa Git" linki tıklayınca yönlendirilir
     */
    private String sourceUrl;

    /**
     * Haber Resmi URL'i
     * 
     * Zorunlu: Hayır (opsiyonel)
     * Format: String (haber başlığı yanında gösterilecek resim URL'i)
     * 
     * Örnek: "https://cdn.example.com/news-images/2026/01/25/stock-market.jpg"
     * 
     * Kullanım: Frontend'de haber kartında resim göstermek için
     */
    private String imageUrl;

    /**
     * Haber Kategorisi
     * 
     * Zorunlu: Evet (@NotNull)
     * Format: NewsCategory enum
     * 
     * Olası Değerler:
     * - GENERAL_ECONOMY: Genel ekonomi haberleri
     * - STOCK_MARKET: Borsa/hisse haberleri
     * - FOREX: Döviz piyasası haberleri
     * - CRYPTO: Kripto para haberleri
     * - REAL_ESTATE: Gayrimenkul haberleri
     * - vb.
     * 
     * @NotNull - Kategori mutlaka seçilmeli
     *          - Kategorisiz haber kaydı yapılamaz
     */
    @NotNull(message = "Kategori boş olamaz")
    private NewsCategory category;

    /**
     * Haber Yayınlanma Tarihi
     * 
     * Zorunlu: Evet (@NotNull)
     * Format: LocalDateTime (Java time API)
     * 
     * Örnek: 2026-01-25T14:30:00
     * (25 Ocak 2026, saat 14:30:00)
     * 
     * Önem: Haberler bu tarihe göre sıralanır
     * Eski haberler en altta gösterilir
     * 
     * @NotNull - Tarih belirtilmek zorunlu
     *          - Null değer kabul edilmez
     */
    @NotNull(message = "Yayınlanma tarihi boş olamaz")
    private LocalDateTime publishedDate;
}
