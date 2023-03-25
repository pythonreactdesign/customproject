import { useRouter } from 'next/router';
import { useEffect, useRef, useState, useCallback } from 'react';

import { URLS } from 'utils/urls';

export const useAudio = () => {
  const router = useRouter();
  const isPlaying = useRef(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const setMusic = useCallback(() => {
    switch (router.pathname) {
      case URLS.root:
        return '/musics/HomeSid.mp3';
      case URLS.about:
        return '/musics/AboutSid.mp3';
      case URLS.work:
        return '/musics/WorkSid.mp3';
      case URLS.contact:
        return '/musics/ContactSid.mp3';
      default:
        '/musics/HomeSid.mp3';
    }
  }, [router.pathname]);
  const [theNewSource, setTheNewSource] = useState(setMusic());

  useEffect(() => {
    const newAudio = new Audio(theNewSource);
    newAudio.volume = 0.12;
    setAudio(newAudio);
  }, []);

  useEffect(() => {
    setTheNewSource(setMusic());
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.setAttribute('src', setMusic() as string);
      audio.load();
      isPlaying.current = true;
      audio.play();
    }
  }, [audio, setMusic]);

  const togglePlay = useCallback(() => {
    if (audio) {
      audio.play();
      isPlaying.current = true;
    }
  }, [audio]);

  const togglePause = useCallback(() => {
    if (audio) {
      audio.pause();
      isPlaying.current = false;
    }
  }, [audio]);

  const toggleStop = useCallback(() => {
    if (audio) {
      isPlaying.current = false;
      audio.pause();
      audio.currentTime = 0;
    }
  }, [audio]);

  useEffect(() => {
    const reLoadAudio = () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.play();
      }
    };

    if (audio) {
      audio.addEventListener('ended', () => reLoadAudio());
      return () => {
        audio.removeEventListener('ended', () => reLoadAudio());
      };
    }
  }, [audio]);

  return { togglePlay, togglePause, toggleStop };
};
