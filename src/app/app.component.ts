import { Component } from '@angular/core';
import { ImageService } from './image.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'image-error-handle';
  image = 'https://picsum.photos/300/200';
  //http
  imageURLHttp?: string;
  imageErrorCodeHttp: number = 0;
  isImageLoadingHttp = false;
  //imageService
  isImageErrorIS = false;
  isImageLoadingIS = false;
  //fetch
  imageURLFetch?: string;
  imageErrorCode: number = 0;
  isImageLoadingFetch = false;

  constructor(private imageService: ImageService, private http: HttpClient) {}

  ngOnInit() {
    this.getImage();

    this.getByImageService();

    this.getUsingFetch();
  }

  changeUri(options?: {status: number}) {
    if (options && options.status) {
      if (options.status === 200) {
        this.image = 'https://picsum.photos/300/200';
      } else {
        this.image = "https://picsum.photos/xxx/yyy";
      }
    }
    this.imageURLHttp = undefined;
    this.imageURLFetch = undefined;
    this.imageErrorCodeHttp = 0;
    this.imageErrorCode = 0;

    this.getImage();
    this.getByImageService();
    this.getUsingFetch();
  }

  getImage() {
    let httpHeaders = new HttpHeaders().set('Accept', 'image/webp,*/*');
    this.isImageLoadingHttp = true;

    return this.http
      .get<Blob>(this.image, {
        headers: httpHeaders,
        responseType: 'blob' as 'json',
      })
      .subscribe({
        next: (response: Blob) => {
          this.isImageLoadingHttp = false;
          // console.log('[http get] image size:', response.size);
          // console.log('[http get] image type:', response.type);
          this.imageURLHttp = URL.createObjectURL(response);
        },
        error: (error) => {
          this.isImageLoadingHttp = false;
          console.log('[http get] error:', error);
          this.imageErrorCodeHttp = error.status;
        }
      });
  }

  getByImageService() {
    this.isImageLoadingIS = true;
    this.isImageErrorIS = false;
    document.getElementById('image-container')!.innerHTML = '';
    this.imageService.loadImage(this.image).subscribe({
      next: (img: Blob) => {
        // convert 
        this.isImageLoadingIS = false;
        const imageSrc = URL.createObjectURL(img);
        const imgElement = document.createElement('img');
        imgElement.src = imageSrc;
        document.getElementById('image-container')?.appendChild(imgElement);
      },
      error: (error) => {
        this.isImageLoadingIS = false;
        console.error('Image error:', error);
        this.isImageErrorIS = true;
      },
    });
  }

  async getUsingFetch() {
    this.isImageLoadingFetch = true;
    const imgElement = document.getElementById(
      'my-fetch-image-container'
    ) as HTMLImageElement;
    imgElement!.src = '';
    
    try {
      const response = await fetch(this.image);
      this.imageErrorCode = response.status;
      // console.log('[fetch] ok:', response.ok);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      
      imgElement!.src = imgUrl;
    } catch (error: any) {
      console.error(error.message);
    }
    this.isImageLoadingFetch = false;
  }
}
