package com.toyotaborsa.finance.service;

import com.toyotaborsa.finance.dto.NewsCreateDto;
import com.toyotaborsa.finance.dto.NewsDto;
import com.toyotaborsa.finance.entity.News;
import com.toyotaborsa.finance.entity.NewsCategory;
import com.toyotaborsa.finance.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service // sınıfın business logic old işaretler ve spring bundan
// oto olarak bean olş hafz yönt
@RequiredArgsConstructor // final tipindeki değşkler için oto constr olş spring bu constı
// kullnanarak oto olarak servislerini sınıfa enjetke eder
@Slf4j // log yazmayı otolaştırır
public class NewsService {

    private final NewsRepository newsRepository;

    /**
     * Tüm haberleri getir (sayfalama ile)
     */
    @Transactional(readOnly = true)
    public Page<NewsDto> getAllNews(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return newsRepository.findAllByOrderByPublishedDateDesc(pageable)
                .map(this::convertToDto);
    }

    /**
     * ID'ye göre haber getir
     */
    @Transactional(readOnly = true)
    public NewsDto getNewsById(Long id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Haber bulunamadı: " + id));
        return convertToDto(news);
    }

    /**
     * Kategoriye göre haberleri getir
     */
    @Transactional(readOnly = true)
    public Page<NewsDto> getNewsByCategory(NewsCategory category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return newsRepository.findByCategoryOrderByPublishedDateDesc(category, pageable)
                .map(this::convertToDto);
    }

    /**
     * Anahtar kelimeye göre haber ara
     */
    @Transactional(readOnly = true)
    public Page<NewsDto> searchNews(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return newsRepository.searchNews(keyword, pageable)
                .map(this::convertToDto);
    }

    /**
     * Tarih aralığına göre haberleri getir
     */
    @Transactional(readOnly = true)
    public Page<NewsDto> getNewsByDateRange(LocalDateTime startDate, LocalDateTime endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return newsRepository.findByPublishedDateBetweenOrderByPublishedDateDesc(startDate, endDate, pageable)
                .map(this::convertToDto);
    }

    /**
     * Son N gün içindeki haberleri getir
     */
    @Transactional(readOnly = true)
    public List<NewsDto> getRecentNews(int days) {
        LocalDateTime dateThreshold = LocalDateTime.now().minusDays(days);
        return newsRepository.findRecentNews(dateThreshold)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Kategori ve tarih aralığına göre haberleri getir
     */
    @Transactional(readOnly = true)
    public Page<NewsDto> getNewsByCategoryAndDateRange(
            NewsCategory category,
            LocalDateTime startDate,
            LocalDateTime endDate,
            int page,
            int size) {
        Pageable pageable = PageRequest.of(page, size);
        return newsRepository.findByCategoryAndPublishedDateBetweenOrderByPublishedDateDesc(
                category, startDate, endDate, pageable)
                .map(this::convertToDto);
    }

    /**
     * Yeni haber oluştur
     */
    @Transactional
    public NewsDto createNews(NewsCreateDto createDto) {
        News news = new News();
        news.setTitle(createDto.getTitle());
        news.setContent(createDto.getContent());
        news.setSummary(createDto.getSummary());
        news.setSource(createDto.getSource());
        news.setSourceUrl(createDto.getSourceUrl());
        news.setImageUrl(createDto.getImageUrl());
        news.setCategory(createDto.getCategory());
        news.setPublishedDate(createDto.getPublishedDate());

        News savedNews = newsRepository.save(news);
        log.info("Yeni haber oluşturuldu: {}", savedNews.getId());

        return convertToDto(savedNews);
    }

    /**
     * Haberi güncelle
     */
    @Transactional
    public NewsDto updateNews(Long id, NewsCreateDto updateDto) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Haber bulunamadı: " + id));

        news.setTitle(updateDto.getTitle());
        news.setContent(updateDto.getContent());
        news.setSummary(updateDto.getSummary());
        news.setSource(updateDto.getSource());
        news.setSourceUrl(updateDto.getSourceUrl());
        news.setImageUrl(updateDto.getImageUrl());
        news.setCategory(updateDto.getCategory());
        news.setPublishedDate(updateDto.getPublishedDate());

        News updatedNews = newsRepository.save(news);
        log.info("Haber güncellendi: {}", updatedNews.getId());

        return convertToDto(updatedNews);
    }

    /**
     * Haberi sil
     */
    @Transactional
    public void deleteNews(Long id) {
        if (!newsRepository.existsById(id)) {
            throw new RuntimeException("Haber bulunamadı: " + id);
        }
        newsRepository.deleteById(id);
        log.info("Haber silindi: {}", id);
    }

    /**
     * News entity'yi DTO'ya çevir
     */
    private NewsDto convertToDto(News news) {
        NewsDto dto = new NewsDto();
        dto.setId(news.getId());
        dto.setTitle(news.getTitle());
        dto.setContent(news.getContent());
        dto.setSummary(news.getSummary());
        dto.setSource(news.getSource());
        dto.setSourceUrl(news.getSourceUrl());
        dto.setImageUrl(news.getImageUrl());
        dto.setCategory(news.getCategory());
        dto.setPublishedDate(news.getPublishedDate());
        dto.setCreatedDate(news.getCreatedDate());
        return dto;
    }
}
