type FullTextSearchResponseType = {
    matchingText: string
    matchingMessages: FullTextSearchResponseGroupType[];
}

type FullTextSearchResponseGroupType = {
    id: number
    groupUrl: string
    messages: string[]
    groupName: string
}

export type {FullTextSearchResponseType}
