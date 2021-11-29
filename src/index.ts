import axios, {AxiosInstance} from "axios"

export interface ILoghouseClientOptions {
  accessToken: string
  bucketId: string
}

interface ILogEntry {
  message: string
  timestamp?: number
  metadata?: object
}

const baseURL = 'https://api.loghouse.io/'

export class LoghouseClient {

  private readonly accessToken: string
  private readonly bucketId: string
  private httpClient: AxiosInstance

  public constructor(options: ILoghouseClientOptions) {
    if (!options.accessToken) {
      throw new Error('[LoghouseClient::constructor]: Access token is empty')
    }

    if (!options.bucketId) {
      throw new Error('[LoghouseClient::constructor]: BucketId is empty')
    }

    this.accessToken = options.accessToken
    this.bucketId = options.bucketId

    this.httpClient = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      }
    })
  }

  async log(logEntry: ILogEntry | ILogEntry[]) {
    const logEntries = this.build(logEntry)

    const url = `/log?access_token=${this.accessToken}&bucket_id=${this.bucketId}`

    try {
      await this.httpClient.post(url, JSON.stringify(logEntries))
    } catch (e) {
      console.error(`LoghouseClient request failed. Message: ${e.message}`)
    }
  }

  build(logEntry: ILogEntry | ILogEntry[]): ILogEntry[] {

    let logEntries = Array.isArray(logEntry) ? logEntry : [logEntry]

    return logEntries.map((logEntry: ILogEntry, index) => {

      if (!logEntry) {
        throw new Error(`[LoghouseClient::build]: LogEntry can not be empty. LogEntry[${index}]`)
      }

      if (!logEntry.message) {
        throw new Error(`[LoghouseClient::build]: Message can not be empty. LogEntry[${index}]`)
      }

      if (!logEntry.timestamp) {
        logEntry.timestamp = Date.now()
      }

      let metadata = Object.assign({}, (({message, timestamp, metadata, ...o}) => o)(logEntry), logEntry.metadata)

      return {
        message: logEntry.message,
        timestamp: logEntry.timestamp,
        metadata
      } as ILogEntry
    })
  }
}