import { AccessOptions, FileInfo, FTPResponse } from "basic-ftp";

export interface ClientFtp {
    access(options: AccessOptions): Promise<any>;
    list(remoteFilePath: string, pattern?: string | RegExp): Promise<FileInfo[]>;
    downloadTo(remoteFilePath: string, localPath: string): Promise<FTPResponse>;
    close(): void;
}
