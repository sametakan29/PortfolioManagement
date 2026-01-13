package com.toyotaborsa.finance.repository;

import com.toyotaborsa.finance.entity.News;
import com.toyotaborsa.finance.entity.NewsCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository // repository )db logic) olduğunu işaretler ve spring buradan oto bean olşturur
public interface NewsRepository extends JpaRepository<News, Long> {

    // Kategoriye göre haberleri getir
    Page<News> findByCategoryOrderByPublishedDateDesc(NewsCategory category, Pageable pageable);

    // Tüm haberleri yayın tarihine göre sırala
    Page<News> findAllByOrderByPublishedDateDesc(Pageable pageable);

    // Başlık veya içerikte arama yap
    @Query("SELECT n FROM News n WHERE LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(n.summary) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "ORDER BY n.publishedDate DESC")
    Page<News> searchNews(@Param("keyword") String keyword, Pageable pageable);

    // Belirli bir tarih aralığındaki haberleri getir
    Page<News> findByPublishedDateBetweenOrderByPublishedDateDesc(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable);

    // Son N gün içindeki haberleri getir
    @Query("SELECT n FROM News n WHERE n.publishedDate >= :date ORDER BY n.publishedDate DESC")
    List<News> findRecentNews(@Param("date") LocalDateTime date);

    // Kategoriye ve tarih aralığına göre haberleri getir
    Page<News> findByCategoryAndPublishedDateBetweenOrderByPublishedDateDesc(
            NewsCategory category,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable);
    
    // Duplicate check: Aynı başlık ve kaynaktan haber var mı?
    boolean existsByTitleAndSource(String title, String source);
}
