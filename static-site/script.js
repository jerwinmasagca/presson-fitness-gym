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

  // 3. ScrollSpy / Active Link Highlight
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

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
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          if (feedbackDiv) {
            feedbackDiv.style.display = 'flex';
            feedbackDiv.className = 'form-feedback success';
            feedbackDiv.innerHTML = '<strong>✓ Form sent successfully!</strong> Your submission has been delivered directly to <strong>carlvine0926@gmail.com</strong>. Coach will reach out via SMS or Phone Call shortly.';
          }
          form.reset();
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
});

