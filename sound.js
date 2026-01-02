/**
 * Sound Design Utility for "혁신하며, 영진하다"
 * Focused on "Quiet Luxury" - Subtle, tactile sounds.
 * Refactored to use Web Audio API buffering for performance.
 */

const sounds = {
    scroll: '/assets/sounds/fabric_rustle.mp3',
    click: '/assets/sounds/ink_pen.mp3',
    hover: '/assets/sounds/paper_flip.mp3'
};

let audioContext;
let isEnabled = false;
const buffers = new Map();

class BufferManager {
    static async loadBuffer(url) {
        if (buffers.has(url)) return buffers.get(url);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.warn(`Sound file not found: ${url} (Status: ${response.status})`);
                return null;
            }
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            buffers.set(url, audioBuffer);
            return audioBuffer;
        } catch (e) {
            console.error(`Error loading or decoding sound: ${url}`, e);
            return null;
        }
    }
}

export const initSoundDesign = () => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', async () => {
        if (!isEnabled) {
            isEnabled = true;
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // Pre-load sounds
            Object.values(sounds).forEach(src => BufferManager.loadBuffer(src));
        } else if (audioContext && audioContext.state === 'suspended') {
            await audioContext.resume();
        }
    }, { once: false });
};

let lastScrollTop = 0;
let scrollTimeout;

const handleScroll = () => {
    if (!isEnabled) return;

    const st = window.pageYOffset || document.documentElement.scrollTop;
    const delta = Math.abs(st - lastScrollTop);

    if (delta > 20) {
        playSubtleSound(sounds.scroll, 0.05);
    }

    lastScrollTop = st <= 0 ? 0 : st;
};

export const playSubtleSound = async (src, volume = 0.1) => {
    if (!audioContext || audioContext.state === 'suspended') return;

    const buffer = await BufferManager.loadBuffer(src);
    if (!buffer) return;

    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    source.start(0);
};
