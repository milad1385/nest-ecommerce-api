import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit, { toFile } from '@imagekit/nodejs';

@Injectable()
export class ImageKitService {
  private readonly client: ImageKit;

  constructor(private readonly configService: ConfigService) {
    this.client = new ImageKit({
      privateKey: this.configService.get<string>('IMAGEKIT_PRIVATE_KEY')!,
    });
  }

  async uploadImage(file: Buffer, fileName: string) {
    try {
      const uploadableFile = await toFile(file, fileName);
      return await this.client.files.upload({
        file: uploadableFile,
        fileName,
      });
    } catch (error) {
      console.error('ImageKit upload error:', error);
      throw new InternalServerErrorException('Failed to upload image');
    }
  }

  async deleteFile(fileId: string) {
    try {
      return await this.client.files.delete(fileId);
    } catch (error) {
      console.error('ImageKit delete error:', error);
      throw new InternalServerErrorException('Failed to delete image');
    }
  }
}
