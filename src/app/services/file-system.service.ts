import { Injectable } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const appFolder = 'Cerebropolis';

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  constructor(
  ) { }

  async checkPermissions(): Promise<boolean> {
    const permStatus = await Filesystem.checkPermissions();

    if (permStatus.publicStorage !== 'granted') {
      const request = await Filesystem.requestPermissions();
      return request.publicStorage === 'granted';
    }
    return true;
  }

  async createAppFolder() {
    const hasPermission = await this.checkPermissions();
    if (!hasPermission) {
      alert('Permissão negada para acessar o armazenamento.');
      return;
    }

    try {
      await Filesystem.mkdir({
        path: appFolder,
        directory: Directory.ExternalStorage,
        recursive: true // Cria a pasta caso não exista
      });
    } catch (error: any) {
      if (error.message !== 'Current directory does already exist.' && error.message !== 'Directory exists') {
        alert('Erro ao criar pasta do aplicativo: ' + error);
      }
    }
  }

  async writeBinaryFile(filePath: string, data: File): Promise<void> {
    const fullPath = `${appFolder}/${filePath}`;
    const hasPermission = await this.checkPermissions();

    if (!hasPermission) {
      alert("Permissão negada para acessar o armazenamento.");
      return;
    }

    try {
      const base64Data = await this.blobToBase64(data);
      await Filesystem.writeFile({
        path: fullPath,
        data: base64Data,
        directory: Directory.ExternalStorage,
      });
    } catch (error) {
      alert('Erro ao salvar arquivo: ' + error);
      throw error;
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result?.toString().split(',')[1];
        if (result) {
          resolve(result);
        } else {
          reject('Falha ao converter Blob para base64');
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async readBinaryFile(filePath: string): Promise<string | null> {
    const fullPath = `${appFolder}/${filePath}`;
    try {
      const contents = await Filesystem.readFile({
        path: fullPath,
        directory: Directory.ExternalStorage,
      });

      const extension = filePath.split('.').pop()?.toLowerCase() || '';
      return `data:${this.getMimeType(extension)};base64,${contents.data}`;
    } catch (error) {
      return null;
    }
  }

  private getMimeType(extension: string): string {
    switch (extension) {
      case 'png': return 'image/png';
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'gif': return 'image/gif';
      case 'webp': return 'image/webp';
      default: return 'application/octet-stream';
    }
  }

  async deleteFile(filePath: string) {
    const fullPath = `${appFolder}/${filePath}`;

    await Filesystem.deleteFile({
      path: fullPath,
      directory: Directory.ExternalStorage,
    });
  }
}
