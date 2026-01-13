package com.toyotaborsa.finance.entity;

public enum NewsCategory {
    GENERAL_ECONOMY("Genel Ekonomi"),
    STOCK_MARKET("Hisse Senedi"),
    FOREX("Döviz"),
    BOND("Tahvil"),
    CRYPTO("Kripto Para"),
    COMMODITY("Emtia"),
    BANKING("Bankacılık"),
    INSURANCE("Sigorta"),
    OTHER("Diğer");

    private final String displayName;

    NewsCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
