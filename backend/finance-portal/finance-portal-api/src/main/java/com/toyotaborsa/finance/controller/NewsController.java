package com.toyotaborsa.finance.controller;

import com.toyotaborsa.finance.dto.NewsCreateDto;
import com.toyotaborsa.finance.dto.NewsDto;
import com.toyotaborsa.finance.entity.NewsCategory;
import com.toyotaborsa.finance.service.NewsService;
import com.toyotaborsa.finance.service.RssFeedService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Haber (News) API Controller
 * 
 * Sorumıluklar:
 * 1. Haberleri getir (liste, detay, kategoriye göre)
 * 2. Haber ara ve filtrele (anahtar kelime, tarih aralığı)
 * 3. Haber yönetimi (oluştur, güncelle, sil) - ADMIN
 * 4. RSS feed'lerinden haber çek - ADMIN
 * 
 * Endpoint Güvenliği:
 * - GET endpoint'ler: Herkese açık
 * - POST/PUT/DELETE: Sadece ADMIN
 */
@RestController
// Bu sınıf REST API controller'ıdır - request'leri handle eder ve JSON döner
@RequestMapping("/api/news")
// Tüm endpoint'ler /api/news ile başlar
@RequiredArgsConstructor
// Lombok: final alanlar için constructor oto oluştur ve dependency injection
// yap
@Slf4j
// Lombok: log.info(), log.error() vb. kullanılabilir hale getir
@CrossOrigin(origins = "*")
// CORS: Frontend'den gelen request'leri kabul et (herhangi bir origin'den)
public class NewsController {

    // NewsService: Haber işlemleri (DB, filtering vb.)
    private final NewsService newsService;
    // RssFeedService: RSS feed'lerden haber çekme
    private final RssFeedService rssFeedService;

    /**
     * Tüm Haberleri Getir (Sayfalama ile)
     * 
     * GET /api/news
     * GET /api/news?page=0&size=20
     * 
     * @param page Hangi sayfa (0-indexed, varsayılan: 0)
     * @param size Her sayfada kaç haber (varsayılan: 20)
     * 
     * @return Sayfalanmış haber listesi
     * 
     *         Örnek Response:
     *         {
     *         "content": [ { NewsDto objects } ],
     *         "totalPages": 5,
     *         "totalElements": 100,
     *         "currentPage": 0
     *         }
     */
    @GetMapping
    // GET isteğini yakala
    public ResponseEntity<Page<NewsDto>> getAllNews(
            @RequestParam(defaultValue = "0") int page,
            // URL'de ?page=1 şeklinde gelen sayfa numarası
            @RequestParam(defaultValue = "20") int size) {
        // URL'de ?size=50 şeklinde gelen sayfa boyutu
        log.info("Tüm haberler istendi - Sayfa: {}, Boyut: {}", page, size);
        Page<NewsDto> news = newsService.getAllNews(page, size);
        return ResponseEntity.ok(news);
    }

    /**
     * Belirli Bir Haberin Detayını Getir
     * 
     * GET /api/news/123
     * 
     * @param id Haber ID'si
     * 
     * @return Haber detayı (NewsDto)
     * @throws NotFoundException eğer haber bulunamazsa
     */
    @GetMapping("/{id}")
    public ResponseEntity<NewsDto> getNewsById(@PathVariable Long id) {
        // URL'deki /123 kısmını id değişkenine bind et
        log.info("Haber detayı istendi - ID: {}", id);
        NewsDto news = newsService.getNewsById(id);
        return ResponseEntity.ok(news);
    }

    /**
     * Kategoriye Göre Haberleri Getir
     * 
     * GET /api/news/category/GENERAL_ECONOMY?page=0&size=20
     * 
     * Kategori Türleri: GENERAL_ECONOMY, STOCK_MARKET, FOREX, CRYPTO vb.
     * 
     * @param category Haber kategorisi (enum)
     * @param page     Sayfa numarası
     * @param size     Sayfa boyutu
     * 
     * @return Kategoriye ait haber listesi
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<Page<NewsDto>> getNewsByCategory(
            @PathVariable NewsCategory category,
            // URL'deki kategori değerini enum'a çevir
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Kategoriye göre haberler istendi - Kategori: {}, Sayfa: {}, Boyut: {}",
                category, page, size);
        Page<NewsDto> news = newsService.getNewsByCategory(category, page, size);
        return ResponseEntity.ok(news);
    }

    /**
     * Anahtar Kelimeye Göre Haber Ara
     * 
     * GET /api/news/search?keyword=ekonomi&page=0&size=20
     * 
     * Başlık ve içerikte arama yapılır (case-insensitive)
     * 
     * @param keyword Aranacak kelime
     * @param page    Sayfa numarası
     * @param size    Sayfa boyutu
     * 
     * @return Arama sonuçları
     */
    @GetMapping("/search")
    public ResponseEntity<Page<NewsDto>> searchNews(
            @RequestParam String keyword,
            // keyword zorunludur (defaultValue yok)
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Haber arama - Anahtar kelime: {}, Sayfa: {}, Boyut: {}", keyword, page, size);
        Page<NewsDto> news = newsService.searchNews(keyword, page, size);
        return ResponseEntity.ok(news);
    }

