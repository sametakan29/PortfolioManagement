package com.toyotaborsa.finance.service;

import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import com.toyotaborsa.finance.config.RssFeedConfig;
import com.toyotaborsa.finance.entity.News;
import com.toyotaborsa.finance.entity.NewsCategory;
import com.toyotaborsa.finance.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

/**
 * RSS Feed'lerden haber çekme servisi
 * Belirli aralıklarla RSS feed kaynaklarını tarar ve yeni haberleri
 * veritabanına kaydeder
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RssFeedService {

    private final RssFeedConfig rssFeedConfig;
    private final NewsRepository newsRepository;

    /**
     * Her X dakikada bir çalışır (application.yml'den yapılandırılabilir)
     * Cron: saniye, dakika, saat, gün, ay, haftanın günü
     */
    @Scheduled(fixedDelayString = "${news.rss.fetch-interval-minutes:30}000", initialDelay = 60000) // İlk 1 dk sonra
                                                                                                    // başla
    @Transactional
    public void fetchNewsFromRssFeeds() {
        if (!rssFeedConfig.isEnabled()) {
            log.debug("RSS feed çekme devre dışı");
            return;
        }

        log.info("RSS feed'lerden haber çekme başlatıldı...");
        int totalFetched = 0;
        int totalSaved = 0;

        for (RssFeedConfig.FeedSource source : rssFeedConfig.getSources()) {
            if (!source.isEnabled()) {
                continue;
            }

            try {
                log.info("Feed çekiliyor: {} - {}", source.getName(), source.getUrl());
                List<News> newsList = fetchFromSource(source);

                for (News news : newsList) {
                    // Aynı başlık ve kaynaktan haber daha önce eklenmemiş mi kontrol et
                    boolean exists = newsRepository.existsByTitleAndSource(news.getTitle(), news.getSource());
                    if (!exists) {
                        newsRepository.save(news);
                        totalSaved++;
                        log.debug("Yeni haber kaydedildi: {}", news.getTitle());
                    }
                }

                totalFetched += newsList.size();
                log.info("Feed tamamlandı: {} - {} haber çekildi", source.getName(), newsList.size());

            } catch (Exception e) {
                log.error("Feed çekme hatası: {} - {}", source.getName(), e.getMessage(), e);
            }
        }

        log.info("RSS feed çekme tamamlandı. Toplam: {} çekildi, {} yeni haber kaydedildi", totalFetched, totalSaved);
    }

    /**
     * Tek bir RSS feed kaynağından haberleri çeker
     */
    @SuppressWarnings("deprecation")
    private List<News> fetchFromSource(RssFeedConfig.FeedSource source) throws Exception {
        SyndFeedInput input = new SyndFeedInput();
        SyndFeed feed = input.build(new XmlReader(URI.create(source.getUrl()).toURL()));

        return feed.getEntries().stream()
                .map(entry -> convertToNews(entry, source))
                .filter(news -> news != null)
                .toList();
    }

    /**
     * RSS feed entry'sini News entity'sine çevirir
     */
    private News convertToNews(SyndEntry entry, RssFeedConfig.FeedSource source) {
        try {
            News news = new News();

            // Başlık
            news.setTitle(cleanText(entry.getTitle()));

            // İçerik ve özet ayrı ayrı işle
            String description = "";
            String fullContent = "";

            // Description varsa al (genelde kısa özet)
            if (entry.getDescription() != null && entry.getDescription().getValue() != null) {
                description = cleanHtml(entry.getDescription().getValue());
            }

            // Contents varsa al (genelde tam içerik)
            if (entry.getContents() != null && !entry.getContents().isEmpty()) {
                fullContent = cleanHtml(entry.getContents().get(0).getValue());
            }

            // Content belirleme: fullContent varsa onu, yoksa description'ı kullan
            String content = !fullContent.isEmpty() ? fullContent : description;

            // Summary belirleme: description'dan oluştur, çift tekrarı önle
            String summary = "";
            if (!description.isEmpty()) {
                // Description zaten kısaysa direkt kullan
                summary = truncate(description, 200);
            } else if (!content.isEmpty()) {
                // Description yoksa content'ten özet çıkar
                summary = truncate(content, 200);
            }

            // Özet ve içerik aynıysa, özeti temizle (gereksiz tekrar)
            if (summary.equals(content) || (content.startsWith(summary.replace("...", "")))) {
                // İçerik kısaysa özet gereksiz
                if (content.length() <= 250) {
                    summary = "";
                }
            }

            news.setContent(content);
            news.setSummary(summary);

            // Kaynak
            news.setSource(source.getName());
            news.setSourceUrl(entry.getLink());

            // Resim URL (eğer varsa)
            if (entry.getEnclosures() != null && !entry.getEnclosures().isEmpty()) {
                news.setImageUrl(entry.getEnclosures().get(0).getUrl());
            }

            // Kategori
            news.setCategory(source.getCategory() != null ? source.getCategory() : NewsCategory.OTHER);

            // Tarih
            Date publishedDate = entry.getPublishedDate() != null ? entry.getPublishedDate() : new Date();
            news.setPublishedDate(LocalDateTime.ofInstant(publishedDate.toInstant(), ZoneId.systemDefault()));

            return news;

        } catch (Exception e) {
            log.warn("RSS entry parse hatası: {} - {}", entry.getTitle(), e.getMessage());
            return null;
        }
    }

    /**
     * HTML etiketlerini temizler
     */
    private String cleanHtml(String html) {
        if (html == null || html.isEmpty())
            return "";

        String cleaned = html
                // HTML etiketlerini kaldır
                .replaceAll("<[^>]*>", "")
                // HTML entity'leri decode et
                .replaceAll("&nbsp;", " ")
                .replaceAll("&amp;", "&")
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">")
                .replaceAll("&quot;", "\"")
                .replaceAll("&apos;", "'")
                .replaceAll("&#8230;", "...")
                .replaceAll("&#8217;", "'")
                .replaceAll("&#8216;", "'")
                .replaceAll("&#8220;", "\"")
                .replaceAll("&#8221;", "\"")
                .replaceAll("&#8211;", "-")
                .replaceAll("&#8212;", "-")
                .replaceAll("&#39;", "'")
                .replaceAll("&#34;", "\"")
                // Numeric HTML entities (genel)
                .replaceAll("&#(\\d+);", "")
                // Çoklu boşlukları tek boşluğa indir
                .replaceAll("\\s+", " ")
                .trim();

        return cleaned;
    }

    /**
     * Metni temizler
     */
    private String cleanText(String text) {
        if (text == null)
            return "";
        return text.trim();
    }

    /**
     * Metni belirtilen uzunlukta keser
     */
    private String truncate(String text, int maxLength) {
        if (text == null || text.length() <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + "...";
    }

    /**
     * Manuel olarak feed çekme (test/admin için)
     */
    public void fetchNow() {
        log.info("Manuel RSS feed çekme tetiklendi");
        fetchNewsFromRssFeeds();
    }
}
