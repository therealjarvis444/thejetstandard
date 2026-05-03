/**
 * THE JET STANDARD - Landing Page JavaScript
 * Minimal, performant, accessibility-focused
 * 
 * PATCHED: 2026-05-02 — Added MCS webhook integration
 * Webhook endpoint: /api/webhooks/subscribe
 * Auto-enrolls subscribers and triggers welcome email
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const cookieConsent = document.getElementById('cookie-consent');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieDecline = document.getElementById('cookie-decline');
    const emailCapturePopup = document.getElementById('email-capture-popup');
    const popupEmailForm = document.getElementById('popup-email-form');
    const popupClose = document.getElementById('popup-close');
    const popupDecline = document.getElementById('popup-decline');

    // Affiliate links that trigger popup
    const affiliateLink = 'https://villiers.ai/?id=G2YINT';
    let isPricingGuideFlow = false;
    let pendingRedirect = null;

    // ============================================
    // Analytics Helper
    // ============================================
    function trackEvent(eventName, params) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
    }

    // ============================================
    // Mobile Menu
    // ============================================
    if (mobileMenuBtn && mobileMenu && mobileMenuClose) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
            trackEvent('mobile_menu_open', { event_category: 'navigation' });
        });

        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });

        mobileMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ============================================
    // Email Capture Popup
    // ============================================
    function showPopup(isGuideFlow, redirectUrl) {
        isPricingGuideFlow = isGuideFlow;
        pendingRedirect = redirectUrl || null;
        if (emailCapturePopup) {
            emailCapturePopup.classList.add('show');
            trackEvent('email_popup_shown', { event_category: 'engagement', value: 1 });
        }
    }

    function hidePopup() {
        if (emailCapturePopup) {
            emailCapturePopup.classList.remove('show');
            trackEvent('email_popup_closed_x', { event_category: 'engagement', value: 1 });
        }
    }

    // Show popup on affiliate link clicks
    document.querySelectorAll('a[href*="villiers.ai"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            if (!localStorage.getItem('email-captured')) {
                e.preventDefault();
                showPopup(false, link.href);
            }
        });
    });

    // Close popup
    if (popupClose) {
        popupClose.addEventListener('click', hidePopup);
    }

    if (popupDecline) {
        popupDecline.addEventListener('click', function() {
            hidePopup();
            trackEvent('email_popup_declined', { event_category: 'engagement', value: 1 });
        });
    }

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && emailCapturePopup && emailCapturePopup.classList.contains('show')) {
            hidePopup();
        }
    });

    // Close on overlay click
    if (emailCapturePopup) {
        emailCapturePopup.addEventListener('click', function(e) {
            if (e.target === emailCapturePopup || e.target.classList.contains('popup-overlay')) {
                hidePopup();
            }
        });
    }

    // ============================================
    // Form submission — with MCS webhook integration
    // ============================================
    if (popupEmailForm) {
        popupEmailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const name = document.getElementById('popup-name').value;
            const email = document.getElementById('popup-email').value;
            const consent = document.getElementById('popup-consent').checked;
            
            if (!consent) {
                alert('Please agree to the Privacy Policy and Terms of Service.');
                return;
            }

            // Track conversion
            trackEvent('email_popup_conversion', {
                event_category: 'conversion',
                event_label: 'email_capture',
                value: 1
            });

            // ============================================
            // Send to email engine webhook — auto-enroll + schedule welcome email
            // ============================================
            const firstName = name.split(' ')[0] || '';
            const lastName = name.split(' ').slice(1).join(' ') || '';

            fetch('https://ag-nc.co/api/v1/webhooks/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    first_name: firstName,
                    last_name: lastName,
                    campaign_id: 'aa6911d0-c43f-43ec-9829-23b193987b4f',
                    utm_source: 'website',
                    utm_medium: 'popup_form'
                })
            }).then(function(response) {
                if (!response.ok) {
                    console.error('Email engine webhook error:', response.status);
                }
                return response.json();
            }).then(function(data) {
                console.log('Email engine webhook success:', data);
            }).catch(function(err) {
                // Silently fail — don't block user experience
                console.error('Email engine webhook failed:', err);
            });

            const redirect = pendingRedirect;
            pendingRedirect = null;
            
            if (isPricingGuideFlow) {
                // Show success message
                const formContainer = popupEmailForm.parentElement;
                formContainer.innerHTML = `
                    <div class="form-success">
                        <h3>You're In!</h3>
                        <p>Your pricing guide is on its way to <strong>${email}</strong>. Check your inbox!</p>
                        <a href="${redirect || affiliateLink}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                            Get Your Free Quote
                        </a>
                    </div>
                `;
            } else {
                // Standard flow
                hidePopup();
                if (redirect) {
                    window.open(redirect, '_blank');
                }
            }
            isPricingGuideFlow = false;
            localStorage.setItem('email-captured', 'true');
        });
    }

    // ============================================
    // Cookie Consent Banner
    // ============================================
    function checkCookieConsent() {
        const hasConsent = localStorage.getItem('cookie-consent');
        if (!hasConsent && cookieConsent) {
            setTimeout(function() {
                cookieConsent.classList.add('show');
            }, 1000);
        }
    }

    if (cookieConsent && cookieAccept && cookieDecline) {
        checkCookieConsent();

        cookieAccept.addEventListener('click', function() {
            localStorage.setItem('cookie-consent', 'accepted');
            cookieConsent.classList.remove('show');
            trackEvent('cookie_consent', { event_category: 'consent', event_label: 'accepted', value: 1 });
            if (typeof gtag === 'function') {
                gtag('consent', 'update', { 'analytics_storage': 'granted' });
            }
        });

        cookieDecline.addEventListener('click', function() {
            localStorage.setItem('cookie-consent', 'declined');
            cookieConsent.classList.remove('show');
            trackEvent('cookie_consent', { event_category: 'consent', event_label: 'declined', value: 1 });
            if (typeof gtag === 'function') {
                gtag('consent', 'update', { 'analytics_storage': 'denied' });
            }
        });
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============================================
    // Lazy Loading Images
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    if ('IntersectionObserver' in window) {
        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(function(el) {
            revealObserver.observe(el);
        });
    }

    // ============================================
    // Performance: Preload critical resources
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Preload hero image if present
            const heroImg = document.querySelector('.hero-bg img');
            if (heroImg && heroImg.dataset.src) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.as = 'image';
                preloadLink.href = heroImg.dataset.src;
                document.head.appendChild(preloadLink);
            }
        });
    }

    // ============================================
    // Pricing Guide CTA Flow
    // ============================================
    document.querySelectorAll('[data-action="pricing-guide"]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (!localStorage.getItem('email-captured')) {
                showPopup(true, null);
            } else {
                window.open(affiliateLink, '_blank');
            }
        });
    });

})();
