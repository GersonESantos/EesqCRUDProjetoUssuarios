import { gsap } from 'gsap';

// Animation on Load
document.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline();

    tl.to('.glass-card', {
        duration: 1,
        y: 0,
        opacity: 1,
        ease: 'power3.out'
    })
        .from('.input-group', {
            duration: 0.8,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        }, '-=0.5')
        .from('.btn-submit', {
            duration: 0.5,
            y: 10,
            opacity: 0,
            ease: 'power2.out'
        }, '-=0.3');

    // Input Hover Effects
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input.parentElement, { scale: 1.02, duration: 0.3 });
        });
        input.addEventListener('blur', () => {
            gsap.to(input.parentElement, { scale: 1, duration: 0.3 });
        });
    });
});

// Form Submission
const form = document.getElementById('contactForm');
const statusMessage = document.getElementById('statusMessage');
const submitBtn = document.querySelector('.btn-submit');
const btnText = document.querySelector('.btn-text');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset Status
    statusMessage.textContent = '';
    statusMessage.className = 'status-message';

    // Loading State
    const originalText = btnText.textContent;
    btnText.textContent = 'Enviando...';
    gsap.to(submitBtn, { opacity: 0.8, pointerEvents: 'none' });

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:3000/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            statusMessage.textContent = '✅ ' + result.message;
            statusMessage.classList.add('success');
            form.reset();

            // Success Animation
            gsap.fromTo(statusMessage, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, ease: 'elastic.out' });
        } else {
            throw new Error(result.error || 'Erro ao enviar dados');
        }

    } catch (error) {
        statusMessage.textContent = '❌ ' + error.message;
        statusMessage.classList.add('error');

        // Error Shake Animation
        gsap.fromTo('.glass-card', { x: -10 }, { x: 10, duration: 0.1, repeat: 3, yoyo: true, clearProps: 'x' });
    } finally {
        // Reset Button
        btnText.textContent = originalText;
        gsap.to(submitBtn, { opacity: 1, pointerEvents: 'all' });
    }
});
