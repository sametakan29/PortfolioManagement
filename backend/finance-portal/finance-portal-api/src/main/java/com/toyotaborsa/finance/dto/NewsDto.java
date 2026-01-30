package com.toyotaborsa.finance.dto;

import com.toyotaborsa.finance.entity.NewsCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Haber Response DTO
 * 
 * Backend'den frontend'e gönderilen haber verisi
 * NewsCreateDto'dan farklı: id ve createdDate alanları içerir
 * 
 * Akış: NewsEntity → NewsDto (Entity → DTO dönüşümü)
 */
@Data
// getter, setter, toString, equals, hashCode otomatik oluştur
@NoArgsConstructor
// Boş constructor (JSON deserialize için)
@AllArgsConstructor
// Tüm alanlar için constructor
public class NewsDto {

    /**
     * Haber Kimliği
     * DB'deki primary key, benzersiz tanımlayıcı
     */
    private Long id;

    /**
     * Haber Başlığı
     */
    private String title;

    /**
     * Haber İçeriği (tam metin)
     */
    private String content;

    /**
     * Haber Özeti (liste görünümü için)
     */
    private String summary;

    /**
     * Haber Kaynağı (Bloomberg, Reuters vb.)
     */
    private String source;

    /**
     * Orijinal Haber URL'i
     */
    private String sourceUrl;

    /**
     * Haber Resmi URL'i
     */
    private String imageUrl;

    /**
     * Haber Kategorisi enum
     */
    private NewsCategory category;

    /**
     * Haber Yayınlanma Tarihi
     */
    private LocalDateTime publishedDate;

    /**
     * Haber Oluşturulma Tarihi (sistem tarafından otomatik set edilir)
     */
    private LocalDateTime createdDate;
}
