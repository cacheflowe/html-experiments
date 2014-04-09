#= require components/bindable
#= require request-animation-frame

class antisocial.VideoCapture
  constructor: (@el, data)->
    @data = if data then data else @el.dataset
    @initialize()
    @addListeners()

  initialize: ->
    @requestAccessButton = document.getElementById('request-media-access')
    @startRecordingButton = document.getElementById('start-recording')
    @stopRecordingButton = document.getElementById('stop-recording')

    @videoEl = document.getElementById('webcam')
    @videoCanvas = document.getElementById('video-capture')
    @videoCanvasContext = @videoCanvas.getContext('2d')

    @recording = false

    @recordedAudioEl = null
    @recordedVideoEl = null

# PUBLIC #

  dispose: ->
    @removeListeners()


# PROTECTED #


# WebRTC shared between A/V #
  startUserMedia: (stream) =>
    # audio
    input = @audio_context.createMediaStreamSource(stream)
    input.connect @audio_context.destination
    @recorder = new Recorder(input)

    # video 
    videoSource = if window.webkitURL then window.webkitURL.createObjectURL(stream) else stream
    @videoEl.autoplay = true
    @videoEl.src = videoSource

    requestAnimationFrame @updateVideoCapture

# VIDEO RECORDING #

  updateVideoCapture: =>
    @videoCanvasContext.drawImage( @videoEl, 0, 0, @videoEl.width, @videoEl.height )

    if @recording
      @whammy.add @videoCanvasContext

    requestAnimationFrame @updateVideoCapture


# AUDIO RECORDING #

  initAudio: ->
    @audio_context = undefined
    @recorder = undefined



  startRecording: =>
    @recorder and @recorder.record()
    console.log "Recording..."

    # create whammy video capture
    @whammy = new Whammy.Video(30)
    @recording = true

  stopRecording: =>
    @recorder and @recorder.stop()
    console.log "Stopped recording."

    @recording = false
    
    # AUDIO create WAV download link using audio data blob
    @renderAudio()
    @recorder.clear()

    # VIDEO render
    @renderVideo()

    @buildPlaybackButton()

  renderVideo: ->
    start_time = +new Date;
    output = @whammy.compile();
    end_time = +new Date;
    url = webkitURL.createObjectURL(output);


    li = document.createElement("li")
    vid = document.createElement("video")
    hf = document.createElement("a")

    vid.src = url
    vid.controls = "true"
    hf.href = url;
    hf.download = new Date().toISOString() + ".webm"
    hf.innerHTML = hf.download
    # document.getElementById('status').innerHTML = "Compiled Video in " + (end_time - start_time) + "ms, file size: " + Math.ceil(output.size / 1024) + "KB";

    li.appendChild vid
    li.appendChild hf
    @el.appendChild li

    @recordedVideoEl = vid

  renderAudio: ->
    @recorder and @recorder.exportWAV((blob) =>
      # Recorder.forceDownload( blob, "myRecording-" + Date.now() + ".wav" );
      url = URL.createObjectURL(blob)
      li = document.createElement("li")
      au = document.createElement("audio")
      hf = document.createElement("a")
      au.controls = true
      au.src = url
      hf.href = url
      hf.download = new Date().toISOString() + ".wav"
      hf.innerHTML = hf.download
      li.appendChild au
      li.appendChild hf
      @el.appendChild li

      @recordedAudioEl = au
    )

  buildPlaybackButton: ->
      li = document.createElement("li")
      button = document.createElement("button")
      button.innerHTML = "PLAY!"
      li.appendChild button
      @el.appendChild li

      button.addEventListener 'click', (e) =>
        e.preventDefault()
        @recordedAudioEl.play()
        @recordedVideoEl.play()

  requestMediaAccess: =>
    try
      # navigator.getUserMedia = navigator.getUserMedia or navigator.webkitGetUserMedia
      navigator.getUserMedia || navigator.getUserMedia = ( 
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

      # webkit shim
      window.AudioContext = window.AudioContext or window.webkitAudioContext
      window.URL = window.URL or window.webkitURL
      @audio_context = new AudioContext()
      console.log "Audio context set up."
      console.log "navigator.getUserMedia " + ((if navigator.getUserMedia then "available." else "not present!"))
    catch e
      console.log e
      # alert "No web audio support in this browser!"
    navigator.getUserMedia
      audio: true
      video: true
    , @startUserMedia, (e) ->
      console.log "No live audio input: " + e

  addListeners: ->
    @requestAccessButton.addEventListener 'click', @requestMediaAccess, false
    @startRecordingButton.addEventListener 'click', @startRecording, false
    @stopRecordingButton.addEventListener 'click', @stopRecording, false

  removeListeners: ->
    @requestAccessButton.removeEventListener 'click', @requestMediaAccess, false
    @startRecordingButton.removeEventListener 'click', @startRecording, false
    @stopRecordingButton.removeEventListener 'click', @stopRecording, false

Bindable.register 'video-capture', antisocial.VideoCapture
