package com.mercure.commons.dto.search;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class FullTextSearchResponseDTO {

    private String matchingText;

    private List<FullTextSearchDatabaseResponseDTO> matchingMessages;
}
