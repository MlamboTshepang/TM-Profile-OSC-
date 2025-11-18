document.addEventListener("DOMContentLoaded", () => {
    const progressBars = document.querySelectorAll('.progress-bar');

    // Use a slight delay for a better visual effect
    setTimeout(() => {
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
    }, 200); // 200ms delay


    // 1. Register only the ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // 2. Set up the Hero Reveal animations
    const heroReveal = gsap.utils.toArray(".hero-reveal");
    heroReveal.forEach((element) => {
        // Find all the necessary child elements
        const heroBox = element.querySelector(".hero-reveal__header");
        const heroHeadings = element.querySelectorAll(".hero-reveal__split-item");
        const contentEl = element.querySelector(".hero-reveal__content");

        // Exit if elements are missing
        if (!heroBox || !contentEl || heroHeadings.length < 2) {
            console.warn("Hero reveal section is missing required elements.");
            return;
        }

        // Get the heights for calculating animation duration
        const heroBoxHeight = heroBox.offsetHeight;
        const contentHeight = contentEl.offsetHeight;
        const endTrigger = `+=${
            heroBoxHeight > contentHeight ? heroBoxHeight : contentHeight
        }`;

        // Animation for the content scrolling up from underneath
        gsap
            .timeline({
                scrollTrigger: {
                    trigger: element,
                    start: "top top",
                    end: endTrigger,
                    scrub: true,
                },
            })
            .fromTo(contentEl, {y: "50%"}, {y: "0%", ease: "none"}, 0.2);

        // Main timeline for pinning the section and splitting the text
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: element,
                start: "top top",
                end: endTrigger,
                scrub: true,
                pin: true, // Pin the element while scrolling
            },
        });

        // Animate the clipPath of the parent box
        tl.fromTo(
            heroBox,
            {
                clipPath:
                    "polygon(0 0, 100% 0, 100% 50%, 0 50%, 0 50%, 100% 50%, 100% 100%, 0 100%)",
            },
            {
                clipPath:
                    "polygon(0 0, 100% 0, 100% 0%, 0 0%, 0 100%, 100% 100%, 100% 100%, 0 100%)",
                duration: 0.4,
                ease: "power4.inOut",
            }
        );

        // Animate the top half of the text UP
        tl.fromTo(
            heroHeadings[0],
            {y: "0%"},
            {y: "-30%", ease: "power3.inOut"},
            0 // Start at 0 seconds (same time as clipPath)
        );

        // Animate the bottom half of the text DOWN
        tl.fromTo(
            heroHeadings[1],
            {y: "0%"},
            {y: "30%", ease: "power3.inOut"},
            0 // Start at 0 seconds
        );
    });

    // 3. Define the Parallax function
    function parallaxScrollBySpeed(selector, speed = 1, trigger = ".hero-reveal") {
        const el = document.querySelector(selector);
        const contentEl = document.querySelector(".hero-reveal__content");

        // Exit if elements aren't found
        if (!el || !contentEl) {
            console.warn(`Parallax element not found: ${selector}`);
            return;
        }

        const contentHeight = contentEl.offsetHeight;

        gsap.to(el, {
            yPercent: (speed - 1) * 100,
            ease: "none",
            scrollTrigger: {
                trigger,
                start: "top top",
                end: `+=${contentHeight * 3}`,
                scrub: true,
            },
        });
    }

    // 4. Call the Parallax functions
    parallaxScrollBySpeed(".hero-reveal__parallax-book", 15);
    parallaxScrollBySpeed(".hero-reveal__parallax-clock", 13);
    parallaxScrollBySpeed(".hero-reveal__parallax-alice", 6);
    parallaxScrollBySpeed(".hero-reveal__parallax-kettle", 3);
    parallaxScrollBySpeed(".hero-reveal__parallax-card", 5);

});