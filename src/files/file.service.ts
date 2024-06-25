import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { existsSync } from "fs";
import { access, mkdir, writeFile, readdir } from "fs/promises";
import { join, parse } from "path";
import { MFile } from "./mfile.class";

interface FileResponse {
    url: string
    fileName: string
}

@Injectable()
export class FileService {

    public async filterFiles(files: MFile[]): Promise<MFile[]> {
        const newFiles = await Promise.all(
            files.map(async (file) => {
                const mimeType = file.mimetype;
                
                return new MFile({
                    buffer: file.buffer,
                    originalname: Buffer.from(file.originalname, 'latin1').toString(),
                    mimetype: mimeType
                })
            })
        )

        return newFiles
    }

    private async checkAndRenameFile(filePath: string, fileName: string) {
        
        let fullFilePath = join(filePath, fileName)
        if (existsSync(fullFilePath)) {
            let index = 1;
            const parsedFileName = parse(fullFilePath);
            const fileName = parsedFileName.name;
            const fileExtension = parsedFileName.ext
            
            let newFileName = `${fileName}(1)${fileExtension}`;
            fullFilePath = join(filePath, newFileName)
            while (existsSync(fullFilePath)) {
                index++;
                newFileName = `${fileName}(${index})${fileExtension}`;
                fullFilePath = join(filePath, newFileName)
            }
    
            return fullFilePath;
        }
        return fullFilePath;
    }

    public async saveFiles(files: MFile[]): Promise<FileResponse[]> {
        let saveFilePath = `${process.env.SAVE_FILES_PATH}`
        
        try {
            await access(saveFilePath)
        } catch(err) {
            await mkdir(saveFilePath, {recursive: true})
        }
        const response: FileResponse[] = await Promise.all(
            files.map(async (file): Promise<FileResponse> => {
                try {
                    const newFilePath = await this.checkAndRenameFile(saveFilePath, file.originalname)
                    await writeFile(newFilePath, file.buffer)
                } catch(err) {
                    throw new InternalServerErrorException('Error while processing file')
                }
            return {
                url: `${saveFilePath}/${file.originalname}`,
                fileName: file.originalname
            }
            })
        )
        return response       
    }

    public async getFiles() {
        const files = await readdir(process.env.SAVE_FILES_PATH)
        
        return {files: files.map((fileName) => {            
            return {
                fileName: fileName,
                link: `/files/${fileName}`
            }
        })}
        
    }
}