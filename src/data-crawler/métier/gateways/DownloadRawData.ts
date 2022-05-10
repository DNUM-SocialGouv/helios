export interface DownloadRawData {
  handle(rawData: string, sftpPath: string, localPath: string): void
}
