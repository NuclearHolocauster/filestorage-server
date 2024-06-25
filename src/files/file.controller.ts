import { Controller, Get, Post, UseInterceptors, UploadedFiles, HttpException } from '@nestjs/common';
import { FileService } from './file.service';
import { FilesInterceptor } from "@nestjs/platform-express"

@Controller('files')
export class FileController {
    constructor(
        private readonly fileService: FileService
    ) {}
    @Post('/create')
    @UseInterceptors(FilesInterceptor('file', 3, {limits: { fileSize: 10 * 1024 * 1024 * 1024 }}))
    public async createPost(
        @UploadedFiles() uploadedFiles: Express.Multer.File[]
    ) {
        if (!uploadedFiles) {
            throw new HttpException('Need to choose file', 400);
        }
        const files = await this.fileService.filterFiles(uploadedFiles);
        await this.fileService.saveFiles(files);
    }

    @Get('/')
    public async getFiles() {
        return await this.fileService.getFiles()
    }
}
