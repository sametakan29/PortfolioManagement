package com.toyotaborsa.finance.scheduler;

import com.toyotaborsa.finance.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Finance data scheduler
 * Periyodik olarak finans verilerini çeker ve cache'e yazar
 * 
 * Cron ifadeleri:(sn-dk-saat-gun-ay-haftanin gunu)
 * - Her 5 dakikada bir: 0 *\/5 * * * *
 * - Her 10 dakikada bir: 0 *\/10 * * * *
 * - Her saat başı: 0 0 * * * *
 */
// lombo:slf4j içerir-tekrarlı olayları kısaltır örn:get,set,log
@Slf4j // her seferinde ayrı ayrı log nesnesi oluşturmaya gerek kalmaz log.ABC
@Component // bu sınıf spring beani olur
@RequiredArgsConstructor
public class FinanceDataScheduler {

    private final ForexDataService forexDataService;
    private final StockDataService stockDataService;
    private final BondDataService bondDataService;
    private final ViopDataService viopDataService;
    private final FundDataService fundDataService;
    private final MarketHoursService marketHoursService;

    /**
     * Döviz kurlarını her 5 dakikada bir çek
     * Kurlar sık değiştiği için daha sık güncellenir
     */
    @Scheduled(cron = "0 */5 * * * *")
    @CacheEvict(value = "forexRates", allEntries = true, beforeInvocation = false)
    public void refreshForexRates() {
        if (!marketHoursService.shouldFetchData()) {
            log.debug("Piyasa kapalı - Döviz kurları güncellenmedi");
            return;
        }
        log.info("Zamanlanmış görev: Döviz kurları güncelleniyor...");
        try {
            forexDataService.getForexRates();
            log.info("Döviz kurları başarıyla güncellendi");
        } catch (Exception e) {
            log.error("Döviz kurları güncellenirken hata: {}", e.getMessage());
        }
    }

    /**
     * Hisse verilerini her 10 dakikada bir çek
     * Hisse fiyatları da sık değişir
     */
    @Scheduled(cron = "0 */10 * * * *")
    @CacheEvict(value = "stockData", allEntries = true, beforeInvocation = false)
    public void refreshStockData() {
        if (!marketHoursService.shouldFetchData()) {
            log.debug("Piyasa kapalı - Hisse verileri güncellenmedi");
            return;
        }
        log.info("Zamanlanmış görev: Hisse verileri güncelleniyor...");
        try {
            stockDataService.getStocks(null);
            log.info("Hisse verileri başarıyla güncellendi");
        } catch (Exception e) {
            log.error("Hisse verileri güncellenirken hata: {}", e.getMessage());
        }
    }

    /**
     * Tahvil verilerini her saat başı çek
     * Tahviller daha az değişir
     */
    @Scheduled(cron = "0 0 * * * *")
    @CacheEvict(value = "bondData", allEntries = true, beforeInvocation = false)
    public void refreshBondData() {
        if (!marketHoursService.shouldFetchData()) {
            log.debug("Piyasa kapalı - Tahvil verileri güncellenmedi");
            return;
        }
        log.info("Zamanlanmış görev: Tahvil verileri güncelleniyor...");
        try {
            bondDataService.getBonds();
            log.info("Tahvil verileri başarıyla güncellendi");
        } catch (Exception e) {
            log.error("Tahvil verileri güncellenirken hata: {}", e.getMessage());
        }
    }

    /**
     * VIOP verilerini her 10 dakikada bir çek
     */
    @Scheduled(cron = "0 */10 * * * *")
    @CacheEvict(value = "viopData", allEntries = true, beforeInvocation = false)
    public void refreshViopData() {
        if (!marketHoursService.shouldFetchData()) {
            log.debug("Piyasa kapalı - VIOP verileri güncellenmedi");
            return;
        }
        log.info("Zamanlanmış görev: VIOP verileri güncelleniyor...");
        try {
            viopDataService.getViopInstruments();
            log.info("VIOP verileri başarıyla güncellendi");
        } catch (Exception e) {
            log.error("VIOP verileri güncellenirken hata: {}", e.getMessage());
        }
    }

    /**
     * Fon verilerini her saat başı çek
     * Fonlar günde bir kez güncellenir genelde
     */
    @Scheduled(cron = "0 0 * * * *")
    @CacheEvict(value = "fundData", allEntries = true, beforeInvocation = false)
    public void refreshFundData() {
        if (!marketHoursService.shouldFetchData()) {
            log.debug("Piyasa kapalı - Fon verileri güncellenmedi");
            return;
        }
        log.info("Zamanlanmış görev: Fon verileri güncelleniyor...");
        try {
            fundDataService.getFunds();
            log.info("Fon verileri başarıyla güncellendi");
        } catch (Exception e) {
            log.error("Fon verileri güncellenirken hata: {}", e.getMessage());
        }
    }
}
