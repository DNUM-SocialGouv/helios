export interface DownloadDataSource {
  handle(dataSource: string, sftpPath: string, localPath: string): void
}
