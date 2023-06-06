import Sound from 'react-native-sound';

let whoosh = null;
// Enable playback in silence mode
Sound.setCategory('Playback');

// 播放指定名称的音频
export const playSound = (soundName, times = 1) => {
  whoosh?.stop();
  whoosh?.release();

  whoosh = new Sound(soundName, Sound.MAIN_BUNDLE, (err) => {
    if (err) {
      console.log(`${soundName} 音频载入失败`, err);
      return;
    }

    // loaded successfully
    console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

    const _play = () => {
      whoosh.play((success) => {
        if (success) {
          console.log('successfully finished playing');
          if (--times <= 0) {
            return;
          } else {
            _play();
          }
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    }

    _play();
  });
};

export const stopSound = ()=> {
  whoosh?.stop();
  whoosh?.release();
}

