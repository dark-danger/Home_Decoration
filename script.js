document.addEventListener('DOMContentLoaded', () => {
    
    // Page Loader
    const loader = document.querySelector('.loader-wrapper');
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    });

    // Sticky Navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const revealTop = reveal.getBoundingClientRect().top;
            const revealPoint = 150;

            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // Image Carousel
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const dotsNav = document.querySelector('.carousel-dots');
    
    let currentSlideIndex = 0;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dotsNav.appendChild(dot);
    });

    const dots = Array.from(dotsNav.children);

    const updateSlider = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        currentSlideIndex = index;
    };

    nextBtn.addEventListener('click', () => {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        updateSlider(currentSlideIndex);
    });

    prevBtn.addEventListener('click', () => {
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        updateSlider(currentSlideIndex);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => updateSlider(index));
    });

    // Auto Play Carousel
    let autoPlay = setInterval(() => {
        nextBtn.click();
    }, 5000);

    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => {
            nextBtn.click();
        }, 5000);
    });

    // Button Ripple Effect
    const rippleButtons = document.querySelectorAll('.ripple');
    rippleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const x = e.clientX - e.target.offsetLeft;
            const y = e.clientY - e.target.offsetTop;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add To Cart Animation (UI Only)
    const cartBtns = document.querySelectorAll('.add-to-cart');
    cartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btn.innerHTML = 'Adding...';
            btn.style.backgroundColor = 'var(--dark-forest)';
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Added';
                setTimeout(() => {
                    btn.innerHTML = 'Add to Cart';
                    btn.style.backgroundColor = 'var(--fresh-green)';
                }, 2000);
            }, 800);
        });
    });

    // Hero Parallax Effect
    const heroBg = document.querySelector('.hero-bg');
    window.addEventListener('scroll', () => {
        const scroll = window.scrollY;
        heroBg.style.transform = `scale(${1.1 + scroll * 0.0001}) translateY(${scroll * 0.2}px)`;
    });

    // Scroll Navigation Highlight
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });
});
