package com.toyotaborsa.finance.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.Map;

/**
 * BIST (Borsa İstanbul) Piyasa Saatleri Servisi
 * 
 * Piyasa açık/kapalı kontrolü ve mevcut seans bilgisini döner.
 * Türkiye saatine (Europe/Istanbul) göre çalışır.
 * 
 * BIST Seans Saatleri:
 * 1. Açılış Seansı (Emir Toplama):    09:40 - 09:55
 * 2. Açılış Eşleşme:                  09:55 - 10:00
 * 3. Sürekli İşlem (Ana Seans):       10:00 - 18:00
 * 4. Kapanış Seansı (Emir Toplama):   18:01 - 18:05  (Karanlık Oda)
 * 5. Kapanış Eşleşme:                 18:05 - 18:08
 * 6. Kapanış Fiyatından İşlemler:     18:08 - 18:10
 * 
 * Piyasa Kapalı: Hafta sonu (Cumartesi-Pazar) + 18:10 sonrası / 09:40 öncesi
 */
@Slf4j
@Service
public class MarketHoursService {

    private static final ZoneId ISTANBUL_ZONE = ZoneId.of("Europe/Istanbul");

    // Seans saatleri
    private static final LocalTime ACILIS_EMIR_TOPLAMA_BASLANGIC = LocalTime.of(9, 40);
    private static final LocalTime ACILIS_EMIR_TOPLAMA_BITIS = LocalTime.of(9, 55);
    private static final LocalTime ACILIS_ESLEME_BITIS = LocalTime.of(10, 0);
    private static final LocalTime SUREKLI_ISLEM_BITIS = LocalTime.of(18, 0);
    private static final LocalTime KAPANIS_EMIR_TOPLAMA_BASLANGIC = LocalTime.of(18, 1);
    private static final LocalTime KAPANIS_EMIR_TOPLAMA_BITIS = LocalTime.of(18, 5);
    private static final LocalTime KAPANIS_ESLEME_BITIS = LocalTime.of(18, 8);
    private static final LocalTime KAPANIS_FIYAT_ISLEM_BITIS = LocalTime.of(18, 10);

    /**
     * Piyasanın şu an açık olup olmadığını kontrol eder.
     * Hafta içi 09:40–18:10 arası açık sayılır.
     */
    public boolean isMarketOpen() {
        ZonedDateTime now = ZonedDateTime.now(ISTANBUL_ZONE);
        return isMarketOpenAt(now);
    }

    /**
     * Belirli bir zamanda piyasanın açık olup olmadığını kontrol eder.
     */
    public boolean isMarketOpenAt(ZonedDateTime dateTime) {
        DayOfWeek day = dateTime.getDayOfWeek();

        // Hafta sonu kapalı
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
            return false;
        }

        LocalTime time = dateTime.toLocalTime();

