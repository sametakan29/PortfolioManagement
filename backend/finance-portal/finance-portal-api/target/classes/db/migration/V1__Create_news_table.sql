
CREATE TABLE IF NOT EXISTS news (
    id BIGSERIAL PRIMARY KEY,
    
    -- Başlık: Uzun başlıklar için geniş alan, boş olamaz ama default var
    title VARCHAR(1000) NOT NULL DEFAULT 'Başlık Yok',
    
    -- İçerik: TEXT sınırsız, NULL olabilir (bazı RSS'lerde sadece başlık var)
    content TEXT,
    
    -- Özet: Otomatik oluşturulabilir, NULL olabilir
    summary VARCHAR(2000),
    
    -- Kaynak bilgileri: Boş gelebilir, default değerler ile
    source VARCHAR(500) NOT NULL DEFAULT 'Bilinmeyen Kaynak',
    source_url VARCHAR(2000),
    
    -- Resim: Çoğu kaynakta olmayabilir, NULL güvenli
    image_url VARCHAR(2000),
    
    -- Kategori: Default 'OTHER' ile hiçbir haber kaybolmaz
    category VARCHAR(50) NOT NULL DEFAULT 'OTHER',
    
    -- Tarihler: published_date NULL olabilir (bazı RSS'lerde yok)
    published_date TIMESTAMP,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP,
    
    -- Duplicate kontrolü için hash
    content_hash VARCHAR(64),
    
    -- İşlenme durumu
    is_processed BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Kategori constraint
    CONSTRAINT chk_news_category CHECK (category IN (
        'GENERAL_ECONOMY', 'STOCK_MARKET', 'FOREX', 'BOND', 
        'CRYPTO', 'COMMODITY', 'BANKING', 'INSURANCE', 'OTHER'
    ))
);

-- Indexes

-- Temel sorgular için
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_published_date ON news(published_date DESC NULLS LAST);
CREATE INDEX idx_news_created_date ON news(created_date DESC);
CREATE INDEX idx_news_category_published ON news(category, published_date DESC NULLS LAST);

-- Duplicate kontrolü için (aynı haber tekrar eklenmemeli)
CREATE UNIQUE INDEX idx_news_content_hash ON news(content_hash) WHERE content_hash IS NOT NULL;

-- Kaynak bazlı sorgular için
CREATE INDEX idx_news_source ON news(source);

-- Full-text search için (COALESCE ile NULL güvenli)
CREATE INDEX idx_news_title_search ON news USING gin(to_tsvector('turkish', COALESCE(title, '')));
CREATE INDEX idx_news_content_search ON news USING gin(to_tsvector('turkish', COALESCE(content, '')));