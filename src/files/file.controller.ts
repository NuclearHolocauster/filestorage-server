import { Controller, Get, Post, UseInterceptors, UploadedFiles, HttpException } from '@nestjs/common';
import { FileService } from './file.service';
import { FilesInterceptor } from "@nestjs/platform-express"
import { saveFileToStorage } from './file-storage';

@Controller('files')
export class FileController {
    constructor(
        private readonly fileService: FileService
    ) {}

    @Post('/create')
    @UseInterceptors(
        FilesInterceptor(
            'file', 
            3,
            saveFileToStorage
        )
    )
    public async saveFile(
        @UploadedFiles() uploadedFiles: Express.Multer.File[]
    ) {
        if (!uploadedFiles) {
            throw new HttpException('Need to choose file', 400);
        }
    }

    @Get('/')
    public async getFiles() {
        return await this.fileService.getFiles()
    }
}
