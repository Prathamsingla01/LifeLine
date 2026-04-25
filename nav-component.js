// ═══════════════════════════════════════════════════════════════
//  LifeLine — Shared Navigation Component
//  Auto-injects a consistent nav bar into every page
// ═══════════════════════════════════════════════════════════════

(function () {
  'use strict';

  const NAV_LINKS = [
    { href: 'index.html', label: 'Home', emoji: '🏠' },
    { href: 'lifeline.html', label: 'App Demo', emoji: '🚨' },
    { href: 'lifeline_accident_demo.html', label: 'Accident Flow', emoji: '🚗' },
    { href: 'hackathon-demo.html', label: 'Scenario Deck', emoji: '🎯' },
    { href: 'medical-profile.html', label: 'Medical Profile', emoji: '🩺' },
    { href: 'family-tracker.html', label: 'Family Tracker', emoji: '👨‍👩‍👧‍👦' },
    { href: 'architecture.html', label: 'Architecture', emoji: '⚙️' },
  ];

  // Determine which page is active
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  function buildNav() {
    const nav = document.createElement('nav');
    nav.className = 'll-global-nav';

    // Logo
    const logoLink = document.createElement('a');
    logoLink.className = 'll-nav-logo';
    logoLink.href = 'index.html';
    logoLink.innerHTML = `
      <div class="ll-nav-logo-icon">🛡</div>
      <span>LifeLine</span>
      <div class="ll-nav-pulse"></div>
    `;

    // Links
    const ul = document.createElement('ul');
    ul.className = 'll-nav-links';
    ul.id = 'll-nav-links';

    NAV_LINKS.forEach(link => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'll-nav-link';
      a.href = link.href;
      if (currentPage === link.href || (currentPage === '' && link.href === 'index.html')) {
        a.classList.add('active');
      }
      a.innerHTML = `<span class="nav-emoji">${link.emoji}</span>${link.label}`;
      li.appendChild(a);
      ul.appendChild(li);
    });

    // Hamburger
    const hamburger = document.createElement('button');
    hamburger.className = 'll-nav-hamburger';
    hamburger.setAttribute('aria-label', 'Toggle menu');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    hamburger.addEventListener('click', () => {
      ul.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    ul.addEventListener('click', (e) => {
      if (e.target.closest('.ll-nav-link')) {
        ul.classList.remove('open');
        hamburger.classList.remove('active');
      }
    });

    nav.appendChild(logoLink);
    nav.appendChild(ul);
    nav.appendChild(hamburger);

    return nav;
  }

  // Inject nav and add body class
  document.addEventListener('DOMContentLoaded', () => {
    const nav = buildNav();
    document.body.insertBefore(nav, document.body.firstChild);
    document.body.classList.add('has-ll-nav');
  });
})();
