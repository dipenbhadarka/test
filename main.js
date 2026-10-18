(function(){
  var d=document;
  var nav=d.getElementById('nav');
  function onScroll(){ if(nav) nav.classList.toggle('scrolled', window.scrollY>40); }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // Mobile menu
  var burger=d.getElementById('burger'), menu=d.getElementById('mobileMenu');
  function setMenu(open){
    if(!burger||!menu) return;
    burger.classList.toggle('open',open); menu.classList.toggle('open',open);
    burger.setAttribute('aria-expanded',open?'true':'false');
    d.body.style.overflow=open?'hidden':'';
  }
  if(burger){
    burger.addEventListener('click',function(){ setMenu(!menu.classList.contains('open')); });
    menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',function(){ setMenu(false); }); });
    window.addEventListener('resize',function(){ if(window.innerWidth>900) setMenu(false); });
  }

  // Kinetic headline
  var k=d.getElementById('kinetic');
  if(k){
    var words=(k.getAttribute('data-text')||k.textContent).trim().split(/\s+/);
    k.setAttribute('aria-label',words.join(' '));
    k.innerHTML=words.map(function(w,i){ return '<span aria-hidden="true" style="animation-delay:'+(i*0.07)+'s">'+w+'</span>'; }).join(' ');
  }

  // Reveal on scroll
  var items=d.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    items.forEach(function(el){ io.observe(el); });
  } else { items.forEach(function(el){ el.classList.add('in'); }); }

  // FAQ
  d.querySelectorAll('.faq-item').forEach(function(item){
    var q=item.querySelector('.faq-q'), a=item.querySelector('.faq-a');
    q.setAttribute('role','button'); q.setAttribute('tabindex','0');
    function toggle(){
      var open=item.classList.contains('open');
      d.querySelectorAll('.faq-item.open').forEach(function(o){ o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight=0; });
      if(!open){ item.classList.add('open'); a.style.maxHeight=a.scrollHeight+'px'; }
    }
    q.addEventListener('click',toggle);
    q.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); } });
  });

  // Work filters
  var fs=d.querySelectorAll('.filter');
  fs.forEach(function(f){
    f.addEventListener('click',function(){
      fs.forEach(function(x){ x.classList.remove('active'); }); f.classList.add('active');
      var t=f.getAttribute('data-f');
      d.querySelectorAll('.case-card[data-cat]').forEach(function(c){
        c.classList.toggle('hide', t!=='all' && c.getAttribute('data-cat')!==t);
      });
    });
  });

  // Contact form (Formspree)
  var form=d.getElementById('contactForm');
  if(form){
    var msg=d.getElementById('formMsg');
    var pre=new URLSearchParams(location.search).get('service');
    if(pre && form.service){ for(var i=0;i<form.service.options.length;i++){ if(form.service.options[i].value===pre) form.service.selectedIndex=i; } }
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var action=form.getAttribute('action');
      msg.className='form-msg';
      if(action.indexOf('YOUR_FORM_ID')>-1){
        msg.className='form-msg err';
        msg.textContent='The form is not connected yet. Please email us directly at qualityworkstudios@gmail.com.';
        return;
      }
      var btn=form.querySelector('button[type=submit]'); var label=btn.textContent; btn.disabled=true; btn.textContent='Sending...';
      fetch(action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}})
        .then(function(r){ if(r.ok){ form.reset(); msg.className='form-msg ok'; msg.textContent='Thank you for contacting The Quality Work Studio. We\'ve received your project details and will review them before getting back to you.'; } else { throw new Error('bad'); } })
        .catch(function(){ msg.className='form-msg err'; msg.textContent='Something went wrong. Please email us at qualityworkstudios@gmail.com.'; })
        .then(function(){ btn.disabled=false; btn.textContent=label; });
    });
  }
})();
