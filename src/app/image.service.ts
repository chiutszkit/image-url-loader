// image.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  loadImage(url: string): Observable<Blob> {
    const httpHeaders = new HttpHeaders().set('Accept', 'image/webp,*/*');
    return this.http.get<Blob>(url, { headers: httpHeaders, responseType: 'blob' as 'json' });
  }

}