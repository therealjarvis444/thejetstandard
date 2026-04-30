/**
 * THE JET STANDARD - Landing Page JavaScript
 * Minimal, performant, accessibility-focused
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    const faqItems = document.querySelectorAll('.faq-item');
    const fadeElements = document.querySelectorAll('.fade-in');

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            this.classList.toggle('active');
            const label = isExpanded ? 'Open menu' : 'Close menu';
            this.setAttribute('aria-label', label);
        });
    }

    // ============================================
    // Navbar Scroll Effect
    // ============================================
    let lastScrollY = window.scrollY;
    const scrollThreshold = 100;

    function handleScroll() {
        const currentScrollY = window.scrollY;
        if (currentScrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScrollY = currentScrollY;
    }

    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // ============================================
    // FAQ Accordion
    // ============================================
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            faqItems.forEach(function(otherItem) {
                const otherQuestion = otherItem.querySelector('.faq-question');
                if (otherItem !== item) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherItem.classList.remove('active');
                }
            });
            this.setAttribute('aria-expanded', !isExpanded);
            item.classList.toggle('active');
        });
    });

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    if ('IntersectionObserver' in window && fadeElements.length > 0) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(function(el) { observer.observe(el); });
    } else {
        fadeElements.forEach(function(el) { el.classList.add('visible'); });
    }

    // ============================================
    // Email Capture Popup (Triggers on ALL Affiliate Links + Pricing Guide Button)
    // ============================================
    const emailCapturePopup = document.getElementById('email-capture-popup');
    const popupClose = document.querySelector('.popup-close');
    const popupDecline = document.getElementById('popup-decline');
    const popupEmailForm = document.getElementById('popup-email-form');
    const pricingGuideTrigger = document.getElementById('pricing-guide-trigger');
    const villiersLinks = document.querySelectorAll('a[href*="villiers.ai/?id=G2YINT"]');
    
    let popupShown = false;
    let pendingRedirect = null;
    let isPricingGuideFlow = false;
    
    function showPopup(redirectUrl, isPricingGuide = false) {
        // Only show once per session
        if (popupShown || sessionStorage.getItem('email-popup-shown') === 'true') {
            // Already shown, redirect directly
            if (redirectUrl) {
                window.open(redirectUrl, '_blank');
            }
            return;
        }
        
        popupShown = true;
        sessionStorage.setItem('email-popup-shown', 'true');
        pendingRedirect = redirectUrl;
        isPricingGuideFlow = isPricingGuide;
        
        if (emailCapturePopup) {
            emailCapturePopup.classList.add('show');
            trackEvent('email_popup_shown', { event_category: 'engagement', value: 1 });
        }
    }
    
    function hidePopup() {
        if (emailCapturePopup) {
            emailCapturePopup.classList.remove('show');
        }
    }
    
    // Pricing guide button trigger
    if (pricingGuideTrigger) {
        pricingGuideTrigger.addEventListener('click', function() {
            showPopup('https://villiers.ai/?id=G2YINT', true);
        });
    }
    
    // Pricing guide button triggers (both buttons)
    const pricingGuideTriggerMain = document.getElementById('pricing-guide-trigger-main');
    const pricingGuideTriggerPopup = document.getElementById('pricing-guide-trigger-popup');
    const pricingGuideTriggerBottom = document.getElementById('pricing-guide-trigger');
    
    if (pricingGuideTriggerMain) {
        pricingGuideTriggerMain.addEventListener('click', function(e) {
            e.preventDefault();
            showPopup('https://villiers.ai/?id=G2YINT', true);
        });
    }
    
    if (pricingGuideTriggerPopup) {
        pricingGuideTriggerPopup.addEventListener('click', function(e) {
            e.preventDefault();
            showPopup('https://villiers.ai/?id=G2YINT', true);
        });
    }
    
    if (pricingGuideTriggerBottom) {
        pricingGuideTriggerBottom.addEventListener('click', function(e) {
            e.preventDefault();
            showPopup('https://villiers.ai/?id=G2YINT', true);
        });
    }
    
    // Intercept all Villiers affiliate links
    villiersLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.href;
            showPopup(href, false);
        });
    });
    
    // Close handlers
    if (popupClose) {
        popupClose.addEventListener('click', function() {
            hidePopup();
            // Redirect if pending
            if (pendingRedirect) {
                window.open(pendingRedirect, '_blank');
                pendingRedirect = null;
            }
        });
    }
    
    if (popupDecline) {
        popupDecline.addEventListener('click', function() {
            hidePopup();
            trackEvent('email_popup_declined', { event_category: 'engagement', value: 1 });
            // Redirect if pending
            if (pendingRedirect) {
                window.open(pendingRedirect, '_blank');
                pendingRedirect = null;
            }
        });
    }
    
    // Close on overlay click
    if (emailCapturePopup) {
        emailCapturePopup.addEventListener('click', function(e) {
            if (e.target === emailCapturePopup || e.target.classList.contains('popup-overlay')) {
                hidePopup();
                if (pendingRedirect) {
                    window.open(pendingRedirect, '_blank');
                    pendingRedirect = null;
                }
            }
        });
    }
    
    // Form submission
    if (popupEmailForm) {
        popupEmailForm.addEventListener('submit', function(e) {
            e.preventDefault();
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
            
            // Here you would integrate with your ESP (ConvertKit, HubSpot, etc.)
            // to send the welcome email with pricing guide link
            // For now, we'll redirect to Villiers
            
            if (isPricingGuideFlow) {
                // Show success message with pricing guide download
                const formContainer = popupEmailForm.parentElement;
                formContainer.innerHTML = `
                    <div class="form-success">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-success); margin: 0 auto 1rem;">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <h3>You're In!</h3>
                        <p style="margin-bottom: 1.5rem;">Your pricing guide is on its way to <strong>${email}</strong>. Check your inbox!</p>
                        <p style="font-size: 0.875rem; color: var(--color-text-light); margin-bottom: 1.5rem;">Ready to get your free quote?</p>
                        <a href="https://villiers.ai/?id=G2YINT" class="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">
                            Get Your Free Quote
                        </a>
                    </div>
                `;
            } else {
                // Standard flow - just redirect
                if (pendingRedirect) {
                    window.open(pendingRedirect, '_blank');
                    pendingRedirect = null;
                }
                hidePopup();
            }
        });
    }

    // ============================================
    // Cookie Consent Banner
    // ============================================
    const cookieConsent = document.getElementById('cookie-consent');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieDecline = document.getElementById('cookie-decline');
    
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
    // Analytics Event Tracking
    // ============================================
    function trackEvent(eventName, eventData) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, eventData);
        }
        if (window.location.hostname === 'localhost') {
            console.log('Analytics Event:', eventName, eventData);
        }
    }

    document.querySelectorAll('[data-track-cta]').forEach(function(el) {
        el.addEventListener('click', function() {
            trackEvent('cta_click', {
                event_category: 'engagement',
                event_label: this.getAttribute('data-track-cta'),
                value: 1
            });
        });
    });

    document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
        link.addEventListener('click', function() {
            trackEvent('phone_click', {
                event_category: 'conversion',
                event_label: this.href.replace('tel:', ''),
                value: 1
            });
        });
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach(function(link) {
        link.addEventListener('click', function() {
            trackEvent('email_click', {
                event_category: 'conversion',
                event_label: this.href.replace('mailto:', ''),
                value: 1
            });
        });
    });

    // ============================================
    // Performance Metrics
    // ============================================
    if ('PerformanceObserver' in window) {
        try {
            const lcpObserver = new PerformanceObserver(function(entryList) {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                trackEvent('performance_lcp', {
                    event_category: 'performance',
                    value: Math.round(lastEntry.startTime)
                });
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {}

        try {
            const fidObserver = new PerformanceObserver(function(entryList) {
                const entries = entryList.getEntries();
                entries.forEach(function(entry) {
                    trackEvent('performance_fid', {
                        event_category: 'performance',
                        value: Math.round(entry.processingStart - entry.startTime)
                    });
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {}
    }

    // ============================================
    // Page Load Complete
    // ============================================
    window.addEventListener('load', function() {
        if (window.performance && window.performance.timing) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            trackEvent('page_load', { event_category: 'performance', value: loadTime });
        }
        document.body.classList.add('loaded');
    });

    // ============================================
    // Error Handling
    // ============================================
    window.addEventListener('error', function(e) {
        trackEvent('javascript_error', {
            event_category: 'error',
            event_label: e.message,
            value: e.filename + ':' + e.lineno
        });
    });

    console.log('The Jet Standard - Landing Page Loaded');

})();