    /**
     * Son N Gün İçindeki Haberleri Getir
     * 
     * GET /api/news/recent
     * GET /api/news/recent?days=7
     * 
     * @param days Kaç gün geriye bakacak (varsayılan: 7)
     * 
     * @return Son N gün içindeki tüm haberler (sayfalanmamış)
     */
    @GetMapping("/recent")
    public ResponseEntity<List<NewsDto>> getRecentNews(
            @RequestParam(defaultValue = "7") int days) {
        log.info("Son {} günün haberleri istendi", days);
        List<NewsDto> news = newsService.getRecentNews(days);
        return ResponseEntity.ok(news);
    }

    /**
     * Tarih Aralığına Göre Haberleri Getir
     * 
     * GET
     * /api/news/date-range?startDate=2026-01-01T00:00:00&endDate=2026-01-31T23:59:59
     * 
     * Format: ISO-8601 (2026-01-25T14:30:00)
     * 
     * @param startDate Başlangıç tarihi
     * @param endDate   Bitiş tarihi
     * @param page      Sayfa numarası
     * @param size      Sayfa boyutu
     * 
     * @return Tarih aralığındaki haberler
     */
    @GetMapping("/date-range")
    public ResponseEntity<Page<NewsDto>> getNewsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            // @DateTimeFormat: String'i LocalDateTime'a otomatik çevir
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Tarih aralığına göre haberler istendi - Başlangıç: {}, Bitiş: {}",
                startDate, endDate);
        Page<NewsDto> news = newsService.getNewsByDateRange(startDate, endDate, page, size);
        return ResponseEntity.ok(news);
    }

    /**
     * Tüm Haber Kategorilerini Getir
     * 
     * GET /api/news/categories
     * 
     * @return Enum değerleri array'i (GENERAL_ECONOMY, STOCK_MARKET, vb.)
     */
    @GetMapping("/categories")
    public ResponseEntity<NewsCategory[]> getCategories() {
        log.info("Kategori listesi istendi");
        return ResponseEntity.ok(NewsCategory.values());
        // NewsCategory enum'ının tüm değerlerini döndür
    }

    /**
     * Yeni Haber Oluştur (ADMIN ONLY)
     * 
     * POST /api/news
     * Body: NewsCreateDto (title, content, category vb.)
     * 
     * Güvenlik: @PreAuthorize("hasRole('ADMIN')")
     * ↳ Sadece ADMIN rolüne sahip kullanıcılar çağırabilir
     * 
     * @param createDto Oluşturulacak haber bilgileri
     * 
     * @return Oluşturulan haber (201 CREATED status)
     * 
     *         Validasyon:
     *         - @Valid: createDto'daki tüm alanlar doğrulansın
     *         - Title boş olamaz, Content zorunlu vb.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    // Sadece ADMIN rolüne sahip kullanıcılar bu endpoint'i çağırabilir
    public ResponseEntity<NewsDto> createNews(@Valid @RequestBody NewsCreateDto createDto) {
        // @Valid: Gelen DTO'daki @NotNull, @Size vb. constraints'leri kontrol et
        log.info("Yeni haber oluşturuluyor - Başlık: {}", createDto.getTitle());
        NewsDto news = newsService.createNews(createDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(news);
        // 201 Created döndür (başarılı oluşturma)
    }

    /**
     * Haberi Güncelle (ADMIN ONLY)
     * 
     * PUT /api/news/123
     * Body: NewsCreateDto (güncellenecek alanlar)
     * 
     * Güvenlik: @PreAuthorize("hasRole('ADMIN')")
     * 
     * @param id        Güncellenecek haber ID'si
     * @param updateDto Güncelleme bilgileri
     * 
     * @return Güncellenmiş haber (200 OK status)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NewsDto> updateNews(
            @PathVariable Long id,
            @Valid @RequestBody NewsCreateDto updateDto) {
        log.info("Haber güncelleniyor - ID: {}", id);
        NewsDto news = newsService.updateNews(id, updateDto);
        return ResponseEntity.ok(news);
    }

    /**
     * Haberi Sil (ADMIN ONLY)
     * 
     * DELETE /api/news/123
     * 
     * Güvenlik: @PreAuthorize("hasRole('ADMIN')")
     * 
     * @param id Silinecek haber ID'si
     * 
     * @return 204 No Content (başarılı silme, body yok)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        log.info("Haber siliniyor - ID: {}", id);
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
        // 204 No Content: Silme başarılı, response body'si boş
    }

    /**
     * RSS Feed'lerden Manuel Haber Çekme (ADMIN ONLY)
     * 
     * POST /api/news/fetch-rss
     * 
     * Normalde scheduler tarafından otomatik çalışır
     * Ama manual tetikleme için bu endpoint
     * 
     * Güvenlik: @PreAuthorize("hasRole('ADMIN')")
     * 
     * @return Başlangıç mesajı (asenkron işlem)
     * 
     *         Akış:
     *         1. Admin endpoint'i çağırır
     *         2. rssFeedService.fetchNow() tetiklenir
     *         3. "işlem başlatıldı" mesajı döner
     *         4. Arka planda feed'ler çekilir (async)
     */
    @PostMapping("/fetch-rss")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> fetchRssFeeds() {
        log.info("Manuel RSS feed çekme tetiklendi");
        rssFeedService.fetchNow();
        // Arka planda başla (asenkron)
        return ResponseEntity.ok("RSS feed çekme işlemi başlatıldı");
    }
}
