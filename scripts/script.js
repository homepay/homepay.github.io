const yearEl = document.getElementById('copyright-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

function setMobileMenu(open) {
    mobileMenu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

menuToggle.addEventListener('click', () => setMobileMenu(mobileMenu.hidden));

// Close mobile menu after picking a link, clicking outside or pressing Escape
mobileMenu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMobileMenu(false);
});

document.addEventListener('click', (e) => {
    if (!mobileMenu.hidden && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        setMobileMenu(false);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.hidden) setMobileMenu(false);
});

// How it works: shrink the wide flow diagrams to fit their box on tablets
const flowCanvases = document.querySelectorAll('.flow__canvas');

function fitFlows() {
    flowCanvases.forEach((canvas) => {
        // 1120 is the canvas width in style.css. On phones the box is hidden, so its width is 0.
        const width = canvas.parentElement.clientWidth;
        if (width) canvas.style.zoom = Math.min(1, width / 1120);
    });
}

fitFlows();
window.addEventListener('resize', fitFlows);

// Join Network Modal
const joinModal = document.getElementById('joinModal');

document.querySelectorAll('[data-join]').forEach((button) => {
    button.addEventListener('click', () => {
        setMobileMenu(false);
        joinModal.showModal();
    });
});

document.querySelectorAll('[data-close-join]').forEach((button) => {
    button.addEventListener('click', () => joinModal.close());
});

// Close modal on background click
joinModal.addEventListener('click', (e) => {
    if (e.target === joinModal) joinModal.close();
});

function showFormError(msg) {
    const el = document.getElementById('formError');
    el.textContent = msg;
    el.hidden = false;
    setTimeout(() => { el.hidden = true; }, 4000);
}

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxKY1JzGjHQ7KAONguw9IaTPPTbpn06QTzGCyamFk5orJAPez3JAActdnkovgoP-Hw/exec';
const SUBMIT_LABEL = 'Send';

document.getElementById('joinForm')
    .addEventListener('submit', async function (e) {
        e.preventDefault();

        const btn = document.getElementById('submitBtn');
        btn.textContent = 'Sending...';
        btn.disabled = true;

        const blockedDomains = [
            'gmail.com', 'yahoo.com', 'hotmail.com',
            'outlook.com', 'icloud.com', 'aol.com',
            'protonmail.com', 'mail.com', 'ymail.com',
            'live.com', 'msn.com', 'me.com'
        ];

        const emailValue = document.getElementById('formEmail').value;
        const emailDomain = emailValue.split('@')[1]?.toLowerCase();

        if (blockedDomains.includes(emailDomain)) {
            showFormError('Please use your company email address.');
            btn.textContent = SUBMIT_LABEL;
            btn.disabled = false;
            return;
        }

        // Get Turnstile token
        const turnstileToken = document.querySelector(
            '[name="cf-turnstile-response"]')?.value;

        if (!turnstileToken) {
            showFormError('Please complete the security check.');
            btn.textContent = SUBMIT_LABEL;
            btn.disabled = false;
            return;
        }

        const payload = {
            honeypot: document.getElementById('honeypot').value,
            joinAs: document.getElementById('joinAs').value,
            organization: document.getElementById('organization').value,
            website: document.getElementById('website').value,
            region: document.getElementById('region').value,
            email: document.getElementById('formEmail').value,
            description: document.getElementById('description').value,
            cfTurnstileResponse: turnstileToken
        };

        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            document.getElementById('joinForm').hidden = true;
            document.getElementById('joinSuccess').hidden = false;

        } catch (err) {
            btn.textContent = SUBMIT_LABEL;
            btn.disabled = false;
            showFormError('Something went wrong. Please try again.');
        }
    });
