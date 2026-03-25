async function loadComponent(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

async function init() {
  await loadComponent("nav", "./src/components/nav.html");
  await loadComponent("hero", "./src/components/hero.html");
  await loadComponent("about", "./src/components/about.html");
  await loadComponent("accommodation", "./src/components/accommodation.html");
  await loadComponent("gallery", "./src/components/gallery.html");
  await loadComponent("testimonials", "./src/components/testimonials.html");
  await loadComponent("contact", "./src/components/contact.html");
  await loadComponent("footer", "./src/components/footer.html");

  // 🚨 RUN ORIGINAL CODE ONLY AFTER COMPONENTS LOAD
  runApp();
}

init();

function runApp() {

  // Default config
  const defaultConfig = {
    hero_title: 'La Vue',
    hero_subtitle: 'Port Shepstone',
    hero_tagline: 'Where the ocean meets quiet luxury',
    about_heading: 'A Coastal Sanctuary',
    about_text: 'Perched along the KwaZulu-Natal South Coast, La Vue offers a serene escape where dramatic ocean views meet understated elegance. Every detail has been considered to create an atmosphere of calm refinement — from the carefully curated interiors to the uninterrupted panorama of the Indian Ocean.',
    accommodation_heading: 'The Experience',
    contact_heading: 'Begin Your Stay',
    contact_email: 'lavue.portshepstone@gmail.com',
    contact_phone: '+27 76 163 2064',
    background_color: '#FAF8F5',
    surface_color: '#FFFFFF',
    text_color: '#1A1A1A',
    primary_action_color: '#C9A96E',
    secondary_action_color: '#A89F94',
    font_family: 'Playfair Display',
    font_size: 16
  };

  // Element SDK
  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange: async (config) => {
        const c = { ...defaultConfig, ...config };

        // Text updates
        document.getElementById('hero-title').textContent = c.hero_title;
        document.getElementById('hero-subtitle').textContent = c.hero_subtitle;
        document.getElementById('hero-tagline').textContent = c.hero_tagline;
        document.getElementById('about-heading').textContent = c.about_heading;
        document.getElementById('about-text').textContent = c.about_text;
        document.getElementById('accommodation-heading').textContent = c.accommodation_heading;
        document.getElementById('contact-heading').textContent = c.contact_heading;
        document.getElementById('contact-email-display').textContent = c.contact_email;
        document.getElementById('contact-phone-display').textContent = c.contact_phone;

        // Colors
        document.getElementById('app-root').style.backgroundColor = c.background_color;
        document.querySelectorAll('.feature-card').forEach(el => el.style.backgroundColor = c.surface_color);
        document.querySelectorAll('.font-serif-display').forEach(el => {
          if (!el.closest('.quote-mark') && !el.closest('footer')) {
            el.style.color = c.text_color;
          }
        });
        document.querySelectorAll('.thin-divider').forEach(el => el.style.backgroundColor = c.primary_action_color);
        document.querySelectorAll('[style*="color: #C9A96E"], [style*="color:#C9A96E"]').forEach(el => {
          if (el.tagName !== 'I') el.style.color = c.primary_action_color;
        });

        // Fonts
        const serifStack = `${c.font_family}, Georgia, serif`;
        document.querySelectorAll('.font-serif-display').forEach(el => el.style.fontFamily = serifStack);

        // Font size
        const base = c.font_size || 16;
        document.querySelectorAll('.font-serif-body').forEach(el => {
          const current = parseFloat(getComputedStyle(el).fontSize);
          if (current > 18) el.style.fontSize = `${base * 1.35}px`;
          else el.style.fontSize = `${base}px`;
        });
      },
      mapToCapabilities: (config) => {
        const c = { ...defaultConfig, ...config };
        return {
          recolorables: [
            { get: () => c.background_color, set: (v) => { c.background_color = v; window.elementSdk.setConfig({ background_color: v }); } },
            { get: () => c.surface_color, set: (v) => { c.surface_color = v; window.elementSdk.setConfig({ surface_color: v }); } },
            { get: () => c.text_color, set: (v) => { c.text_color = v; window.elementSdk.setConfig({ text_color: v }); } },
            { get: () => c.primary_action_color, set: (v) => { c.primary_action_color = v; window.elementSdk.setConfig({ primary_action_color: v }); } },
            { get: () => c.secondary_action_color, set: (v) => { c.secondary_action_color = v; window.elementSdk.setConfig({ secondary_action_color: v }); } }
          ],
          borderables: [],
          fontEditable: {
            get: () => c.font_family,
            set: (v) => { c.font_family = v; window.elementSdk.setConfig({ font_family: v }); }
          },
          fontSizeable: {
            get: () => c.font_size,
            set: (v) => { c.font_size = v; window.elementSdk.setConfig({ font_size: v }); }
          }
        };
      },
      mapToEditPanelValues: (config) => {
        const c = { ...defaultConfig, ...config };
        return new Map([
          ['hero_title', c.hero_title],
          ['hero_subtitle', c.hero_subtitle],
          ['hero_tagline', c.hero_tagline],
          ['about_heading', c.about_heading],
          ['about_text', c.about_text],
          ['accommodation_heading', c.accommodation_heading],
          ['contact_heading', c.contact_heading],
          ['contact_email', c.contact_email],
          ['contact_phone', c.contact_phone]
        ]);
      }
    });
  }

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Mobile nav
  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('mobile-nav').classList.add('open');
  });
  document.getElementById('menu-close').addEventListener('click', () => {
    document.getElementById('mobile-nav').classList.remove('open');
  });
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mobile-nav').classList.remove('open');
    });
  });

  // Form
  document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.querySelector('span:first-child').innerHTML;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('span:first-child').innerHTML = '<i data-lucide="loader" style="width:14px;height:14px;animation:spin 1s linear infinite;"></i> Sending...';
    lucide.createIcons();
    
    const formData = {
      name: document.getElementById('cf-name').value,
      email: document.getElementById('cf-email').value,
      dates: document.getElementById('cf-dates').value,
      message: document.getElementById('cf-message').value
    };
    
    try {
      // Send via Formspree to lavue.portshepstone@gmail.com
      const response = await fetch('https://formspree.io/f/mdokqnpv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          dates: formData.dates,
          message: formData.message,
          _replyto: formData.email
        })
      });
      
      if (response.ok) {
        document.getElementById('form-success').classList.remove('hidden');
        e.target.reset();
        setTimeout(() => document.getElementById('form-success').classList.add('hidden'), 4000);
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      console.error('Error sending form:', error);
      // Show error message
      const successDiv = document.getElementById('form-success');
      successDiv.innerHTML = '<div class="flex items-start gap-4"><i data-lucide="alert-circle" style="width:18px;height:18px;color:#C9A96E;flex-shrink:0;margin-top:2px;"></i><div><p class="font-sans-body text-sm font-medium" style="color: #C9A96E; letter-spacing: 0.05em;">Unable to Send</p><p class="font-serif-body text-sm mt-1" style="color: #A89F94; font-weight: 300; line-height: 1.5;">Please try again or contact us directly.</p></div></div>';
      successDiv.classList.remove('hidden');
      lucide.createIcons();
      setTimeout(() => successDiv.classList.add('hidden'), 4000);
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('span:first-child').innerHTML = originalText;
      lucide.createIcons();
    }
  });

  // Submit button hover effect
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('mouseenter', function() {
      const bgSpan = this.querySelector('span:last-child');
      bgSpan.style.transform = 'scaleX(1)';
      const textSpan = this.querySelector('span:first-child');
      textSpan.style.color = '#1A1A1A';
      const arrow = textSpan.querySelector('i');
      if (arrow) arrow.style.transform = 'translateX(4px)';
    });
    submitBtn.addEventListener('mouseleave', function() {
      const bgSpan = this.querySelector('span:last-child');
      bgSpan.style.transform = 'scaleX(0)';
      const textSpan = this.querySelector('span:first-child');
      textSpan.style.color = '#FAF8F5';
      const arrow = textSpan.querySelector('i');
      if (arrow) arrow.style.transform = 'translateX(0)';
    });
  }

  // Book Now button hover effect
  const heroCtaBtn = document.getElementById('hero-cta');
  if (heroCtaBtn) {
    heroCtaBtn.addEventListener('mouseenter', function() {
      const bgSpan = this.querySelector('span:last-child');
      bgSpan.style.transform = 'scaleX(1)';
      const textSpan = this.querySelector('span:first-child');
      textSpan.style.color = '#FAF8F5';
    });
    heroCtaBtn.addEventListener('mouseleave', function() {
      const bgSpan = this.querySelector('span:last-child');
      bgSpan.style.transform = 'scaleX(0)';
      const textSpan = this.querySelector('span:first-child');
      textSpan.style.color = '#C9A96E';
    });
  }

  // Init icons
  lucide.createIcons();

  (function(){
    function c(){
      var b=a.contentDocument||a.contentWindow.document;if(b){
        var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9e186bf7e18c0382',t:'MTc3NDM4NDEwMS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
        b.getElementsByTagName('head')[0].appendChild(d)}
      }
      if(document.body){
        var a=document.createElement('iframe');
        a.height=1;
        a.width=1;
        a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';
        a.style.visibility='hidden';document.body.appendChild(a);
        if('loading'!==document.readyState)c();
        else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);
        else{var e=document.onreadystatechange||function(){};
        document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();
}