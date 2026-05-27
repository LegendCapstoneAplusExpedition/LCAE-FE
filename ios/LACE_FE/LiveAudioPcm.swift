import AVFoundation
import React
import UIKit

@objc(LiveAudioPcm)
class LiveAudioPcm: RCTEventEmitter {
  private let engine = AVAudioEngine()
  private var converter: AVAudioConverter?
  private var targetFormat: AVAudioFormat?
  private var sequence = 0
  private var hasListeners = false
  private var isRecording = false
  private var wasInterrupted = false
  private var currentSampleRate = 16_000.0
  private var currentChannels = 1
  private var currentChunkDurationMs = 100

  override init() {
    super.init()

    let center = NotificationCenter.default
    center.addObserver(
      self,
      selector: #selector(handleAudioSessionInterruption),
      name: AVAudioSession.interruptionNotification,
      object: AVAudioSession.sharedInstance()
    )
    center.addObserver(
      self,
      selector: #selector(handleAudioEngineConfigurationChange),
      name: .AVAudioEngineConfigurationChange,
      object: engine
    )
    center.addObserver(
      self,
      selector: #selector(handleAppDidBecomeActive),
      name: UIApplication.didBecomeActiveNotification,
      object: nil
    )
  }

  deinit {
    NotificationCenter.default.removeObserver(self)
  }

  override static func requiresMainQueueSetup() -> Bool {
    false
  }

  override func supportedEvents() -> [String]! {
    ["LiveAudioPcmChunk"]
  }

  override func startObserving() {
    hasListeners = true
  }

  override func stopObserving() {
    hasListeners = false
  }

  @objc(start:channels:chunkDurationMs:resolver:rejecter:)
  func start(
    _ sampleRateValue: NSNumber,
    channels channelsValue: NSNumber,
    chunkDurationMs chunkDurationMsValue: NSNumber,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    if isRecording {
      resolve(nil)
      return
    }

    let session = AVAudioSession.sharedInstance()

    switch session.recordPermission {
    case .granted:
      break
    case .denied:
      reject("E_PERMISSION", "Microphone permission is not granted.", nil)
      return
    case .undetermined:
      session.requestRecordPermission { [weak self] granted in
        guard let self else {
          return
        }

        if granted {
          self.start(
            sampleRateValue,
            channels: channelsValue,
            chunkDurationMs: chunkDurationMsValue,
            resolver: resolve,
            rejecter: reject
          )
        } else {
          reject("E_PERMISSION", "Microphone permission is not granted.", nil)
        }
      }
      return
    @unknown default:
      reject("E_PERMISSION", "Microphone permission state is unknown.", nil)
      return
    }

    do {
      let sampleRate = max(8_000, sampleRateValue.doubleValue)
      let channels = max(1, min(2, channelsValue.intValue))
      let chunkDurationMs = max(20, min(250, chunkDurationMsValue.intValue))

      currentSampleRate = sampleRate
      currentChannels = channels
      currentChunkDurationMs = chunkDurationMs
      sequence = 0
      try startEngine(sampleRate: sampleRate, channels: channels, chunkDurationMs: chunkDurationMs)
      isRecording = true
      wasInterrupted = false
      resolve(nil)
    } catch {
      cleanup()
      reject("E_AUDIO_RECORD", error.localizedDescription, error)
    }
  }

  @objc(stop:rejecter:)
  func stop(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    cleanup()
    resolve(nil)
  }

  @objc(prepareWebRtcAudioSession:rejecter:)
  func prepareWebRtcAudioSession(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let session = AVAudioSession.sharedInstance()

    switch session.recordPermission {
    case .granted:
      break
    case .denied:
      reject("E_PERMISSION", "Microphone permission is not granted.", nil)
      return
    case .undetermined:
      session.requestRecordPermission { [weak self] granted in
        guard let self else {
          return
        }

        if granted {
          self.prepareWebRtcAudioSession(resolve, rejecter: reject)
        } else {
          reject("E_PERMISSION", "Microphone permission is not granted.", nil)
        }
      }
      return
    @unknown default:
      reject("E_PERMISSION", "Microphone permission state is unknown.", nil)
      return
    }

    do {
      if isRecording {
        cleanup()
      }

      try session.setCategory(
        .playAndRecord,
        mode: .voiceChat,
        options: [.allowBluetooth, .allowBluetoothA2DP, .defaultToSpeaker]
      )
      try session.setPreferredSampleRate(48_000)
      try session.setPreferredIOBufferDuration(0.01)
      try session.setActive(true)

      resolve([
        "category": session.category.rawValue,
        "inputAvailable": session.isInputAvailable,
        "inputs": session.currentRoute.inputs.map { $0.portType.rawValue },
        "mode": session.mode.rawValue,
        "outputs": session.currentRoute.outputs.map { $0.portType.rawValue },
      ])
    } catch {
      reject("E_AUDIO_SESSION", error.localizedDescription, error)
    }
  }

  private func cleanup() {
    engine.inputNode.removeTap(onBus: 0)

    if engine.isRunning {
      engine.stop()
    }

    converter = nil
    targetFormat = nil
    sequence = 0
    isRecording = false
    wasInterrupted = false
    try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
  }

