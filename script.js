document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    initSmoothScroll();
    
    // Contact form submission
    initContactForm();
    
    // Navbar active state
    initNavbarActive();
    
    // Animate elements on scroll
    initScrollAnimations();
    
    // Profile image upload/preview handler (client-side, persisted to localStorage)
    initProfileImageHandler();
});
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}
function initContactForm() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                alert('Please fill out all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset form
            form.reset();
        });
    }
}

function initNavbarActive() {
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe skill cards and project cards
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .info-item');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}
function initScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.classList.add('scroll-to-top');
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;
        font-size: 1.2rem;
    `;
    
    document.body.appendChild(scrollButton);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'flex';
        } else {
            scrollButton.style.display = 'none';
        }
    });
    
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    scrollButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// Initialize scroll to top button when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollToTop);

console.log('%cWelcome to Jerold L. Misal\'s Portfolio!', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%cFeel free to explore and get in touch!', 'color: #764ba2; font-size: 14px;');

/* -----------------------------
   Profile image upload handler
   - Allows selecting an image via the hidden file input
   - Previews it in both pages (index/profile)
   - Persists the image as a data URL in localStorage so it survives reloads
   Note: This is client-side only; selecting an image does not add it to the project folder.
   ----------------------------- */
function initProfileImageHandler() {
    try {
        const inputs = document.querySelectorAll('.profile-image-input');
        const buttons = document.querySelectorAll('.change-photo-btn');

        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Prefer input within same controls container
                const container = btn.closest('.profile-photo-controls');
                let input = container ? container.querySelector('.profile-image-input') : null;
                if (!input) input = document.querySelector('.profile-image-input');
                if (input) input.click();
            });
        });

        inputs.forEach(input => {
            input.addEventListener('change', function(e) {
                const file = this.files && this.files[0];
                if (!file) return;
                if (!file.type.startsWith('image/')) {
                    alert('Please select an image file.');
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(ev) {
                    const dataUrl = ev.target.result;
                    applyProfileImage(dataUrl);
                    try { localStorage.setItem('profileImageDataUrl', dataUrl); } catch (err) { console.warn('localStorage unavailable:', err); }
                };
                reader.readAsDataURL(file);
            });
        });

        // load stored image if present
        const stored = localStorage.getItem('profileImageDataUrl');
        if (stored) applyProfileImage(stored);
    } catch (err) {
        console.error('Error initializing profile image handler', err);
    }
}

function applyProfileImage(dataUrl) {
    // index page <img>
    const img = document.querySelector('.profile-img');
    if (img) img.src = dataUrl;

    // profile page avatar (background-image)
    const avatar = document.querySelector('.profile-avatar');
    if (avatar) avatar.style.backgroundImage = `url('${dataUrl}')`;
}
