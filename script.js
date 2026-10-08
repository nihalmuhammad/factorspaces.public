// Progressive enhancements: the full site remains readable without JavaScript.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const markets = ['the UAE', 'Saudi Arabia', 'Bahrain', 'Kuwait', 'Oman'];
const countryName = document.querySelector('#market-name');
const toggle = document.querySelector('#market-toggle');
let activeMarket = 0;
let paused = false;
let rotation;

function selectMarket(index) {
  activeMarket = index;
  countryName.textContent = markets[index];
  if (!motionPreference.matches) {
    countryName.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 350 });
  }
}
function updateRotation() {
  clearInterval(rotation);
  toggle.textContent = paused ? '▶' : 'Ⅱ';
  toggle.setAttribute('aria-label', paused ? 'Resume country rotation' : 'Pause country rotation');
  document.querySelector('.market-controls').hidden = motionPreference.matches;
  if (!paused && !motionPreference.matches && !document.hidden) {
    rotation = setInterval(() => selectMarket((activeMarket + 1) % markets.length), 3500);
  }
}
toggle.addEventListener('click', () => { paused = !paused; updateRotation(); });
document.addEventListener('visibilitychange', updateRotation);
motionPreference.addEventListener('change', updateRotation);
updateRotation();

// A restrained pointer response gives the cube a little depth.
const art = document.querySelector('.hero-art');
const cube = document.querySelector('.art-center');
art.addEventListener('pointermove', event => {
  if (motionPreference.matches || event.pointerType !== 'mouse') return;
  const box = art.getBoundingClientRect();
  const x = (event.clientX - box.left) / box.width - 0.5;
  const y = (event.clientY - box.top) / box.height - 0.5;
  cube.style.transform = `translate(${x * 12}px, ${y * 12}px) rotate(${x * 8}deg)`;
});
function resetCube() { cube.style.transform = ''; }
art.addEventListener('pointerleave', resetCube);
motionPreference.addEventListener('change', () => {
  resetCube();
  if (motionPreference.matches) document.getAnimations().forEach(animation => animation.cancel());
});

// Animate once on entry, without hiding content or depending on JS for visibility.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!motionPreference.matches) {
        entry.target.animate([{ transform: 'translateY(18px)', opacity: 0.65 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 550, easing: 'ease-out' });
      }
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.product-card, .service-card, .about-copy').forEach(card => observer.observe(card));
}

// Set a verified form endpoint before enabling live delivery.

const contactDialog = document.querySelector('#contact-dialog');
const enquiryForm = document.querySelector('#enquiry-form');
const formStatus = document.querySelector('#form-status');
const submitButton = enquiryForm.querySelector('[type="submit"]');

if (typeof contactDialog.showModal === 'function') {
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    if (contactDialog.contains(link)) return;
    link.addEventListener('click', event => {
      event.preventDefault();
      const subject = new URL(link.href).searchParams.get('subject') || '';
      const mappings = [['FactorPOS','FactorPOS pilot'], ['Signage','Dunch Signage setup'], ['Dunch','Dunch menu setup'], ['WhatsApp','WhatsApp Business optimisation'], ['Google','Google Business Profile optimisation'], ['UGC','UGC creator campaign'], ['Prototype','Prototype design and production']];
      enquiryForm.elements.service.value = mappings.find(([key]) => subject.includes(key))?.[1] || 'General enquiry';
      contactDialog.showModal();
    });
  });
  contactDialog.querySelector('.dialog-close').addEventListener('click', () => contactDialog.close());
}
enquiryForm.addEventListener('submit', () => {
  enquiryForm.elements._subject.value = `FactorSpaces enquiry: ${enquiryForm.elements.service.value}`;
  submitButton.textContent = 'Continuing…';
});
window.addEventListener('pageshow', () => { submitButton.textContent = 'Send enquiry'; });