  private func startEngine(sampleRate: Double, channels: Int, chunkDurationMs: Int) throws {
    let session = AVAudioSession.sharedInstance()
    try session.setCategory(.playAndRecord, mode: .measurement, options: [.allowBluetooth])
    try session.setPreferredSampleRate(sampleRate)
    try session.setPreferredIOBufferDuration(Double(chunkDurationMs) / 1000)
    try session.setActive(true)

    if engine.isRunning {
      engine.stop()
    }

    let inputNode = engine.inputNode
    inputNode.removeTap(onBus: 0)

    let inputFormat = inputNode.inputFormat(forBus: 0)

    guard
      let outputFormat = AVAudioFormat(
        commonFormat: .pcmFormatInt16,
        sampleRate: sampleRate,
        channels: AVAudioChannelCount(channels),
        interleaved: true
      ),
      let audioConverter = AVAudioConverter(from: inputFormat, to: outputFormat)
    else {
      throw NSError(
        domain: "LiveAudioPcm",
        code: 1,
        userInfo: [NSLocalizedDescriptionKey: "Failed to create PCM16 audio format."]
      )
    }

    converter = audioConverter
    targetFormat = outputFormat

    let bufferSize = AVAudioFrameCount(inputFormat.sampleRate * Double(chunkDurationMs) / 1000)
    inputNode.installTap(onBus: 0, bufferSize: bufferSize, format: inputFormat) {
      [weak self] buffer,
      _ in
      self?.emitChunk(from: buffer)
    }

    engine.prepare()
    try engine.start()
  }

  private func restartEngineIfNeeded() {
    guard isRecording else {
      return
    }

    do {
      try startEngine(
        sampleRate: currentSampleRate,
        channels: currentChannels,
        chunkDurationMs: currentChunkDurationMs
      )
      wasInterrupted = false
    } catch {
      wasInterrupted = true
    }
  }

  @objc
  private func handleAudioSessionInterruption(_ notification: Notification) {
    guard
      let userInfo = notification.userInfo,
      let typeValue = userInfo[AVAudioSessionInterruptionTypeKey] as? UInt,
      let type = AVAudioSession.InterruptionType(rawValue: typeValue)
    else {
      return
    }

    switch type {
    case .began:
      wasInterrupted = isRecording
      if engine.isRunning {
        engine.pause()
      }
    case .ended:
      guard isRecording, wasInterrupted else {
        return
      }

      DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) { [weak self] in
        self?.restartEngineIfNeeded()
      }
    @unknown default:
      break
    }
  }

  @objc
  private func handleAudioEngineConfigurationChange(_ notification: Notification) {
    guard isRecording else {
      return
    }

    DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) { [weak self] in
      self?.restartEngineIfNeeded()
    }
  }

  @objc
  private func handleAppDidBecomeActive(_ notification: Notification) {
    guard isRecording, !engine.isRunning else {
      return
    }

    DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) { [weak self] in
      self?.restartEngineIfNeeded()
    }
  }

  private func emitChunk(from inputBuffer: AVAudioPCMBuffer) {
    guard hasListeners, let converter, let targetFormat else {
      return
    }

    let ratio = targetFormat.sampleRate / inputBuffer.format.sampleRate
    let capacity = AVAudioFrameCount(Double(inputBuffer.frameLength) * ratio) + 1

    guard let outputBuffer = AVAudioPCMBuffer(pcmFormat: targetFormat, frameCapacity: capacity) else {
      return
    }

    var didProvideInput = false
    let inputBlock: AVAudioConverterInputBlock = { _, status in
      if didProvideInput {
        status.pointee = .noDataNow
        return nil
      }

      didProvideInput = true
      status.pointee = .haveData
      return inputBuffer
    }

    var error: NSError?
    converter.convert(to: outputBuffer, error: &error, withInputFrom: inputBlock)

    guard error == nil, let data = pcmData(from: outputBuffer), !data.isEmpty else {
      return
    }

    let body: [String: Any] = [
      "data": data.base64EncodedString(),
      "sequence": sequence,
      "timestamp": Date().timeIntervalSince1970 * 1000,
      "sampleRate": targetFormat.sampleRate,
      "channels": Int(targetFormat.channelCount),
      "db": calculateDb(data),
    ]
    sequence += 1

    DispatchQueue.main.async { [weak self] in
      self?.sendEvent(withName: "LiveAudioPcmChunk", body: body)
    }
  }

  private func pcmData(from buffer: AVAudioPCMBuffer) -> Data? {
    let audioBuffer = buffer.audioBufferList.pointee.mBuffers

    guard let rawData = audioBuffer.mData, audioBuffer.mDataByteSize > 0 else {
      return nil
    }

    return Data(bytes: rawData, count: Int(audioBuffer.mDataByteSize))
  }

  private func calculateDb(_ data: Data) -> Double {
    data.withUnsafeBytes { rawBuffer in
      let samples = rawBuffer.bindMemory(to: Int16.self)

      if samples.isEmpty {
        return -80
      }

      var sumSquares = 0.0
      for sample in samples {
        let normalized = Double(Int16(littleEndian: sample)) / Double(Int16.max)
        sumSquares += normalized * normalized
      }

      if sumSquares == 0 {
        return -80
      }

      let rms = sqrt(sumSquares / Double(samples.count))
      return max(-80, 20 * log10(rms))
    }
  }
}
