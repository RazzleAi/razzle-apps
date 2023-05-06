

export interface SearchResult {

    position: number;
    title: string;
    link: string;
    snippet: string;
    description: string;

}


export interface Page<T> {

    items: T[];
    total: number;
    page: number;
    pageSize: number;

}


