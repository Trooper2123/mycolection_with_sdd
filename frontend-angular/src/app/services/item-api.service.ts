import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemRequest, ItemResponse, PageResponse } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemApiService {
  private readonly apiBaseUrl = 'http://localhost:8080/itens';

  constructor(private readonly http: HttpClient) {}

  list(page = 0, size = 10, categoria?: string): Observable<PageResponse<ItemResponse>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (categoria && categoria.trim().length > 0) {
      params = params.set('categoria', categoria.trim());
    }
    return this.http.get<PageResponse<ItemResponse>>(this.apiBaseUrl, { params });
  }

  create(payload: ItemRequest): Observable<ItemResponse> {
    return this.http.post<ItemResponse>(this.apiBaseUrl, payload);
  }

  update(id: number, payload: ItemRequest): Observable<ItemResponse> {
    return this.http.put<ItemResponse>(`${this.apiBaseUrl}/${id}`, payload);
  }

  delete(id: number, justificativa?: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/${id}`, {
      body: justificativa?.trim() ? { justificativa: justificativa.trim() } : undefined
    });
  }

  emprestar(id: number): Observable<ItemResponse> {
    return this.http.post<ItemResponse>(`${this.apiBaseUrl}/${id}/emprestar`, {});
  }

  devolver(id: number): Observable<ItemResponse> {
    return this.http.post<ItemResponse>(`${this.apiBaseUrl}/${id}/devolver`, {});
  }
}
