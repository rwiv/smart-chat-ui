// 빈 비디오 트랙 생성
export function createEmptyVideo() {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 360;
  const ctx = canvas.getContext("2d")
  if (ctx) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  return canvas.captureStream();
}

export function createEmptyAudio() {
  const audioDestination = new AudioContext().createMediaStreamDestination();
  return audioDestination.stream;
}

export function createEmptyStream() {
  const video = createEmptyVideo();
  const audio = createEmptyAudio();

  const stream = new MediaStream();
  stream.addTrack(video.getVideoTracks()[0]);
  stream.addTrack(audio.getAudioTracks()[0]);

  return stream;
}
