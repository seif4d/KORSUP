/* KORSUP Library — actual directory reconstructed from the supplied HTML.
   NO authentication/access control is implemented in this static file.
   Do not publish the full link-bearing version as a public sales preview. */
(() => {
'use strict';
const data=window.KORSUP_LIBRARY;
const publicPreview=Boolean(window.KORSUP_PUBLIC_PREVIEW);
const $=(q,root=document)=>root.querySelector(q), $$=(q,root=document)=>[...root.querySelectorAll(q)];
const main=$('#pageView');
const formatter=new Intl.NumberFormat('en-US');
const icons={folder:'folder',video:'video',audio:'headphones',image:'image',doc:'file',other:'file'};
const kinds={folder:'مجلد',video:'فيديو',audio:'صوت',image:'صورة',doc:'مستند',other:'ملف'};
const typeLabels={all:'الكل',folder:'مجلدات',video:'فيديو',audio:'صوت',image:'صور',doc:'مستندات',other:'أخرى'};
const vid=new Set(['mp4','mkv','mov','webm','avi','m4v','ts','swf','wmv']);
const aud=new Set(['mp3','m4a','wav','ogg','aac','flac','wma']);
const imgs=new Set(['jpg','jpeg','png','webp','gif','svg','bmp','heic']);
const docs=new Set(['pdf','txt','html','htm','doc','docx','xls','xlsx','ppt','pptx','srt','csv','epub','rtf','xml']);
const extFolder=id=>data.nodes[id][3]==='d';
const cats=data.categories;
const categoryById=new Map(cats.map(cat=>[cat.id,cat]));
const kids=Array.from({length:data.nodes.length},()=>[]);
for(let i=1;i<data.nodes.length;i++)kids[data.nodes[i][0]].push(i);
const counts={files: data.nodes.filter(n=>n[3]==='f').length, folders:data.nodes.filter(n=>n[3]==='d').length-1};
let saved=new Set(),current={view:'home',id:0,q:''},activeFilter='all',sortMode='original',listMode='list',resultLimit=48,searchMatches=[];
try{const parsed=JSON.parse(localStorage.getItem('korsup:saved')||'[]');saved=new Set(parsed.filter(id=>Number.isInteger(id)&&id>0&&id<data.nodes.length))}catch(_){}
try{listMode=localStorage.getItem('korsup:view')||'list'}catch(_){}
function icon(key){return `<svg aria-hidden="true"><use href="#i-${icons[key]||key}"/></svg>`}
function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function normalize(str){return String(str||'').normalize('NFKC').toLowerCase().replace(/[\u064b-\u065f\u0670]/g,'').replace(/[إأآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[_\-./\\]+/g,' ').replace(/\s+/g,' ').trim()}
const searchIndex=data.nodes.map(n=>normalize(n[1]));
function fmt(number){return formatter.format(number)}
function type(id){const n=data.nodes[id];if(n[3]==='d')return 'folder';const x=n[4];if(vid.has(x))return 'video';if(aud.has(x))return 'audio';if(imgs.has(x))return 'image';if(docs.has(x))return 'doc';return 'other'}
function categoryId(id){let candidate=id;while(data.nodes[candidate]?.[0]>0){candidate=data.nodes[candidate][0]}return candidate}
function path(id){const a=[];let at=id;while(at>0&&a.length<20){a.unshift(at);at=data.nodes[at][0]}return a}
function shortName(id){return data.nodes[id][1].replace(/^\d{1,2}[_\-.]\s*/, '').replace(/_/g,' ').replace(/\s+/g,' ').trim()}
function displayName(id){return categoryById.get(id)?.ar||shortName(id)}
function locLine(id){return path(id).slice(0,-1).map(n=>categoryById.get(n)?.ar||shortName(n)).join(' / ')}
function updateSavedBadge(){['savedCount','sideSavedCount'].forEach(id=>{const el=$('#'+id);if(el)el.textContent=fmt(saved.size)})}
function notify(msg){const toast=$('#toast');toast.textContent=msg;toast.classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove('show'),2700)}
function saveToggle(id){if(saved.has(id)){saved.delete(id);notify('اتشالت من المحفوظات')}else{saved.add(id);notify('اتضافت للمحفوظات ✳')}try{localStorage.setItem('korsup:saved',JSON.stringify([...saved]))}catch(_){}updateSavedBadge();$$(`[data-fav="${id}"]`).forEach(el=>{el.classList.toggle('is-saved',saved.has(id));el.setAttribute('aria-pressed',String(saved.has(id)));el.setAttribute('aria-label',saved.has(id)?'إزالة من المحفوظات':'حفظ العنصر')});if(current.view==='saved')renderSaved()}
function setLocation(hash,{replace=false}={}){if(replace){history.replaceState(null,'',hash);onRoute()}else if(location.hash===hash){onRoute()}else location.hash=hash}
function go(view,id){if(view==='home')setLocation('#home');else if(view==='saved')setLocation('#saved');else if(view==='search')setLocation('#search='+encodeURIComponent($('#searchBox').value.trim()));else if(view==='folder')setLocation('#folder='+id)}
function currentCategory(){return current.view==='folder'?categoryId(current.id):0}
function sideCategory(cat){const n=data.nodes[cat.id];const empty=n[6]===0;return `<button type="button" class="side-item ${currentCategory()===cat.id?'active':''}" data-folder="${cat.id}"><span class="side-icon">${esc(cat.icon)}</span><span>${esc(cat.ar)}</span><span class="side-count">${empty?'—':fmt(n[6])}</span></button>`}
function renderSide(){const selected=current.view;
 $('#sideCategories').innerHTML=cats.map(sideCategory).join('');
 $$('.side-item[data-go]').forEach(b=>b.classList.toggle('active',b.dataset.go===selected));
 $$('.mobile-bottom [data-go]').forEach(b=>b.classList.toggle('active',b.dataset.go===selected));
 $('#mobileExplore').classList.toggle('active',selected==='folder');$('#mobileSearch').classList.toggle('active',selected==='search');}
function foot(){return `<div class="footer-note"><span>KORSUP® / THE SKILL LIBRARY — <b>ONE LIBRARY, MANY DIRECTIONS.</b></span><span>INDEX / 2026</span></div>`}
function stat(label,num,symbol){return `<div class="stat-card"><div><strong>${fmt(num)}</strong><br><small>${esc(label)}</small></div><span class="stat-mark" aria-hidden="true">${symbol}</span></div>`}
function categoryCard(cat,index){const n=data.nodes[cat.id];const empty=n[6]===0;return `<button type="button" data-folder="${cat.id}" class="category-card ${empty?'empty':''}"><div class="cat-top"><small>${String(index+1).padStart(2,'0')} / ${empty?'EMPTY CATEGORY':'EXPLORE TRACK'}</small><span class="category-arrow">↗</span></div><span class="cat-symbol" aria-hidden="true">${esc(cat.icon)}</span><div class="cat-bottom"><div><h3>${esc(cat.en)}</h3><p>${esc(cat.ar)}</p></div><span class="cat-count">${empty?'0 FILES':fmt(n[6])+' FILES'}</span></div></button>`}
function renderHome(){current={view:'home',id:0,q:''};
 main.innerHTML=`<section class="home-hero"><div class="hero-inner"><div class="small-label hero-intro">THE DIGITAL SKILLS VAULT / KORSUP 2026</div><h1>كل اللي عايز<br><em>تتعلّمه.</em> هنا<span style="color:var(--orange)">✳</span></h1><p>من الـAI للتصميم والتسويق والمونتاج واللغات. مكتبتك الرقمية متقسمة وواضحة؛ اختار مجال، ادخل المجلد، ووصل للمحتوى بسهولة.</p><div class="hero-buttons"><button class="cta" type="button" data-scroll="categories">ابدأ الاستكشاف ${icon('arrow')}</button><button class="ghost-button" type="button" data-go="saved">المحفوظات ${icon('star')}</button></div></div><div class="hero-art" aria-hidden="true"><span class="hero-spark">✳</span><div class="pack-box"><div class="pack-header"><span>KORSUP / 01—09</span><span>↗</span></div><strong>SKILL<br><span>UP.</span></strong><div class="pack-footer">THE FULL<br>LIBRARY</div></div><div class="hero-tag">ACCESS YOUR SKILLS ↗</div></div></section>
 <div class="stats-row">${stat('ملف تعليمي متنوع',counts.files,'↗')}${stat('مجلد مرتب حسب التخصص',counts.folders,'⊞')}${stat('أقسام في فهرس المكتبة',cats.length,'✳')}</div>
 <section id="categories"><div class="section-title-bar"><div><div class="small-label"><span class="orange">01 /</span> PICK YOUR LANE</div><h2>إيه المجال اللي على مزاجك؟</h2></div><span class="section-note">اختر مجالًا لعرض مجلداته وملفاته</span></div><div class="category-grid">${cats.map(categoryCard).join('')}</div><div class="disclaimer"><strong>ملاحظة:</strong> الأرقام دي عدد الملفات الفعلية، مش عدد الكورسات. الأقسام الثلاثة الأخيرة موجودة في الفهرس الأصلي لكنها بدون محتوى مسجل حاليًا.</div></section>${foot()}`;
 renderSide();}
function crumb(id){const a=path(id);return `<nav class="breadcrumbs" aria-label="مسار المجلد"><button type="button" class="crumb-btn" data-go="home">المكتبة</button>${a.map((ancestor,i)=>`${icon('chevron')}${i===a.length-1?`<span class="crumb-current" title="${esc(data.nodes[ancestor][1])}">${esc(displayName(ancestor))}</span>`:`<button type="button" class="crumb-btn" data-folder="${ancestor}" title="${esc(data.nodes[ancestor][1])}">${esc(displayName(ancestor))}</button>`}`).join('')}</nav>`}
function item(id,searchContext=false){const n=data.nodes[id],isFolder=extFolder(id),t=type(id),cat=categoryById.get(categoryId(id));const href=n[2];const sub=isFolder?`${fmt(n[6])} ملف · ${fmt(n[5])} مجلد`:`${t==='other'?(n[4]||'FILE').toUpperCase():kinds[t]}${n[4]?' · '+n[4].toUpperCase():''}`;
 const action=isFolder?`<button class="item-open" type="button" data-folder="${id}" aria-label="افتح المجلد">${icon('chevron')}<span>استكشف</span></button>`:href?`<a class="item-open" href="${esc(href)}" target="_blank" rel="noopener noreferrer" aria-label="فتح الملف في Google Drive">${icon('arrow')}<span>فتح</span></a>`:`<span class="file-chip">${publicPreview?'PREVIEW ONLY':'NO LINK'}</span>`;
 return `<article class="library-item"><div class="item-icon ${t}">${icon(t)}</div><div class="item-meta">${isFolder?`<button class="item-name" data-folder="${id}" title="${esc(n[1])}">${esc(displayName(id))}</button>`:href?`<a class="item-name" href="${esc(href)}" target="_blank" rel="noopener noreferrer" title="${esc(n[1])}">${esc(n[1])}</a>`:`<span class="item-name">${esc(n[1])}</span>`}<div class="item-description">${searchContext?`<span class="search-result-description">${esc(locLine(id)||cat?.ar||'المكتبة')}</span><span class="dot">·</span>`:''}<span>${esc(sub)}</span></div></div><div class="item-extras">${!isFolder?`<span class="file-chip">${esc((n[4]||'FILE').toUpperCase())}</span>`:''}<button class="star-action ${saved.has(id)?'is-saved':''}" type="button" data-fav="${id}" aria-pressed="${saved.has(id)}" aria-label="${saved.has(id)?'إزالة من المحفوظات':'حفظ العنصر'}">${icon('star')}</button>${action}</div></article>`}
function sortItems(ids){if(sortMode==='name')return [...ids].sort((a,b)=>shortName(a).localeCompare(shortName(b),undefined,{numeric:true,sensitivity:'base'}));if(sortMode==='type')return [...ids].sort((a,b)=>{const folderDiff=(extFolder(b)?1:0)-(extFolder(a)?1:0);return folderDiff||shortName(a).localeCompare(shortName(b),undefined,{numeric:true})});if(sortMode==='reverse')return [...ids].reverse();return ids}
function listControls(){return `<div class="explorer-actions"><select class="sort-select" id="sortSelect" aria-label="ترتيب الملفات"><option value="original" ${sortMode==='original'?'selected':''}>الترتيب الأصلي</option><option value="name" ${sortMode==='name'?'selected':''}>الاسم A–Z</option><option value="type" ${sortMode==='type'?'selected':''}>المجلدات أولًا</option><option value="reverse" ${sortMode==='reverse'?'selected':''}>عكس الترتيب</option></select><div class="mode-group" aria-label="طريقة العرض"><button type="button" class="mode-button ${listMode==='list'?'active':''}" data-mode="list" aria-label="عرض قائمة">${icon('list')}</button><button type="button" class="mode-button ${listMode==='grid'?'active':''}" data-mode="grid" aria-label="عرض شبكة">${icon('grid')}</button></div></div>`}
function directoryItems(ids,context=false){return ids.length?`<div class="${listMode==='grid'?'items-grid':'item-list'}" id="itemResults">${sortItems(ids).map(id=>item(id,context)).join('')}</div>`:''}
function renderFolder(id){const n=data.nodes[id];if(!n||!extFolder(id))return renderHome();current={view:'folder',id,q:''};const cat=categoryById.get(categoryId(id));const isTop=cat?.id===id;const listing=kids[id];const empty=listing.length===0;
 main.innerHTML=`<section class="directory-head">${crumb(id)}<div class="directory-eyebrow"><span></span> ${esc(cat?.en||'KORSUP FOLDER')} / ${isTop?'TRACK':'FOLDER'}</div><div class="dir-title-line"><div><h1>${esc(displayName(id))}</h1><div class="dir-original">${esc(n[1])}</div></div><div class="folder-header-actions"><button class="quiet-action" type="button" data-fav="${id}" aria-pressed="${saved.has(id)}">${icon('star')} ${saved.has(id)?'محفوظ':'احفظ المجلد'}</button><button class="quiet-action" type="button" data-copy="${id}">${icon('copy')} انسخ الرابط</button>${n[2]?`<a class="quiet-action" href="${esc(n[2])}" target="_blank" rel="noopener noreferrer">${icon('arrow')} Google Drive</a>`:''}</div></div><div class="dir-subtitle">${isTop?'محتوى المجال مرتب في مجلدات متفرعة. استكشف الملفات والمجلدات بالترتيب المناسب لك.':'تصفّح العناصر الموجودة في هذا المجلد أو افتحه مباشرة على Google Drive.'}</div><div class="folder-meter"><span class="meter-item"><b>${fmt(n[5])}</b> مجلد فرعي</span><span class="meter-item"><b>${fmt(n[6])}</b> ملف</span><span class="meter-item"><b>${fmt(listing.length)}</b> عنصر مباشر</span></div></section>
 <div class="explorer-bar"><h2>داخل المجلد <small>${fmt(listing.length)} ITEMS</small></h2>${listControls()}</div>${empty?`<div class="empty-state folder-empty"><span class="empty-symbol">✳</span><h3>المجلد فاضي حاليًا</h3><p>المجلد موجود في الفهرس الأصلي، لكن مفيش ملفات أو مجلدات فرعية مسجلة جواه.</p><button type="button" class="cta" data-go="home">شوف باقي المجالات ${icon('arrow')}</button></div>`:directoryItems(listing)}${foot()}`;renderSide();}
function renderSaved(){current={view:'saved',id:0,q:''};const ids=[...saved].filter(id=>id>0&&id<data.nodes.length);
 main.innerHTML=`<div class="small-label"><span class="orange">YOUR SPACE /</span> BOOKMARKS</div><h1 class="saved-title">اللي عاجبك، <span style="color:var(--orange)">احفظه.</span></h1><p class="saved-intro">المجلدات والملفات اللي علّمت عليها بتتخزن على متصفحك الحالي فقط.</p><div class="explorer-bar"><h2>المحفوظات <small>${fmt(ids.length)} SAVED</small></h2>${listControls()}</div>${ids.length?directoryItems(ids,true):`<div class="empty-state"><span class="empty-symbol">☆</span><h3>لسه معندكش محفوظات</h3><p>دوس على علامة النجمة جنب أي ملف أو مجلد علشان تلاقيه هنا بسرعة.</p><button type="button" class="cta" data-go="home">استكشف المكتبة ${icon('arrow')}</button></div>`}${foot()}`;renderSide()}
function searchFilter(id){const t=type(id);return activeFilter==='all'||activeFilter===t}
function findMatches(q){const normalized=normalize(q);if(!normalized)return[];const tokens=normalized.split(' ').filter(Boolean);const starts=[],other=[];for(let id=1;id<data.nodes.length;id++){const name=searchIndex[id];if(tokens.every(w=>name.includes(w))){(name.startsWith(tokens[0])?starts:other).push(id)}}return starts.concat(other)}
function filterOptions(){return `<div class="filters">${Object.entries(typeLabels).map(([key,label])=>`<button type="button" class="filter-btn ${activeFilter===key?'active':''}" data-filter="${key}">${label}</button>`).join('')}</div>`}
function renderSearch(){current.view='search';const q=current.q;searchMatches=findMatches(q);resultLimit=48;drawSearch()}
function drawSearch(){const q=current.q;const filtered=searchMatches.filter(searchFilter);const limited=filtered.slice(0,resultLimit);
 main.innerHTML=`<div class="small-label"><span class="orange">KORSUP /</span> SEARCH EVERYWHERE</div><div class="search-result-head"><div><h1 class="search-heading">دوّر، <span style="color:var(--orange)">واكتشف.</span></h1><p>${q?`نتائج البحث عن «<strong>${esc(q)}</strong>»`:'اكتب كلمة أو اسم ملف علشان تدوّر داخل المكتبة كلها.'}</p></div><span class="stat-mark" aria-hidden="true">⌕</span></div>
 <label class="global-search search-page" for="searchPageInput"><svg><use href="#i-search"/></svg><input id="searchPageInput" type="search" autocomplete="off" placeholder="مثال: ChatGPT، Premiere، Excel..." value="${esc(q)}" aria-label="ابحث في الملفات والمجلدات"><kbd>ENTER</kbd></label>
 <div class="search-tools">${filterOptions()}<span class="result-hint">${fmt(filtered.length)} نتيجة ${q?'مطابقة':''}</span></div>
 <div class="explorer-bar"><h2>نتائج الاستكشاف <small>${fmt(limited.length)} / ${fmt(filtered.length)}</small></h2>${listControls()}</div>
 ${q?filtered.length?`${directoryItems(limited,true)}${resultLimit<filtered.length?'<button class="show-more" type="button" id="showMore">اعرض نتائج أكثر ↓</button>':''}`:`<div class="empty-state"><span class="empty-symbol">⌕</span><h3>مفيش نتيجة مطابقة</h3><p>جرّب اسم أقصر، كلمة مختلفة، أو اختار «الكل» من فلاتر الملفات.</p><button class="cta" type="button" data-go="home">تصفح المجالات ${icon('arrow')}</button></div>`:`<div class="empty-state"><span class="empty-symbol">✳</span><h3>هتلاقيها هنا.</h3><p>اكتب اسم الأداة، الدرس أو المجال، وهندور في كل ملفات ومجلدات الفهرس.</p></div>`}${foot()}`;renderSide();}
function parseRoute(){let hash=location.hash.slice(1);if(!hash||hash==='home')return {view:'home'};if(hash==='saved')return {view:'saved'};if(hash.startsWith('folder=')){const id=Number(hash.slice(7));return Number.isInteger(id)&&id>0&&id<data.nodes.length&&extFolder(id)?{view:'folder',id}:{view:'home'}}if(hash.startsWith('search=')){try{return{view:'search',q:decodeURIComponent(hash.slice(7)).slice(0,130)}}catch(_){return{view:'search',q:''}}}return {view:'home'}}
function onRoute(){const route=parseRoute();if(route.view==='home')renderHome();else if(route.view==='folder')renderFolder(route.id);else if(route.view==='saved')renderSaved();else if(route.view==='search'){current.q=route.q;renderSearch()}$('#searchBox').value=current.view==='search'?current.q:'';closeSidebar();window.scrollTo({top:0,behavior:'instant'})}
function searchInput(q,source){q=q.trim().slice(0,130);current.q=q;activeFilter='all';setLocation('#search='+encodeURIComponent(q),{replace:true});if(source==='page'){const searchField=$('#searchPageInput');if(searchField){searchField.focus();searchField.setSelectionRange(q.length,q.length)}}}
function scheduleSearch(value,source){clearTimeout(scheduleSearch.timer);scheduleSearch.timer=setTimeout(()=>searchInput(value,source),160)}
function updateMode(mode){if(!['list','grid'].includes(mode))return;listMode=mode;try{localStorage.setItem('korsup:view',listMode)}catch(_){}if(current.view==='folder')renderFolder(current.id);else if(current.view==='saved')renderSaved();else if(current.view==='search')drawSearch()}
function changeSort(value){sortMode=value;if(current.view==='folder')renderFolder(current.id);else if(current.view==='saved')renderSaved();else if(current.view==='search')drawSearch()}
async function copyFolder(id){const url=location.href.split('#')[0]+'#folder='+id;try{await navigator.clipboard.writeText(url);notify('رابط المجلد اتنسخ!')}catch(_){const t=document.createElement('textarea');t.value=url;document.body.append(t);t.select();const ok=document.execCommand('copy');t.remove();notify(ok?'رابط المجلد اتنسخ!':'انسخ عنوان المجلد من شريط العنوان')}}
function openSidebar(){const sidebar=$('#sidebar'),shade=$('#sidebarShade');sidebar.classList.add('open');shade.hidden=false;$('#sidebarToggle').setAttribute('aria-expanded','true')}
function closeSidebar(){$('#sidebar').classList.remove('open');$('#sidebarShade').hidden=true;$('#sidebarToggle').setAttribute('aria-expanded','false')}
function focusSearch(){go('search');requestAnimationFrame(()=>{const field=window.innerWidth<=680?$('#searchPageInput'):$('#searchBox');field?.focus()})}
function delegateClick(ev){const target=ev.target.closest('button,a');if(!target)return;
 if(target.hasAttribute('data-folder')){ev.preventDefault();go('folder',Number(target.dataset.folder));return}
 if(target.hasAttribute('data-go')){ev.preventDefault();go(target.dataset.go);return}
 if(target.hasAttribute('data-scroll')){$('#'+target.dataset.scroll)?.scrollIntoView({behavior:'smooth'});return}
 if(target.hasAttribute('data-fav')){ev.preventDefault();saveToggle(Number(target.dataset.fav));return}
 if(target.hasAttribute('data-copy')){ev.preventDefault();copyFolder(Number(target.dataset.copy));return}
 if(target.hasAttribute('data-filter')){activeFilter=target.dataset.filter;resultLimit=48;drawSearch();return}
 if(target.hasAttribute('data-mode')){updateMode(target.dataset.mode);return}
 if(target.id==='showMore'){resultLimit+=48;drawSearch();return}
 if(target.id==='searchFocus'||target.id==='mobileSearch'){focusSearch();return}
 if(target.id==='mobileExplore'){openSidebar();return}
 if(target.id==='sidebarToggle'){$('#sidebar').classList.contains('open')?closeSidebar():openSidebar();return}
}
function setup(){if(!data||!data.nodes)return;$('#year').textContent=new Date().getFullYear();updateSavedBadge();
 document.addEventListener('click',delegateClick);
 $('#sidebarShade').addEventListener('click',closeSidebar);
 $('#searchBox').addEventListener('input',e=>scheduleSearch(e.target.value,'header'));
 $('#searchBox').addEventListener('keydown',e=>{if(e.key==='Enter')searchInput(e.target.value,'header')});
 main.addEventListener('input',e=>{if(e.target.id==='searchPageInput')scheduleSearch(e.target.value,'page')});
 main.addEventListener('keydown',e=>{if(e.target.id==='searchPageInput'&&e.key==='Enter')searchInput(e.target.value,'page')});
 main.addEventListener('change',e=>{if(e.target.id==='sortSelect')changeSort(e.target.value)});
 window.addEventListener('hashchange',onRoute);
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();focusSearch()}if(e.key==='Escape')closeSidebar()});
 onRoute();}
setup();
})();
