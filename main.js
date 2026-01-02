import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSoundDesign } from './sound';

gsap.registerPlugin(ScrollTrigger);

const initAnimations = () => {
    // Hero Branding Entrance (Refined)
    gsap.to('#scene-hero .reveal-up', {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1.8,
        ease: 'expo.out',
        delay: 0.6
    });

    // --- 1. Sound Design Integration ---
    initSoundDesign();

    // --- 2. Dynamic Navigation Active State ---
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

    // --- 3. Custom Cursor & Social/Nav Hover Sound ---
    const cursorDot = document.querySelector('.cursor-dot');

    // Check for touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        if (cursorDot) cursorDot.style.display = 'none';
    }

    // Blueprint Parallax & Cursor Interaction
    // Optimized Mouse Follower
    const moveCursor = (e) => {
        const { clientX, clientY } = e;

        // Blueprint parallax
        const xPos = (clientX / window.innerWidth - 0.5) * 40; // Increased depth
        const yPos = (clientY / window.innerHeight - 0.5) * 40;

        gsap.to('.blueprint-layer', {
            x: xPos,
            y: yPos,
            duration: 2,
            ease: 'power2.out'
        });

        if (cursorDot) {
            gsap.to(cursorDot, {
                x: clientX,
                y: clientY,
                duration: 0.15, // Slight lag for "fluid" feel
                ease: 'power2.out'
            });
        }
    };

    window.addEventListener('mousemove', moveCursor);

    // Cursor Hover States
    const interactables = document.querySelectorAll('a, button, .logo-box, .dot');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => cursorDot?.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorDot?.classList.remove('hover'));
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

    // gsap.matchMedia() for responsive animations
    const mm = gsap.matchMedia();

    // Scene 2: Philosophy (The Uncompromising Chart)
    mm.add("(min-width: 481px)", () => {
        const tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: '#scene-2',
                start: 'top top',
                end: '+=2000',
                scrub: 1.2,
                pin: true,
            }
        });

        tl2.from('#scene-2 .bg-image', { scale: 1.1, opacity: 0, duration: 2 })
            .to('#scene-2 .reveal-up', { y: 0, opacity: 1, stagger: 0.3, duration: 1 }, '<');

        // Chart Animation Logic (only when pinning)
        setupChartAnimation(tl2);
    });

    mm.add("(max-width: 480px)", () => {
        // No pinning on mobile, simple reveal
        gsap.to('#scene-2 .reveal-up', {
            scrollTrigger: {
                trigger: '#scene-2',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 1
        });

        // Static chart for mobile (already handled in CSS with opacity 1)
    });

    function setupChartAnimation(timeline) {
        const chartDuration = 5;
        let yearProxy = { val: 1960 };
        timeline.to(yearProxy, {
            val: 2025,
            duration: chartDuration,
            ease: 'none',
            onUpdate: function () {
                const el = document.getElementById('chart-year');
                if (el) el.textContent = Math.floor(this.targets()[0].val);
            }
        }, 'start-chart');

        timeline.to('.yeongjin-line', { strokeDashoffset: 0, duration: chartDuration, ease: 'none' }, 'start-chart');
        timeline.to('.competitor-line-1, .competitor-line-2', { strokeDashoffset: 0, duration: chartDuration, ease: 'none' }, 'start-chart');
        timeline.to('.event-marker, .event-text', { opacity: 1, duration: 0.5 }, 'start-chart+=3.4');
        timeline.to('.chart-label-yeongjin', { opacity: 1, duration: 1 }, 'start-chart+=0.5')
            .to('.chart-label-competitor', { opacity: 1, duration: 1 }, 'start-chart+=1');
    }




    // Scene 4: Growth (Slides transition)
    mm.add("(min-width: 481px)", () => {
        const tl4 = gsap.timeline({
            scrollTrigger: {
                trigger: '#scene-4',
                start: 'top top',
                end: '+=250%',
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });

        tl4.to('#scene-4 .bg-image', { opacity: 0.15, duration: 2 })
            .to('#scene-4 .reveal-up', { y: 0, opacity: 1, stagger: 0.3, duration: 1.5 }, '<');

        tl4.to('.ch4-slide-1', { opacity: 0, y: -50, duration: 1, ease: "power1.inOut" })
            .to('.ch4-slide-2', { opacity: 1, y: 0, duration: 1, ease: "power1.inOut" }, "-=0.5")
            .to({}, { duration: 1 });
    });

    mm.add("(max-width: 480px)", () => {
        // Simple sequential reveal for mobile
        gsap.to('#scene-4 .reveal-up', {
            scrollTrigger: {
                trigger: '#scene-4',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 1
        });

        // Ensure slides are visible on mobile
        gsap.set('.ch4-slide-1, .ch4-slide-2', { opacity: 1, y: 0 });
    });

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
            end: 'bottom top',
            scrub: 1.5,
            pin: true,
        }
    });

    tl5.to('#scene-5 .reveal-up', { y: 0, opacity: 1, stagger: 0.3, duration: 1.5 });
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
    initSoundDesign();
});
