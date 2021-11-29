import {LoghouseClient} from "../src"

const accessToken = "accessToken"
const bucketId = "bucketId"
const timestampMow = Date.now()

const message1 = 'testMessage1'
const message2 = 'testMessage2'

const timestamp = 12345678

const metadata = {
  key1: 'key1',
  key2: 'key2'
}

const otherMetadata = {
  key3: 'key3',
  key4: 'key4'
}

describe("LoghouseClient: build log entries", () => {
  let loghouseClient

  beforeEach(() => {
    loghouseClient = new LoghouseClient({
      accessToken,
      bucketId,
    })
  })

  it('One log entry without message', () => {
    expect(() => loghouseClient.build({
      timestamp: Date.now()
    })).toThrow()
  })

  it('One log entry with only message', () => {
    const logEntries = loghouseClient.build({
      message: message1
    })

    expect(logEntries.length).toBe(1)
    expect(logEntries[0].message).toBe(message1)
    expect(logEntries[0].timestamp).toBeGreaterThanOrEqual(timestampMow)
  })

  it('One log entry with other timestamp', () => {
    const logEntries = loghouseClient.build({
      message: message1,
      timestamp
    })

    expect(logEntries.length).toBe(1)
    expect(logEntries[0].message).toBe(message1)
    expect(logEntries[0].timestamp).toBe(timestamp)
  })


  it('One log entry with metadata', () => {
    const logEntries = loghouseClient.build({
      message: message1,
      metadata
    })

    expect(logEntries.length).toBe(1)
    expect(logEntries[0].message).toBe(message1)
    expect(logEntries[0].timestamp).toBeGreaterThanOrEqual(timestampMow)
    expect(logEntries[0].metadata.key1).toBe(metadata.key1)
    expect(logEntries[0].metadata.key2).toBe(metadata.key2)
  })

  it('One log entry without metadata and other keys in global object', () => {
    const logEntries = loghouseClient.build({
      message: message1,
      key1: metadata.key1,
      key2: metadata.key2,
    })

    expect(logEntries.length).toBe(1)
    expect(logEntries[0].message).toBe(message1)
    expect(logEntries[0].timestamp).toBeGreaterThanOrEqual(timestampMow)
    expect(logEntries[0].metadata.key1).toBe(metadata.key1)
    expect(logEntries[0].metadata.key2).toBe(metadata.key2)
  })

  it('One log entry with metadata and other keys in global object', () => {
    const logEntries = loghouseClient.build({
      message: message1,
      metadata,
      key3: otherMetadata.key3,
      key4: otherMetadata.key4
    })

    expect(logEntries.length).toBe(1)
    expect(logEntries[0].message).toBe(message1)
    expect(logEntries[0].timestamp).toBeGreaterThanOrEqual(timestampMow)
    expect(logEntries[0].metadata.key1).toBe(metadata.key1)
    expect(logEntries[0].metadata.key2).toBe(metadata.key2)
    expect(logEntries[0].metadata.key3).toBe(otherMetadata.key3)
    expect(logEntries[0].metadata.key4).toBe(otherMetadata.key4)
  })

  it('One log entry with metadata and equal keys in global object', () => {
    const logEntries = loghouseClient.build({
      message: message1,
      metadata,
      key1: otherMetadata.key3,
      key2: otherMetadata.key4
    })

    expect(logEntries.length).toBe(1)
    expect(logEntries[0].message).toBe(message1)
    expect(logEntries[0].timestamp).toBeGreaterThanOrEqual(timestampMow)
    expect(logEntries[0].metadata.key1).toBe(metadata.key1)
    expect(logEntries[0].metadata.key2).toBe(metadata.key2)
  })

  it('More than 1 log entry without message', () => {
    expect(() => loghouseClient.build(
      {
        timestamp: Date.now()
      },
      {
        message: message1
      }
    )).toThrow()
  })

  it('More than 1 log entry with only messages', () => {
    const logEntries = loghouseClient.build([
      {
        message: message1
      },
      {
        message: message2
      }
    ])

    expect(logEntries.length).toBe(2)

    expect(logEntries[0].message).toBe(message1)
    expect(logEntries[0].timestamp).toBeGreaterThanOrEqual(timestampMow)

    expect(logEntries[1].message).toBe(message2)
    expect(logEntries[1].timestamp).toBeGreaterThanOrEqual(timestampMow)
  })
})