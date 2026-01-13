package com.toyotaborsa.finance.dto;

import com.toyotaborsa.finance.entity.NewsCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data // getter,setter,tostring vs hepsini tek başına halleder
@NoArgsConstructor // boş constructor olşturur
@AllArgsConstructor // tüm değişkenleri içeren bir constructor olş
public class NewsDto {
    private Long id;
    private String title;
    private String content;
    private String summary;
    private String source;
    private String sourceUrl;
    private String imageUrl;
    private NewsCategory category;
    private LocalDateTime publishedDate;
    private LocalDateTime createdDate;
}
