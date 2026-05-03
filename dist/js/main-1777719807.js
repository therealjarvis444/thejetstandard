/**
 * THE JET STANDARD - Landing Page JavaScript
 * Minimal, performant, accessibility-focused
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
    
    // Email Capture Popup
    const emailCapturePopup = document.getElementById('email-capture-popup');
    const popupClose = document.querySelector('.popup-close');
    const popupDecline = document.getElementById('popup-decline');
    const popupEmailForm = document.getElementById('popup-email-form');
    let pendingRedirect = null;
    let isPricingGuideFlow = false;

    // ============================================
    // Analytics Helper
    // ============================================
    function trackEvent(eventName, params) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
        if (typeof fbq === 'function') {
            fbq('track', eventName, params);
        }
    }

    // ============================================
    // Mobile Menu
    // ============================================
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    // Close mobile menu on link click
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('show');
            document.body.style.overflow = '';
        });
    });

    // ============================================
    // Email Capture Popup
    // ============================================
    function showPopup(redirectUrl, pricingGuideFlow) {
        if (emailCapturePopup) {
            emailCapturePopup.classList.add('show');
            trackEvent('email_popup_shown', { event_category: 'engagement', value: 1 });
            pendingRedirect = redirectUrl;
            isPricingGuideFlow = pricingGuideFlow || false;
        }
    }

    function hidePopup() {
        if (emailCapturePopup) {
            emailCapturePopup.classList.remove('show');
        }
    }

    // Hook all affiliate links to show popup
    const affiliateLink = 'https://villiers.ai/?id=G2YINT';
    
    // Hero CTA buttons
    const heroCTAs = document.querySelectorAll('#hero-cta-primary, #hero-cta-secondary');
    heroCTAs.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showPopup(affiliateLink);
        });
    });

    // Pricing guide triggers
    const pricingGuideTriggers = document.querySelectorAll('[id*="pricing-guide-trigger"]');
    pricingGuideTriggers.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showPopup(affiliateLink, true);
        });
    });

    // All other affiliate links
    document.querySelectorAll('a[href*="villiers.ai"]').forEach(function(link) {
        // Skip if it's a direct PDF download
        if (link.getAttribute('download')) return;
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showPopup(link.href);
        });
    });

    // ============================================
    // POPUP EVENT LISTENERS
    // ============================================

    // X button - JUST CLOSE, NO REDIRECT
    if (popupClose) {
        popupClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            pendingRedirect = null; // Clear redirect
            isPricingGuideFlow = false;
            hidePopup();
            trackEvent('email_popup_closed_x', { event_category: 'engagement', value: 1 });
        });
    }

    // Decline button - close AND redirect
    if (popupDecline) {
        popupDecline.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            trackEvent('email_popup_declined', { event_category: 'engagement', value: 1 });
            const redirect = pendingRedirect;
            pendingRedirect = null;
            isPricingGuideFlow = false;
            hidePopup();
            if (redirect) {
                window.open(redirect, '_blank');
            }
        });
    }

    // Click outside - just close, NO REDIRECT
    if (emailCapturePopup) {
        emailCapturePopup.addEventListener('click', function(e) {
            if (e.target === emailCapturePopup || e.target.classList.contains('popup-overlay')) {
                pendingRedirect = null; // Clear redirect
                isPricingGuideFlow = false;
                hidePopup();
            }
        });
    }

    // Escape key - just close, NO REDIRECT
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && emailCapturePopup && emailCapturePopup.classList.contains('show')) {
            pendingRedirect = null;
            isPricingGuideFlow = false;
            hidePopup();
        }
    });

    // Form submission
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
            // ============================================
            // Email Engine Integration
            // Website form → Email Engine → SendGrid
            // ============================================
            
            const firstName = name.split(' ')[0] || '';
            const lastName = name.split(' ').slice(1).join(' ') || '';
            
            fetch('https://ag-nc.co/api/v1/webhooks/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    first_name: firstName,
                    last_name: lastName,
                    campaign_id: 'aa6911d0-c43f-43ec-9829-23b193987b4f',
                    utm_source: 'website',
                    utm_medium: 'popup_form'
                })
            })
            .then(function(response) {
                if (!response.ok) {
                    console.error('Email engine error:', response.status);
                    throw new Error('Email capture failed: ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                console.log('Email engine success:', data);
            })
            .catch(function(err) {
                console.error('Email engine error:', err.message);
            });
            // End of email engine integration

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
    // Smooth Scroll
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-in').forEach(function(el) {
        observer.observe(el);
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
    // Performance: Passive Event Listeners
    // ============================================
    // Mark touch events as passive for better scroll performance
    let supportsPassive = false;
    try {
        const opts = Object.defineProperty({}, 'passive', {
            get: function() {
                supportsPassive = true;
                return true;
            }
        });
        window.addEventListener('test', null, opts);
        window.removeEventListener('test', null, opts);
    } catch (e) {
        supportsPassive = false;
    }

    // ============================================
    // Console Welcome Message
    // ============================================
    console.log('%c✈️ The Jet Standard', 'font-size: 24px; font-weight: bold; color: #D4AF37;');
    console.log('%cPrivate Jet Charter Landing Page', 'font-size: 14px; color: #666;');

})();
