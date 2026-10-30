export interface Paginated<T> {
  items: T[];
  total: number;
  pageSize: number
  page: number;
  totalPages: number;
}