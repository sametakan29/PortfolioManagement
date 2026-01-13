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

@RestController // bu sınıf controller der,return olrk html değl json,xml döner=veri
@RequestMapping("/api/news") // bu adrese istek gelirse oto olarak bu sınıfa yönlendirilir
@RequiredArgsConstructor // final diye tanımlanan tüm değşk için oto constrc olş spring bu constr
                         // kullanarak servislerini sınıfa oto enjkte eder
@Slf4j // log yazmak için gereken satırlarca kodu oto halleder
@CrossOrigin(origins = "*") // herkesin istek atmasına açık hale getirir($)
public class NewsController {

    private final NewsService newsService;
    private final RssFeedService rssFeedService;

    /**
     * Tüm haberleri getir (sayfalama ile)
     * GET /api/news?page=0&size=10
     */
    @GetMapping // okuma-getirme isteğini yakalayıp belli bir java metodu çalş sağlar
    public ResponseEntity<Page<NewsDto>> // header-body-statusu tek bir paketle kontrllü göndr
            getAllNews(
                    @RequestParam(defaultValue = "0") int page, // urlde ? işaretinden sonr gelen değşk yakalar
                    @RequestParam(defaultValue = "20") int size) {
        log.info("Tüm haberler istendi - Sayfa: {}, Boyut: {}", page, size);
        Page<NewsDto> news = newsService.getAllNews(page, size);
        return ResponseEntity.ok(news);
    }

    /**
     * ID'ye göre haber detayını getir
     * GET /api/news/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<NewsDto> getNewsById(@PathVariable Long id) {
        log.info("Haber detayı istendi - ID: {}", id);
        NewsDto news = newsService.getNewsById(id);
        return ResponseEntity.ok(news);
    }

    /**
     * Kategoriye göre haberleri getir
     * GET /api/news/category/{category}?page=0&size=10
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<Page<NewsDto>> getNewsByCategory(
            @PathVariable NewsCategory category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Kategoriye göre haberler istendi - Kategori: {}, Sayfa: {}, Boyut: {}",
                category, page, size);
        Page<NewsDto> news = newsService.getNewsByCategory(category, page, size);
        return ResponseEntity.ok(news);
    }

    /**
     * Anahtar kelimeye göre haber ara
     * GET /api/news/search?keyword=ekonomi&page=0&size=10
     */
    @GetMapping("/search")
    public ResponseEntity<Page<NewsDto>> searchNews(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Haber arama - Anahtar kelime: {}, Sayfa: {}, Boyut: {}", keyword, page, size);
        Page<NewsDto> news = newsService.searchNews(keyword, page, size);
        return ResponseEntity.ok(news);
    }

    /**
     * Son N gün içindeki haberleri getir
     * GET /api/news/recent?days=7
     */
    @GetMapping("/recent")
    public ResponseEntity<List<NewsDto>> getRecentNews(
            @RequestParam(defaultValue = "7") int days) {
        log.info("Son {} günün haberleri istendi", days);
        List<NewsDto> news = newsService.getRecentNews(days);
        return ResponseEntity.ok(news);
    }

    /**
     * Tarih aralığına göre haberleri getir
     * GET
     * /api/news/date-range?startDate=2026-01-01T00:00:00&endDate=2026-01-31T23:59:59&page=0&size=10
     */
    @GetMapping("/date-range")
    public ResponseEntity<Page<NewsDto>> getNewsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Tarih aralığına göre haberler istendi - Başlangıç: {}, Bitiş: {}",
                startDate, endDate);
        Page<NewsDto> news = newsService.getNewsByDateRange(startDate, endDate, page, size);
        return ResponseEntity.ok(news);
    }

    /**
     * Kategori listesini getir
     * GET /api/news/categories
     */
    @GetMapping("/categories")
    public ResponseEntity<NewsCategory[]> getCategories() {
        log.info("Kategori listesi istendi");
        return ResponseEntity.ok(NewsCategory.values());
    }

    /**
     * Yeni haber oluştur
     * POST /api/news
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NewsDto> createNews(@Valid @RequestBody NewsCreateDto createDto) {
        log.info("Yeni haber oluşturuluyor - Başlık: {}", createDto.getTitle());
        NewsDto news = newsService.createNews(createDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(news);
    }

    /**
     * Haberi güncelle
     * PUT /api/news/{id}
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
     * Haberi sil
     * DELETE /api/news/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        log.info("Haber siliniyor - ID: {}", id);
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * RSS feed'lerden manuel haber çekme (Admin)
     * POST /api/news/fetch-rss
     */
    @PostMapping("/fetch-rss")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> fetchRssFeeds() {
        log.info("Manuel RSS feed çekme tetiklendi");
        rssFeedService.fetchNow();
        return ResponseEntity.ok("RSS feed çekme işlemi başlatıldı");
    }
}
