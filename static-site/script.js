/**
 * Presson Fitness Gym - Lightweight Vanilla JavaScript
 * - Sticky Header Scroll Shadow
 * - Mobile Navigation Toggle
 * - Single-Page Smooth Scroll Navigation & ScrollSpy
 * - Pre-select Membership Plan from Pricing Cards
 * - Form UX feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const membershipSelect = document.getElementById('membershipSelect');

  // 1. Mobile Menu Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.classList.toggle('is-active');
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('nav-active');
    });

    // Close menu when clicking any nav link
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('nav-active');
      });
    });
  }

  // 2. Header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // 3. Live Click & ScrollSpy Active Link Highlight
  const navSectionIds = ['home', 'about', 'rates', 'gallery', 'contact'];
  let scrollLockUntil = 0;

  const setActiveNav = (id) => {
    navLinks.forEach(link => {
      const isMatch = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isMatch);
      if (isMatch) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetId = (link.getAttribute('href') || '#home').replace('#', '');
      scrollLockUntil = Date.now() + 750;
      setActiveNav(targetId);
    });
  });

  const updateActiveOnScroll = () => {
    if (Date.now() < scrollLockUntil) return;

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40) {
      setActiveNav('contact');
      return;
    }

    const scrollPos = window.scrollY + 140;
    let currentId = 'home';
    navSectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && scrollPos >= el.offsetTop) {
        currentId = id;
      }
    });
    setActiveNav(currentId);
  };

  if (window.location.hash) {
    const hash = window.location.hash;
    if (hash === '#about' || hash === '#products') setActiveNav('about');
    else if (['#rates', '#join', '#facility', '#services'].includes(hash)) setActiveNav('rates');
    else if (hash === '#gallery' || hash === '#faq') setActiveNav('gallery');
    else if (hash === '#contact') setActiveNav('contact');
    else setActiveNav('home');
  } else {
    updateActiveOnScroll();
  }

  window.addEventListener('scroll', updateActiveOnScroll, { passive: true });

  // 4. Interactive Plan Selector: Pre-select plan in Form A when clicking pricing card
  const planButtons = document.querySelectorAll('.tier-select-btn');
  planButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const plan = btn.getAttribute('data-plan');
      if (membershipSelect && plan) {
        membershipSelect.value = plan;
        // Visual indicator on the select element
        membershipSelect.style.borderColor = 'var(--gold)';
        membershipSelect.style.boxShadow = '0 0 12px rgba(201, 169, 106, 0.4)';
        setTimeout(() => {
          membershipSelect.style.boxShadow = '';
        }, 1500);

        const joinSection = document.getElementById('join');
        if (joinSection) {
          joinSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 5. Asynchronous Form Submission to carlvine0926@gmail.com
  const forms = document.querySelectorAll('form.styled-form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const feedbackDiv = form.querySelector('.form-feedback');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Details... ⏳';
      }

      if (feedbackDiv) {
        feedbackDiv.style.display = 'none';
        feedbackDiv.className = 'form-feedback';
      }

      try {
        const formData = new FormData(form);
        // FormSubmit requires /ajax/ endpoint for XMLHttpRequest / Fetch requests
        const ajaxUrl = form.action.includes('/ajax/')
          ? form.action
          : form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

        const response = await fetch(ajaxUrl, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        const data = await response.json().catch(() => null);

        if (response.ok && data && (data.success === 'true' || data.success === true)) {
          if (feedbackDiv) {
            feedbackDiv.style.display = 'flex';
            feedbackDiv.className = 'form-feedback success';
            feedbackDiv.innerHTML = '<strong>✓ Form sent successfully!</strong> Your submission has been delivered directly to <strong>carlvine0926@gmail.com</strong>. Coach will reach out via SMS or Phone Call shortly.';
          }
          form.reset();
        } else if (data && data.message) {
          if (feedbackDiv) {
            feedbackDiv.style.display = 'flex';
            feedbackDiv.className = 'form-feedback error';
            feedbackDiv.innerHTML = `<strong>Notice:</strong> ${data.message}`;
          }
        } else {
          // Fallback if service returns status error
          form.submit();
        }
      } catch (err) {
        console.error('Submission error:', err);
        // Fallback to standard HTTP POST if fetch fails
        form.submit();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  });

  // 6. Interactive Gallery Lightbox Modal
  const galleryTiles = Array.from(document.querySelectorAll('.gallery-tile[data-img]'));
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;

  function updateLightbox(index) {
    if (index < 0) index = galleryTiles.length - 1;
    if (index >= galleryTiles.length) index = 0;
    currentGalleryIndex = index;

    const tile = galleryTiles[currentGalleryIndex];
    const imgSrc = tile.getAttribute('data-img');
    const title = tile.getAttribute('data-title') || '';
    const desc = tile.getAttribute('data-desc') || '';

    if (lightboxImg) lightboxImg.src = imgSrc;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;
    if (lightboxCounter) lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${galleryTiles.length}`;
  }

  function openLightbox(index) {
    if (!lightbox) return;
    updateLightbox(index);
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryTiles.forEach((tile, idx) => {
    tile.addEventListener('click', () => openLightbox(idx));
    tile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightbox(currentGalleryIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightbox(currentGalleryIndex + 1);
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightbox(currentGalleryIndex - 1);
    if (e.key === 'ArrowRight') updateLightbox(currentGalleryIndex + 1);
  });

  // 7. Quick Search Modal
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchModalInput');
  const searchResults = document.getElementById('searchModalResults');
  const searchClose = document.getElementById('searchModalClose');
  const desktopSearchBtn = document.getElementById('desktopSearchBtn');
  const mobileSearchBtn = document.getElementById('mobileSearchBtn');

  const quickSearchItems = [
    { title: 'Daily Session Pass', detail: 'Regular ₱65 · Student/Senior ₱60 (Unlimited 8am–10pm)', href: '#rates' },
    { title: 'Monthly Membership', detail: 'Regular ₱750 · Student/Senior ₱700 (+ Wi-Fi & Treadmill)', href: '#rates' },
    { title: 'Quarterly & Annual Plans', detail: '3 Months from ₱1,900 · 12 Months from ₱7,100', href: '#rates' },
    { title: 'Fuel & Refreshments', detail: 'Energy Drinks, Hydration, Fresh Coffee', href: '#products' },
    { title: 'Parking Location', detail: 'Right beside the Sports Court · Court parking for cars & motorcycles', href: '#contact' },
    { title: 'Accepted Payment Methods', detail: 'Cash, GCash, Maya, Bank Transfer (Credit/Debit cards not accepted)', href: '#faq' },
    { title: 'Personal Training & Coaching', detail: '1-on-1 Coaching, Group Strength, Coach Jerwin 0927 066 0386', href: '#services' },
    { title: 'Gym Equipment & Floor', detail: 'Free Weights, Power Racks, Cables, Treadmills, Wi-Fi', href: '#facility' },
    { title: 'Facility Photo Gallery', detail: 'View inside the Quezon City gym floor', href: '#gallery' },
  ];

  const renderSearchResults = (query) => {
    if (!searchResults) return;
    const q = (query || '').trim().toLowerCase();
    const matches = quickSearchItems.filter(item =>
      !q || item.title.toLowerCase().includes(q) || item.detail.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      searchResults.innerHTML = '<p class="search-empty">No matches found. Try searching "rates", "parking", or "coffee".</p>';
      return;
    }

    searchResults.innerHTML = matches
      .map(item => `
        <a href="${item.href}" class="search-result-row">
          <strong>${item.title}</strong>
          <span>${item.detail}</span>
        </a>
      `)
      .join('');

    searchResults.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (searchModal) searchModal.style.display = 'none';
        const href = link.getAttribute('href') || '#home';
        scrollLockUntil = Date.now() + 750;
        if (href === '#about' || href === '#products') setActiveNav('about');
        else if (['#rates', '#join', '#facility', '#services'].includes(href)) setActiveNav('rates');
        else if (href === '#gallery' || href === '#faq') setActiveNav('gallery');
        else if (href === '#contact') setActiveNav('contact');
        else setActiveNav('home');
      });
    });
  };

  const openSearchModal = () => {
    if (!searchModal) return;
    searchModal.style.display = 'flex';
    if (searchInput) {
      searchInput.value = '';
      renderSearchResults('');
      setTimeout(() => searchInput.focus(), 40);
    }
  };

  const closeSearchModal = () => {
    if (searchModal) searchModal.style.display = 'none';
  };

  if (desktopSearchBtn) desktopSearchBtn.addEventListener('click', openSearchModal);
  if (mobileSearchBtn) mobileSearchBtn.addEventListener('click', openSearchModal);
  if (searchClose) searchClose.addEventListener('click', closeSearchModal);
  if (searchInput) {
    searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));
  }
  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearchModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal && searchModal.style.display === 'flex') {
      closeSearchModal();
    }
  });
});

