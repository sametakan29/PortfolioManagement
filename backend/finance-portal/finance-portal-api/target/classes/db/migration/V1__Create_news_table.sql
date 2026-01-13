-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    summary TEXT,
    source VARCHAR(255) NOT NULL,
    source_url VARCHAR(1000),
    image_url VARCHAR(1000),
    category VARCHAR(50) NOT NULL,
    published_date TIMESTAMP NOT NULL,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_news_category CHECK (category IN (
        'GENERAL_ECONOMY', 'STOCK_MARKET', 'FOREX', 'BOND', 
        'CRYPTO', 'COMMODITY', 'BANKING', 'INSURANCE', 'OTHER'
    ))
);

-- Create indexes for better query performance
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_published_date ON news(published_date DESC);
CREATE INDEX idx_news_category_published ON news(category, published_date DESC);
CREATE INDEX idx_news_title_search ON news USING gin(to_tsvector('turkish', title));
CREATE INDEX idx_news_content_search ON news USING gin(to_tsvector('turkish', content));

-- Insert sample news data
INSERT INTO news (title, content, summary, source, source_url, image_url, category, published_date) VALUES
('Merkez Bankası Faiz Kararını Açıkladı', 
'Merkez Bankası, politika faizini yüzde 45''te sabit tutma kararı aldı. Enflasyonla mücadele kararlılıkla sürdürülecek.',
'Merkez Bankası faiz oranlarını değiştirmedi, yüzde 45 seviyesinde tuttu.',
'Bloomberg HT', 'https://www.bloomberght.com', NULL, 'GENERAL_ECONOMY', CURRENT_TIMESTAMP - INTERVAL '2 hours'),

('Borsa İstanbul Güne Yükselişle Başladı',
'BIST 100 endeksi, güne yüzde 1.5 artışla 9,500 seviyesinden başladı. Bankacılık hisseleri öne çıktı.',
'BIST 100 yüzde 1.5 yükseldi, 9,500 puan seviyesinde.',
'Investing.com', 'https://www.investing.com', NULL, 'STOCK_MARKET', CURRENT_TIMESTAMP - INTERVAL '1 hour'),

('Dolar/TL Kurunda Son Durum',
'Dolar/TL kuru 34.25 seviyesinde işlem görüyor. Yatırımcılar Merkez Bankası''nın açıklamalarını bekliyor.',
'Dolar 34.25 TL seviyesinde.',
'Bigpara', 'https://www.bigpara.com', NULL, 'FOREX', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

('Hazine 10 Yıllık Tahvil İhalesi Yapıldı',
'Hazine, 10 yıllık tahvil ihalesinde 15 milyar TL borçlandı. Faiz oranı yüzde 28.5 olarak gerçekleşti.',
'Hazine tahvil ihalesinde 15 milyar TL borçlandı.',
'Anadolu Ajansı', 'https://www.aa.com.tr', NULL, 'BOND', CURRENT_TIMESTAMP - INTERVAL '3 hours'),

('Bitcoin 100 Bin Doların Üzerine Çıktı',
'Bitcoin, 100 bin dolar seviyesini aşarak tarihi rekor kırdı. Kripto para piyasalarında genel yükseliş yaşanıyor.',
'Bitcoin 100 bin doları aştı.',
'CoinDesk', 'https://www.coindesk.com', NULL, 'CRYPTO', CURRENT_TIMESTAMP - INTERVAL '4 hours'),

('Altın Fiyatlarında Rekor',
'Gram altın 2,850 TL seviyesini aştı. Küresel belirsizlikler altına talebi artırıyor.',
'Gram altın 2,850 TL seviyesinde.',
'Foreks', 'https://www.foreks.com', NULL, 'COMMODITY', CURRENT_TIMESTAMP - INTERVAL '5 hours');
