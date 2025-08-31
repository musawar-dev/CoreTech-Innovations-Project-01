// Shared JS for all pages: nav toggles, data-bg, back-to-top, service panel, contact form

/* helpers */
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

/* ----- Mobile nav toggle ----- */
const navToggle = $('.nav-toggle');
const navLinks = $('.nav-links');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
}

/* ----- Set background images from data-bg ----- */
document.querySelectorAll('[data-bg]').forEach(el => {
    const bg = el.getAttribute('data-bg');
    if (bg) el.style.backgroundImage = `url('${bg}')`;
});

/* ----- Back to top button ----- */
const backToTop = $('#backToTop');
if (backToTop) {
    const toggleVisibility = () => (backToTop.style.display = window.scrollY > 300 ? 'block' : 'none');
    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility();
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ----- Service data (full details) ----- */
const serviceData = {
    web: {
        title: 'Web Development',
        description: 'Custom websites & SaaS applications built with modern stacks. Responsive design, CMS integration, e-commerce and performance optimization.',
        projects: '200+',
        rating: '★★★★★',
        testimonials: [
            { name: 'Jennifer P.', text: 'CoreTech delivered our e-commerce site on time and with great quality.' },
            { name: 'David S.', text: 'Their architecture improved our performance drastically.' }
        ]
    },
    mobile: {
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile apps for iOS and Android, covering app design, development, and store deployment.',
        projects: '120+',
        rating: '★★★★☆',
        testimonials: [
            { name: 'Maria G.', text: 'The app exceeded expectations in UX and stability.' }
        ]
    },
    uiux: {
        title: 'UI/UX Design',
        description: 'User research, wireframing, prototyping and polished visual design to increase conversions.',
        projects: '140+',
        rating: '★★★★★',
        testimonials: [
            { name: 'Robert C.', text: 'Beautiful designs — customers loved the new interface.' }
        ]
    },
    cloud: {
        title: 'Cloud Solutions',
        description: 'AWS/Azure infrastructure, migrations, DevOps, CI/CD pipelines and observability.',
        projects: '90+',
        rating: '★★★★☆',
        testimonials: [
            { name: 'Operations Team', text: 'Our uptime and deployment speed improved a lot.' }
        ]
    },
    marketing: {
        title: 'Digital Marketing',
        description: 'SEO, PPC, social media and growth campaigns to increase traffic and conversions.',
        projects: '75+',
        rating: '★★★★☆',
        testimonials: [
            { name: 'SEO Client', text: 'Organic traffic growth was exceptional.' }
        ]
    },
    consulting: {
        title: 'IT Consulting',
        description: 'Technology audits, security assessments and strategic roadmaps aligned to business goals.',
        projects: '60+',
        rating: '★★★★★',
        testimonials: [
            { name: 'CTO Client', text: 'Strategic advice led to measurable improvements.' }
        ]
    }
};

/* ----- Slide-down service panel ----- */
const panel = $('#service-panel');

function openPanel(key) {
    const data = serviceData[key];
    if (!data || !panel) return;

    // Build testimonials HTML
    const tHTML = data.testimonials.map(t => `<blockquote class="muted">"${t.text}" — <strong>${t.name}</strong></blockquote>`).join('');

    panel.innerHTML = `
    <div class="container panel-inner">
      <div class="panel-meta">
        <div><strong>Projects Completed</strong><div>${data.projects}</div></div>
        <div style="margin-top:.6rem"><strong>Rating</strong><div>${data.rating}</div></div>
      </div>

      <div class="flow" style="flex:1">
        <h2 style="margin:0">${data.title}</h2>
        <p class="muted">${data.description}</p>
        <div>${tHTML}</div>
        <div class="panel-actions" style="margin-top:.6rem">
          <a class="btn btn-primary" href="contact.html#contact">Get Quote</a>
        </div>
      </div>
    </div>
  `;

    // Open animation: set height from 0 to scrollHeight
    panel.classList.add('open');
    panel.style.height = 'auto';
    const target = panel.scrollHeight + 'px';
    panel.style.height = '0px';
    requestAnimationFrame(() => (panel.style.height = target));
}

// close the panel smoothly
function closePanel() {
    if (!panel || !panel.classList.contains('open')) return;
    panel.style.height = panel.scrollHeight + 'px';
    requestAnimationFrame(() => {
        panel.style.height = '0px';
        setTimeout(() => {
            panel.classList.remove('open');
            panel.innerHTML = '';
        }, 350);
    });
}

/* open panel when clicking any .service-link in any menu (dropdown or cards) */
document.addEventListener('click', (e) => {
    const link = e.target.closest('.service-link');
    if (link) {
        e.preventDefault();
        const key = link.dataset.service;
        if (key) openPanel(key);
        // hide mobile nav if open
        navLinks?.classList.remove('open');
        return;
    }

    // clicking service preview cards (data-service-card)
    const card = e.target.closest('[data-service-card]');
    if (card) {
        const key = card.getAttribute('data-service-card');
        if (key) openPanel(key);
        return;
    }

    // click outside dropdown & panel => close panel
    const clickedInDropdown = !!e.target.closest('.dropdown');
    const clickedInPanel = !!e.target.closest('#service-panel');
    if (!clickedInDropdown && !clickedInPanel) closePanel();
});

// close panel on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
});

/* ----- make dropdown open on touch (mobile) by toggling .open class ----- */
document.querySelectorAll('.drop-trigger').forEach(btn => {
    btn.addEventListener('click', (ev) => {
        const parent = btn.parentElement;
        if (parent.classList.contains('open')) parent.classList.remove('open');
        else parent.classList.add('open');
    });
});

/* ----- Contact form validation (global) ----- */
const contactForm = $('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('#name')?.value.trim();
        const email = $('#email')?.value.trim();
        const message = $('#message')?.value.trim();
        const errorBox = $('#formError');

        if (!name || !email || !message) {
            if (errorBox) errorBox.textContent = '⚠️ Please fill in Name, Email, and Message before submitting.';
            setTimeout(() => { if (errorBox) errorBox.textContent = ''; }, 5000);
            return;
        }

        // simple email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            if (errorBox) errorBox.textContent = '⚠️ Please enter a valid email address.';
            setTimeout(() => { if (errorBox) errorBox.textContent = ''; }, 5000);
            return;
        }

        // success (frontend only)
        alert('✅ Thank you — your message has been recorded (frontend demo).');
        contactForm.reset();
    });
}

/* ----- If page loaded with hash #contact, scroll the contact section into view ----- */
window.addEventListener('load', () => {
    if (location.hash === '#contact') {
        const el = document.getElementById('contact');
        if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    }
});
