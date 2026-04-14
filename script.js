// ===== Navigation Scroll Effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Hero Canvas Animation =====
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            alpha: Math.random() * 0.5 + 0.2
        });
    }
}

function animateParticles() {
    ctx.fillStyle = 'rgba(10, 14, 26, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.alpha})`;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach(p2 => {
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - dist / 150)})`;
                ctx.stroke();
            }
        });
    });

    animationId = requestAnimationFrame(animateParticles);
}

// Initialize canvas
resizeCanvas();
createParticles();
animateParticles();

window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
});

// ===== Pricing Toggle =====
const pricingToggle = document.getElementById('pricingToggle');
const onetimeLabel = document.getElementById('onetimeLabel');
const maintenanceLabel = document.getElementById('maintenanceLabel');
const prices = document.querySelectorAll('.price');

pricingToggle.addEventListener('change', () => {
    const isMaintenance = pricingToggle.checked;
    
    onetimeLabel.classList.toggle('active', !isMaintenance);
    maintenanceLabel.classList.toggle('active', isMaintenance);
    
    prices.forEach(price => {
        const onetime = price.dataset.onetime;
        const maintenance = price.dataset.maintenance;
        
        if (onetime && maintenance) {
            price.textContent = `$${isMaintenance ? maintenance : onetime}`;
        }
    });
});

// ===== Portfolio Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        
        // Filter cards
        portfolioCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ===== Portfolio Modal =====
const modal = document.getElementById('portfolioModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalStats = document.getElementById('modalStats');
const modalTags = document.getElementById('modalTags');

function openModal(title, description, tags, stats, image) {
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalImage.src = image;
    modalImage.alt = title;
    
    // Parse and display tags
    const tagList = tags.split(',').map(t => t.trim());
    modalTags.innerHTML = tagList.map(tag => `<span>${tag}</span>`).join('');
    
    // Parse and display stats
    const statList = stats.split(',').map(s => s.trim());
    modalStats.innerHTML = statList.map(stat => {
        const [key, value] = stat.split(':');
        return `
            <div>
                <div class="stat-value">${value.trim()}</div>
                <div class="stat-label">${key.trim()}</div>
            </div>
        `;
    }).join('');
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = `
        <div style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        Sending...
    `;
    submitBtn.disabled = true;
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success message
    contactForm.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
});

function resetForm() {
    contactForm.reset();
    contactForm.style.display = 'flex';
    successMessage.style.display = 'none';
}

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .pricing-card, .portfolio-card, .value-card, .process-step, .skill-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// ===== Skill Bar Animation =====
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillFills = entry.target.querySelectorAll('.skill-fill');
            skillFills.forEach(fill => {
                const width = fill.style.width;
                fill.style.width = '0';
                setTimeout(() => {
                    fill.style.width = width;
                }, 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const skillsCard = document.querySelector('.skills-card');
if (skillsCard) {
    skillObserver.observe(skillsCard);
}

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== Console Welcome Message =====
console.log('%c Welcome to WebDevPro! ', 'background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 10px;');
console.log('%c Looking for a web developer? Let\'s chat! ', 'color: #94a3b8; font-size: 14px;');
