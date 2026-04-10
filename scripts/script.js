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