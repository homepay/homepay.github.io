AOS.init({ duration: 1000, once: true });

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('mobileMenu');
    const icon = document.querySelector('.menu-icon');
    if (!menu.contains(e.target) && !icon.contains(e.target) && menu.classList.contains('active')) {
        menu.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('typing-container');
    const badge = document.getElementById('success-badge');

    const codeSnippet = `{
  "txnNo": "CBTXXXXXXXX005",
  "sender": {
    "name": "ALBERT EINSTEIN",
    "amount": 100,
    "currency": "USD"
  },
  "recipient": {
    "name": "KAZI NAZRUL ISLAM",
    "accountNo": "123XXXXXXX077",
    "routingNo": "XXXXXXXXX",
    "amount": 10000,
    "currency": "BDT"
  }
}`;

    let index = 0;

    function typeCode() {
        if (index < codeSnippet.length) {
            container.textContent += codeSnippet.charAt(index);
            index++;
            setTimeout(typeCode, 10);
        } else {
            // Typing is done! Show the success badge
            badge.classList.remove('opacity-0');
            badge.classList.add('opacity-100');
        }
    }

    // Start typing after a short delay
    setTimeout(typeCode, 800);
});

// Join Network Modal
function showFormError(msg) {
    const el = document.getElementById('formError');
    el.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 4000);
}

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxKY1JzGjHQ7KAONguw9IaTPPTbpn06QTzGCyamFk5orJAPez3JAActdnkovgoP-Hw/exec';

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
            btn.textContent = 'Submit Interest';
            btn.disabled = false;
            return;
        }

        // Get Turnstile token
        const turnstileToken = document.querySelector(
            '[name="cf-turnstile-response"]')?.value;

        if (!turnstileToken) {
            showFormError('Please complete the security check.');
            btn.textContent = 'Submit Interest';
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

            document.getElementById('joinForm').classList.add('hidden');
            document.getElementById('joinSuccess').classList.remove('hidden');

        } catch (err) {
            btn.textContent = 'Submit Interest';
            btn.disabled = false;
            showFormError('Something went wrong. Please try again.');
        }
    });

// Close modal on background click
document.getElementById('joinModal')
    .addEventListener('click', function (e) {
        if (e.target === this)
            this.style.display = 'none';
    });