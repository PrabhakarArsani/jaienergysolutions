// Jai Energy Solutions - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
  initHeader();
  initMobileMenu();
  initNavDropdown();
  initFAQ();
  initModals();
  initFloatingButtons();
  initScrollAnimations();
  initExitIntent();
  initDistrictDropdowns();
  initActiveNav();
  initHomepagePopup();
});

// Homepage enquiry popup after delay
function initHomepagePopup() {
  const isHomepage = window.location.pathname.endsWith('index.html') ||
    window.location.pathname.endsWith('/') ||
  !window.location.pathname.includes('.html');
  
  if (!isHomepage || !document.getElementById('enquiryModal')) return;
  
  const hasSubmitted = sessionStorage.getItem('enquirySubmitted');
  const hasShown = sessionStorage.getItem('homepagePopupShown');
  
  if (!hasSubmitted && !hasShown) {
    setTimeout(() => {
      openModal('enquiryModal');
      sessionStorage.setItem('homepagePopupShown', 'true');
    }, 4000);
  }
}

// Sticky Header
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Mobile Menu
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');
  
  if (!toggle || !menu) return;
  
  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
  });
  
  document.querySelectorAll('.nav-link:not(.nav-dropdown-toggle), .nav-sublink').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      toggle.classList.remove('active');
      document.querySelectorAll('.nav-dropdown').forEach(d => {
        d.classList.remove('open');
        d.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });
    });
  });
}

// Solutions dropdown (Residential / Commercial / Industrial)
function initNavDropdown() {
  document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth > 768) return;

      e.preventDefault();
      e.stopPropagation();
      const dropdown = toggle.closest('.nav-dropdown');
      const isOpen = dropdown.classList.contains('open');

      document.querySelectorAll('.nav-dropdown').forEach(d => {
        d.classList.remove('open');
        d.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        dropdown.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// FAQ Accordion
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// Modal System
function initModals() {
  const enquiryModal = document.getElementById('enquiryModal');
  
  document.querySelectorAll('[data-modal="enquiry"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('enquiryModal');
    });
  });
  
  document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el) {
        closeAllModals();
      }
    });
  });
  
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
}

// Floating Buttons — quote CTA uses data-modal via initModals
function initFloatingButtons() {
  const quoteBtn = document.querySelector('.quote-cta');
  if (quoteBtn && !quoteBtn.hasAttribute('data-modal')) {
    quoteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('enquiryModal');
    });
  }
}

// Scroll Animations
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach(el => observer.observe(el));
}

// Exit Intent Popup
function initExitIntent() {
  let shown = false;
  
  document.addEventListener('mouseout', (e) => {
    if (e.clientY < 10 && !shown && document.getElementById('enquiryModal')) {
      const hasSubmitted = sessionStorage.getItem('enquirySubmitted');
      if (!hasSubmitted) {
        shown = true;
        setTimeout(() => openModal('enquiryModal'), 500);
      }
    }
  });
}

// District & Mandal Dropdowns
function initDistrictDropdowns() {
  const stateSelects = document.querySelectorAll('[data-state-select]');
  
  stateSelects.forEach(stateSelect => {
    const form = stateSelect.closest('form');
    const districtSelect = form?.querySelector('[data-district-select]');
    const mandalSelect = form?.querySelector('[data-mandal-select]');
    
    if (!districtSelect) return;
    
    stateSelect.addEventListener('change', () => {
      populateDistricts(stateSelect.value, districtSelect);
      if (mandalSelect) {
        mandalSelect.innerHTML = '<option value="">Select Mandal</option>';
      }
    });
    
    if (mandalSelect) {
      districtSelect.addEventListener('change', () => {
        populateMandals(stateSelect.value, districtSelect.value, mandalSelect);
      });
    }
  });
}

function populateDistricts(state, selectElement) {
  selectElement.innerHTML = '<option value="">Select District</option>';
  
  if (!state || !STATE_DATA[state]) return;
  
  const districts = Object.keys(STATE_DATA[state].districts).sort();
  districts.forEach(district => {
    const option = document.createElement('option');
    option.value = district;
    option.textContent = district;
    selectElement.appendChild(option);
  });
}

function populateMandals(state, district, selectElement) {
  selectElement.innerHTML = '<option value="">Select Mandal</option>';
  
  if (!state || !district || !STATE_DATA[state]?.districts[district]) return;
  
  const mandals = STATE_DATA[state].districts[district].sort();
  mandals.forEach(mandal => {
    const option = document.createElement('option');
    option.value = mandal;
    option.textContent = mandal;
    selectElement.appendChild(option);
  });
}

// Active Navigation
function initActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const solutionPages = ['residential-solar.html', 'commercial-solar.html', 'industrial-solar.html'];
  
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  document.querySelectorAll('.nav-sublink').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
      const dropdown = link.closest('.nav-dropdown');
      if (dropdown) {
        dropdown.querySelector('.nav-dropdown-toggle')?.classList.add('active');
      }
    }
  });

  if (solutionPages.includes(currentPage)) {
    document.querySelector('.nav-dropdown-toggle')?.classList.add('active');
  }
}

const WHATSAPP_NUMBER = '918985977403';

function buildWhatsAppMessage(formType, data) {
  const labels = {
    name: 'Name',
    mobile: 'Mobile',
    email: 'Email',
    state: 'State',
    district: 'District',
    mandal: 'Mandal',
    property_type: 'Property Type',
    electricity_bill: 'Monthly Bill',
    message: 'Message',
    investment_capacity: 'Investment Capacity',
    experience: 'Experience'
  };

  let message = 'Hello Jai Energy Solutions,\n\nI would like to enquire about solar solutions.\n\n';
  message += `*Enquiry Type:* ${formType.replace(/-/g, ' ')}\n`;

  Object.entries(data).forEach(([key, value]) => {
    if (value) {
      message += `*${labels[key] || key.replace(/_/g, ' ')}:* ${value}\n`;
    }
  });

  return message;
}

// Form Submission Handler — redirects to WhatsApp
function handleFormSubmit(e, formType) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  sessionStorage.setItem('enquirySubmitted', 'true');

  const message = buildWhatsAppMessage(formType, data);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const modal = form.closest('.modal-overlay');
  if (modal) closeAllModals();

  window.open(whatsappUrl, '_blank');
}

// Savings Calculator
function calculateSavings() {
  const billAmount = parseFloat(document.getElementById('billAmount')?.value) || 0;
  const systemSize = parseFloat(document.getElementById('systemSize')?.value) || 3;
  
  const monthlyGeneration = systemSize * 120; // kWh per kW
  const tariffRate = 8; // Rs per unit
  const monthlySavings = Math.min(monthlyGeneration * tariffRate, billAmount);
  const yearlySavings = monthlySavings * 12;
  const paybackPeriod = (systemSize * 50000) / yearlySavings;
  
  const resultEl = document.getElementById('savingsResult');
  if (resultEl) {
    resultEl.innerHTML = `
      <h4>₹${yearlySavings.toLocaleString('en-IN')}/year</h4>
      <p>Estimated Annual Savings</p>
      <p style="margin-top: 12px; font-size: 0.9rem;">Payback Period: ~${paybackPeriod.toFixed(1)} years</p>
    `;
  }
}
