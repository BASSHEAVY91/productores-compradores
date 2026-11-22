import { Injectable } from '@angular/core';
import { Camera, MediaResult } from '@capacitor/camera';

/** Lado más largo (en píxeles) con el que se guarda la foto. */
const MAX_SIZE = 800;
/** Calidad JPEG (0 a 1). */
const JPEG_QUALITY = 0.7;

/**
 * Responsabilidad única: obtener una foto del producto con la cámara o la
 * galería del dispositivo (RF5) y devolverla lista para guardar.
 *
 * Usa el plugin nativo @capacitor/camera, que en el navegador abre el
 * selector de archivos. La foto se reduce y comprime para que ocupe poco
 * espacio (importante con conectividad rural limitada, RNF4).
 */
@Injectable({ providedIn: 'root' })
export class PhotoService {
  /** Abre la cámara. Devuelve la foto como data URL, o null si se canceló. */
  async takePhoto(): Promise<string | null> {
    try {
      const result = await Camera.takePhoto({ quality: 80, webUseInput: true });
      return this.toCompressedDataUrl(result);
    } catch {
      return null;
    }
  }

  /** Abre la galería. Devuelve la foto como data URL, o null si se canceló. */
  async chooseFromGallery(): Promise<string | null> {
    try {
      const { results } = await Camera.chooseFromGallery({ quality: 80, webUseInput: true });
      return results.length > 0 ? this.toCompressedDataUrl(results[0]) : null;
    } catch {
      return null;
    }
  }

  private toCompressedDataUrl(media: MediaResult): Promise<string | null> {
    const source = media.webPath ?? this.thumbnailToDataUrl(media.thumbnail);
    if (!source) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, MAX_SIZE / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      };
      img.onerror = () => resolve(null);
      img.src = source;
    });
  }

  private thumbnailToDataUrl(thumbnail?: string): string | null {
    if (!thumbnail) {
      return null;
    }
    return thumbnail.startsWith('data:') ? thumbnail : `data:image/jpeg;base64,${thumbnail}`;
  }
}
