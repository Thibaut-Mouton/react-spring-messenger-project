package com.mercure.commons.dto.search;

import lombok.*;

import java.util.List;

@Data
public class FullTextSearchDatabaseResponseDTO {

    private Integer id;

    private String groupUrl;

    private List<String> messages;

    private String groupName;
}
