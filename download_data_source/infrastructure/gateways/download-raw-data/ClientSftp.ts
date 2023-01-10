import { ConnectOptions, FileInfo, FastGetTransferOptions } from 'ssh2-sftp-client'

export interface ClientSftp {
  connect(options: ConnectOptions): Promise<any>
  list(remoteFilePath: string, pattern?: string | RegExp): Promise<FileInfo[]>
  fastGet(remoteFilePath: string, localPath: string, options?: FastGetTransferOptions): Promise<string>
  end(): Promise<void>
}
