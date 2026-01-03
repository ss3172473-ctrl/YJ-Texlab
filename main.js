import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { initSoundDesign } from './sound';

gsap.registerPlugin(ScrollTrigger);

// --- Premium Smooth Scroll (Lenis) ---
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// --- 1. Page Transition Manager (The Curtain) ---
class PageTransitionManager {
    constructor() {
        this.curtain = document.createElement('div');
        this.curtain.className = 'page-transition-curtain';
        document.body.appendChild(this.curtain);
        this.initListeners();
    }

    initListeners() {
        // Intercept internal links
        document.querySelectorAll('a').forEach(link => {
            if (link.hostname === window.location.hostname && !link.hash && link.target !== '_blank') {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (link.href === window.location.href) return;
                    this.animateOut(link.href);
                });
            }
        });

        // Animate In on Load
        this.animateIn();
    }

    animateOut(url) {
        gsap.to(this.curtain, {
            scaleY: 1,
            transformOrigin: 'bottom',
            duration: 0.8,
            ease: 'power4.inOut',
            onComplete: () => {
                window.location.href = url;
            }
        });
    }

    animateIn() {
        gsap.fromTo(this.curtain, {
            scaleY: 1,
            transformOrigin: 'top'
        }, {
            scaleY: 0,
            duration: 1.2,
            ease: 'power4.inOut',
            delay: 0.2
        });
    }
}

// --- 2. Magnetic Cursor Interaction ---
class MagneticCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor-dot');
        this.items = document.querySelectorAll('.logo-box, .nav-links a, .submit-btn, .dot');
        this.pos = { x: 0, y: 0 };
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.items.forEach(item => {
            item.addEventListener('mouseenter', () => this.cursor.classList.add('magnetic-active'));
            item.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('magnetic-active');
                gsap.to(item, { x: 0, y: 0, duration: 0.3 }); // Reset element position
            });
            item.addEventListener('mousemove', e => this.magnetize(e, item));
        });

        gsap.ticker.add(() => this.render());
    }

    magnetize(e, item) {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Attraction strength
        const matchX = (e.clientX - centerX) * 0.3;
        const matchY = (e.clientY - centerY) * 0.3;

        // Move element slightly towards mouse
        gsap.to(item, {
            x: matchX,
            y: matchY,
            duration: 0.2,
            ease: 'power2.out'
        });
    }

    render() {
        // Lerp cursor position
        const dt = 1.0 - Math.pow(1.0 - 0.2, gsap.ticker.deltaRatio());
        this.pos.x += (this.mouse.x - this.pos.x) * dt;
        this.pos.y += (this.mouse.y - this.pos.y) * dt;

        if (this.cursor) {
            gsap.set(this.cursor, {
                x: this.pos.x,
                y: this.pos.y
            });
        }
    }
}

// --- 3. Editorial Image Reveal (Mask) ---
const initEditorialReveals = () => {
    // Select all elements with .editorial-reveal-wrapper
    const wrappers = document.querySelectorAll('.editorial-reveal-wrapper');

    wrappers.forEach(wrapper => {
        const image = wrapper.querySelector('.editorial-reveal-content') || wrapper.firstElementChild; // Flexible targeting
        const mask = wrapper.querySelector('.editorial-reveal-mask');

        if (!image || !mask) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: wrapper,
                start: "top 80%",
            }
        });

        // Reveal sequence: Mask moves, Image scales down to normal
        tl.to(mask, {
            height: '0%', // Reveal from top to bottom
            duration: 1.5,
            ease: 'power4.inOut'
        })
            .to(image, {
                scale: 1, // Zoom out effect
                opacity: 1,
                duration: 1.5,
                ease: 'power2.out'
            }, "<"); // Run simultaneously
    });
};


