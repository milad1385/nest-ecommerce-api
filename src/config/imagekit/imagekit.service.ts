import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit, { toFile } from '@imagekit/nodejs';

export interface UploadResult {
  url: string;
  fileId: string;
  name: string;
  thumbnailUrl?: string;
}

@Injectable()
export class ImageKitService {
  private readonly client: ImageKit;

  constructor(private readonly configService: ConfigService) {
    this.client = new ImageKit({
      privateKey: this.configService.get<string>('IMAGEKIT_PRIVATE_KEY')!,
    });
  }

  async uploadImage(file: Buffer, fileName: string): Promise<UploadResult> {
    const uploadableFile = await toFile(file, fileName);
    const result = await this.client.files.upload({
      file: uploadableFile,
      fileName,
    });

    return {
      url: result.url!,
      fileId: result.fileId!,
      name: result.name!,
      thumbnailUrl: result.thumbnailUrl,
    };
  }
}
