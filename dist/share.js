function sharePage(){
 const options=earnedTrionfi().map(t=>`<option value="${esc(t.id)}">${esc(t.name)}</option>`).join('');
 return title('Condividi i progressi','Crea un’immagine con il tuo livello, i tuoi XP o un trofeo.')+
 section('Scheda da condividere',card(`<label>Contenuto della scheda<select id="share-kind"><option value="">Riepilogo dei progressi</option>${options}</select></label>
 <p class="muted">La scheda mostra solo dati della demo. Nome, saldo e attività personali restano fuori dall’immagine.</p>
 <img id="share-preview" width="1080" height="1080" alt="Anteprima della scheda di prova">
 <div class="row"><button type="button" id="share-native" hidden>Condividi immagine</button><a class="btn" id="share-download" download="cca-siemmu-progressi.png">Scarica PNG</a></div>
 <p id="share-feedback" class="muted" role="status"></p>`),link('Torna al profilo','profilo'));
}

function drawShareCard(trophy){
 const canvas=document.createElement('canvas');
 canvas.width=canvas.height=1080;
 const ctx=canvas.getContext('2d');
 const ink='#171523', cream='#fff3d5', sky='#8feafc', lime='#caff4d';
 const box=(color,x,y,w,h)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h);};
 const text=(copy,x,y,size,color=ink,maxWidth=880)=>{
  ctx.fillStyle=color;
  ctx.font=`bold ${size}px system-ui, sans-serif`;
  ctx.fillText(copy,x,y,maxWidth);
 };
 box(sky,0,0,1080,1080);
 for(let i=0;i<6;i++){
  box('#b9954b',i*180,890-(i%3)*40,180,200);
  box('#6f440f',i*180+20,950-(i%3)*40,125,130);
  box('#fe4400',i*180+42,940-(i%3)*40,81,18);
  box(cream,i*180+58,980-(i%3)*40,20,25);
 }
 box(ink,77,80,944,819);box(cream,66,68,944,819);
 box(lime,102,102,370,56);
 text('CCA SIEMMU · DEMO',118,142,30);
 text(trophy?'TROFEO OTTENUTO':'IL MIO PERCORSO',106,231,43);
 const level=progressLevel();
 text(trophy?trophy.name:level.name,102,390,106);
 const symbol=trophy?navIcons.missioni:cheese;
 ctx.save();
 ctx.translate(111,460);ctx.scale(9,9);
 for(const match of symbol.matchAll(/<path(?: fill="([^"]+)")? d="([^"]+)"\/>/g)){
  ctx.fillStyle=match[1]||ink;
  ctx.fill(new Path2D(match[2]));
 }
 ctx.restore();
 text(trophy?'Sbloccato nella demo':`Livello ${level.number} di 8`,288,519,51);
 text(`${level.xp} XP · ${earnedTrionfi().length} trofei`,288,590,40,'#6f440f');
 box(ink,104,676,862,4);
 text('E boni siemmu',105,774,55);
 text('CAMMARATA + SAN GIOVANNI GEMINI',107,832,27,'#6f440f');
 return canvas;
}

function initSharing(){
 const selector=document.querySelector('#share-kind');
 if(!selector)return;
 const preview=document.querySelector('#share-preview');
 const native=document.querySelector('#share-native');
 const download=document.querySelector('#share-download');
 const feedback=document.querySelector('#share-feedback');
 let payload;
 function update(){
  const trophy=earnedTrionfi().find(t=>t.id===selector.value);
  const png=drawShareCard(trophy).toDataURL('image/png');
  preview.src=download.href=png;
  preview.alt=trophy?`Scheda demo · Trofeo ${trophy.name}`:'Scheda demo con livello, XP e numero di trofei';
  const bytes=Uint8Array.from(atob(png.split(',')[1]),char=>char.charCodeAt(0));
  const file=new File([bytes],'cca-siemmu-progressi.png',{type:'image/png'});
  payload={files:[file]};
  native.hidden=!(typeof navigator.share==='function'&&navigator.canShare?.(payload));
  feedback.textContent=native.hidden?'Scarica l’immagine e allegala nell’app che preferisci.':'';
 }
 selector.addEventListener('change',update);
 native.addEventListener('click',async()=>{
  try {await navigator.share(payload);}
  catch(error){
   if(error.name!=='AbortError')feedback.textContent='Condivisione non disponibile. Puoi scaricare il PNG.';
  }
 });
 try {update();}
 catch {
  preview.hidden=true;
  download.hidden=true;
  feedback.textContent='Questo browser non ha potuto generare la scheda.';
 }
}
