/*
 KORSUP — storefront configuration.
 Add one or both destinations below before publishing:
   checkoutUrl: 'https://your-payment-gateway.example/...'
   whatsapp: '2010XXXXXXXX'   // international number, no leading +
 Set access duration / delivery rules in HTML FAQ once decided.
*/
const CONFIG = Object.freeze({
  price: 499,
  checkoutUrl: '',
  whatsapp: '',
});

// Category structure and file counts were checked against the supplied
// Unvirsty 404 HTML catalog. "Files" includes videos, audio and assets.
const tracks = [
  { name: 'AI & Productivity', desc:'أدوات ذكاء اصطناعي وإنتاجية، Excel وأتمتة.', count:1107,
    modules:[['Productivity & Workspace','إنتاجية وأدوات عمل',138],['AI Tools & ChatGPT','أدوات AI وChatGPT',175],['Excel','دروس Excel',687],['AI Automation & Vibe Coding','أتمتة وتطوير بمساعدة AI',107]] },
  { name:'Content Creation',desc:'استراتيجية المحتوى، التصوير، المونتاج والموبيل.',count:653,
    modules:[['Content Strategy & Virality','تخطيط المحتوى والانتشار',242],['Filming & Camera Aesthetics','التصوير والكاميرا',12],['Quick Editing & Mobile','مونتاج سريع وموبايل',177],['Advanced Editing & Motion','مونتاج متقدم وموشن',222]] },
  { name:'Graphic Design',desc:'أساسيات الجرافيك وتعديل الصور وCanva.',count:374,
    modules:[['Graphic Design Basics','أساسيات التصميم',179],['Photo Manipulation / NourDesign','معالجة وتركيب الصور',135],['Canva & Commercial Design','Canva وتصميم تجاري',60]] },
  { name:'Digital Marketing',desc:'التسعير والإعلانات وSEO وتسويق AI.',count:347,
    modules:[['Buyer Mindset & Pricing','تفكير المشتري والتسعير',66],['Meta & Google Ads','إعلانات Meta وGoogle',108],['SEO & AI Marketing','تحسين محركات البحث وتسويق AI',173]] },
  { name:'Freelancing & Business',desc:'العمل الحر والتعامل مع العملاء والأعمال الرقمية.',count:370,
    modules:[['Freelance Diploma','أساسيات ومهارات العمل الحر',181],['Digital Business & Affiliate','مشاريع رقمية وتسويق بالعمولة',189]] },
  { name:'Languages Bonus',desc:'مواد تعليمية بالإنجليزية والفرنسية، بينها صوتيات وملفات مساعدة.',count:6058,
    modules:[['English Mastery','مواد اللغة الإنجليزية',5847],['French DELF','مواد اللغة الفرنسية',211]] },
];

const $ = (selector, root=document)=>root.querySelector(selector);
const $$ = (selector, root=document)=>[...root.querySelectorAll(selector)];
const formatter = new Intl.NumberFormat('en-US');
let activeTrack = 0;
function selectTrack(index, scrollToPreview=false) {
  if(!tracks[index]) return;
  activeTrack=index;
  $$('.path-card').forEach(btn => {
    const on = Number(btn.dataset.path)===index;
    btn.classList.toggle('is-active',on);
    btn.setAttribute('aria-pressed',String(on));
  });
  $$('.preview-tab').forEach(btn => {
    const on=Number(btn.dataset.tab)===index;
    btn.classList.toggle('is-active',on);
    btn.setAttribute('aria-selected',String(on));
    btn.tabIndex=on?0:-1;
  });
  const track=tracks[index];
  $('#previewIndex').textContent=`TRACK ${String(index+1).padStart(2,'0')} / 06`;
  $('#previewName').textContent=track.name;
  $('#previewDesc').textContent=track.desc;
  $('#previewCount').textContent=formatter.format(track.count);
  const moduleList=$('#moduleList');
  moduleList.replaceChildren(...track.modules.map(([english,arabic,count],i)=>{
    const row=document.createElement('div');row.className='module-row';
    const num=document.createElement('span');num.className='module-number';num.textContent=String(i+1).padStart(2,'0');
    const wrapper=document.createElement('div');wrapper.className='module-name';
    const strong=document.createElement('strong');strong.textContent=arabic;
    const small=document.createElement('small');small.textContent=english;
    wrapper.append(strong,small);
    const countLabel=document.createElement('span');countLabel.className='module-files';countLabel.textContent=`${formatter.format(count)} files`;
    const glyph=document.createElement('span');glyph.className='module-glyph';glyph.textContent='↗';glyph.setAttribute('aria-hidden','true');
    row.append(num,wrapper,countLabel,glyph);return row;
  }));
  if(scrollToPreview) $('#preview').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}