const initAnimations = () => {
    // --- Cinematic Intro Sequence (Refined) ---
    const introTl = gsap.timeline();

    // 1. Initial State Set (Safety)
    gsap.set('.intro-logo-wrapper', {
        filter: 'blur(10px)',
        scale: 1.5,
        opacity: 0
    });

    // 2. Impact Entrance (Blur In + Scale Down) - "Tac!"
    introTl.to('.intro-logo-wrapper', {
        filter: 'blur(0px)',
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'power4.out', // Crisp stop
        delay: 0.2
    })
        // 3. Shimmer Effect (Light Sweep)
        .to('.intro-shine', {
            left: '150%', // Move across
            duration: 0.6,
            ease: 'power2.inOut'
        }, "-=0.2") // Start slightly before impact settles
        // 4. Quick Exit (Zoom Out + Fade)
        .to('.intro-logo-wrapper', {
            scale: 1.1, // Subtle bump up
            opacity: 0,
            filter: 'blur(5px)', // Fade out into blur
            duration: 0.5,
            ease: 'power2.in',
            delay: 0.3 // Short hold
        })
        .to('#intro-overlay', {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                const overlay = document.getElementById('intro-overlay');
                if (overlay) overlay.style.display = 'none';
            }
        }, "-=0.1");

    // Hero Branding Entrance (Refined & Synced)
    gsap.to('#scene-hero .reveal-up', {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1.8,
        ease: 'expo.out', // Reduced delay as curtain handles load
        delay: 2.2 // Synced after intro (0.2 + 0.8 + 0.3 + 0.5 approx)
    });

    // --- Sound Design Integration ---
    initSoundDesign();

    // --- Dynamic Navigation Active State ---
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-links a');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (currentPath === linkPath || (currentPath === '/' && linkPath === '/index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Initial set
    setActiveNavLink();

    // Add click listener to logo-box for home navigation
    document.querySelector('.logo-box').addEventListener('click', () => {
        window.location.href = '/';
    });

    // Scene 1: Origins
    gsap.from('#scene-1 .content > *', {
        scrollTrigger: {
            trigger: '#scene-1',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out'
    });

    const tl1 = gsap.timeline({
        scrollTrigger: {
            trigger: '#scene-1',
            start: 'top top',
            end: '+=600', // Reduced pinning duration as requested
            scrub: 1.5,
            pin: true,
            anticipatePin: 1
        }
    });

    tl1.to('#scene-1 .bg-image', { scale: 1.05, opacity: 0.1, duration: 2, ease: 'power1.inOut' })
        .to('#scene-1 .reveal-up', { y: 0, opacity: 1, stagger: 0.3, duration: 1.5, ease: 'power2.out' }, '<');

    // Scene 2: Philosophy (The Uncompromising Chart)
    const isMobile = window.innerWidth <= 768;
    const tl2 = gsap.timeline({
        scrollTrigger: {
            trigger: '#scene-2',
            start: 'top top',
            end: isMobile ? '+=3000' : '+=2000', // Mobile needs more scroll room for two phases
            scrub: 1.2,
            pin: true,
        }
    });

    tl2.from('#scene-2 .bg-image', { scale: 1.1, opacity: 0, duration: 2 })
        .to('#scene-2 .reveal-up', { y: 0, opacity: 1, stagger: 0.3, duration: 1 }, '<');

    if (isMobile) {
        // --- MOBILE SEQUENTIAL PHASE 1: Show/Stay on Text ---
        tl2.to({}, { duration: 2 }); // Buffer for reading text

        // --- TRANSITION: Fade out text, prep chart ---
        tl2.to('#scene-2 .content.side-content', { opacity: 0, y: -20, duration: 1 });
        tl2.set('.visual-asset-chart', { opacity: 0, y: 30, display: 'block' });
        tl2.to('.visual-asset-chart', { opacity: 1, y: 0, duration: 1 });
    }

    // Chart Animation Sequence (Synced)
    const chartDuration = 5;

    // 1. Year Counter 1960 -> 2025 (Synced with drawing)
    let yearProxy = { val: 1960 };
    tl2.to(yearProxy, {
        val: 2025,
        duration: chartDuration,
        ease: 'none',
        onUpdate: function () {
            const el = document.getElementById('chart-year');
            if (el) el.textContent = Math.floor(this.targets()[0].val);
        }
    }, 'start-chart');

    // 2. Draw Yeongjin Line (Straight & Steady)
    tl2.to('.yeongjin-line', { strokeDashoffset: 0, duration: chartDuration, ease: 'none' }, 'start-chart');

    // 3. Draw Competitor Lines (Falling)
    tl2.to('.competitor-line-1, .competitor-line-2', { strokeDashoffset: 0, duration: chartDuration, ease: 'none' }, 'start-chart');

    // 4. Reveal Event "China Low Cost" - Appear around 2005
    tl2.to('.event-marker, .event-text', { opacity: 1, duration: 0.5 }, 'start-chart+=3.4');

    // 5. Reveal Labels Earlier (Start of chart)
    tl2.to('.chart-label-yeongjin', { opacity: 1, duration: 1 }, 'start-chart+=0.5')
        .to('.chart-label-competitor', { opacity: 1, duration: 1 }, 'start-chart+=1');




    const tl4 = gsap.timeline({
        scrollTrigger: {
            trigger: '#scene-4',
            start: 'top top',
            end: '+=250%', // Slightly longer pin to accommodate the buffer
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });

    tl4.to('#scene-4 .bg-image', { opacity: 0.15, duration: 2 })
        .to('#scene-4 .reveal-up', { y: 0, opacity: 1, stagger: 0.3, duration: 1.5 }, '<');

    // Initial State is defined in CSS (Slide 1 visible, Slide 2 hidden)

    // Transition Sequence
    tl4.to('.ch4-slide-1', { opacity: 0, y: -50, duration: 1, ease: "power1.inOut" })
        .to('.ch4-slide-2', { opacity: 1, y: 0, duration: 1, ease: "power1.inOut" }, "-=0.5") // Overlap slightly
        .to({}, { duration: 1 }); // Added scroll buffer (dead time) so users can read partners/countries

    // Brand Marquee Animation
    const marqueeAnim = gsap.to('.marquee-content', {
        x: "-50%",
        repeat: -1,
        duration: 25, // Slightly slower for readability
        ease: "none"
    });

    // Pause on hover
    const marqueeEl = document.querySelector('.brand-marquee');
    if (marqueeEl) {
        marqueeEl.addEventListener('mouseenter', () => marqueeAnim.pause());
        marqueeEl.addEventListener('mouseleave', () => marqueeAnim.play());
    }

    // Scene 5: Legacy
    const tl5 = gsap.timeline({
        scrollTrigger: {
            trigger: '#scene-5',
            start: 'top top',
            end: isMobile ? '+=1500' : 'bottom top',
            scrub: 1.5,
            pin: true,
        }
    });

    tl5.to('#scene-5 .reveal-up', { y: 0, opacity: 1, stagger: 0.3, duration: 1.5 });

    if (isMobile) {
        // Sequential reveal for tag
        tl5.to({}, { duration: 1 }); // read text
        tl5.to('#scene-5 .final-content-wrapper > *:not(.promise-tag)', {
            opacity: 0,
            y: -20,
            duration: 1,
            stagger: 0.1
        });
        tl5.from('.promise-tag', {
            opacity: 0,
            scale: 0.8,
            y: 30,
            duration: 1,
            clearProps: "all"
        });
    }

    // Initialize New Managers
    new PageTransitionManager();
    new MagneticCursor();
    initEditorialReveals();
};

// Tactical Scroll Momentum
const initInertia = () => {
    ScrollTrigger.config({ limitCallbacks: true });
};

document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    // Certified Tag Tilt Effect
    const tag = document.querySelector('.tag-visual');
    const shine = document.querySelector('.shine-overlay');
    if (tag && shine) {
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const rect = tag.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Tilt amount
            const rotateX = (centerY - clientY) / 15;
            const rotateY = (clientX - centerX) / 15;

            // Shine position
            const xPercent = (clientX - rect.left) / rect.width * 100;
            const yPercent = (clientY - rect.top) / rect.height * 100;

            gsap.to(tag, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.6,
                ease: 'power2.out'
            });

            gsap.to(shine, {
                xPercent: xPercent - 50,
                yPercent: yPercent - 50,
                duration: 0.6,
                ease: 'power2.out'
            });
        });

        tag.addEventListener('mouseleave', () => {
            gsap.to(tag, {
                rotateX: 0,
                rotateY: 0,
                duration: 1.2,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    }

    initInertia();
});
