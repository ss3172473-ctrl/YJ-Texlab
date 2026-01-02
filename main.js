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
    const cursor = document.querySelector('.cursor-dot');

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

    // Scene 2: Philosophy (The Uncompromising Chart)
    const tl2 = gsap.timeline({
        scrollTrigger: {
            trigger: '#scene-2',
            start: 'top top',
            end: '+=2000', // Pin longer for chart animation
            scrub: 1.2,
            pin: true,
        }
    });

    tl2.from('#scene-2 .bg-image', { scale: 1.1, opacity: 0, duration: 2 })
        .to('#scene-2 .reveal-up', { y: 0, opacity: 1, stagger: 0.3, duration: 1 }, '<');

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


    // Scene 3: Breakthrough (Counter & Narrative)
    const tl3 = gsap.timeline({
        scrollTrigger: {
            trigger: '#scene-3',
            start: 'top top',
            end: '+=1500', // Reduced scroll distance for faster progression
            scrub: 1,
            pin: true,
        }
    });

    // 1. Reveal Counter & Count to 30 + Reveal Narrative Text simultaneously
    tl3.fromTo('#day-counter', { innerText: 0 }, {
        innerText: 30,
        duration: 4,
        snap: { innerText: 1 },
        ease: 'none',
        onUpdate: function () { this.targets()[0].innerText = Math.ceil(this.targets()[0].innerText); }
    }, 'start-ch3');

    tl3.fromTo('.narrative-block > *',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.5, duration: 3 },
        'start-ch3' // Sync with counter start
    );


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
    initInertia();
    initSoundDesign();
});
