package com.example.aifoodscanner.dto;

import lombok.Data;

@Data
public class ScanRequest {
    private String foodName;
    private Double calories;
    private Double protein;
    private Double carbs;
    private Double fat;
    private Integer healthyScore;
    private String rawJsonResult;
}