$$('.path-card').forEach(btn=>btn.addEventListener('click',()=>selectTrack(Number(btn.dataset.path),true)));
$$('.preview-tab').forEach(btn=>{
  btn.addEventListener('click',()=>selectTrack(Number(btn.dataset.tab)));
  btn.addEventListener('keydown',evt=>{
    if(evt.key!=='ArrowLeft' && evt.key!=='ArrowRight')return;
    evt.preventDefault();const step=evt.key==='ArrowLeft'?-1:1;
    const next=(activeTrack+step+tracks.length)%tracks.length;
    selectTrack(next);$(`.preview-tab[data-tab="${next}"]`).focus();
  });
});
selectTrack(0);

const menuToggle=$('#menuToggle'), mobileMenu=$('#mobileMenu');
function closeMenu(){menuToggle.setAttribute('aria-expanded','false');mobileMenu.hidden=true}
menuToggle.addEventListener('click',()=>{const expanded=menuToggle.getAttribute('aria-expanded')==='true';menuToggle.setAttribute('aria-expanded',String(!expanded));mobileMenu.hidden=expanded});
$$('.mobile-nav a').forEach(link=>link.addEventListener('click',closeMenu));
window.addEventListener('resize',()=>{if(window.innerWidth>860)closeMenu()},{passive:true});

document.documentElement.classList.add('js');
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px 40px 0px'});
  $$('.reveal').forEach(el=>observer.observe(el));
}else{$$('.reveal').forEach(el=>el.classList.add('is-visible'))}
const progress=$('#progress');let ticking=false;
window.addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{const range=document.documentElement.scrollHeight-window.innerHeight;const scroll=range>0?window.scrollY/range:0;progress.style.width=`${Math.min(100,Math.max(0,scroll*100))}%`;ticking=false})},{passive:true});

const changingSkill=$('#changingSkill');
const words=['AI & AUTOMATION','VIDEO EDITING','GRAPHIC DESIGN','DIGITAL MARKETING','FREELANCING'];
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){let pos=0;setInterval(()=>{pos=(pos+1)%words.length;changingSkill.textContent=words[pos]},2700)}

$('#year').textContent=new Date().getFullYear();
['visiblePrice','mobilePrice','modalPrice'].forEach(id=>{const el=$(`#${id}`);if(el)el.textContent=formatter.format(CONFIG.price)});

const modal=$('#checkoutModal');
const feedback=$('#orderFeedback');
const modalDescription=$('#modalDescription');
const orderAction=$('#orderAction');
function getMessage(){const name=$('#buyerName').value.trim();return `مرحبًا KORSUP 👋\nعايز أطلب Ultimate Skills Pack بسعر ${CONFIG.price} جنيه.${name?`\nالاسم: ${name}`:''}\nممكن أعرف خطوات الدفع والتسليم ومدة الوصول؟`}
function openOrder(){
  feedback.textContent='';
  if(CONFIG.checkoutUrl){window.open(CONFIG.checkoutUrl,'_blank','noopener,noreferrer');return}
  if(CONFIG.whatsapp){
    modalDescription.textContent='اطلب الباكج على واتساب. هنرسل رسالة جاهزة تقدر تراجعها قبل الإرسال.';
    orderAction.textContent='متابعة على واتساب ↗';
  }else{
    modalDescription.textContent='دي نسخة تجريبية من صفحة البيع. ربط وسيلة الطلب لسه مطلوب قبل نشرها للعميل.';
    orderAction.textContent='نسخ تفاصيل الطلب ↗';
  }
  modal.showModal();document.body.classList.add('modal-open');
}
$$('[data-buy]').forEach(btn=>btn.addEventListener('click',openOrder));
modal.addEventListener('close',()=>{document.body.classList.remove('modal-open')});
modal.addEventListener('click',evt=>{if(evt.target===modal)modal.close()});
orderAction.addEventListener('click',async()=>{
  const message=getMessage();
  if(CONFIG.whatsapp){window.open(`https://wa.me/${CONFIG.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');feedback.textContent='تم تجهيز الطلب على واتساب.';return}
  try{await navigator.clipboard.writeText(message);feedback.textContent='تم نسخ رسالة الطلب. اربط وسيلة الطلب قبل نشر الموقع.'}
  catch(_){
    const temp=document.createElement('textarea');temp.value=message;temp.style.position='fixed';temp.style.opacity='0';document.body.append(temp);temp.select();const copied=document.execCommand('copy');temp.remove();feedback.textContent=copied?'تم نسخ رسالة الطلب. اربط وسيلة الطلب قبل نشر الموقع.':'انسخ الرسالة يدويًا بعد ربط وسيلة الطلب.';
  }
});
