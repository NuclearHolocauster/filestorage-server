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