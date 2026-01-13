package com.toyotaborsa.finance.dto;

import com.toyotaborsa.finance.entity.NewsCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsCreateDto {

    @NotBlank(message = "Başlık boş olamaz")
    private String title;

    private String content;

    private String summary;

    @NotBlank(message = "Kaynak boş olamaz")
    private String source;

    private String sourceUrl;

    private String imageUrl;

    @NotNull(message = "Kategori boş olamaz")
    private NewsCategory category;

    @NotNull(message = "Yayınlanma tarihi boş olamaz")
    private LocalDateTime publishedDate;
}
