(function(){
  "use strict";

  var hdr = document.getElementById('hdr');
  var burger = document.getElementById('burger');
  var mm = document.getElementById('mm');

  function onScroll(){
    if(window.scrollY > 24){ hdr.classList.add('solid'); }
    else { hdr.classList.remove('solid'); }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  burger.addEventListener('click', function(){
    var open = mm.classList.toggle('on');
    burger.classList.toggle('on', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mm.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      mm.classList.remove('on');
      burger.classList.remove('on');
      burger.setAttribute('aria-expanded','false');
    });
  });

  /* ---------- language ---------- */
  var lang = 'zh';
  var titleNode = document.querySelector('title');
  var descNode = document.querySelector('meta[name="description"]');
  var TITLE = {
    zh: (titleNode && titleNode.getAttribute('data-zh')) || document.title,
    en: (titleNode && titleNode.getAttribute('data-en')) || document.title
  };
  var DESC = {
    zh: (descNode && descNode.getAttribute('data-zh')) || '',
    en: (descNode && descNode.getAttribute('data-en')) || ''
  };

  function applyLang(next){
    lang = next;
    document.querySelectorAll('[data-zh]').forEach(function(el){
      var v = el.getAttribute('data-' + lang);
      if(v !== null){
        if(/<[a-z]/i.test(v)){ el.innerHTML = v; } else { el.textContent = v; }
      }
    });
    document.documentElement.lang = (lang === 'zh' ? 'zh-CN' : 'en');
    document.title = TITLE[lang];
    if(descNode && DESC[lang]){ descNode.setAttribute('content', DESC[lang]); }
    var label = (lang === 'zh' ? 'EN' : '中文');
    document.querySelectorAll('.lang').forEach(function(b){ b.textContent = label; });
    try{ localStorage.setItem('octc-lang', lang); }catch(e){}
  }

  document.querySelectorAll('.lang').forEach(function(btn){
    btn.addEventListener('click', function(){
      applyLang(lang === 'zh' ? 'en' : 'zh');
    });
  });

  var saved = null;
  try{ saved = localStorage.getItem('octc-lang'); }catch(e){}
  if(saved === 'en'){ applyLang('en'); }

  /* ---------- reveal ---------- */
  var items = document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en, i){
        if(en.isIntersecting){
          var el = en.target;
          var delay = Math.min(i * 70, 280);
          setTimeout(function(){ el.classList.add('in'); }, delay);
          io.unobserve(el);
        }
      });
    }, {threshold: 0.12, rootMargin: '0px 0px -60px 0px'});
    items.forEach(function(el){ io.observe(el); });
  } else {
    items.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- enquiry form -> mailto ---------- */
  var form = document.getElementById('enq');
  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var d = new FormData(form);
      var g = function(k){ return (d.get(k) || '').toString().trim(); };
      var subject, body;
      if(lang === 'zh'){
        subject = '【官网咨询】' + (g('company') || '未填写公司') + ' · ' + g('need');
        body = '姓名：' + g('name') + '\n公司：' + g('company') + '\n邮箱：' + g('email') + '\n电话：' + g('phone') + '\n需求类型：' + g('need') + '\n\n具体情况：\n' + g('detail') + '\n';
      } else {
        subject = '[Website enquiry] ' + (g('company') || 'Company N/A') + ' · ' + g('need');
        body = 'Name: ' + g('name') + '\nCompany: ' + g('company') + '\nEmail: ' + g('email') + '\nPhone: ' + g('phone') + '\nNeed: ' + g('need') + '\n\nDetails:\n' + g('detail') + '\n';
      }
      window.location.href = 'mailto:sales@octc-china.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