        // 09:40 - 18:10 arası açık
        return !time.isBefore(ACILIS_EMIR_TOPLAMA_BASLANGIC)
                && time.isBefore(KAPANIS_FIYAT_ISLEM_BITIS);
    }

    /**
     * Veri çekilip çekilmeyeceğini belirler.
     * Piyasa açıksa true, kapalıysa false.
     */
    public boolean shouldFetchData() {
        return isMarketOpen();
    }

    /**
     * Mevcut piyasa durumunu detaylı döner.
     * Frontend'e banner bilgisi olarak gönderilir.
     */
    public MarketStatus getMarketStatus() {
        ZonedDateTime now = ZonedDateTime.now(ISTANBUL_ZONE);
        DayOfWeek day = now.getDayOfWeek();
        LocalTime time = now.toLocalTime();

        // Hafta sonu
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
            return new MarketStatus(
                    "CLOSED",
                    "Piyasa Kapalı",
                    "Hafta sonu - Borsa İstanbul kapalıdır. Piyasa Pazartesi 09:40'ta açılacaktır.",
                    false,
                    now.toString()
            );
        }

        // Piyasa açılmadan önce
        if (time.isBefore(ACILIS_EMIR_TOPLAMA_BASLANGIC)) {
            return new MarketStatus(
                    "PRE_MARKET",
                    "Piyasa Açılış Öncesi",
                    "Borsa İstanbul henüz açılmadı. Açılış seansı 09:40'ta başlayacaktır.",
                    false,
                    now.toString()
            );
        }

        // Açılış Seansı - Emir Toplama (09:40 - 09:55)
        if (time.isBefore(ACILIS_EMIR_TOPLAMA_BITIS)) {
            return new MarketStatus(
                    "OPENING_AUCTION",
                    "Açılış Seansı (Emir Toplama)",
                    "Alım-satım emirleri toplanıyor. İşlem gerçekleşmez, emirler havuzda birikir. (09:40 - 09:55)",
                    true,
                    now.toString()
            );
        }

        // Açılış Eşleşme (09:55 - 10:00)
        if (time.isBefore(ACILIS_ESLEME_BITIS)) {
            return new MarketStatus(
                    "OPENING_MATCH",
                    "Açılış Eşleşme",
                    "Toplanan emirler değerlendiriliyor ve günün açılış fiyatı belirleniyor. (09:55 - 10:00)",
                    true,
                    now.toString()
            );
        }

        // Sürekli İşlem - Ana Seans (10:00 - 18:00)
        if (time.isBefore(SUREKLI_ISLEM_BITIS)) {
            return new MarketStatus(
                    "CONTINUOUS_TRADING",
                    "Sürekli İşlem (Ana Seans)",
                    "Piyasada anlık alım-satım işlemleri yapılmaktadır. Fiyatlar sürekli değişmektedir. (10:00 - 18:00)",
                    true,
                    now.toString()
            );
        }

        // Sürekli İşlem ile Kapanış arası boşluk (18:00 - 18:01)
        if (time.isBefore(KAPANIS_EMIR_TOPLAMA_BASLANGIC)) {
            return new MarketStatus(
                    "CLOSING_BREAK",
                    "Kapanış Seansı Hazırlık",
                    "Ana seans sona erdi, kapanış seansı başlamak üzere. (18:00 - 18:01)",
                    true,
                    now.toString()
            );
        }

        // Kapanış Seansı - Emir Toplama / Karanlık Oda (18:01 - 18:05)
        if (time.isBefore(KAPANIS_EMIR_TOPLAMA_BITIS)) {
            return new MarketStatus(
                    "CLOSING_AUCTION",
                    "Kapanış Seansı - Karanlık Oda",
                    "Emir girilebilir ancak fiyatlar ve emir derinliği ekranda görünmez. (18:01 - 18:05)",
                    true,
                    now.toString()
            );
        }

        // Kapanış Eşleşme (18:05 - 18:08)
        if (time.isBefore(KAPANIS_ESLEME_BITIS)) {
            return new MarketStatus(
                    "CLOSING_MATCH",
                    "Kapanış Eşleşme",
                    "Girilen emirler eşleşiyor ve günün kapanış fiyatı belirleniyor. (18:05 - 18:08)",
                    true,
                    now.toString()
            );
        }

        // Kapanış Fiyatından İşlemler (18:08 - 18:10)
        if (time.isBefore(KAPANIS_FIYAT_ISLEM_BITIS)) {
            return new MarketStatus(
                    "CLOSING_TRADES",
                    "Kapanış Fiyatından İşlemler",
                    "Sadece belirlenen kapanış fiyatı üzerinden son işlemler yapılmaktadır. (18:08 - 18:10)",
                    true,
                    now.toString()
            );
        }

        // Piyasa kapandıktan sonra (18:10+)
        return new MarketStatus(
                "CLOSED",
                "Piyasa Kapalı",
                "Borsa İstanbul bugün için kapandı. Bir sonraki işlem günü 09:40'ta açılacaktır.",
                false,
                now.toString()
        );
    }

    /**
     * Piyasa durumu DTO'su
     */
    public record MarketStatus(
            String session,       // Seans kodu: CLOSED, PRE_MARKET, OPENING_AUCTION, vb.
            String title,         // Başlık: "Piyasa Kapalı", "Sürekli İşlem", vb.
            String description,   // Açıklama metni
            boolean isOpen,       // Piyasa açık mı?
            String timestamp      // İstanbul saati
    ) {}
}
