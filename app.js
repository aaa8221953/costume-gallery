(function(){
const CATS=[["all","全部"],["春","春"],["夏","夏"],["秋","秋"],["冬","冬"],["ランジェリー","内衣"],["パーティ","派对"],["水着","泳装"],["セクシー","性感"]];
const PAGE=120;
let items=[],list=[],cat="all",shown=0,cur=-1;
const $=id=>document.getElementById(id);
const grid=$("grid"),tabs=$("tabs"),q=$("q");
function toast(t){const e=$("toast");e.textContent=t;e.classList.add("on");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("on"),1400)}
function copy(t){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast("已复制"),()=>{const a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();try{document.execCommand("copy");toast("已复制")}catch(e){toast("复制失败，请手动选择")}a.remove()})}
function readHash(){const p=new URLSearchParams(location.hash.slice(1));cat=p.get("c")||"all";q.value=p.get("q")||"";return p.get("id")}
function writeHash(id){const p=new URLSearchParams();if(cat!=="all")p.set("c",cat);if(q.value.trim())p.set("q",q.value.trim());if(id)p.set("id",id);history.replaceState(null,"","#"+p.toString())}
function renderTabs(){const cnt={all:items.length};items.forEach(i=>cnt[i.categoria_ja]=(cnt[i.categoria_ja]||0)+1);
tabs.innerHTML=CATS.map(([k,n])=>`<button data-c="${k}" class="${k===cat?"on":""}">${n}<b>${cnt[k]||0}</b></button>`).join("")}
function filter(){const terms=q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
list=items.filter(i=>(cat==="all"||i.categoria_ja===cat)&&terms.every(t=>i._s.includes(t)));
grid.innerHTML="";shown=0;
if(!list.length)grid.innerHTML='<div class="empty">没有找到匹配的服装</div>';
$("stat").textContent=`共 ${list.length} 套`;more()}
function card(i,idx){return `<div class="card" data-i="${idx}"><div class="ph"><img loading="lazy" src="${i.thumb}" alt="${i.id}"></div><div class="meta"><div class="id">${i.id}</div><div class="kw">${i.keywords}</div></div></div>`}
function more(){if(shown>=list.length){$("more").textContent=list.length?"已全部显示":"";return}
const end=Math.min(shown+PAGE,list.length);grid.insertAdjacentHTML("beforeend",list.slice(shown,end).map((i,k)=>card(i,shown+k)).join(""));shown=end;
$("more").textContent=shown<list.length?"向下滚动加载更多…":"已全部显示"}
function open(idx){if(idx<0||idx>=list.length)return;cur=idx;const i=list[idx];
$("lbImg").src=i.img;$("lbId").textContent=i.id+" · "+(CATS.find(c=>c[0]===i.categoria_ja)||[,""])[1];
$("lbKw").textContent=i.keywords;$("dl").href=i.img;$("dl").setAttribute("download",i.id+".webp");
$("lb").hidden=false;document.body.style.overflow="hidden";writeHash(i.id)}
function close(){$("lb").hidden=true;document.body.style.overflow="";cur=-1;writeHash()}
tabs.onclick=e=>{const b=e.target.closest("button");if(!b)return;cat=b.dataset.c;renderTabs();filter();writeHash();scrollTo(0,0)};
let tm;q.oninput=()=>{clearTimeout(tm);tm=setTimeout(()=>{filter();writeHash()},150)};
grid.onclick=e=>{const c=e.target.closest(".card");if(c)open(+c.dataset.i)};
$("lbClose").onclick=close;$("lb").onclick=e=>{if(e.target.id==="lb")close()};
$("lbPrev").onclick=()=>open(cur-1);$("lbNext").onclick=()=>{if(cur+1>=shown)more();open(cur+1)};
$("copyKw").onclick=()=>copy(list[cur].keywords);$("copyId").onclick=()=>copy(list[cur].id);
document.onkeydown=e=>{if($("lb").hidden)return;if(e.key==="Escape")close();if(e.key==="ArrowLeft")$("lbPrev").click();if(e.key==="ArrowRight")$("lbNext").click()};
new IntersectionObserver(es=>{if(es[0].isIntersecting)more()},{rootMargin:"800px"}).observe($("more"));
fetch("costumes-index.json").then(r=>r.json()).then(d=>{items=d.items.map(i=>Object.assign(i,{_s:(i.id+" "+i.keywords).toLowerCase()}));
const id=readHash();renderTabs();filter();if(id){const k=list.findIndex(i=>i.id===id);if(k>=0){while(shown<=k)more();open(k)}}})
.catch(()=>{grid.innerHTML='<div class="empty">数据加载失败</div>'});
})();
