import { Controller, Get, Post, UseInterceptors, Request, Body, UploadedFiles, HttpException } from '@nestjs/common';
import { FileService } from './file.service';
import { FilesInterceptor } from "@nestjs/platform-express"

@Controller('files')
export class FileController {
    constructor(
        private readonly fileService: FileService
    ) {}
    @Post('/create')
    @UseInterceptors(FilesInterceptor('file'))
    public async createPost(
        @UploadedFiles() images: Express.Multer.File[]
    ) {
        if (!images) {
            throw new HttpException('Need to upload character image', 400);
        }
        const files = await this.fileService.filterFiles(images);
        await this.fileService.saveFiles(files);
    }

    @Get('/')
    public async getFiles() {
        return await this.fileService.getFiles()
    }
}
