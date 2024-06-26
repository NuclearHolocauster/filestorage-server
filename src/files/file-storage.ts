import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";
import { existsSync } from "node:fs";
import { join, parse } from "path";

export const saveFileToStorage: MulterOptions = {
    storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
            cb(null, getFileName(file.originalname))
        },
    }),
    limits: {
        fileSize: 10 * 1024 * 1024 * 1024
    }
}

const getFileName = (fileName: string): string => {
    const saveFilesPath = join(__dirname, '..', '..', 'files')
    let newFileName = fileName
    
    if (existsSync(join(saveFilesPath, fileName))) {
        let index = 1;
        const parsedFileName = parse(newFileName);
        const fileName = parsedFileName.name;
        const fileExtension = parsedFileName.ext
        newFileName = `${fileName}(${index})${fileExtension}`;
        
        while (existsSync(join(saveFilesPath, newFileName))) {
            index++;
            newFileName = `${fileName}(${index})${fileExtension}`;
        }

        return newFileName;
    }
    return newFileName;
}