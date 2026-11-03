(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const Rr=1/60,We={width:100,height:178,halfWidth:50,playerMinY:14,playerMaxY:74,spawnY:186,despawnY:-24},lt={sectors:10,missionsPerSector:30,missions:300},cn={enemies:64,playerBullets:220,enemyBullets:260,pickups:24,drones:3},Qa={lives:3,respawnInvuln:2.2},eo={low:{stars:320,particles:160,pixelRatio:1},medium:{stars:640,particles:340,pixelRatio:1.5},high:{stars:1100,particles:620,pixelRatio:2}};class ic{context=null;master=null;enabled=!0;musicEnabled=!0;musicTimer=null;musicStep=0;unlock(){if(this.context){this.context.state==="suspended"&&this.context.resume();return}try{const e=window.AudioContext??window.webkitAudioContext;if(!e)return;this.context=new e,this.master=this.context.createGain(),this.master.gain.value=.32,this.master.connect(this.context.destination)}catch{this.context=null}}setEnabled(e){this.enabled=e,e?this.musicEnabled&&this.startMusic():this.stopMusic()}setMusic(e){this.musicEnabled=e,e?this.startMusic():this.stopMusic()}tone(e,t,n,i,r=0){if(!this.context||!this.master||!this.enabled)return;const a=this.context.currentTime,o=this.context.createOscillator(),l=this.context.createGain();o.type=n,o.frequency.setValueAtTime(e,a),r!==0&&o.frequency.exponentialRampToValueAtTime(Math.max(30,e+r),a+t),l.gain.setValueAtTime(1e-4,a),l.gain.exponentialRampToValueAtTime(Math.max(2e-4,i),a+.012),l.gain.exponentialRampToValueAtTime(1e-4,a+t),o.connect(l),l.connect(this.master),o.start(a),o.stop(a+t+.02)}noise(e,t,n){if(!this.context||!this.master||!this.enabled)return;const i=Math.floor(this.context.sampleRate*e),r=this.context.createBuffer(1,i,this.context.sampleRate),a=r.getChannelData(0);for(let h=0;h<i;h+=1)a[h]=(Math.random()*2-1)*(1-h/i);const o=this.context.createBufferSource();o.buffer=r;const l=this.context.createBiquadFilter();l.type="lowpass",l.frequency.value=n;const c=this.context.createGain();c.gain.value=t,o.connect(l),l.connect(c),c.connect(this.master),o.start()}play(e){if(this.enabled)switch(this.unlock(),e){case"shoot":this.tone(680+Math.random()*120,.07,"square",.035,-260);break;case"hit":this.tone(320,.06,"triangle",.05,-80);break;case"explode":this.noise(.32,.22,900),this.tone(120,.24,"sawtooth",.08,-70);break;case"pickup":this.tone(760,.08,"sine",.08,240),this.tone(1140,.1,"sine",.05,120);break;case"boss":this.tone(70,.9,"sawtooth",.14,-18),this.noise(.7,.14,320);break;case"death":this.noise(.7,.28,620),this.tone(180,.6,"sawtooth",.12,-130);break;case"win":[523,659,784,1047].forEach((t,n)=>{window.setTimeout(()=>this.tone(t,.22,"triangle",.09),n*110)});break;case"lose":[392,330,262].forEach((t,n)=>{window.setTimeout(()=>this.tone(t,.3,"sine",.09),n*150)});break;case"missile":this.noise(.2,.1,1500);break;case"shield":this.tone(420,.18,"sine",.07,260);break;case"ui":this.tone(560,.05,"square",.035,80);break}}startMusic(){if(!this.enabled||!this.musicEnabled||this.musicTimer!==null||(this.unlock(),!this.context))return;const e=[110,130.8,146.8,174.6,196,174.6,146.8,130.8];this.musicTimer=window.setInterval(()=>{if(!this.context||!this.master)return;const t=this.context.currentTime,n=e[this.musicStep%e.length],i=this.context.createOscillator(),r=this.context.createGain();i.type="sine",i.frequency.value=n,r.gain.setValueAtTime(1e-4,t),r.gain.exponentialRampToValueAtTime(.03,t+.4),r.gain.exponentialRampToValueAtTime(1e-4,t+2.2),i.connect(r),r.connect(this.master),i.start(t),i.stop(t+2.3),this.musicStep+=1},1400)}stopMusic(){this.musicTimer!==null&&(window.clearInterval(this.musicTimer),this.musicTimer=null)}}const nt=new ic,Cr=[{id:1,name:"Frontier Patrol",subtitle:"Where the squadron begins",blurb:"Bright nebula dust, easy patrols and the first real capital ship.",faction:"crimson",boss:"dreadnought",terrain:"nebula",palette:{sky:"#05091a",nebula:"#2b3d8f",nebula2:"#7c3f8c",accent:"#4de1ff",planet:"#3b6ea8",fog:"#070c22"}},{id:2,name:"Crimson Nebula",subtitle:"Ash on every wing",blurb:"Red gas fields, dive bombers and a serpent that never sits still.",faction:"crimson",boss:"serpent",terrain:"dust",palette:{sky:"#160610",nebula:"#8f2238",nebula2:"#ff7a59",accent:"#ff8a5c",planet:"#a23c3c",fog:"#1c0810"}},{id:3,name:"Crystal Expanse",subtitle:"Light with edges",blurb:"Reflective debris and shield carriers that punish sloppy aim.",faction:"crystal",boss:"empress",terrain:"crystal",palette:{sky:"#04141c",nebula:"#0e7490",nebula2:"#67e8f9",accent:"#67e8f9",planet:"#155e75",fog:"#061a24"}},{id:4,name:"Inferno Belt",subtitle:"Keep clear of the rocks",blurb:"Asteroids, bombers and a carrier that fills the sky with fire.",faction:"iron",boss:"inferno",terrain:"asteroid",palette:{sky:"#190a04",nebula:"#b45309",nebula2:"#f97316",accent:"#fb923c",planet:"#7c2d12",fog:"#1d0d05"}},{id:5,name:"Frozen Void",subtitle:"Silence, then ice",blurb:"Slow-moving slabs of ice and a leviathan that freezes your wings.",faction:"crystal",boss:"leviathan",terrain:"ice",palette:{sky:"#040d18",nebula:"#1e4d7b",nebula2:"#bfe9ff",accent:"#93c5fd",planet:"#1e3a5f",fog:"#06121f"}},{id:6,name:"Electric Frontier",subtitle:"Everything hums",blurb:"EMP ships, chain lightning and a sovereign made of storms.",faction:"void",boss:"sovereign",terrain:"storm",palette:{sky:"#0a0620",nebula:"#4c1d95",nebula2:"#a78bfa",accent:"#c4b5fd",planet:"#312e81",fog:"#0d0824"}},{id:7,name:"Gravity Rift",subtitle:"Aim is a suggestion",blurb:"Warped space bends every shot and a harbinger that pulls you in.",faction:"void",boss:"harbinger",terrain:"rift",palette:{sky:"#0b0416",nebula:"#6b21a8",nebula2:"#f0abfc",accent:"#e879f9",planet:"#4c1d95",fog:"#120624"}},{id:8,name:"Phantom Sector",subtitle:"Nothing stays put",blurb:"Teleporting raiders, decoys and an ark that is never where you aim.",faction:"eclipse",boss:"ark",terrain:"phantom",palette:{sky:"#0b0716",nebula:"#831843",nebula2:"#f472b6",accent:"#f9a8d4",planet:"#500724",fog:"#150a1c"}},{id:9,name:"Iron Dominion",subtitle:"Armour all the way down",blurb:"Capital ships, heavy guns and a fortress that shrugs off everything.",faction:"iron",boss:"behemoth",terrain:"fortress",palette:{sky:"#0d0f14",nebula:"#78350f",nebula2:"#fbbf24",accent:"#fcd34d",planet:"#57534e",fog:"#12141a"}},{id:10,name:"Starfall Citadel",subtitle:"The last sky",blurb:"Every mechanic at once, ending at the Devourer itself.",faction:"eclipse",boss:"devourer",terrain:"citadel",palette:{sky:"#05030f",nebula:"#1e1b4b",nebula2:"#38bdf8",accent:"#7dd3fc",planet:"#0f172a",fog:"#08061a"}}];function Cs(s){return Cr[Math.max(0,Math.min(Cr.length-1,s-1))]}function Ma(s){let e=s>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function vi(s){let e=2166136261;for(let t=0;t<s.length;t+=1)e^=s.charCodeAt(t),e=Math.imul(e,16777619);return e>>>0}function sc(s,e,t){return e+s()*(t-e)}function mi(s,e,t){return Math.floor(sc(s,e,t+1-Number.EPSILON))}function Gs(s,e){if(e.length===0)throw new Error("pick() needs a non-empty list");return e[Math.min(e.length-1,Math.floor(s()*e.length))]}function rc(s,e){const t=[...e];for(let n=t.length-1;n>0;n-=1){const i=Math.floor(s()*(n+1)),r=t[n];t[n]=t[i],t[i]=r}return t}function ac(s,e){const t=e.reduce((i,[,r])=>i+Math.max(0,r),0);let n=s()*t;for(const[i,r]of e)if(n-=Math.max(0,r),n<=0)return i;return e[e.length-1][0]}const oc="#ff7a59",lc="#a78bfa",cc="#fbbf24",hc="#67e8f9",uc="#a3e635",dc="#f472b6",ml=[{id:"scout",name:"Scout",faction:"crimson",behavior:"advance",shape:"dart",hull:12,speed:26,radius:3.2,threat:1,score:40,fireCooldown:1.9,bulletDamage:5,color:"#8e2233",accent:oc},{id:"interceptor",name:"Interceptor",faction:"crimson",behavior:"sine",shape:"dart",hull:16,speed:34,radius:3.4,threat:1.4,score:55,fireCooldown:1.6,bulletDamage:6,color:"#7f1d1d",accent:"#fca5a5"},{id:"formation",name:"Formation Fighter",faction:"crimson",behavior:"advance",shape:"wedge",hull:20,speed:24,radius:3.8,threat:1.6,score:65,fireCooldown:2.2,bulletDamage:6,color:"#9f1239",accent:"#fda4af"},{id:"divebomber",name:"Dive Bomber",faction:"crimson",behavior:"dive",shape:"wedge",hull:22,speed:46,radius:3.9,threat:2.1,score:85,fireCooldown:2.6,bulletDamage:8,color:"#7c2d12",accent:"#fdba74"},{id:"heavybomber",name:"Heavy Bomber",faction:"iron",behavior:"advance",shape:"cruiser",hull:54,speed:17,radius:5.4,threat:3.2,score:130,fireCooldown:2.8,bulletDamage:10,color:"#44403c",accent:cc},{id:"shieldcarrier",name:"Shield Carrier",faction:"crystal",behavior:"shield",shape:"hex",hull:46,speed:20,radius:5,threat:3.4,score:150,fireCooldown:3.2,bulletDamage:7,color:"#155e75",accent:hc},{id:"missilefrigate",name:"Missile Frigate",faction:"iron",behavior:"hover",shape:"cruiser",hull:40,speed:16,radius:5.2,threat:3,score:140,fireCooldown:2.4,bulletDamage:12,color:"#3f3f46",accent:"#fdba74"},{id:"laserturret",name:"Laser Turret Ship",faction:"iron",behavior:"turret",shape:"orb",hull:34,speed:12,radius:4.2,threat:2.6,score:115,fireCooldown:1.8,bulletDamage:9,color:"#52525b",accent:"#fca5a5"},{id:"repairdrone",name:"Repair Drone",faction:"bioforge",behavior:"repair",shape:"orb",hull:26,speed:22,radius:3.4,threat:2.8,score:120,fireCooldown:4.5,bulletDamage:0,color:"#365314",accent:uc},{id:"supportcarrier",name:"Support Carrier",faction:"bioforge",behavior:"carrier",shape:"organic",hull:62,speed:15,radius:6.2,threat:4,score:190,fireCooldown:3.6,bulletDamage:7,color:"#3f6212",accent:"#d9f99d"},{id:"stealthfighter",name:"Stealth Fighter",faction:"eclipse",behavior:"teleport",shape:"wedge",hull:30,speed:40,radius:3.6,threat:3.1,score:155,fireCooldown:2.2,bulletDamage:9,color:"#4c1d95",accent:dc},{id:"sniper",name:"Sniper Ship",faction:"eclipse",behavior:"sniper",shape:"dart",hull:28,speed:18,radius:3.2,threat:3.3,score:165,fireCooldown:2.9,bulletDamage:16,color:"#581c87",accent:"#f9a8d4"},{id:"kamikaze",name:"Kamikaze Drone",faction:"crimson",behavior:"kamikaze",shape:"orb",hull:14,speed:62,radius:3,threat:1.8,score:70,fireCooldown:99,bulletDamage:18,color:"#b91c1c",accent:"#fecaca"},{id:"minelayer",name:"Mine Layer",faction:"iron",behavior:"minelayer",shape:"hex",hull:44,speed:20,radius:4.8,threat:3.2,score:160,fireCooldown:3.4,bulletDamage:14,color:"#57534e",accent:"#fbbf24"},{id:"swarmcarrier",name:"Drone Swarm Carrier",faction:"bioforge",behavior:"carrier",shape:"organic",hull:70,speed:14,radius:6.6,threat:4.4,score:210,fireCooldown:3.2,bulletDamage:6,color:"#365314",accent:"#a3e635"},{id:"destroyer",name:"Armored Destroyer",faction:"iron",behavior:"advance",shape:"cruiser",hull:110,speed:13,radius:7.2,threat:5.2,score:280,fireCooldown:2.2,bulletDamage:12,color:"#292524",accent:"#fbbf24"},{id:"leech",name:"Energy Leech",faction:"void",behavior:"leech",shape:"organic",hull:38,speed:30,radius:4,threat:3.4,score:175,fireCooldown:3,bulletDamage:6,color:"#3b0764",accent:lc},{id:"empship",name:"EMP Ship",faction:"void",behavior:"emp",shape:"orb",hull:44,speed:19,radius:4.6,threat:3.8,score:195,fireCooldown:3.8,bulletDamage:5,color:"#4c1d95",accent:"#c4b5fd"},{id:"teleporter",name:"Teleport Fighter",faction:"eclipse",behavior:"teleport",shape:"dart",hull:34,speed:38,radius:3.6,threat:3.6,score:185,fireCooldown:2,bulletDamage:10,color:"#6d28d9",accent:"#f0abfc"},{id:"gravitywell",name:"Gravity Disruptor",faction:"void",behavior:"gravity",shape:"ring",hull:58,speed:14,radius:5.6,threat:4.6,score:230,fireCooldown:4.2,bulletDamage:8,color:"#312e81",accent:"#e879f9"},{id:"artillery",name:"Plasma Artillery",faction:"iron",behavior:"artillery",shape:"wedge",hull:66,speed:15,radius:5.8,threat:4.4,score:240,fireCooldown:3.6,bulletDamage:15,color:"#78350f",accent:"#fb923c"},{id:"shieldgen",name:"Shield Generator",faction:"crystal",behavior:"shield",shape:"ring",hull:72,speed:12,radius:5.4,threat:4.8,score:250,fireCooldown:4,bulletDamage:0,color:"#0e7490",accent:"#a5f3fc"},{id:"minicapital",name:"Mini Capital Ship",faction:"iron",behavior:"advance",shape:"cruiser",hull:160,speed:10,radius:8.6,threat:6.5,score:380,fireCooldown:2.6,bulletDamage:13,color:"#1c1917",accent:"#fcd34d"},{id:"ace",name:"Elite Ace Fighter",faction:"eclipse",behavior:"ace",shape:"wedge",hull:74,speed:44,radius:4.2,threat:5.4,score:320,fireCooldown:1.7,bulletDamage:12,color:"#831843",accent:"#f9a8d4"},{id:"miniboss",name:"Miniboss Cruiser",faction:"void",behavior:"ace",shape:"cruiser",hull:230,speed:16,radius:9.4,threat:8,score:520,fireCooldown:1.9,bulletDamage:14,color:"#2e1065",accent:"#d8b4fe"}],fc=new Map(ml.map(s=>[s.id,s]));function Xn(s){return fc.get(s)??ml[0]}const to=[["scout","interceptor","formation"],["scout","interceptor","formation","divebomber","missilefrigate"],["interceptor","formation","shieldcarrier","laserturret","sniper"],["divebomber","heavybomber","missilefrigate","kamikaze","artillery"],["heavybomber","shieldcarrier","supportcarrier","repairdrone","sniper"],["laserturret","empship","leech","shieldgen","ace"],["gravitywell","artillery","teleporter","empship","minelayer"],["stealthfighter","teleporter","sniper","ace","repairdrone"],["destroyer","minicapital","shieldgen","artillery","heavybomber"],["ace","miniboss","teleporter","gravitywell","destroyer","stealthfighter"]],Sa=[{id:"dreadnought",sector:1,name:"The Dreadnought",subtitle:"Alien battleship",blurb:"A blunt instrument: four turrets, then the hull, then the core.",hp:900,turrets:4,turretHp:90,radius:14,x:0,color:"#3f3f46",accent:"#ff7a59",shape:"dreadnought",phases:[{at:1,name:"Turret Screen",patterns:["aimed"],fireCooldown:1.5,bulletSpeed:46,note:"Turrets fire aimed volleys."},{at:.66,name:"Broadside",patterns:["aimed","radial"],fireCooldown:1.2,bulletSpeed:52,note:"Radial bursts join the aimed fire."},{at:.33,name:"Exposed Core",patterns:["radial","burst"],fireCooldown:.95,bulletSpeed:58,note:"The core is open. Everything fires."}],reward:600},{id:"serpent",sector:2,name:"The Crimson Serpent",subtitle:"Segmented warship",blurb:"It coils across the lane, so the safe spot keeps moving.",hp:1150,turrets:5,turretHp:105,radius:15,x:0,color:"#7f1d1d",accent:"#ff8a5c",shape:"serpent",phases:[{at:1,name:"Coil",patterns:["sweep"],fireCooldown:1.4,bulletSpeed:50,note:"Sweeping fire follows the coil."},{at:.66,name:"Strike",patterns:["sweep","aimed"],fireCooldown:1.1,bulletSpeed:56,note:"It lunges and fires together."},{at:.33,name:"Frenzy",patterns:["spiral","radial"],fireCooldown:.85,bulletSpeed:62,note:"A spiral of plasma and no gaps."}],reward:750},{id:"empress",sector:3,name:"The Crystal Empress",subtitle:"Crystalline capital ship",blurb:"Rotating shield prisms make half your shots glance off.",hp:1450,turrets:6,turretHp:115,radius:15,x:0,color:"#155e75",accent:"#67e8f9",shape:"crystal",phases:[{at:1,name:"Prism Guard",patterns:["radial"],fireCooldown:1.5,bulletSpeed:50,note:"Radial shards from every facet."},{at:.66,name:"Refraction",patterns:["spiral","aimed"],fireCooldown:1.15,bulletSpeed:58,note:"Spirals that bend inward."},{at:.33,name:"Shatter",patterns:["burst","laser"],fireCooldown:.9,bulletSpeed:64,note:"Laser sweeps between bursts."}],reward:900},{id:"inferno",sector:4,name:"The Inferno Carrier",subtitle:"Fire-line carrier",blurb:"Launches bombers and lays burning mines behind them.",hp:1750,turrets:5,turretHp:130,radius:16,x:0,color:"#7c2d12",accent:"#fb923c",shape:"carrier",phases:[{at:1,name:"Launch Bay",patterns:["minions","aimed"],fireCooldown:1.6,bulletSpeed:48,note:"Bombers launch from the bay."},{at:.66,name:"Fire Line",patterns:["laser","mines"],fireCooldown:1.2,bulletSpeed:54,note:"Laser lines and mine drops."},{at:.33,name:"Meltdown",patterns:["burst","radial","minions"],fireCooldown:.8,bulletSpeed:60,note:"The reactor vents everything."}],reward:1050},{id:"leviathan",sector:5,name:"The Frost Leviathan",subtitle:"Ice-bound leviathan",blurb:"Freezing fields slow your ship and your shots.",hp:2050,turrets:6,turretHp:140,radius:17,x:0,color:"#1e3a5f",accent:"#93c5fd",shape:"leviathan",phases:[{at:1,name:"Rime",patterns:["aimed","sweep"],fireCooldown:1.5,bulletSpeed:46,note:"Slow, heavy aimed fire."},{at:.66,name:"Deep Freeze",patterns:["radial","laser"],fireCooldown:1.15,bulletSpeed:52,note:"Laser columns across the lane."},{at:.33,name:"Glacier Break",patterns:["spiral","burst"],fireCooldown:.85,bulletSpeed:58,note:"Ice shards spiral outward."}],reward:1200},{id:"sovereign",sector:6,name:"The Volt Sovereign",subtitle:"Storm battleship",blurb:"Chains lightning through your drones and your hull alike.",hp:2400,turrets:6,turretHp:150,radius:17,x:0,color:"#4c1d95",accent:"#c4b5fd",shape:"volt",phases:[{at:1,name:"Charge",patterns:["aimed","burst"],fireCooldown:1.35,bulletSpeed:56,note:"Short, sharp bursts."},{at:.66,name:"Arc Web",patterns:["spiral","radial"],fireCooldown:1.05,bulletSpeed:62,note:"A web of slow arcs."},{at:.33,name:"Overload",patterns:["laser","burst","mines"],fireCooldown:.75,bulletSpeed:68,note:"Overloaded emitters, no safe lane."}],reward:1400},{id:"harbinger",sector:7,name:"The Gravity Harbinger",subtitle:"Rift manipulator",blurb:"Pulls your ship toward the hull and bends every projectile.",hp:2750,turrets:5,turretHp:160,radius:18,x:0,color:"#4c1d95",accent:"#e879f9",shape:"harbinger",phases:[{at:1,name:"Pull",patterns:["radial"],fireCooldown:1.4,bulletSpeed:50,note:"Gravity drags you forward."},{at:.66,name:"Fold",patterns:["spiral","aimed"],fireCooldown:1.05,bulletSpeed:58,note:"Shots curve around the rift."},{at:.33,name:"Collapse",patterns:["burst","radial","laser"],fireCooldown:.78,bulletSpeed:64,note:"The rift starts collapsing."}],reward:1600},{id:"ark",sector:8,name:"The Phantom Ark",subtitle:"Stealth mothership",blurb:"Teleports, leaves decoys, and fires from wherever you are not looking.",hp:3100,turrets:6,turretHp:170,radius:18,x:0,color:"#831843",accent:"#f9a8d4",shape:"ark",phases:[{at:1,name:"Decoys",patterns:["minions","aimed"],fireCooldown:1.4,bulletSpeed:54,note:"Decoy fighters screen the hull."},{at:.66,name:"Blink",patterns:["aimed","mines"],fireCooldown:1,bulletSpeed:62,note:"It disappears and reappears."},{at:.33,name:"Unmasked",patterns:["spiral","burst","laser"],fireCooldown:.72,bulletSpeed:70,note:"No more hiding."}],reward:1850},{id:"behemoth",sector:9,name:"The Iron Behemoth",subtitle:"Mechanical fortress",blurb:"Heavy plating absorbs damage until every turret is gone.",hp:3600,turrets:8,turretHp:190,radius:19,x:0,color:"#292524",accent:"#fbbf24",shape:"fortress",phases:[{at:1,name:"Plating",patterns:["aimed","radial"],fireCooldown:1.5,bulletSpeed:54,note:"Armour shrugs off 65% of damage."},{at:.66,name:"Siege",patterns:["laser","mines"],fireCooldown:1.15,bulletSpeed:60,note:"Siege lasers sweep the lane."},{at:.33,name:"Breach",patterns:["burst","spiral"],fireCooldown:.8,bulletSpeed:68,note:"The armour is open. Hit the core."}],reward:2100},{id:"devourer",sector:10,name:"The Starfall Devourer",subtitle:"Alien mothership",blurb:"Everything the fleet has, all at once, with a core that fights back.",hp:5200,turrets:10,turretHp:220,radius:21,x:0,color:"#0f172a",accent:"#7dd3fc",shape:"devourer",phases:[{at:1,name:"Hive Screen",patterns:["minions","aimed","radial"],fireCooldown:1.35,bulletSpeed:58,note:"Swarms and aimed fire together."},{at:.66,name:"Starfall",patterns:["spiral","laser","burst"],fireCooldown:.95,bulletSpeed:66,note:"Spirals, laser sweeps, bursts."},{at:.33,name:"Devour",patterns:["radial","spiral","mines","burst"],fireCooldown:.68,bulletSpeed:74,note:"The Citadel itself comes apart."}],reward:3e3}],pc=new Map(Sa.map(s=>[s.id,s])),mc=new Map(Sa.map(s=>[s.sector,s]));function gc(s){return s?pc.get(s):void 0}function Ea(s){return mc.get(s)??Sa[0]}const wa=[{id:"weaponUp",name:"Weapon Upgrade",glyph:"▲",blurb:"One level on the current primary.",rarity:2,duration:0,color:"#4de1ff"},{id:"weaponSwap",name:"Weapon Swap",glyph:"⇄",blurb:"Cycles to the next primary weapon.",rarity:2,duration:0,color:"#a5b4fc"},{id:"rapid",name:"Rapid Fire",glyph:"⚡",blurb:"Firing cooldown cut by 40%.",rarity:1,duration:12,color:"#fde68a"},{id:"double",name:"Double Shot",glyph:"∥",blurb:"Adds a second stream.",rarity:1,duration:14,color:"#8ef0c8"},{id:"triple",name:"Triple Shot",glyph:"⋔",blurb:"Adds a third stream.",rarity:2,duration:14,color:"#6ee7b7"},{id:"spread",name:"Spread Shot",glyph:"⋁",blurb:"Fires an extra-wide fan.",rarity:2,duration:14,color:"#c4b5fd"},{id:"laserUp",name:"Laser Upgrade",glyph:"⌁",blurb:"Beam damage and penetration up.",rarity:2,duration:15,color:"#a5f3fc"},{id:"plasmaUp",name:"Plasma Upgrade",glyph:"◉",blurb:"Plasma damage and splash up.",rarity:2,duration:15,color:"#e879f9"},{id:"missiles",name:"Homing Missiles",glyph:"➤",blurb:"Passive seekers launch every second.",rarity:2,duration:16,color:"#fdba74"},{id:"missileBarrage",name:"Missile Barrage",glyph:"⇶",blurb:"Twelve missiles, all at once.",rarity:3,duration:0,color:"#fb923c"},{id:"shieldRecharge",name:"Shield Recharge",glyph:"◍",blurb:"Restores half the shield bubble.",rarity:1,duration:0,color:"#67e8f9"},{id:"megaShield",name:"Mega Shield",glyph:"◎",blurb:"Doubles shield capacity for a while.",rarity:3,duration:14,color:"#22d3ee"},{id:"invuln",name:"Invulnerability",glyph:"✧",blurb:"Six seconds of immunity.",rarity:3,duration:6,color:"#fef08a"},{id:"hullRepair",name:"Hull Repair",glyph:"✚",blurb:"Restores 35 hull.",rarity:1,duration:0,color:"#86efac"},{id:"fullRepair",name:"Full Repair",glyph:"✚✚",blurb:"Restores hull and shields completely.",rarity:4,duration:0,color:"#4ade80"},{id:"extraLife",name:"Extra Life",glyph:"♥",blurb:"One more life, up to five.",rarity:4,duration:0,color:"#fb7185"},{id:"speedBoost",name:"Speed Boost",glyph:"»",blurb:"Movement speed up 35%.",rarity:1,duration:12,color:"#5eead4"},{id:"timeSlow",name:"Time Slow",glyph:"◷",blurb:"Enemies and bullets slow down.",rarity:3,duration:8,color:"#bae6fd"},{id:"emp",name:"EMP Blast",glyph:"⌾",blurb:"Disables every enemy briefly.",rarity:2,duration:0,color:"#a5f3fc"},{id:"screenBomb",name:"Screen Bomb",glyph:"✸",blurb:"Adds a screen-clearing bomb charge.",rarity:2,duration:0,color:"#fbbf24"},{id:"megaBomb",name:"Mega Bomb",glyph:"✹",blurb:"Adds two bomb charges.",rarity:3,duration:0,color:"#f97316"},{id:"drone",name:"Companion Drone",glyph:"◆",blurb:"One support drone joins the wing.",rarity:2,duration:18,color:"#93c5fd"},{id:"twinDrone",name:"Twin Drones",glyph:"◈",blurb:"Two support drones.",rarity:3,duration:18,color:"#60a5fa"},{id:"droneUpgrade",name:"Drone Upgrade",glyph:"◇",blurb:"Drones fire faster and hit harder.",rarity:3,duration:16,color:"#818cf8"},{id:"damageBoost",name:"Damage Boost",glyph:"✦",blurb:"All damage up 30%.",rarity:2,duration:12,color:"#fca5a5"},{id:"critBoost",name:"Critical Boost",glyph:"✷",blurb:"Critical chance up to 45%.",rarity:3,duration:14,color:"#f9a8d4"},{id:"energyRegen",name:"Energy Regen",glyph:"◌",blurb:"Ability and secondary cooldowns drop.",rarity:2,duration:14,color:"#a7f3d0"},{id:"reflect",name:"Projectile Reflect",glyph:"⟲",blurb:"Enemy shots bounce back for 8s.",rarity:4,duration:8,color:"#fef3c7"},{id:"magnet",name:"Magnet Field",glyph:"⊃",blurb:"Pickups fly to your ship.",rarity:1,duration:16,color:"#f0abfc"},{id:"scoreMult",name:"Score Multiplier",glyph:"×2",blurb:"Double points for 18s.",rarity:2,duration:18,color:"#fcd34d"},{id:"credits",name:"Credit Bonus",glyph:"¤",blurb:"A handful of credits, banked now.",rarity:1,duration:0,color:"#fde047"},{id:"chain",name:"Chain Lightning",glyph:"⌁⌁",blurb:"Shots arc to nearby enemies.",rarity:3,duration:14,color:"#c4b5fd"},{id:"pierce",name:"Piercing Shots",glyph:"⇢",blurb:"Shots pass through two hulls.",rarity:2,duration:14,color:"#e2e8f0"},{id:"explosive",name:"Explosive Rounds",glyph:"✺",blurb:"Every hit splashes to neighbours.",rarity:3,duration:14,color:"#fb923c"},{id:"phoenix",name:"Phoenix Burst",glyph:"✵",blurb:"A radial fire wave, right now.",rarity:3,duration:0,color:"#f97316"},{id:"gravity",name:"Gravity Pulse",glyph:"◉",blurb:"Throws every nearby threat away.",rarity:2,duration:0,color:"#c084fc"},{id:"repairDrone",name:"Repair Drone",glyph:"✚◆",blurb:"Bleeds hull back for 20s.",rarity:3,duration:20,color:"#6ee7b7"},{id:"shieldDrone",name:"Shield Drone",glyph:"◍◆",blurb:"Intercepts incoming fire for 20s.",rarity:3,duration:20,color:"#38bdf8"},{id:"overdrive",name:"Overdrive",glyph:"⏫",blurb:"Everything offensive, doubled.",rarity:4,duration:9,color:"#f43f5e"},{id:"starfall",name:"Starfall Strike",glyph:"☄",blurb:"The squadron calls in a strike.",rarity:4,duration:0,color:"#facc15"}],Ks=new Map(wa.map(s=>[s.id,s])),is={1:62,2:26,3:9,4:3},_c=["v","line","diamond","wedge","spiral","pincer","swarm","stagger","escort"],vc={eliminate:["Patrol Sweep","Clear the Lane","Hunter Detail","Sweep and Burn","Contact Report"],survive:["Hold the Line","Holding Pattern","Under Siege","Wait It Out","Last Stand"],boss:["Capital Contact","Sector Flagship","Break the Hull","Final Approach","Citadel Gate"],elite:["Elite Sighted","Cruiser Hunt","Ace Down","Priority Kill","Heavy Contact"],interception:["Runners","Stop Them","Closing Window","Intercept","No Escape"],asteroid:["Debris Field","Rock Run","Through the Belt","Asteroid Alley","Tight Quarters"],resource:["Recovery","Salvage Run","Cores First","Gather and Go","Supply Drop"],gauntlet:["Gauntlet","No Respite","Wave After Wave","The Long Fight","Attrition"],escort:["Courier Run","Escort Duty","Keep It Alive","Safe Passage","Shepherd"],defense:["Station Watch","Hold the Dock","Shield Wall","Protect the Relay","Garrison"]},xc={eliminate:"Thin out the patrol before it can call for help.",survive:"The squadron cannot withdraw yet. Stay alive until the window closes.",boss:"A capital ship is in the lane. Take it apart piece by piece.",elite:"Elite cruisers are screening the fleet. Break them.",interception:"Priority runners are breaking for the jump point. Do not let them leave.",asteroid:"A debris field sits between you and the objective. Fly it.",resource:"Energy cores are drifting in the wreckage. Recover them.",gauntlet:"No resupply, no pause. Clear every wave.",escort:"A courier is carrying the sector plans. Keep it in one piece.",defense:"A relay station is under fire. Nothing gets through."},no=[{name:"First Contact",kind:"eliminate",target:6,brief:"Scouts only. Drag anywhere in the lower half of the screen to fly, and your cannon fires itself."},{name:"Two Directions",kind:"eliminate",target:9,brief:"Interceptors weave. Lead them or let the stream do the work."},{name:"Formation Flying",kind:"eliminate",target:12,brief:"They arrive in a V. Break the point and the rest scatter."},{name:"Hold the Line",kind:"survive",target:30,brief:"Survive for thirty seconds. Pickups are falling: grab the green ones."},{name:"Salvage",kind:"resource",target:4,brief:"Collect four energy cores. They drift down the lane with the wreckage."},{name:"First Blood",kind:"eliminate",target:16,brief:"More of the same, faster. Watch the bottom of the screen."},{name:"Runners",kind:"interception",target:4,brief:"Marked runners must not escape off the bottom of the screen."},{name:"Debris",kind:"asteroid",target:25,brief:"Rocks cannot be ignored. Shoot the small ones, dodge the big ones."},{name:"Cover",kind:"escort",target:30,brief:"Keep the courier alive for thirty seconds. It will not dodge for you."},{name:"Station Watch",kind:"defense",target:30,brief:"The relay is taking fire. Keep the lane clear."},{name:"Wingmates",kind:"eliminate",target:20,brief:"Drones and upgrades stack. Try the secondary weapon button."},{name:"Ace",kind:"elite",target:1,brief:"An elite ace is in the lane. It dodges, so trap it against a wall."},{name:"Gauntlet",kind:"gauntlet",target:24,brief:"Every archetype you have met so far, in one run."},{name:"Long Patrol",kind:"survive",target:45,brief:"Forty-five seconds. Shield pickups are rarer out here."},{name:"Ace Wing",kind:"elite",target:1,brief:"An elite ace is screening the lane. Break it and the rest scatter."}];function yc(s,e){if(e===lt.missionsPerSector)return"boss";if(e===25)return"gauntlet";if(e===20)return"elite";if(e===15)return"defense";if(e===10)return"interception";const t=["eliminate","survive","resource","asteroid","eliminate","escort","eliminate"];return t[(e+s*2)%t.length]}function gl(s){return to[Math.max(0,Math.min(to.length-1,s-1))]}function _l(s){return Gs(s,_c)}function bc(s,e,t,n){const i=Xn(e),r=i.threat>=5?mi(s,1,2):i.threat>=3?mi(s,2,3):mi(s,3,5);return{archetype:e,count:r,formation:_l(s),x:t,priority:n}}function Mc(s,e){return Math.min(10,Number(((s-1)*.92+e/lt.missionsPerSector*3.1).toFixed(2)))}function Sc(s,e,t,n){switch(s){case"eliminate":return{kind:s,target:Math.max(4,Math.min(e,t)),label:`Destroy ${Math.max(4,Math.min(e,t))} hostiles`};case"survive":return{kind:s,target:e,label:`Survive ${e}s`};case"boss":return{kind:s,target:1,label:`Destroy ${n}`};case"elite":return{kind:s,target:e,label:`Destroy ${e} elite ${e===1?"ace":"aces"}`};case"interception":return{kind:s,target:e,label:`Stop ${e} runners escaping`};case"asteroid":return{kind:s,target:e,label:`Survive the debris field for ${e}s`};case"resource":return{kind:s,target:e,label:`Recover ${e} energy cores`};case"gauntlet":return{kind:s,target:t,label:`Clear all ${t} hostiles`};case"escort":return{kind:s,target:e,label:`Protect the courier for ${e}s`};case"defense":return{kind:s,target:e,label:`Defend the relay for ${e}s`}}}function Ec(s,e,t,n,i,r){const a=gl(e),o=n==="boss",l=o?16+e*5:18+i*7.5,c=o?2:Math.max(3,Math.min(9,3+Math.floor(t/5))),h=33,d=[];for(let b=0;b<c;b+=1){const p=Math.min(h,l/c),u=[];let S=0,E=0;for(;S<p&&E<8;){E+=1;const A=Gs(s,a),T=Xn(A),R=n==="interception"&&b%2===0,D=bc(s,A,mi(s,-34,34),R);if(S+T.threat*D.count>h){const x=Math.floor((h-S)/T.threat);if(x<1)continue;D.count=x}if(u.push(D),S+=T.threat*D.count,R)break}u.length===0&&u.push({archetype:a[0],count:2,formation:"line",x:0});const M=o?4+b*8:2+b*(r-10)/c;d.push({at:Number(M.toFixed(1)),entries:u})}n==="elite"&&d[d.length-1].entries.push({archetype:"ace",count:1,formation:"line",x:0});let f=0,m=0,_=0;for(const b of d)for(const p of b.entries)f+=p.count,m+=Xn(p.archetype).threat*p.count,p.priority&&(_+=p.count);return{waves:d,enemyCount:f,threat:Number(m.toFixed(1)),priority:_}}function wc(s,e,t){const n=Math.min(4,1+Math.ceil(e/3)),i=wa.filter(a=>a.rarity<=n&&(t==="survive"||a.duration>0||a.rarity<=2));return rc(s,i).slice(0,10).map(a=>a.id)}function vl(s){const e=Math.min(lt.sectors,Math.ceil(s/lt.missionsPerSector)),t=(s-1)%lt.missionsPerSector+1,n=vi(`starfall-squadron-v1:${s}`),i=Ma(n),r=s<=no.length?no[s-1]:void 0,a=r?.kind??yc(e,t),o=a==="boss"?Ea(e):null,l=Mc(e,t),c=a==="boss"?150:a==="survive"?55+e*4:52+t+e*3,h=Math.min(150,c),{waves:d,enemyCount:f,threat:m,priority:_}=Ec(i,e,t,a,l,h),b=Math.round(h*.62),p=Math.max(4,Math.round(f*.55)),u=Math.min(6,3+Math.floor(e/3)),S=o?.name??"the flagship",E=a==="survive"||a==="asteroid"||a==="escort"||a==="defense"?b:a==="resource"?u:a==="boss"?1:a==="interception"?Math.max(1,Math.min(Math.round(2+e/4),_)):a==="elite"?Math.max(1,Math.round(e/3)):a==="gauntlet"?f:p,M=Sc(a,E,f,S),A=vc[a],T=r?.name??`${Gs(i,A)}`,R=Math.max(600,f*55+(o?2200:0)),D=[Math.round(R/100)*100,Math.round(R*1.55/100)*100,Math.round(R*2.3/100)*100],x=[];return(a==="asteroid"||e===4||e>=6&&t%7===0)&&x.push("asteroid"),e>=7&&(t%5===0||a==="survive")&&x.push("gravity"),{id:`ss-${String(s).padStart(3,"0")}`,index:s,sector:e,local:t,seed:n,name:T,type:a,brief:r?.brief??xc[a],objective:M,waves:d,duration:h,difficulty:l,boss:o?.id??null,hazards:x,allowedPowerUps:wc(i,e,a),starScore:D,threat:m,enemyCount:f}}function $n(s){const e=Math.max(1,Math.min(lt.missions,Math.round(s)));return vl(e)}let ss=null;function Tc(){return ss||(ss=Array.from({length:lt.missions},(s,e)=>vl(e+1)),ss)}function io(s,e=1){const t=1+(s*7+e)%lt.missions,n=$n(t),i=Math.min(10,1+Math.floor(s/3)),r=Math.min(32,14+s*2.4),a=Ma(vi(`endless:${s}:${e}`)),o=gl(i),l=[];let c=0,h=0,d=0;for(;c<r&&l.length<6&&d<10;){d+=1;const f=Gs(a,o),m={archetype:f,count:mi(a,2,4),formation:_l(a),x:mi(a,-32,32)},_=Xn(f).threat*m.count;if(c+_>33){const b=Math.floor((33-c)/Xn(f).threat);if(b<1)continue;m.count=b}l.push(m),c+=Xn(f).threat*m.count,h+=m.count}return{...n,id:`endless-${s}`,index:9e3+s,sector:i,local:Math.min(30,1+s%30),seed:vi(`endless:${s}:${e}`),name:`Wave ${s}`,type:"gauntlet",brief:"Endless survival. Each wave is denser than the last.",objective:{kind:"gauntlet",target:h,label:`Clear wave ${s}`},waves:[{at:2.5,entries:l}],duration:90,difficulty:Math.min(10,2+s*.35),boss:s%5===0?Ea(i).id:null,hazards:s>=4?["asteroid"]:[],starScore:[600,1200,2e3],threat:Number(c.toFixed(1)),enemyCount:h}}function so(s){const e=Math.max(1,Math.min(10,s)),t=Ea(e);return{...$n(e*lt.missionsPerSector),id:`bossrush-${s}`,name:t.name,type:"boss",brief:t.blurb,objective:{kind:"boss",target:1,label:`Destroy ${t.name}`},boss:t.id,waves:[{at:3,entries:[{archetype:"interceptor",count:3,formation:"v",x:0}]}],duration:150,difficulty:Math.min(10,2+s),starScore:[2e3,3600,5200],enemyCount:3,threat:4.2}}function Ac(s){const e=`${s.getUTCFullYear()}-${s.getUTCMonth()+1}-${s.getUTCDate()}`,t=vi(`daily:${e}`),n=1+t%lt.missions;return{...$n(n),id:`daily-${e}`,seed:t,name:"Daily Sortie",brief:"One shared mission per day. Same sky for every pilot."}}const Fs=[{id:"oneLife",name:"One Life Only",blurb:"No respawns. One hull."},{id:"noShields",name:"No Shields",blurb:"Shields are offline for the whole sortie."},{id:"basicWeapon",name:"Basic Weapon Only",blurb:"The pulse cannon, unupgraded."},{id:"missileOnly",name:"Missile Specialist",blurb:"Secondaries only. Make every shot land."},{id:"droneCommander",name:"Drone Commander",blurb:"Two drones, a weak hull."},{id:"speedClear",name:"Speed Clear",blurb:"Everything moves faster."},{id:"noDamage",name:"Boss No-Damage",blurb:"Take a single hit and the sortie ends."},{id:"survival",name:"Survival Marathon",blurb:"Ten waves. One hull. Keep going."},{id:"precision",name:"Precision Pilot",blurb:"Smaller ship, faster bullets."},{id:"eliteFleet",name:"Elite Fleet",blurb:"Aces and cruisers from the first second."}];function Rc(s,e=7){const t=$n(s==="eliteFleet"?300:s==="survival"?250:150);return{...t,id:`challenge-${s}`,seed:vi(`challenge:${s}:${e}`),name:Fs.find(n=>n.id===s)?.name??"Challenge",brief:Fs.find(n=>n.id===s)?.blurb??t.brief}}const Os=[{id:"falcon",name:"Falcon Interceptor",className:"Balanced fighter",blurb:"The squadron workhorse. Nothing it does badly, nothing it does best.",hull:100,shield:60,shieldRegen:7,speed:62,accel:340,damage:1,fireRate:1,drones:0,ability:"overdrive",abilityName:"Overdrive",abilityBlurb:"Eight seconds of doubled fire rate.",cost:0,hullColor:"#dbeafe",accentColor:"#4de1ff",shape:"falcon"},{id:"viper",name:"Viper Striker",className:"Fast interceptor",blurb:"Sprints across the lane and gets out again. Do not get hit.",hull:78,shield:48,shieldRegen:9,speed:82,accel:470,damage:.94,fireRate:1.12,drones:0,ability:"phase",abilityName:"Phase Dash",abilityBlurb:"A short burst of invulnerability.",cost:900,hullColor:"#bbf7d0",accentColor:"#22c55e",shape:"viper"},{id:"titan",name:"Titan Defender",className:"Heavy armour",blurb:"Slow, stubborn and impossible to knock out of the sky quickly.",hull:165,shield:95,shieldRegen:5,speed:46,accel:240,damage:1.1,fireRate:.88,drones:1,ability:"bastion",abilityName:"Bastion",abilityBlurb:"Restores a full shield bubble instantly.",cost:1600,hullColor:"#fed7aa",accentColor:"#f59e0b",shape:"titan"},{id:"spear",name:"Nova Spear",className:"Glass cannon",blurb:"Everything into the guns. The hull is a formality.",hull:70,shield:44,shieldRegen:6,speed:60,accel:330,damage:1.5,fireRate:.82,drones:0,ability:"pierce",abilityName:"Lance",abilityBlurb:"Six seconds of piercing shots.",cost:2200,hullColor:"#fecdd3",accentColor:"#fb7185",shape:"spear"},{id:"phantom",name:"Specter Phantom",className:"Evasive precision",blurb:"Built around slipping out of the way and hitting exactly once.",hull:86,shield:66,shieldRegen:11,speed:72,accel:400,damage:1.16,fireRate:1.05,drones:1,ability:"cloak",abilityName:"Cloak",abilityBlurb:"Two seconds untouchable and untargetable.",cost:2900,hullColor:"#e9d5ff",accentColor:"#c084fc",shape:"phantom"},{id:"phoenix",name:"Phoenix Assault",className:"Fire support",blurb:"Close-range brawler that leaves a trail of burning hulls.",hull:118,shield:72,shieldRegen:7,speed:64,accel:350,damage:1.28,fireRate:.98,drones:1,ability:"inferno",abilityName:"Inferno Burst",abilityBlurb:"A radial wave of fire damage.",cost:3800,hullColor:"#fed7aa",accentColor:"#f97316",shape:"phoenix"},{id:"sentinel",name:"Guardian Sentinel",className:"Shield platform",blurb:"A bubble with engines. Wins by simply refusing to die.",hull:120,shield:175,shieldRegen:16,speed:52,accel:270,damage:.96,fireRate:.95,drones:2,ability:"aegis",abilityName:"Aegis",abilityBlurb:"A temporary double-width shield bubble.",cost:4800,hullColor:"#cffafe",accentColor:"#22d3ee",shape:"sentinel"},{id:"tempest",name:"Tempest Raider",className:"Chain damage",blurb:"Every shot forks into the next ship along. Crowds are a gift.",hull:104,shield:78,shieldRegen:10,speed:68,accel:380,damage:1.12,fireRate:1.02,drones:1,ability:"storm",abilityName:"Chain Storm",abilityBlurb:"A chaining arc through every nearby enemy.",cost:6e3,hullColor:"#ddd6fe",accentColor:"#8b5cf6",shape:"tempest"},{id:"eclipse",name:"Eclipse Hunter",className:"Critical specialist",blurb:"Low damage, brutal criticals, and it moves like it knows it.",hull:92,shield:70,shieldRegen:12,speed:76,accel:420,damage:1.34,fireRate:1,drones:1,ability:"crit",abilityName:"Weak Point",abilityBlurb:"Four seconds of guaranteed critical hits.",cost:7800,hullColor:"#fbcfe8",accentColor:"#f472b6",shape:"eclipse"},{id:"prime",name:"Starfall Prime",className:"Endgame prototype",blurb:"The Citadel frame itself, rebuilt for the squadron. Everything, all at once.",hull:150,shield:150,shieldRegen:14,speed:70,accel:400,damage:1.42,fireRate:1.1,drones:2,ability:"nova",abilityName:"Starfall Nova",abilityBlurb:"A screen-wide strike that clears the lane.",cost:12e3,hullColor:"#e0f2fe",accentColor:"#facc15",shape:"prime"}],Pr=new Map(Os.map(s=>[s.id,s]));function Ta(s){return Pr.get(s)??Os[0]}const Cc=[{id:"std",name:"Squadron Standard",cost:0,color:"#4de1ff",trail:!1},{id:"solar",name:"Solar Flare",cost:400,color:"#fbbf24",trail:!0},{id:"void",name:"Void Violet",cost:550,color:"#a78bfa",trail:!0},{id:"emerald",name:"Emerald Wake",cost:650,color:"#34d399",trail:!0},{id:"crimson",name:"Crimson Comet",cost:800,color:"#fb7185",trail:!0},{id:"aurora",name:"Aurora",cost:1100,color:"#67e8f9",trail:!0}],xl="starfall-squadron-save-v1",Dr=[{id:"first-contact",name:"First Contact",blurb:"Clear your first mission."},{id:"squadron-rookie",name:"Squadron Rookie",blurb:"Clear ten missions."},{id:"alien-hunter",name:"Alien Hunter",blurb:"Destroy 250 hostiles."},{id:"shield-master",name:"Shield Master",blurb:"Finish a mission without losing shields."},{id:"missile-commander",name:"Missile Commander",blurb:"Use every secondary weapon type."},{id:"drone-specialist",name:"Drone Specialist",blurb:"Fly with two drones at once."},{id:"boss-breaker",name:"Boss Breaker",blurb:"Destroy any sector boss."},{id:"sector-liberator",name:"Sector Liberator",blurb:"Clear all thirty missions in a sector."},{id:"missions-100",name:"Century Pilot",blurb:"Clear 100 missions."},{id:"missions-200",name:"Veteran",blurb:"Clear 200 missions."},{id:"missions-300",name:"Squadron Legend",blurb:"Clear all 300 missions."},{id:"endless-survivor",name:"Endless Survivor",blurb:"Reach wave 10 in Endless Survival."},{id:"starfall-legend",name:"Starfall Legend",blurb:"Earn three stars on a Citadel mission."},{id:"hangar-collector",name:"Hangar Collector",blurb:"Own five different ships."},{id:"daily-habit",name:"Daily Habit",blurb:"Complete a daily sortie."},{id:"rush-hour",name:"Rush Hour",blurb:"Clear three bosses in one Boss Rush."}];function zi(){return{version:2,progress:{},credits:0,totalKills:0,secondaryUsed:[],ships:["falcon"],ship:"falcon",weapons:{pulse:1,spread:1,beam:1,ion:1,photon:1,rail:1,arc:1,particle:1,fusion:1,wave:1},primary:"pulse",secondary:"missiles",cosmetics:{trails:["std"],trail:"std",hull:"std"},achievements:[],daily:{date:"",score:0,done:!1,streak:0},endlessBest:0,bossRushBest:0,arcadeBest:0,settings:{sound:!0,music:!0,motion:!0,quality:"high",highContrast:!1,control:"absolute",leftHanded:!1,sensitivity:1},lastMission:1}}function Pc(s){if(!s||typeof s!="object")return!1;const e=s;return typeof e.version=="number"&&typeof e.ship=="string"&&!!e.settings}function Dc(){try{const s=localStorage.getItem(xl);if(!s)return zi();const e=JSON.parse(s);if(!Pc(e))return zi();const t=zi(),n={...t,...e,progress:{...t.progress,...e.progress??{}},weapons:{...t.weapons,...e.weapons??{}},cosmetics:{...t.cosmetics,...e.cosmetics??{}},settings:{...t.settings,...e.settings??{}},daily:{...t.daily,...e.daily??{}},ships:Array.isArray(e.ships)&&e.ships.length>0?e.ships:t.ships,achievements:Array.isArray(e.achievements)?e.achievements:[],totalKills:typeof e.totalKills=="number"?e.totalKills:0,secondaryUsed:Array.isArray(e.secondaryUsed)?e.secondaryUsed:[]};return n.ships.includes(n.ship)||(n.ship=n.ships[0]??"falcon"),n.ships.includes("falcon")||n.ships.unshift("falcon"),n.version=2,n}catch{return zi()}}function kt(s){try{localStorage.setItem(xl,JSON.stringify(s))}catch{}}function Bs(s){return Object.values(s.progress).filter(e=>e.cleared).length}function Lc(s){return Object.values(s.progress).reduce((e,t)=>e+t.stars,0)}function Wi(s,e){return e<=1?!0:!!s.progress[e-1]?.cleared}function Ic(s,e){const t=(e-1)*lt.missionsPerSector+1;return Wi(s,t)}function Lr(s,e){let t=0,n=0;for(let i=1;i<=lt.missionsPerSector;i+=1){const r=(e-1)*lt.missionsPerSector+i,a=s.progress[r];a?.cleared&&(t+=1),n+=a?.stars??0}return{cleared:t,stars:n}}function Uc(s,e,t,n,i){const r=s.progress[e.index],a=!r||t>r.score,o=!r||n>r.stars;return s.progress[e.index]={stars:Math.max(r?.stars??0,n),score:Math.max(r?.score??0,t),cleared:!0},s.credits+=i,e.index>s.lastMission&&(s.lastMission=Math.min(lt.missions,e.index+1)),{mission:e,score:t,stars:n,credits:i,newBest:a,newStars:o}}function Nc(s,e){const t=Ta(e);return s.ships.includes(e)||s.credits<t.cost?!1:(s.credits-=t.cost,s.ships.push(e),!0)}function Fc(s,e){const t=s.weapons[e]??1;if(t>=5)return!1;const n=350*t;return s.credits<n?!1:(s.credits-=n,s.weapons[e]=t+1,!0)}function Oc(s,e,t){return s.cosmetics.trails.includes(e)||s.credits<t?!1:(s.credits-=t,s.cosmetics.trails.push(e),!0)}function Bc(s,e){s.ships.includes(e)&&(s.ship=e)}const Aa="180",kc=0,ro=1,zc=2,yl=1,Hc=2,mn=3,Rn=0,Rt=1,Yt=2,wn=0,gi=1,Xi=2,ao=3,oo=4,Gc=5,Hn=100,Vc=101,Wc=102,Xc=103,$c=104,qc=200,Yc=201,Kc=202,jc=203,Ir=204,Ur=205,Zc=206,Jc=207,Qc=208,eh=209,th=210,nh=211,ih=212,sh=213,rh=214,Nr=0,Fr=1,Or=2,xi=3,Br=4,kr=5,zr=6,Hr=7,bl=0,ah=1,oh=2,Tn=0,lh=1,ch=2,hh=3,uh=4,dh=5,fh=6,ph=7,Ml=300,yi=301,bi=302,Gr=303,Vr=304,Vs=306,Wr=1e3,Vn=1001,Xr=1002,Ft=1003,mh=1004,rs=1005,nn=1006,js=1007,Wn=1008,an=1009,Sl=1010,El=1011,$i=1012,Ra=1013,Yn=1014,sn=1015,Ji=1016,Ca=1017,Pa=1018,qi=1020,wl=35902,Tl=35899,Al=1021,Rl=1022,Zt=1023,Yi=1026,Ki=1027,Da=1028,La=1029,Cl=1030,Ia=1031,Ua=1033,Ps=33776,Ds=33777,Ls=33778,Is=33779,$r=35840,qr=35841,Yr=35842,Kr=35843,jr=36196,Zr=37492,Jr=37496,Qr=37808,ea=37809,ta=37810,na=37811,ia=37812,sa=37813,ra=37814,aa=37815,oa=37816,la=37817,ca=37818,ha=37819,ua=37820,da=37821,fa=36492,pa=36494,ma=36495,ga=36283,_a=36284,va=36285,xa=36286,gh=3200,_h=3201,Pl=0,vh=1,En="",Ht="srgb",Mi="srgb-linear",ks="linear",Ke="srgb",Jn=7680,lo=519,xh=512,yh=513,bh=514,Dl=515,Mh=516,Sh=517,Eh=518,wh=519,co=35044,Th=35048,ho="300 es",rn=2e3,zs=2001;class Ti{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const xt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let uo=1234567;const Gi=Math.PI/180,ji=180/Math.PI;function Ai(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(xt[s&255]+xt[s>>8&255]+xt[s>>16&255]+xt[s>>24&255]+"-"+xt[e&255]+xt[e>>8&255]+"-"+xt[e>>16&15|64]+xt[e>>24&255]+"-"+xt[t&63|128]+xt[t>>8&255]+"-"+xt[t>>16&255]+xt[t>>24&255]+xt[n&255]+xt[n>>8&255]+xt[n>>16&255]+xt[n>>24&255]).toLowerCase()}function ze(s,e,t){return Math.max(e,Math.min(t,s))}function Na(s,e){return(s%e+e)%e}function Ah(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function Rh(s,e,t){return s!==e?(t-s)/(e-s):0}function Vi(s,e,t){return(1-t)*s+t*e}function Ch(s,e,t,n){return Vi(s,e,1-Math.exp(-t*n))}function Ph(s,e=1){return e-Math.abs(Na(s,e*2)-e)}function Dh(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Lh(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function Ih(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Uh(s,e){return s+Math.random()*(e-s)}function Nh(s){return s*(.5-Math.random())}function Fh(s){s!==void 0&&(uo=s);let e=uo+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Oh(s){return s*Gi}function Bh(s){return s*ji}function kh(s){return(s&s-1)===0&&s!==0}function zh(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Hh(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Gh(s,e,t,n,i){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),d=r((e-n)/2),f=a((e-n)/2),m=r((n-e)/2),_=a((n-e)/2);switch(i){case"XYX":s.set(o*h,l*d,l*f,o*c);break;case"YZY":s.set(l*f,o*h,l*d,o*c);break;case"ZXZ":s.set(l*d,l*f,o*h,o*c);break;case"XZX":s.set(o*h,l*_,l*m,o*c);break;case"YXY":s.set(l*m,o*h,l*_,o*c);break;case"ZYZ":s.set(l*_,l*m,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function fi(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function St(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const fo={DEG2RAD:Gi,RAD2DEG:ji,generateUUID:Ai,clamp:ze,euclideanModulo:Na,mapLinear:Ah,inverseLerp:Rh,lerp:Vi,damp:Ch,pingpong:Ph,smoothstep:Dh,smootherstep:Lh,randInt:Ih,randFloat:Uh,randFloatSpread:Nh,seededRandom:Fh,degToRad:Oh,radToDeg:Bh,isPowerOfTwo:kh,ceilPowerOfTwo:zh,floorPowerOfTwo:Hh,setQuaternionFromProperEuler:Gh,normalize:St,denormalize:fi};class He{constructor(e=0,t=0){He.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Qi{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3];const f=r[a+0],m=r[a+1],_=r[a+2],b=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d;return}if(o===1){e[t+0]=f,e[t+1]=m,e[t+2]=_,e[t+3]=b;return}if(d!==b||l!==f||c!==m||h!==_){let p=1-o;const u=l*f+c*m+h*_+d*b,S=u>=0?1:-1,E=1-u*u;if(E>Number.EPSILON){const A=Math.sqrt(E),T=Math.atan2(A,u*S);p=Math.sin(p*T)/A,o=Math.sin(o*T)/A}const M=o*S;if(l=l*p+f*M,c=c*p+m*M,h=h*p+_*M,d=d*p+b*M,p===1-o){const A=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=A,c*=A,h*=A,d*=A}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=r[a],f=r[a+1],m=r[a+2],_=r[a+3];return e[t]=o*_+h*d+l*m-c*f,e[t+1]=l*_+h*f+c*d-o*m,e[t+2]=c*_+h*m+o*f-l*d,e[t+3]=h*_-o*d-l*f-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),d=o(r/2),f=l(n/2),m=l(i/2),_=l(r/2);switch(a){case"XYZ":this._x=f*h*d+c*m*_,this._y=c*m*d-f*h*_,this._z=c*h*_+f*m*d,this._w=c*h*d-f*m*_;break;case"YXZ":this._x=f*h*d+c*m*_,this._y=c*m*d-f*h*_,this._z=c*h*_-f*m*d,this._w=c*h*d+f*m*_;break;case"ZXY":this._x=f*h*d-c*m*_,this._y=c*m*d+f*h*_,this._z=c*h*_+f*m*d,this._w=c*h*d-f*m*_;break;case"ZYX":this._x=f*h*d-c*m*_,this._y=c*m*d+f*h*_,this._z=c*h*_-f*m*d,this._w=c*h*d+f*m*_;break;case"YZX":this._x=f*h*d+c*m*_,this._y=c*m*d+f*h*_,this._z=c*h*_-f*m*d,this._w=c*h*d-f*m*_;break;case"XZY":this._x=f*h*d-c*m*_,this._y=c*m*d-f*h*_,this._z=c*h*_+f*m*d,this._w=c*h*d+f*m*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],f=n+o+d;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(a-i)*m}else if(n>o&&n>d){const m=2*Math.sqrt(1+n-o-d);this._w=(h-l)/m,this._x=.25*m,this._y=(i+a)/m,this._z=(r+c)/m}else if(o>d){const m=2*Math.sqrt(1+o-n-d);this._w=(r-c)/m,this._x=(i+a)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+d-n-o);this._w=(a-i)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ze(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+i*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*n+t*this._x,this._y=m*i+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=a*d+this._w*f,this._x=n*d+this._x*f,this._y=i*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(e=0,t=0,n=0){I.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(po.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(po.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),h=2*(o*t-r*i),d=2*(r*n-a*t);return this.x=t+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=i+l*d+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Zs.copy(this).projectOnVector(e),this.sub(Zs)}reflect(e){return this.sub(Zs.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Zs=new I,po=new Qi;class Ne{constructor(e,t,n,i,r,a,o,l,c){Ne.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c)}set(e,t,n,i,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],f=n[2],m=n[5],_=n[8],b=i[0],p=i[3],u=i[6],S=i[1],E=i[4],M=i[7],A=i[2],T=i[5],R=i[8];return r[0]=a*b+o*S+l*A,r[3]=a*p+o*E+l*T,r[6]=a*u+o*M+l*R,r[1]=c*b+h*S+d*A,r[4]=c*p+h*E+d*T,r[7]=c*u+h*M+d*R,r[2]=f*b+m*S+_*A,r[5]=f*p+m*E+_*T,r[8]=f*u+m*M+_*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,f=o*l-h*r,m=c*r-a*l,_=t*d+n*f+i*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const b=1/_;return e[0]=d*b,e[1]=(i*c-h*n)*b,e[2]=(o*n-i*a)*b,e[3]=f*b,e[4]=(h*t-i*l)*b,e[5]=(i*r-o*t)*b,e[6]=m*b,e[7]=(n*l-c*t)*b,e[8]=(a*t-n*r)*b,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Js.makeScale(e,t)),this}rotate(e){return this.premultiply(Js.makeRotation(-e)),this}translate(e,t){return this.premultiply(Js.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Js=new Ne;function Ll(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Hs(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Vh(){const s=Hs("canvas");return s.style.display="block",s}const mo={};function Zi(s){s in mo||(mo[s]=!0,console.warn(s))}function Wh(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const go=new Ne().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),_o=new Ne().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Xh(){const s={enabled:!0,workingColorSpace:Mi,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Ke&&(i.r=gn(i.r),i.g=gn(i.g),i.b=gn(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Ke&&(i.r=_i(i.r),i.g=_i(i.g),i.b=_i(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===En?ks:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Zi("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Zi("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Mi]:{primaries:e,whitePoint:n,transfer:ks,toXYZ:go,fromXYZ:_o,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ht},outputColorSpaceConfig:{drawingBufferColorSpace:Ht}},[Ht]:{primaries:e,whitePoint:n,transfer:Ke,toXYZ:go,fromXYZ:_o,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ht}}}),s}const Xe=Xh();function gn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function _i(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Qn;class $h{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Qn===void 0&&(Qn=Hs("canvas")),Qn.width=e.width,Qn.height=e.height;const i=Qn.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Qn}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Hs("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=gn(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(gn(t[n]/255)*255):t[n]=gn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let qh=0;class Fa{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:qh++}),this.uuid=Ai(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Qs(i[a].image)):r.push(Qs(i[a]))}else r=Qs(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function Qs(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?$h.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Yh=0;const er=new I;class Tt extends Ti{constructor(e=Tt.DEFAULT_IMAGE,t=Tt.DEFAULT_MAPPING,n=Vn,i=Vn,r=nn,a=Wn,o=Zt,l=an,c=Tt.DEFAULT_ANISOTROPY,h=En){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Yh++}),this.uuid=Ai(),this.name="",this.source=new Fa(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new He(0,0),this.repeat=new He(1,1),this.center=new He(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(er).x}get height(){return this.source.getSize(er).y}get depth(){return this.source.getSize(er).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ml)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Wr:e.x=e.x-Math.floor(e.x);break;case Vn:e.x=e.x<0?0:1;break;case Xr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Wr:e.y=e.y-Math.floor(e.y);break;case Vn:e.y=e.y<0?0:1;break;case Xr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Tt.DEFAULT_IMAGE=null;Tt.DEFAULT_MAPPING=Ml;Tt.DEFAULT_ANISOTROPY=1;class je{constructor(e=0,t=0,n=0,i=1){je.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],h=l[4],d=l[8],f=l[1],m=l[5],_=l[9],b=l[2],p=l[6],u=l[10];if(Math.abs(h-f)<.01&&Math.abs(d-b)<.01&&Math.abs(_-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+b)<.1&&Math.abs(_+p)<.1&&Math.abs(c+m+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(c+1)/2,M=(m+1)/2,A=(u+1)/2,T=(h+f)/4,R=(d+b)/4,D=(_+p)/4;return E>M&&E>A?E<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(E),i=T/n,r=R/n):M>A?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=T/i,r=D/i):A<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(A),n=R/r,i=D/r),this.set(n,i,r,t),this}let S=Math.sqrt((p-_)*(p-_)+(d-b)*(d-b)+(f-h)*(f-h));return Math.abs(S)<.001&&(S=1),this.x=(p-_)/S,this.y=(d-b)/S,this.z=(f-h)/S,this.w=Math.acos((c+m+u-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this.w=ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this.w=ze(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Kh extends Ti{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:nn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new je(0,0,e,t),this.scissorTest=!1,this.viewport=new je(0,0,e,t);const i={width:e,height:t,depth:n.depth},r=new Tt(i);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:nn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Fa(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Kn extends Kh{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Il extends Tt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Ft,this.minFilter=Ft,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class jh extends Tt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Ft,this.minFilter=Ft,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class jn{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Xt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Xt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Xt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Xt):Xt.fromBufferAttribute(r,a),Xt.applyMatrix4(e.matrixWorld),this.expandByPoint(Xt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),as.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),as.copy(n.boundingBox)),as.applyMatrix4(e.matrixWorld),this.union(as)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Xt),Xt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ii),os.subVectors(this.max,Ii),ei.subVectors(e.a,Ii),ti.subVectors(e.b,Ii),ni.subVectors(e.c,Ii),vn.subVectors(ti,ei),xn.subVectors(ni,ti),Ln.subVectors(ei,ni);let t=[0,-vn.z,vn.y,0,-xn.z,xn.y,0,-Ln.z,Ln.y,vn.z,0,-vn.x,xn.z,0,-xn.x,Ln.z,0,-Ln.x,-vn.y,vn.x,0,-xn.y,xn.x,0,-Ln.y,Ln.x,0];return!tr(t,ei,ti,ni,os)||(t=[1,0,0,0,1,0,0,0,1],!tr(t,ei,ti,ni,os))?!1:(ls.crossVectors(vn,xn),t=[ls.x,ls.y,ls.z],tr(t,ei,ti,ni,os))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Xt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Xt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(hn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),hn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),hn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),hn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),hn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),hn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),hn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),hn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(hn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const hn=[new I,new I,new I,new I,new I,new I,new I,new I],Xt=new I,as=new jn,ei=new I,ti=new I,ni=new I,vn=new I,xn=new I,Ln=new I,Ii=new I,os=new I,ls=new I,In=new I;function tr(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){In.fromArray(s,r);const o=i.x*Math.abs(In.x)+i.y*Math.abs(In.y)+i.z*Math.abs(In.z),l=e.dot(In),c=t.dot(In),h=n.dot(In);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Zh=new jn,Ui=new I,nr=new I;class Ri{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Zh.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ui.subVectors(e,this.center);const t=Ui.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Ui,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(nr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ui.copy(e.center).add(nr)),this.expandByPoint(Ui.copy(e.center).sub(nr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const un=new I,ir=new I,cs=new I,yn=new I,sr=new I,hs=new I,rr=new I;class Ul{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,un)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=un.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(un.copy(this.origin).addScaledVector(this.direction,t),un.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){ir.copy(e).add(t).multiplyScalar(.5),cs.copy(t).sub(e).normalize(),yn.copy(this.origin).sub(ir);const r=e.distanceTo(t)*.5,a=-this.direction.dot(cs),o=yn.dot(this.direction),l=-yn.dot(cs),c=yn.lengthSq(),h=Math.abs(1-a*a);let d,f,m,_;if(h>0)if(d=a*l-o,f=a*o-l,_=r*h,d>=0)if(f>=-_)if(f<=_){const b=1/h;d*=b,f*=b,m=d*(d+a*f+2*o)+f*(a*d+f+2*l)+c}else f=r,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*l)+c;else f=-r,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*l)+c;else f<=-_?(d=Math.max(0,-(-a*r+o)),f=d>0?-r:Math.min(Math.max(-r,-l),r),m=-d*d+f*(f+2*l)+c):f<=_?(d=0,f=Math.min(Math.max(-r,-l),r),m=f*(f+2*l)+c):(d=Math.max(0,-(a*r+o)),f=d>0?r:Math.min(Math.max(-r,-l),r),m=-d*d+f*(f+2*l)+c);else f=a>0?-r:r,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(ir).addScaledVector(cs,f),m}intersectSphere(e,t){un.subVectors(e.center,this.origin);const n=un.dot(this.direction),i=un.dot(un)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,i=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,i=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),d>=0?(o=(e.min.z-f.z)*d,l=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,l=(e.min.z-f.z)*d),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,un)!==null}intersectTriangle(e,t,n,i,r){sr.subVectors(t,e),hs.subVectors(n,e),rr.crossVectors(sr,hs);let a=this.direction.dot(rr),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;yn.subVectors(this.origin,e);const l=o*this.direction.dot(hs.crossVectors(yn,hs));if(l<0)return null;const c=o*this.direction.dot(sr.cross(yn));if(c<0||l+c>a)return null;const h=-o*yn.dot(rr);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Je{constructor(e,t,n,i,r,a,o,l,c,h,d,f,m,_,b,p){Je.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c,h,d,f,m,_,b,p)}set(e,t,n,i,r,a,o,l,c,h,d,f,m,_,b,p){const u=this.elements;return u[0]=e,u[4]=t,u[8]=n,u[12]=i,u[1]=r,u[5]=a,u[9]=o,u[13]=l,u[2]=c,u[6]=h,u[10]=d,u[14]=f,u[3]=m,u[7]=_,u[11]=b,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Je().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/ii.setFromMatrixColumn(e,0).length(),r=1/ii.setFromMatrixColumn(e,1).length(),a=1/ii.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const f=a*h,m=a*d,_=o*h,b=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=m+_*c,t[5]=f-b*c,t[9]=-o*l,t[2]=b-f*c,t[6]=_+m*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*h,m=l*d,_=c*h,b=c*d;t[0]=f+b*o,t[4]=_*o-m,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=m*o-_,t[6]=b+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*h,m=l*d,_=c*h,b=c*d;t[0]=f-b*o,t[4]=-a*d,t[8]=_+m*o,t[1]=m+_*o,t[5]=a*h,t[9]=b-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*h,m=a*d,_=o*h,b=o*d;t[0]=l*h,t[4]=_*c-m,t[8]=f*c+b,t[1]=l*d,t[5]=b*c+f,t[9]=m*c-_,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,m=a*c,_=o*l,b=o*c;t[0]=l*h,t[4]=b-f*d,t[8]=_*d+m,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=m*d+_,t[10]=f-b*d}else if(e.order==="XZY"){const f=a*l,m=a*c,_=o*l,b=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=f*d+b,t[5]=a*h,t[9]=m*d-_,t[2]=_*d-m,t[6]=o*h,t[10]=b*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Jh,e,Qh)}lookAt(e,t,n){const i=this.elements;return Lt.subVectors(e,t),Lt.lengthSq()===0&&(Lt.z=1),Lt.normalize(),bn.crossVectors(n,Lt),bn.lengthSq()===0&&(Math.abs(n.z)===1?Lt.x+=1e-4:Lt.z+=1e-4,Lt.normalize(),bn.crossVectors(n,Lt)),bn.normalize(),us.crossVectors(Lt,bn),i[0]=bn.x,i[4]=us.x,i[8]=Lt.x,i[1]=bn.y,i[5]=us.y,i[9]=Lt.y,i[2]=bn.z,i[6]=us.z,i[10]=Lt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],f=n[9],m=n[13],_=n[2],b=n[6],p=n[10],u=n[14],S=n[3],E=n[7],M=n[11],A=n[15],T=i[0],R=i[4],D=i[8],x=i[12],v=i[1],P=i[5],F=i[9],z=i[13],X=i[2],W=i[6],$=i[10],j=i[14],H=i[3],re=i[7],ce=i[11],Se=i[15];return r[0]=a*T+o*v+l*X+c*H,r[4]=a*R+o*P+l*W+c*re,r[8]=a*D+o*F+l*$+c*ce,r[12]=a*x+o*z+l*j+c*Se,r[1]=h*T+d*v+f*X+m*H,r[5]=h*R+d*P+f*W+m*re,r[9]=h*D+d*F+f*$+m*ce,r[13]=h*x+d*z+f*j+m*Se,r[2]=_*T+b*v+p*X+u*H,r[6]=_*R+b*P+p*W+u*re,r[10]=_*D+b*F+p*$+u*ce,r[14]=_*x+b*z+p*j+u*Se,r[3]=S*T+E*v+M*X+A*H,r[7]=S*R+E*P+M*W+A*re,r[11]=S*D+E*F+M*$+A*ce,r[15]=S*x+E*z+M*j+A*Se,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],f=e[10],m=e[14],_=e[3],b=e[7],p=e[11],u=e[15];return _*(+r*l*d-i*c*d-r*o*f+n*c*f+i*o*m-n*l*m)+b*(+t*l*m-t*c*f+r*a*f-i*a*m+i*c*h-r*l*h)+p*(+t*c*d-t*o*m-r*a*d+n*a*m+r*o*h-n*c*h)+u*(-i*o*h-t*l*d+t*o*f+i*a*d-n*a*f+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],f=e[10],m=e[11],_=e[12],b=e[13],p=e[14],u=e[15],S=d*p*c-b*f*c+b*l*m-o*p*m-d*l*u+o*f*u,E=_*f*c-h*p*c-_*l*m+a*p*m+h*l*u-a*f*u,M=h*b*c-_*d*c+_*o*m-a*b*m-h*o*u+a*d*u,A=_*d*l-h*b*l-_*o*f+a*b*f+h*o*p-a*d*p,T=t*S+n*E+i*M+r*A;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/T;return e[0]=S*R,e[1]=(b*f*r-d*p*r-b*i*m+n*p*m+d*i*u-n*f*u)*R,e[2]=(o*p*r-b*l*r+b*i*c-n*p*c-o*i*u+n*l*u)*R,e[3]=(d*l*r-o*f*r-d*i*c+n*f*c+o*i*m-n*l*m)*R,e[4]=E*R,e[5]=(h*p*r-_*f*r+_*i*m-t*p*m-h*i*u+t*f*u)*R,e[6]=(_*l*r-a*p*r-_*i*c+t*p*c+a*i*u-t*l*u)*R,e[7]=(a*f*r-h*l*r+h*i*c-t*f*c-a*i*m+t*l*m)*R,e[8]=M*R,e[9]=(_*d*r-h*b*r-_*n*m+t*b*m+h*n*u-t*d*u)*R,e[10]=(a*b*r-_*o*r+_*n*c-t*b*c-a*n*u+t*o*u)*R,e[11]=(h*o*r-a*d*r-h*n*c+t*d*c+a*n*m-t*o*m)*R,e[12]=A*R,e[13]=(h*b*i-_*d*i+_*n*f-t*b*f-h*n*p+t*d*p)*R,e[14]=(_*o*i-a*b*i-_*n*l+t*b*l+a*n*p-t*o*p)*R,e[15]=(a*d*i-h*o*i+h*n*l-t*d*l-a*n*f+t*o*f)*R,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,d=o+o,f=r*c,m=r*h,_=r*d,b=a*h,p=a*d,u=o*d,S=l*c,E=l*h,M=l*d,A=n.x,T=n.y,R=n.z;return i[0]=(1-(b+u))*A,i[1]=(m+M)*A,i[2]=(_-E)*A,i[3]=0,i[4]=(m-M)*T,i[5]=(1-(f+u))*T,i[6]=(p+S)*T,i[7]=0,i[8]=(_+E)*R,i[9]=(p-S)*R,i[10]=(1-(f+b))*R,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=ii.set(i[0],i[1],i[2]).length();const a=ii.set(i[4],i[5],i[6]).length(),o=ii.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],$t.copy(this);const c=1/r,h=1/a,d=1/o;return $t.elements[0]*=c,$t.elements[1]*=c,$t.elements[2]*=c,$t.elements[4]*=h,$t.elements[5]*=h,$t.elements[6]*=h,$t.elements[8]*=d,$t.elements[9]*=d,$t.elements[10]*=d,t.setFromRotationMatrix($t),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,r,a,o=rn,l=!1){const c=this.elements,h=2*r/(t-e),d=2*r/(n-i),f=(t+e)/(t-e),m=(n+i)/(n-i);let _,b;if(l)_=r/(a-r),b=a*r/(a-r);else if(o===rn)_=-(a+r)/(a-r),b=-2*a*r/(a-r);else if(o===zs)_=-a/(a-r),b=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=d,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=b,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=rn,l=!1){const c=this.elements,h=2/(t-e),d=2/(n-i),f=-(t+e)/(t-e),m=-(n+i)/(n-i);let _,b;if(l)_=1/(a-r),b=a/(a-r);else if(o===rn)_=-2/(a-r),b=-(a+r)/(a-r);else if(o===zs)_=-1/(a-r),b=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=d,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=_,c[14]=b,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ii=new I,$t=new Je,Jh=new I(0,0,0),Qh=new I(1,1,1),bn=new I,us=new I,Lt=new I,vo=new Je,xo=new Qi;class on{constructor(e=0,t=0,n=0,i=on.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],d=i[2],f=i[6],m=i[10];switch(t){case"XYZ":this._y=Math.asin(ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(ze(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ze(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return vo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(vo,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return xo.setFromEuler(this),this.setFromQuaternion(xo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}on.DEFAULT_ORDER="XYZ";class Nl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let eu=0;const yo=new I,si=new Qi,dn=new Je,ds=new I,Ni=new I,tu=new I,nu=new Qi,bo=new I(1,0,0),Mo=new I(0,1,0),So=new I(0,0,1),Eo={type:"added"},iu={type:"removed"},ri={type:"childadded",child:null},ar={type:"childremoved",child:null};class _t extends Ti{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:eu++}),this.uuid=Ai(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=_t.DEFAULT_UP.clone();const e=new I,t=new on,n=new Qi,i=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Je},normalMatrix:{value:new Ne}}),this.matrix=new Je,this.matrixWorld=new Je,this.matrixAutoUpdate=_t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Nl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return si.setFromAxisAngle(e,t),this.quaternion.multiply(si),this}rotateOnWorldAxis(e,t){return si.setFromAxisAngle(e,t),this.quaternion.premultiply(si),this}rotateX(e){return this.rotateOnAxis(bo,e)}rotateY(e){return this.rotateOnAxis(Mo,e)}rotateZ(e){return this.rotateOnAxis(So,e)}translateOnAxis(e,t){return yo.copy(e).applyQuaternion(this.quaternion),this.position.add(yo.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(bo,e)}translateY(e){return this.translateOnAxis(Mo,e)}translateZ(e){return this.translateOnAxis(So,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(dn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ds.copy(e):ds.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Ni.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?dn.lookAt(Ni,ds,this.up):dn.lookAt(ds,Ni,this.up),this.quaternion.setFromRotationMatrix(dn),i&&(dn.extractRotation(i.matrixWorld),si.setFromRotationMatrix(dn),this.quaternion.premultiply(si.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Eo),ri.child=e,this.dispatchEvent(ri),ri.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(iu),ar.child=e,this.dispatchEvent(ar),ar.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),dn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),dn.multiply(e.parent.matrixWorld)),e.applyMatrix4(dn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Eo),ri.child=e,this.dispatchEvent(ri),ri.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ni,e,tu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ni,nu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),f=a(e.skeletons),m=a(e.animations),_=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),_.length>0&&(n.nodes=_)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}_t.DEFAULT_UP=new I(0,1,0);_t.DEFAULT_MATRIX_AUTO_UPDATE=!0;_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const qt=new I,fn=new I,or=new I,pn=new I,ai=new I,oi=new I,wo=new I,lr=new I,cr=new I,hr=new I,ur=new je,dr=new je,fr=new je;class Kt{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),qt.subVectors(e,t),i.cross(qt);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){qt.subVectors(i,t),fn.subVectors(n,t),or.subVectors(e,t);const a=qt.dot(qt),o=qt.dot(fn),l=qt.dot(or),c=fn.dot(fn),h=fn.dot(or),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const f=1/d,m=(c*l-o*h)*f,_=(a*h-o*l)*f;return r.set(1-m-_,_,m)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,pn)===null?!1:pn.x>=0&&pn.y>=0&&pn.x+pn.y<=1}static getInterpolation(e,t,n,i,r,a,o,l){return this.getBarycoord(e,t,n,i,pn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,pn.x),l.addScaledVector(a,pn.y),l.addScaledVector(o,pn.z),l)}static getInterpolatedAttribute(e,t,n,i,r,a){return ur.setScalar(0),dr.setScalar(0),fr.setScalar(0),ur.fromBufferAttribute(e,t),dr.fromBufferAttribute(e,n),fr.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(ur,r.x),a.addScaledVector(dr,r.y),a.addScaledVector(fr,r.z),a}static isFrontFacing(e,t,n,i){return qt.subVectors(n,t),fn.subVectors(e,t),qt.cross(fn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return qt.subVectors(this.c,this.b),fn.subVectors(this.a,this.b),qt.cross(fn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Kt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Kt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return Kt.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return Kt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Kt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;ai.subVectors(i,n),oi.subVectors(r,n),lr.subVectors(e,n);const l=ai.dot(lr),c=oi.dot(lr);if(l<=0&&c<=0)return t.copy(n);cr.subVectors(e,i);const h=ai.dot(cr),d=oi.dot(cr);if(h>=0&&d<=h)return t.copy(i);const f=l*d-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(ai,a);hr.subVectors(e,r);const m=ai.dot(hr),_=oi.dot(hr);if(_>=0&&m<=_)return t.copy(r);const b=m*c-l*_;if(b<=0&&c>=0&&_<=0)return o=c/(c-_),t.copy(n).addScaledVector(oi,o);const p=h*_-m*d;if(p<=0&&d-h>=0&&m-_>=0)return wo.subVectors(r,i),o=(d-h)/(d-h+(m-_)),t.copy(i).addScaledVector(wo,o);const u=1/(p+b+f);return a=b*u,o=f*u,t.copy(n).addScaledVector(ai,a).addScaledVector(oi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Fl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Mn={h:0,s:0,l:0},fs={h:0,s:0,l:0};function pr(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Pe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ht){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Xe.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Xe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Xe.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Xe.workingColorSpace){if(e=Na(e,1),t=ze(t,0,1),n=ze(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=pr(a,r,e+1/3),this.g=pr(a,r,e),this.b=pr(a,r,e-1/3)}return Xe.colorSpaceToWorking(this,i),this}setStyle(e,t=Ht){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ht){const n=Fl[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=gn(e.r),this.g=gn(e.g),this.b=gn(e.b),this}copyLinearToSRGB(e){return this.r=_i(e.r),this.g=_i(e.g),this.b=_i(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ht){return Xe.workingToColorSpace(yt.copy(this),e),Math.round(ze(yt.r*255,0,255))*65536+Math.round(ze(yt.g*255,0,255))*256+Math.round(ze(yt.b*255,0,255))}getHexString(e=Ht){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Xe.workingColorSpace){Xe.workingToColorSpace(yt.copy(this),t);const n=yt.r,i=yt.g,r=yt.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Xe.workingColorSpace){return Xe.workingToColorSpace(yt.copy(this),t),e.r=yt.r,e.g=yt.g,e.b=yt.b,e}getStyle(e=Ht){Xe.workingToColorSpace(yt.copy(this),e);const t=yt.r,n=yt.g,i=yt.b;return e!==Ht?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Mn),this.setHSL(Mn.h+e,Mn.s+t,Mn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Mn),e.getHSL(fs);const n=Vi(Mn.h,fs.h,t),i=Vi(Mn.s,fs.s,t),r=Vi(Mn.l,fs.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const yt=new Pe;Pe.NAMES=Fl;let su=0;class Ci extends Ti{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:su++}),this.uuid=Ai(),this.name="",this.type="Material",this.blending=gi,this.side=Rn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ir,this.blendDst=Ur,this.blendEquation=Hn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pe(0,0,0),this.blendAlpha=0,this.depthFunc=xi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=lo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Jn,this.stencilZFail=Jn,this.stencilZPass=Jn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==gi&&(n.blending=this.blending),this.side!==Rn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ir&&(n.blendSrc=this.blendSrc),this.blendDst!==Ur&&(n.blendDst=this.blendDst),this.blendEquation!==Hn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==xi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==lo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Jn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Jn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Jn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ws extends Ci{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Pe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.combine=bl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const dt=new I,ps=new He;let ru=0;class Wt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ru++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=co,this.updateRanges=[],this.gpuType=sn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ps.fromBufferAttribute(this,t),ps.applyMatrix3(e),this.setXY(t,ps.x,ps.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)dt.fromBufferAttribute(this,t),dt.applyMatrix3(e),this.setXYZ(t,dt.x,dt.y,dt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)dt.fromBufferAttribute(this,t),dt.applyMatrix4(e),this.setXYZ(t,dt.x,dt.y,dt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)dt.fromBufferAttribute(this,t),dt.applyNormalMatrix(e),this.setXYZ(t,dt.x,dt.y,dt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)dt.fromBufferAttribute(this,t),dt.transformDirection(e),this.setXYZ(t,dt.x,dt.y,dt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=fi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=St(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=fi(t,this.array)),t}setX(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=fi(t,this.array)),t}setY(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=fi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=fi(t,this.array)),t}setW(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),n=St(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),n=St(n,this.array),i=St(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),n=St(n,this.array),i=St(i,this.array),r=St(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==co&&(e.usage=this.usage),e}}class Ol extends Wt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Bl extends Wt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class ht extends Wt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let au=0;const zt=new Je,mr=new _t,li=new I,It=new jn,Fi=new jn,gt=new I;class Ct extends Ti{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:au++}),this.uuid=Ai(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ll(e)?Bl:Ol)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ne().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return zt.makeRotationFromQuaternion(e),this.applyMatrix4(zt),this}rotateX(e){return zt.makeRotationX(e),this.applyMatrix4(zt),this}rotateY(e){return zt.makeRotationY(e),this.applyMatrix4(zt),this}rotateZ(e){return zt.makeRotationZ(e),this.applyMatrix4(zt),this}translate(e,t,n){return zt.makeTranslation(e,t,n),this.applyMatrix4(zt),this}scale(e,t,n){return zt.makeScale(e,t,n),this.applyMatrix4(zt),this}lookAt(e){return mr.lookAt(e),mr.updateMatrix(),this.applyMatrix4(mr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(li).negate(),this.translate(li.x,li.y,li.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ht(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new jn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];It.setFromBufferAttribute(r),this.morphTargetsRelative?(gt.addVectors(this.boundingBox.min,It.min),this.boundingBox.expandByPoint(gt),gt.addVectors(this.boundingBox.max,It.max),this.boundingBox.expandByPoint(gt)):(this.boundingBox.expandByPoint(It.min),this.boundingBox.expandByPoint(It.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ri);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){const n=this.boundingSphere.center;if(It.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Fi.setFromBufferAttribute(o),this.morphTargetsRelative?(gt.addVectors(It.min,Fi.min),It.expandByPoint(gt),gt.addVectors(It.max,Fi.max),It.expandByPoint(gt)):(It.expandByPoint(Fi.min),It.expandByPoint(Fi.max))}It.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)gt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(gt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)gt.fromBufferAttribute(o,c),l&&(li.fromBufferAttribute(e,c),gt.add(li)),i=Math.max(i,n.distanceToSquared(gt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Wt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let D=0;D<n.count;D++)o[D]=new I,l[D]=new I;const c=new I,h=new I,d=new I,f=new He,m=new He,_=new He,b=new I,p=new I;function u(D,x,v){c.fromBufferAttribute(n,D),h.fromBufferAttribute(n,x),d.fromBufferAttribute(n,v),f.fromBufferAttribute(r,D),m.fromBufferAttribute(r,x),_.fromBufferAttribute(r,v),h.sub(c),d.sub(c),m.sub(f),_.sub(f);const P=1/(m.x*_.y-_.x*m.y);isFinite(P)&&(b.copy(h).multiplyScalar(_.y).addScaledVector(d,-m.y).multiplyScalar(P),p.copy(d).multiplyScalar(m.x).addScaledVector(h,-_.x).multiplyScalar(P),o[D].add(b),o[x].add(b),o[v].add(b),l[D].add(p),l[x].add(p),l[v].add(p))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let D=0,x=S.length;D<x;++D){const v=S[D],P=v.start,F=v.count;for(let z=P,X=P+F;z<X;z+=3)u(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const E=new I,M=new I,A=new I,T=new I;function R(D){A.fromBufferAttribute(i,D),T.copy(A);const x=o[D];E.copy(x),E.sub(A.multiplyScalar(A.dot(x))).normalize(),M.crossVectors(T,x);const P=M.dot(l[D])<0?-1:1;a.setXYZW(D,E.x,E.y,E.z,P)}for(let D=0,x=S.length;D<x;++D){const v=S[D],P=v.start,F=v.count;for(let z=P,X=P+F;z<X;z+=3)R(e.getX(z+0)),R(e.getX(z+1)),R(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Wt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const i=new I,r=new I,a=new I,o=new I,l=new I,c=new I,h=new I,d=new I;if(e)for(let f=0,m=e.count;f<m;f+=3){const _=e.getX(f+0),b=e.getX(f+1),p=e.getX(f+2);i.fromBufferAttribute(t,_),r.fromBufferAttribute(t,b),a.fromBufferAttribute(t,p),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),o.fromBufferAttribute(n,_),l.fromBufferAttribute(n,b),c.fromBufferAttribute(n,p),o.add(h),l.add(h),c.add(h),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(b,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,m=t.count;f<m;f+=3)i.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,r),d.subVectors(i,r),h.cross(d),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)gt.fromBufferAttribute(e,t),gt.normalize(),e.setXYZ(t,gt.x,gt.y,gt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,d=o.normalized,f=new c.constructor(l.length*h);let m=0,_=0;for(let b=0,p=l.length;b<p;b++){o.isInterleavedBufferAttribute?m=l[b]*o.data.stride+o.offset:m=l[b]*h;for(let u=0;u<h;u++)f[_++]=c[m++]}return new Wt(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ct,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){const f=c[h],m=e(f,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,f=c.length;d<f;d++){const m=c[d];h.push(m.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],d=r[c];for(let f=0,m=d.length;f<m;f++)h.push(d[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const To=new Je,Un=new Ul,ms=new Ri,Ao=new I,gs=new I,_s=new I,vs=new I,gr=new I,xs=new I,Ro=new I,ys=new I;class me extends _t{constructor(e=new Ct,t=new Ws){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){xs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],d=r[l];h!==0&&(gr.fromBufferAttribute(d,e),a?xs.addScaledVector(gr,h):xs.addScaledVector(gr.sub(t),h))}t.add(xs)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ms.copy(n.boundingSphere),ms.applyMatrix4(r),Un.copy(e.ray).recast(e.near),!(ms.containsPoint(Un.origin)===!1&&(Un.intersectSphere(ms,Ao)===null||Un.origin.distanceToSquared(Ao)>(e.far-e.near)**2))&&(To.copy(r).invert(),Un.copy(e.ray).applyMatrix4(To),!(n.boundingBox!==null&&Un.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Un)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,f=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,b=f.length;_<b;_++){const p=f[_],u=a[p.materialIndex],S=Math.max(p.start,m.start),E=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let M=S,A=E;M<A;M+=3){const T=o.getX(M),R=o.getX(M+1),D=o.getX(M+2);i=bs(this,u,e,n,c,h,d,T,R,D),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const _=Math.max(0,m.start),b=Math.min(o.count,m.start+m.count);for(let p=_,u=b;p<u;p+=3){const S=o.getX(p),E=o.getX(p+1),M=o.getX(p+2);i=bs(this,a,e,n,c,h,d,S,E,M),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,b=f.length;_<b;_++){const p=f[_],u=a[p.materialIndex],S=Math.max(p.start,m.start),E=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let M=S,A=E;M<A;M+=3){const T=M,R=M+1,D=M+2;i=bs(this,u,e,n,c,h,d,T,R,D),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const _=Math.max(0,m.start),b=Math.min(l.count,m.start+m.count);for(let p=_,u=b;p<u;p+=3){const S=p,E=p+1,M=p+2;i=bs(this,a,e,n,c,h,d,S,E,M),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function ou(s,e,t,n,i,r,a,o){let l;if(e.side===Rt?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,e.side===Rn,o),l===null)return null;ys.copy(o),ys.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(ys);return c<t.near||c>t.far?null:{distance:c,point:ys.clone(),object:s}}function bs(s,e,t,n,i,r,a,o,l,c){s.getVertexPosition(o,gs),s.getVertexPosition(l,_s),s.getVertexPosition(c,vs);const h=ou(s,e,t,n,gs,_s,vs,Ro);if(h){const d=new I;Kt.getBarycoord(Ro,gs,_s,vs,d),i&&(h.uv=Kt.getInterpolatedAttribute(i,o,l,c,d,new He)),r&&(h.uv1=Kt.getInterpolatedAttribute(r,o,l,c,d,new He)),a&&(h.normal=Kt.getInterpolatedAttribute(a,o,l,c,d,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new I,materialIndex:0};Kt.getNormal(gs,_s,vs,f.normal),h.face=f,h.barycoord=d}return h}class wt extends Ct{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],d=[];let f=0,m=0;_("z","y","x",-1,-1,n,t,e,a,r,0),_("z","y","x",1,-1,n,t,-e,a,r,1),_("x","z","y",1,1,e,n,t,i,a,2),_("x","z","y",1,-1,e,n,-t,i,a,3),_("x","y","z",1,-1,e,t,n,i,r,4),_("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new ht(c,3)),this.setAttribute("normal",new ht(h,3)),this.setAttribute("uv",new ht(d,2));function _(b,p,u,S,E,M,A,T,R,D,x){const v=M/R,P=A/D,F=M/2,z=A/2,X=T/2,W=R+1,$=D+1;let j=0,H=0;const re=new I;for(let ce=0;ce<$;ce++){const Se=ce*P-z;for(let Be=0;Be<W;Be++){const Qe=Be*v-F;re[b]=Qe*S,re[p]=Se*E,re[u]=X,c.push(re.x,re.y,re.z),re[b]=0,re[p]=0,re[u]=T>0?1:-1,h.push(re.x,re.y,re.z),d.push(Be/R),d.push(1-ce/D),j+=1}}for(let ce=0;ce<D;ce++)for(let Se=0;Se<R;Se++){const Be=f+Se+W*ce,Qe=f+Se+W*(ce+1),it=f+(Se+1)+W*(ce+1),$e=f+(Se+1)+W*ce;l.push(Be,Qe,$e),l.push(Qe,it,$e),H+=6}o.addGroup(m,H,x),m+=H,f+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Si(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Et(s){const e={};for(let t=0;t<s.length;t++){const n=Si(s[t]);for(const i in n)e[i]=n[i]}return e}function lu(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function kl(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Xe.workingColorSpace}const cu={clone:Si,merge:Et};var hu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,uu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class _n extends Ci{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=hu,this.fragmentShader=uu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Si(e.uniforms),this.uniformsGroups=lu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class zl extends _t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Je,this.projectionMatrix=new Je,this.projectionMatrixInverse=new Je,this.coordinateSystem=rn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Sn=new I,Co=new He,Po=new He;class Gt extends zl{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ji*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Gi*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ji*2*Math.atan(Math.tan(Gi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Sn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Sn.x,Sn.y).multiplyScalar(-e/Sn.z),Sn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Sn.x,Sn.y).multiplyScalar(-e/Sn.z)}getViewSize(e,t){return this.getViewBounds(e,Co,Po),t.subVectors(Po,Co)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Gi*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ci=-90,hi=1;class du extends _t{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Gt(ci,hi,e,t);i.layers=this.layers,this.add(i);const r=new Gt(ci,hi,e,t);r.layers=this.layers,this.add(r);const a=new Gt(ci,hi,e,t);a.layers=this.layers,this.add(a);const o=new Gt(ci,hi,e,t);o.layers=this.layers,this.add(o);const l=new Gt(ci,hi,e,t);l.layers=this.layers,this.add(l);const c=new Gt(ci,hi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===rn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===zs)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const b=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,a),e.setRenderTarget(n,2,i),e.render(t,o),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=b,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(d,f,m),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class Hl extends Tt{constructor(e=[],t=yi,n,i,r,a,o,l,c,h){super(e,t,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class fu extends Kn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Hl(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new wt(5,5,5),r=new _n({name:"CubemapFromEquirect",uniforms:Si(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Rt,blending:wn});r.uniforms.tEquirect.value=t;const a=new me(i,r),o=t.minFilter;return t.minFilter===Wn&&(t.minFilter=nn),new du(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}class Vt extends _t{constructor(){super(),this.isGroup=!0,this.type="Group"}}const pu={type:"move"};class _r{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Vt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Vt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Vt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const b of e.hand.values()){const p=t.getJointPose(b,n),u=this._getHandJoint(c,b);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=h.position.distanceTo(d.position),m=.02,_=.005;c.inputState.pinching&&f>m+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=m-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(pu)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Vt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Oa{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Pe(e),this.near=t,this.far=n}clone(){return new Oa(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class mu extends _t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new on,this.environmentIntensity=1,this.environmentRotation=new on,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class gu extends Tt{constructor(e=null,t=1,n=1,i,r,a,o,l,c=Ft,h=Ft,d,f){super(null,a,o,l,c,h,i,r,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Do extends Wt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ui=new Je,Lo=new Je,Ms=[],Io=new jn,_u=new Je,Oi=new me,Bi=new Ri;class vu extends me{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Do(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,_u)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new jn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ui),Io.copy(e.boundingBox).applyMatrix4(ui),this.boundingBox.union(Io)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ri),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ui),Bi.copy(e.boundingSphere).applyMatrix4(ui),this.boundingSphere.union(Bi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Oi.geometry=this.geometry,Oi.material=this.material,Oi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Bi.copy(this.boundingSphere),Bi.applyMatrix4(n),e.ray.intersectsSphere(Bi)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,ui),Lo.multiplyMatrices(n,ui),Oi.matrixWorld=Lo,Oi.raycast(e,Ms);for(let a=0,o=Ms.length;a<o;a++){const l=Ms[a];l.instanceId=r,l.object=this,t.push(l)}Ms.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Do(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new gu(new Float32Array(i*this.count),i,this.count,Da,sn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const vr=new I,xu=new I,yu=new Ne;class kn{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=vr.subVectors(n,t).cross(xu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(vr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||yu.getNormalMatrix(e),i=this.coplanarPoint(vr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Nn=new Ri,bu=new He(.5,.5),Ss=new I;class Ba{constructor(e=new kn,t=new kn,n=new kn,i=new kn,r=new kn,a=new kn){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=rn,n=!1){const i=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],f=r[6],m=r[7],_=r[8],b=r[9],p=r[10],u=r[11],S=r[12],E=r[13],M=r[14],A=r[15];if(i[0].setComponents(c-a,m-h,u-_,A-S).normalize(),i[1].setComponents(c+a,m+h,u+_,A+S).normalize(),i[2].setComponents(c+o,m+d,u+b,A+E).normalize(),i[3].setComponents(c-o,m-d,u-b,A-E).normalize(),n)i[4].setComponents(l,f,p,M).normalize(),i[5].setComponents(c-l,m-f,u-p,A-M).normalize();else if(i[4].setComponents(c-l,m-f,u-p,A-M).normalize(),t===rn)i[5].setComponents(c+l,m+f,u+p,A+M).normalize();else if(t===zs)i[5].setComponents(l,f,p,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Nn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Nn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Nn)}intersectsSprite(e){Nn.center.set(0,0,0);const t=bu.distanceTo(e.center);return Nn.radius=.7071067811865476+t,Nn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Nn)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Ss.x=i.normal.x>0?e.max.x:e.min.x,Ss.y=i.normal.y>0?e.max.y:e.min.y,Ss.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Ss)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Gl extends Ci{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Pe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Uo=new Je,ya=new Ul,Es=new Ri,ws=new I;class Mu extends _t{constructor(e=new Ct,t=new Gl){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Es.copy(n.boundingSphere),Es.applyMatrix4(i),Es.radius+=r,e.ray.intersectsSphere(Es)===!1)return;Uo.copy(i).invert(),ya.copy(e.ray).applyMatrix4(Uo);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const f=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let _=f,b=m;_<b;_++){const p=c.getX(_);ws.fromBufferAttribute(d,p),No(ws,p,l,i,e,t,this)}}else{const f=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let _=f,b=m;_<b;_++)ws.fromBufferAttribute(d,_),No(ws,_,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function No(s,e,t,n,i,r,a){const o=ya.distanceSqToPoint(s);if(o<t){const l=new I;ya.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Vl extends Tt{constructor(e,t,n=Yn,i,r,a,o=Ft,l=Ft,c,h=Yi,d=1){if(h!==Yi&&h!==Ki)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:d};super(f,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Fa(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Wl extends Tt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class es extends Ct{constructor(e=1,t=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:i,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=t/2,d=Math.PI/2*e,f=t,m=2*d+f,_=n*2+r,b=i+1,p=new I,u=new I;for(let S=0;S<=_;S++){let E=0,M=0,A=0,T=0;if(S<=n){const x=S/n,v=x*Math.PI/2;M=-h-e*Math.cos(v),A=e*Math.sin(v),T=-e*Math.cos(v),E=x*d}else if(S<=n+r){const x=(S-n)/r;M=-h+x*t,A=e,T=0,E=d+x*f}else{const x=(S-n-r)/n,v=x*Math.PI/2;M=h+e*Math.sin(v),A=e*Math.cos(v),T=e*Math.sin(v),E=d+f+x*d}const R=Math.max(0,Math.min(1,E/m));let D=0;S===0?D=.5/i:S===_&&(D=-.5/i);for(let x=0;x<=i;x++){const v=x/i,P=v*Math.PI*2,F=Math.sin(P),z=Math.cos(P);u.x=-A*z,u.y=M,u.z=A*F,o.push(u.x,u.y,u.z),p.set(-A*z,T,A*F),p.normalize(),l.push(p.x,p.y,p.z),c.push(v+D,R)}if(S>0){const x=(S-1)*b;for(let v=0;v<i;v++){const P=x+v,F=x+v+1,z=S*b+v,X=S*b+v+1;a.push(P,F,z),a.push(F,X,z)}}}this.setIndex(a),this.setAttribute("position",new ht(o,3)),this.setAttribute("normal",new ht(l,3)),this.setAttribute("uv",new ht(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new es(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class Cn extends Ct{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],d=[],f=[],m=[];let _=0;const b=[],p=n/2;let u=0;S(),a===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new ht(d,3)),this.setAttribute("normal",new ht(f,3)),this.setAttribute("uv",new ht(m,2));function S(){const M=new I,A=new I;let T=0;const R=(t-e)/n;for(let D=0;D<=r;D++){const x=[],v=D/r,P=v*(t-e)+e;for(let F=0;F<=i;F++){const z=F/i,X=z*l+o,W=Math.sin(X),$=Math.cos(X);A.x=P*W,A.y=-v*n+p,A.z=P*$,d.push(A.x,A.y,A.z),M.set(W,R,$).normalize(),f.push(M.x,M.y,M.z),m.push(z,1-v),x.push(_++)}b.push(x)}for(let D=0;D<i;D++)for(let x=0;x<r;x++){const v=b[x][D],P=b[x+1][D],F=b[x+1][D+1],z=b[x][D+1];(e>0||x!==0)&&(h.push(v,P,z),T+=3),(t>0||x!==r-1)&&(h.push(P,F,z),T+=3)}c.addGroup(u,T,0),u+=T}function E(M){const A=_,T=new He,R=new I;let D=0;const x=M===!0?e:t,v=M===!0?1:-1;for(let F=1;F<=i;F++)d.push(0,p*v,0),f.push(0,v,0),m.push(.5,.5),_++;const P=_;for(let F=0;F<=i;F++){const X=F/i*l+o,W=Math.cos(X),$=Math.sin(X);R.x=x*$,R.y=p*v,R.z=x*W,d.push(R.x,R.y,R.z),f.push(0,v,0),T.x=W*.5+.5,T.y=$*.5*v+.5,m.push(T.x,T.y),_++}for(let F=0;F<i;F++){const z=A+F,X=P+F;M===!0?h.push(X,X+1,z):h.push(X+1,X,z),D+=3}c.addGroup(u,D,M===!0?1:2),u+=D}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cn(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ut extends Cn{constructor(e=1,t=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Ut(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Pi extends Ct{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],a=[];o(i),c(n),h(),this.setAttribute("position",new ht(r,3)),this.setAttribute("normal",new ht(r.slice(),3)),this.setAttribute("uv",new ht(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(S){const E=new I,M=new I,A=new I;for(let T=0;T<t.length;T+=3)m(t[T+0],E),m(t[T+1],M),m(t[T+2],A),l(E,M,A,S)}function l(S,E,M,A){const T=A+1,R=[];for(let D=0;D<=T;D++){R[D]=[];const x=S.clone().lerp(M,D/T),v=E.clone().lerp(M,D/T),P=T-D;for(let F=0;F<=P;F++)F===0&&D===T?R[D][F]=x:R[D][F]=x.clone().lerp(v,F/P)}for(let D=0;D<T;D++)for(let x=0;x<2*(T-D)-1;x++){const v=Math.floor(x/2);x%2===0?(f(R[D][v+1]),f(R[D+1][v]),f(R[D][v])):(f(R[D][v+1]),f(R[D+1][v+1]),f(R[D+1][v]))}}function c(S){const E=new I;for(let M=0;M<r.length;M+=3)E.x=r[M+0],E.y=r[M+1],E.z=r[M+2],E.normalize().multiplyScalar(S),r[M+0]=E.x,r[M+1]=E.y,r[M+2]=E.z}function h(){const S=new I;for(let E=0;E<r.length;E+=3){S.x=r[E+0],S.y=r[E+1],S.z=r[E+2];const M=p(S)/2/Math.PI+.5,A=u(S)/Math.PI+.5;a.push(M,1-A)}_(),d()}function d(){for(let S=0;S<a.length;S+=6){const E=a[S+0],M=a[S+2],A=a[S+4],T=Math.max(E,M,A),R=Math.min(E,M,A);T>.9&&R<.1&&(E<.2&&(a[S+0]+=1),M<.2&&(a[S+2]+=1),A<.2&&(a[S+4]+=1))}}function f(S){r.push(S.x,S.y,S.z)}function m(S,E){const M=S*3;E.x=e[M+0],E.y=e[M+1],E.z=e[M+2]}function _(){const S=new I,E=new I,M=new I,A=new I,T=new He,R=new He,D=new He;for(let x=0,v=0;x<r.length;x+=9,v+=6){S.set(r[x+0],r[x+1],r[x+2]),E.set(r[x+3],r[x+4],r[x+5]),M.set(r[x+6],r[x+7],r[x+8]),T.set(a[v+0],a[v+1]),R.set(a[v+2],a[v+3]),D.set(a[v+4],a[v+5]),A.copy(S).add(E).add(M).divideScalar(3);const P=p(A);b(T,v+0,S,P),b(R,v+2,E,P),b(D,v+4,M,P)}}function b(S,E,M,A){A<0&&S.x===1&&(a[E]=S.x-1),M.x===0&&M.z===0&&(a[E]=A/2/Math.PI+.5)}function p(S){return Math.atan2(S.z,-S.x)}function u(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pi(e.vertices,e.indices,e.radius,e.details)}}class ka extends Pi{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ka(e.radius,e.detail)}}class za extends Pi{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new za(e.radius,e.detail)}}class Xs extends Pi{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Xs(e.radius,e.detail)}}class Ei extends Ct{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,d=e/o,f=t/l,m=[],_=[],b=[],p=[];for(let u=0;u<h;u++){const S=u*f-a;for(let E=0;E<c;E++){const M=E*d-r;_.push(M,-S,0),b.push(0,0,1),p.push(E/o),p.push(1-u/l)}}for(let u=0;u<l;u++)for(let S=0;S<o;S++){const E=S+c*u,M=S+c*(u+1),A=S+1+c*(u+1),T=S+1+c*u;m.push(E,M,T),m.push(M,A,T)}this.setIndex(m),this.setAttribute("position",new ht(_,3)),this.setAttribute("normal",new ht(b,3)),this.setAttribute("uv",new ht(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ei(e.width,e.height,e.widthSegments,e.heightSegments)}}class Nt extends Ct{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],d=new I,f=new I,m=[],_=[],b=[],p=[];for(let u=0;u<=n;u++){const S=[],E=u/n;let M=0;u===0&&a===0?M=.5/t:u===n&&l===Math.PI&&(M=-.5/t);for(let A=0;A<=t;A++){const T=A/t;d.x=-e*Math.cos(i+T*r)*Math.sin(a+E*o),d.y=e*Math.cos(a+E*o),d.z=e*Math.sin(i+T*r)*Math.sin(a+E*o),_.push(d.x,d.y,d.z),f.copy(d).normalize(),b.push(f.x,f.y,f.z),p.push(T+M,1-E),S.push(c++)}h.push(S)}for(let u=0;u<n;u++)for(let S=0;S<t;S++){const E=h[u][S+1],M=h[u][S],A=h[u+1][S],T=h[u+1][S+1];(u!==0||a>0)&&m.push(E,M,T),(u!==n-1||l<Math.PI)&&m.push(M,A,T)}this.setIndex(m),this.setAttribute("position",new ht(_,3)),this.setAttribute("normal",new ht(b,3)),this.setAttribute("uv",new ht(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Nt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Ha extends Pi{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ha(e.radius,e.detail)}}class An extends Ct{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);const a=[],o=[],l=[],c=[],h=new I,d=new I,f=new I;for(let m=0;m<=n;m++)for(let _=0;_<=i;_++){const b=_/i*r,p=m/n*Math.PI*2;d.x=(e+t*Math.cos(p))*Math.cos(b),d.y=(e+t*Math.cos(p))*Math.sin(b),d.z=t*Math.sin(p),o.push(d.x,d.y,d.z),h.x=e*Math.cos(b),h.y=e*Math.sin(b),f.subVectors(d,h).normalize(),l.push(f.x,f.y,f.z),c.push(_/i),c.push(m/n)}for(let m=1;m<=n;m++)for(let _=1;_<=i;_++){const b=(i+1)*m+_-1,p=(i+1)*(m-1)+_-1,u=(i+1)*(m-1)+_,S=(i+1)*m+_;a.push(b,p,S),a.push(p,u,S)}this.setIndex(a),this.setAttribute("position",new ht(o,3)),this.setAttribute("normal",new ht(l,3)),this.setAttribute("uv",new ht(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new An(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class wi extends Ci{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Pe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Pl,this.normalScale=new He(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Su extends Ci{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=gh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Eu extends Ci{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Ga extends _t{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Pe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const xr=new Je,Fo=new I,Oo=new I;class Xl{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new He(512,512),this.mapType=an,this.map=null,this.mapPass=null,this.matrix=new Je,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ba,this._frameExtents=new He(1,1),this._viewportCount=1,this._viewports=[new je(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Fo.setFromMatrixPosition(e.matrixWorld),t.position.copy(Fo),Oo.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Oo),t.updateMatrixWorld(),xr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(xr,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(xr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Bo=new Je,ki=new I,yr=new I;class wu extends Xl{constructor(){super(new Gt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new He(4,2),this._viewportCount=6,this._viewports=[new je(2,1,1,1),new je(0,1,1,1),new je(3,1,1,1),new je(1,1,1,1),new je(3,0,1,1),new je(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),ki.setFromMatrixPosition(e.matrixWorld),n.position.copy(ki),yr.copy(n.position),yr.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(yr),n.updateMatrixWorld(),i.makeTranslation(-ki.x,-ki.y,-ki.z),Bo.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bo,n.coordinateSystem,n.reversedDepth)}}class Tu extends Ga{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new wu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Va extends zl{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Au extends Xl{constructor(){super(new Va(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ko extends Ga{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.shadow=new Au}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Ru extends Ga{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Cu extends Gt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}function zo(s,e,t,n){const i=Pu(n);switch(t){case Al:return s*e;case Da:return s*e/i.components*i.byteLength;case La:return s*e/i.components*i.byteLength;case Cl:return s*e*2/i.components*i.byteLength;case Ia:return s*e*2/i.components*i.byteLength;case Rl:return s*e*3/i.components*i.byteLength;case Zt:return s*e*4/i.components*i.byteLength;case Ua:return s*e*4/i.components*i.byteLength;case Ps:case Ds:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Ls:case Is:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case qr:case Kr:return Math.max(s,16)*Math.max(e,8)/4;case $r:case Yr:return Math.max(s,8)*Math.max(e,8)/2;case jr:case Zr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Jr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Qr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case ea:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case ta:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case na:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case ia:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case sa:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case ra:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case aa:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case oa:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case la:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case ca:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case ha:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case ua:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case da:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case fa:case pa:case ma:return Math.ceil(s/4)*Math.ceil(e/4)*16;case ga:case _a:return Math.ceil(s/4)*Math.ceil(e/4)*8;case va:case xa:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Pu(s){switch(s){case an:case Sl:return{byteLength:1,components:1};case $i:case El:case Ji:return{byteLength:2,components:1};case Ca:case Pa:return{byteLength:2,components:4};case Yn:case Ra:case sn:return{byteLength:4,components:1};case wl:case Tl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Aa}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Aa);function $l(){let s=null,e=!1,t=null,n=null;function i(r,a){t(r,a),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Du(s){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,d=c.byteLength,f=s.createBuffer();s.bindBuffer(l,f),s.bufferData(l,c,h),o.onUploadCallback();let m;if(c instanceof Float32Array)m=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=s.HALF_FLOAT:m=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=s.SHORT;else if(c instanceof Uint32Array)m=s.UNSIGNED_INT;else if(c instanceof Int32Array)m=s.INT;else if(c instanceof Int8Array)m=s.BYTE;else if(c instanceof Uint8Array)m=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const h=l.array,d=l.updateRanges;if(s.bindBuffer(c,o),d.length===0)s.bufferSubData(c,0,h);else{d.sort((m,_)=>m.start-_.start);let f=0;for(let m=1;m<d.length;m++){const _=d[f],b=d[m];b.start<=_.start+_.count+1?_.count=Math.max(_.count,b.start+b.count-_.start):(++f,d[f]=b)}d.length=f+1;for(let m=0,_=d.length;m<_;m++){const b=d[m];s.bufferSubData(c,b.start*h.BYTES_PER_ELEMENT,h,b.start,b.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(s.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var Lu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Iu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Uu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Nu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Fu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ou=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Bu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,ku=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,zu=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Hu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Gu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Vu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Wu=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Xu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,$u=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,qu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Yu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ku=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ju=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Zu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ju=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Qu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ed=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,td=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,nd=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,id=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,sd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,rd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ad=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,od=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ld="gl_FragColor = linearToOutputTexel( gl_FragColor );",cd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,hd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,ud=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,dd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,fd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,pd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,md=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,gd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,_d=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,vd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,xd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,yd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,bd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Md=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Sd=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ed=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,wd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Td=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ad=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Rd=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Cd=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Pd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Dd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Ld=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Id=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ud=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Nd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Fd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Od=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Bd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,kd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,zd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Hd=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Vd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Wd=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Xd=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,$d=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qd=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Yd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Kd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,jd=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Zd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Jd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ef=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,tf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,nf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,sf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,rf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,af=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,of=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,lf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,cf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,hf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,uf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,df=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ff=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,pf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,mf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,gf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,_f=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,vf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,xf=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,yf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,bf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Mf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Sf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ef=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,wf=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Tf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Af=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Rf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Cf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Pf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Df=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Lf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,If=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Uf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Nf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ff=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Of=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,kf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,zf=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Hf=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Gf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Vf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wf=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Xf=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$f=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,qf=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yf=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Kf=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jf=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Zf=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Qf=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,ep=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,tp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,np=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,ip=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,rp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ap=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,op=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,lp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,hp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,up=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Oe={alphahash_fragment:Lu,alphahash_pars_fragment:Iu,alphamap_fragment:Uu,alphamap_pars_fragment:Nu,alphatest_fragment:Fu,alphatest_pars_fragment:Ou,aomap_fragment:Bu,aomap_pars_fragment:ku,batching_pars_vertex:zu,batching_vertex:Hu,begin_vertex:Gu,beginnormal_vertex:Vu,bsdfs:Wu,iridescence_fragment:Xu,bumpmap_pars_fragment:$u,clipping_planes_fragment:qu,clipping_planes_pars_fragment:Yu,clipping_planes_pars_vertex:Ku,clipping_planes_vertex:ju,color_fragment:Zu,color_pars_fragment:Ju,color_pars_vertex:Qu,color_vertex:ed,common:td,cube_uv_reflection_fragment:nd,defaultnormal_vertex:id,displacementmap_pars_vertex:sd,displacementmap_vertex:rd,emissivemap_fragment:ad,emissivemap_pars_fragment:od,colorspace_fragment:ld,colorspace_pars_fragment:cd,envmap_fragment:hd,envmap_common_pars_fragment:ud,envmap_pars_fragment:dd,envmap_pars_vertex:fd,envmap_physical_pars_fragment:Ed,envmap_vertex:pd,fog_vertex:md,fog_pars_vertex:gd,fog_fragment:_d,fog_pars_fragment:vd,gradientmap_pars_fragment:xd,lightmap_pars_fragment:yd,lights_lambert_fragment:bd,lights_lambert_pars_fragment:Md,lights_pars_begin:Sd,lights_toon_fragment:wd,lights_toon_pars_fragment:Td,lights_phong_fragment:Ad,lights_phong_pars_fragment:Rd,lights_physical_fragment:Cd,lights_physical_pars_fragment:Pd,lights_fragment_begin:Dd,lights_fragment_maps:Ld,lights_fragment_end:Id,logdepthbuf_fragment:Ud,logdepthbuf_pars_fragment:Nd,logdepthbuf_pars_vertex:Fd,logdepthbuf_vertex:Od,map_fragment:Bd,map_pars_fragment:kd,map_particle_fragment:zd,map_particle_pars_fragment:Hd,metalnessmap_fragment:Gd,metalnessmap_pars_fragment:Vd,morphinstance_vertex:Wd,morphcolor_vertex:Xd,morphnormal_vertex:$d,morphtarget_pars_vertex:qd,morphtarget_vertex:Yd,normal_fragment_begin:Kd,normal_fragment_maps:jd,normal_pars_fragment:Zd,normal_pars_vertex:Jd,normal_vertex:Qd,normalmap_pars_fragment:ef,clearcoat_normal_fragment_begin:tf,clearcoat_normal_fragment_maps:nf,clearcoat_pars_fragment:sf,iridescence_pars_fragment:rf,opaque_fragment:af,packing:of,premultiplied_alpha_fragment:lf,project_vertex:cf,dithering_fragment:hf,dithering_pars_fragment:uf,roughnessmap_fragment:df,roughnessmap_pars_fragment:ff,shadowmap_pars_fragment:pf,shadowmap_pars_vertex:mf,shadowmap_vertex:gf,shadowmask_pars_fragment:_f,skinbase_vertex:vf,skinning_pars_vertex:xf,skinning_vertex:yf,skinnormal_vertex:bf,specularmap_fragment:Mf,specularmap_pars_fragment:Sf,tonemapping_fragment:Ef,tonemapping_pars_fragment:wf,transmission_fragment:Tf,transmission_pars_fragment:Af,uv_pars_fragment:Rf,uv_pars_vertex:Cf,uv_vertex:Pf,worldpos_vertex:Df,background_vert:Lf,background_frag:If,backgroundCube_vert:Uf,backgroundCube_frag:Nf,cube_vert:Ff,cube_frag:Of,depth_vert:Bf,depth_frag:kf,distanceRGBA_vert:zf,distanceRGBA_frag:Hf,equirect_vert:Gf,equirect_frag:Vf,linedashed_vert:Wf,linedashed_frag:Xf,meshbasic_vert:$f,meshbasic_frag:qf,meshlambert_vert:Yf,meshlambert_frag:Kf,meshmatcap_vert:jf,meshmatcap_frag:Zf,meshnormal_vert:Jf,meshnormal_frag:Qf,meshphong_vert:ep,meshphong_frag:tp,meshphysical_vert:np,meshphysical_frag:ip,meshtoon_vert:sp,meshtoon_frag:rp,points_vert:ap,points_frag:op,shadow_vert:lp,shadow_frag:cp,sprite_vert:hp,sprite_frag:up},se={common:{diffuse:{value:new Pe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ne}},envmap:{envMap:{value:null},envMapRotation:{value:new Ne},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ne},normalScale:{value:new He(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Pe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0},uvTransform:{value:new Ne}},sprite:{diffuse:{value:new Pe(16777215)},opacity:{value:1},center:{value:new He(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}}},tn={basic:{uniforms:Et([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.fog]),vertexShader:Oe.meshbasic_vert,fragmentShader:Oe.meshbasic_frag},lambert:{uniforms:Et([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.fog,se.lights,{emissive:{value:new Pe(0)}}]),vertexShader:Oe.meshlambert_vert,fragmentShader:Oe.meshlambert_frag},phong:{uniforms:Et([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.fog,se.lights,{emissive:{value:new Pe(0)},specular:{value:new Pe(1118481)},shininess:{value:30}}]),vertexShader:Oe.meshphong_vert,fragmentShader:Oe.meshphong_frag},standard:{uniforms:Et([se.common,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.roughnessmap,se.metalnessmap,se.fog,se.lights,{emissive:{value:new Pe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag},toon:{uniforms:Et([se.common,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.gradientmap,se.fog,se.lights,{emissive:{value:new Pe(0)}}]),vertexShader:Oe.meshtoon_vert,fragmentShader:Oe.meshtoon_frag},matcap:{uniforms:Et([se.common,se.bumpmap,se.normalmap,se.displacementmap,se.fog,{matcap:{value:null}}]),vertexShader:Oe.meshmatcap_vert,fragmentShader:Oe.meshmatcap_frag},points:{uniforms:Et([se.points,se.fog]),vertexShader:Oe.points_vert,fragmentShader:Oe.points_frag},dashed:{uniforms:Et([se.common,se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Oe.linedashed_vert,fragmentShader:Oe.linedashed_frag},depth:{uniforms:Et([se.common,se.displacementmap]),vertexShader:Oe.depth_vert,fragmentShader:Oe.depth_frag},normal:{uniforms:Et([se.common,se.bumpmap,se.normalmap,se.displacementmap,{opacity:{value:1}}]),vertexShader:Oe.meshnormal_vert,fragmentShader:Oe.meshnormal_frag},sprite:{uniforms:Et([se.sprite,se.fog]),vertexShader:Oe.sprite_vert,fragmentShader:Oe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Oe.background_vert,fragmentShader:Oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ne}},vertexShader:Oe.backgroundCube_vert,fragmentShader:Oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Oe.cube_vert,fragmentShader:Oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Oe.equirect_vert,fragmentShader:Oe.equirect_frag},distanceRGBA:{uniforms:Et([se.common,se.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Oe.distanceRGBA_vert,fragmentShader:Oe.distanceRGBA_frag},shadow:{uniforms:Et([se.lights,se.fog,{color:{value:new Pe(0)},opacity:{value:1}}]),vertexShader:Oe.shadow_vert,fragmentShader:Oe.shadow_frag}};tn.physical={uniforms:Et([tn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ne},clearcoatNormalScale:{value:new He(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ne},sheen:{value:0},sheenColor:{value:new Pe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ne},transmissionSamplerSize:{value:new He},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ne},attenuationDistance:{value:0},attenuationColor:{value:new Pe(0)},specularColor:{value:new Pe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ne},anisotropyVector:{value:new He},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ne}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag};const Ts={r:0,b:0,g:0},Fn=new on,dp=new Je;function fp(s,e,t,n,i,r,a){const o=new Pe(0);let l=r===!0?0:1,c,h,d=null,f=0,m=null;function _(E){let M=E.isScene===!0?E.background:null;return M&&M.isTexture&&(M=(E.backgroundBlurriness>0?t:e).get(M)),M}function b(E){let M=!1;const A=_(E);A===null?u(o,l):A&&A.isColor&&(u(A,1),M=!0);const T=s.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function p(E,M){const A=_(M);A&&(A.isCubeTexture||A.mapping===Vs)?(h===void 0&&(h=new me(new wt(1,1,1),new _n({name:"BackgroundCubeMaterial",uniforms:Si(tn.backgroundCube.uniforms),vertexShader:tn.backgroundCube.vertexShader,fragmentShader:tn.backgroundCube.fragmentShader,side:Rt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(T,R,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Fn.copy(M.backgroundRotation),Fn.x*=-1,Fn.y*=-1,Fn.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(Fn.y*=-1,Fn.z*=-1),h.material.uniforms.envMap.value=A,h.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(dp.makeRotationFromEuler(Fn)),h.material.toneMapped=Xe.getTransfer(A.colorSpace)!==Ke,(d!==A||f!==A.version||m!==s.toneMapping)&&(h.material.needsUpdate=!0,d=A,f=A.version,m=s.toneMapping),h.layers.enableAll(),E.unshift(h,h.geometry,h.material,0,0,null)):A&&A.isTexture&&(c===void 0&&(c=new me(new Ei(2,2),new _n({name:"BackgroundMaterial",uniforms:Si(tn.background.uniforms),vertexShader:tn.background.vertexShader,fragmentShader:tn.background.fragmentShader,side:Rn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=A,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=Xe.getTransfer(A.colorSpace)!==Ke,A.matrixAutoUpdate===!0&&A.updateMatrix(),c.material.uniforms.uvTransform.value.copy(A.matrix),(d!==A||f!==A.version||m!==s.toneMapping)&&(c.material.needsUpdate=!0,d=A,f=A.version,m=s.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function u(E,M){E.getRGB(Ts,kl(s)),n.buffers.color.setClear(Ts.r,Ts.g,Ts.b,M,a)}function S(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(E,M=1){o.set(E),l=M,u(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,u(o,l)},render:b,addToRenderList:p,dispose:S}}function pp(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=f(null);let r=i,a=!1;function o(v,P,F,z,X){let W=!1;const $=d(z,F,P);r!==$&&(r=$,c(r.object)),W=m(v,z,F,X),W&&_(v,z,F,X),X!==null&&e.update(X,s.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,M(v,P,F,z),X!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function l(){return s.createVertexArray()}function c(v){return s.bindVertexArray(v)}function h(v){return s.deleteVertexArray(v)}function d(v,P,F){const z=F.wireframe===!0;let X=n[v.id];X===void 0&&(X={},n[v.id]=X);let W=X[P.id];W===void 0&&(W={},X[P.id]=W);let $=W[z];return $===void 0&&($=f(l()),W[z]=$),$}function f(v){const P=[],F=[],z=[];for(let X=0;X<t;X++)P[X]=0,F[X]=0,z[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:F,attributeDivisors:z,object:v,attributes:{},index:null}}function m(v,P,F,z){const X=r.attributes,W=P.attributes;let $=0;const j=F.getAttributes();for(const H in j)if(j[H].location>=0){const ce=X[H];let Se=W[H];if(Se===void 0&&(H==="instanceMatrix"&&v.instanceMatrix&&(Se=v.instanceMatrix),H==="instanceColor"&&v.instanceColor&&(Se=v.instanceColor)),ce===void 0||ce.attribute!==Se||Se&&ce.data!==Se.data)return!0;$++}return r.attributesNum!==$||r.index!==z}function _(v,P,F,z){const X={},W=P.attributes;let $=0;const j=F.getAttributes();for(const H in j)if(j[H].location>=0){let ce=W[H];ce===void 0&&(H==="instanceMatrix"&&v.instanceMatrix&&(ce=v.instanceMatrix),H==="instanceColor"&&v.instanceColor&&(ce=v.instanceColor));const Se={};Se.attribute=ce,ce&&ce.data&&(Se.data=ce.data),X[H]=Se,$++}r.attributes=X,r.attributesNum=$,r.index=z}function b(){const v=r.newAttributes;for(let P=0,F=v.length;P<F;P++)v[P]=0}function p(v){u(v,0)}function u(v,P){const F=r.newAttributes,z=r.enabledAttributes,X=r.attributeDivisors;F[v]=1,z[v]===0&&(s.enableVertexAttribArray(v),z[v]=1),X[v]!==P&&(s.vertexAttribDivisor(v,P),X[v]=P)}function S(){const v=r.newAttributes,P=r.enabledAttributes;for(let F=0,z=P.length;F<z;F++)P[F]!==v[F]&&(s.disableVertexAttribArray(F),P[F]=0)}function E(v,P,F,z,X,W,$){$===!0?s.vertexAttribIPointer(v,P,F,X,W):s.vertexAttribPointer(v,P,F,z,X,W)}function M(v,P,F,z){b();const X=z.attributes,W=F.getAttributes(),$=P.defaultAttributeValues;for(const j in W){const H=W[j];if(H.location>=0){let re=X[j];if(re===void 0&&(j==="instanceMatrix"&&v.instanceMatrix&&(re=v.instanceMatrix),j==="instanceColor"&&v.instanceColor&&(re=v.instanceColor)),re!==void 0){const ce=re.normalized,Se=re.itemSize,Be=e.get(re);if(Be===void 0)continue;const Qe=Be.buffer,it=Be.type,$e=Be.bytesPerElement,q=it===s.INT||it===s.UNSIGNED_INT||re.gpuType===Ra;if(re.isInterleavedBufferAttribute){const Z=re.data,de=Z.stride,De=re.offset;if(Z.isInstancedInterleavedBuffer){for(let Me=0;Me<H.locationSize;Me++)u(H.location+Me,Z.meshPerAttribute);v.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let Me=0;Me<H.locationSize;Me++)p(H.location+Me);s.bindBuffer(s.ARRAY_BUFFER,Qe);for(let Me=0;Me<H.locationSize;Me++)E(H.location+Me,Se/H.locationSize,it,ce,de*$e,(De+Se/H.locationSize*Me)*$e,q)}else{if(re.isInstancedBufferAttribute){for(let Z=0;Z<H.locationSize;Z++)u(H.location+Z,re.meshPerAttribute);v.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let Z=0;Z<H.locationSize;Z++)p(H.location+Z);s.bindBuffer(s.ARRAY_BUFFER,Qe);for(let Z=0;Z<H.locationSize;Z++)E(H.location+Z,Se/H.locationSize,it,ce,Se*$e,Se/H.locationSize*Z*$e,q)}}else if($!==void 0){const ce=$[j];if(ce!==void 0)switch(ce.length){case 2:s.vertexAttrib2fv(H.location,ce);break;case 3:s.vertexAttrib3fv(H.location,ce);break;case 4:s.vertexAttrib4fv(H.location,ce);break;default:s.vertexAttrib1fv(H.location,ce)}}}}S()}function A(){D();for(const v in n){const P=n[v];for(const F in P){const z=P[F];for(const X in z)h(z[X].object),delete z[X];delete P[F]}delete n[v]}}function T(v){if(n[v.id]===void 0)return;const P=n[v.id];for(const F in P){const z=P[F];for(const X in z)h(z[X].object),delete z[X];delete P[F]}delete n[v.id]}function R(v){for(const P in n){const F=n[P];if(F[v.id]===void 0)continue;const z=F[v.id];for(const X in z)h(z[X].object),delete z[X];delete F[v.id]}}function D(){x(),a=!0,r!==i&&(r=i,c(r.object))}function x(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:D,resetDefaultState:x,dispose:A,releaseStatesOfGeometry:T,releaseStatesOfProgram:R,initAttributes:b,enableAttribute:p,disableUnusedAttributes:S}}function mp(s,e,t){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),t.update(h,n,1)}function a(c,h,d){d!==0&&(s.drawArraysInstanced(n,c,h,d),t.update(h,n,d))}function o(c,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let m=0;for(let _=0;_<d;_++)m+=h[_];t.update(m,n,1)}function l(c,h,d,f){if(d===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let _=0;_<c.length;_++)a(c[_],h[_],f[_]);else{m.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,d);let _=0;for(let b=0;b<d;b++)_+=h[b]*f[b];t.update(_,n,1)}}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function gp(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(R){return!(R!==Zt&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const D=R===Ji&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==an&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==sn&&!D)}function l(R){if(R==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),u=s.getParameter(s.MAX_VERTEX_ATTRIBS),S=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),E=s.getParameter(s.MAX_VARYING_VECTORS),M=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),A=_>0,T=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:m,maxVertexTextures:_,maxTextureSize:b,maxCubemapSize:p,maxAttributes:u,maxVertexUniforms:S,maxVaryings:E,maxFragmentUniforms:M,vertexTextures:A,maxSamples:T}}function _p(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new kn,o=new Ne,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const m=d.length!==0||f||n!==0||i;return i=f,n=d.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){t=h(d,f,0)},this.setState=function(d,f,m){const _=d.clippingPlanes,b=d.clipIntersection,p=d.clipShadows,u=s.get(d);if(!i||_===null||_.length===0||r&&!p)r?h(null):c();else{const S=r?0:n,E=S*4;let M=u.clippingState||null;l.value=M,M=h(_,f,E,m);for(let A=0;A!==E;++A)M[A]=t[A];u.clippingState=M,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,f,m,_){const b=d!==null?d.length:0;let p=null;if(b!==0){if(p=l.value,_!==!0||p===null){const u=m+b*4,S=f.matrixWorldInverse;o.getNormalMatrix(S),(p===null||p.length<u)&&(p=new Float32Array(u));for(let E=0,M=m;E!==b;++E,M+=4)a.copy(d[E]).applyMatrix4(S,o),a.normal.toArray(p,M),p[M+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=b,e.numIntersection=0,p}}function vp(s){let e=new WeakMap;function t(a,o){return o===Gr?a.mapping=yi:o===Vr&&(a.mapping=bi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Gr||o===Vr)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new fu(l.height);return c.fromEquirectangularTexture(s,a),e.set(a,c),a.addEventListener("dispose",i),t(c.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const pi=4,Ho=[.125,.215,.35,.446,.526,.582],Gn=20,br=new Va,Go=new Pe;let Mr=null,Sr=0,Er=0,wr=!1;const zn=(1+Math.sqrt(5))/2,di=1/zn,Vo=[new I(-zn,di,0),new I(zn,di,0),new I(-di,0,zn),new I(di,0,zn),new I(0,zn,-di),new I(0,zn,di),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)],xp=new I;class Wo{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100,r={}){const{size:a=256,position:o=xp}=r;Mr=this._renderer.getRenderTarget(),Sr=this._renderer.getActiveCubeFace(),Er=this._renderer.getActiveMipmapLevel(),wr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=qo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=$o(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Mr,Sr,Er),this._renderer.xr.enabled=wr,e.scissorTest=!1,As(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===yi||e.mapping===bi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Mr=this._renderer.getRenderTarget(),Sr=this._renderer.getActiveCubeFace(),Er=this._renderer.getActiveMipmapLevel(),wr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:nn,minFilter:nn,generateMipmaps:!1,type:Ji,format:Zt,colorSpace:Mi,depthBuffer:!1},i=Xo(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xo(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=yp(r)),this._blurMaterial=bp(r,e,t)}return i}_compileMaterial(e){const t=new me(this._lodPlanes[0],e);this._renderer.compile(t,br)}_sceneToCubeUV(e,t,n,i,r){const l=new Gt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,m=d.toneMapping;d.getClearColor(Go),d.toneMapping=Tn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null));const b=new Ws({name:"PMREM.Background",side:Rt,depthWrite:!1,depthTest:!1}),p=new me(new wt,b);let u=!1;const S=e.background;S?S.isColor&&(b.color.copy(S),e.background=null,u=!0):(b.color.copy(Go),u=!0);for(let E=0;E<6;E++){const M=E%3;M===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[E],r.y,r.z)):M===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[E]));const A=this._cubeSize;As(i,M*A,E>2?A:0,A,A),d.setRenderTarget(i),u&&d.render(p,l),d.render(e,l)}p.geometry.dispose(),p.material.dispose(),d.toneMapping=m,d.autoClear=f,e.background=S}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===yi||e.mapping===bi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=qo()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=$o());const r=i?this._cubemapMaterial:this._equirectMaterial,a=new me(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;As(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,br)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Vo[(i-r-1)%Vo.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",r),this._halfBlur(a,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new me(this._lodPlanes[i],c),f=c.uniforms,m=this._sizeLods[n]-1,_=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Gn-1),b=r/_,p=isFinite(r)?1+Math.floor(h*b):Gn;p>Gn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Gn}`);const u=[];let S=0;for(let R=0;R<Gn;++R){const D=R/b,x=Math.exp(-D*D/2);u.push(x),R===0?S+=x:R<p&&(S+=2*x)}for(let R=0;R<u.length;R++)u[R]=u[R]/S;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=u,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:E}=this;f.dTheta.value=_,f.mipInt.value=E-n;const M=this._sizeLods[i],A=3*M*(i>E-pi?i-E+pi:0),T=4*(this._cubeSize-M);As(t,A,T,3*M,2*M),l.setRenderTarget(t),l.render(d,br)}}function yp(s){const e=[],t=[],n=[];let i=s;const r=s-pi+1+Ho.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);t.push(o);let l=1/o;a>s-pi?l=Ho[a-s+pi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,d=1+c,f=[h,h,d,h,d,d,h,h,d,d,h,d],m=6,_=6,b=3,p=2,u=1,S=new Float32Array(b*_*m),E=new Float32Array(p*_*m),M=new Float32Array(u*_*m);for(let T=0;T<m;T++){const R=T%3*2/3-1,D=T>2?0:-1,x=[R,D,0,R+2/3,D,0,R+2/3,D+1,0,R,D,0,R+2/3,D+1,0,R,D+1,0];S.set(x,b*_*T),E.set(f,p*_*T);const v=[T,T,T,T,T,T];M.set(v,u*_*T)}const A=new Ct;A.setAttribute("position",new Wt(S,b)),A.setAttribute("uv",new Wt(E,p)),A.setAttribute("faceIndex",new Wt(M,u)),e.push(A),i>pi&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Xo(s,e,t){const n=new Kn(s,e,t);return n.texture.mapping=Vs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function As(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function bp(s,e,t){const n=new Float32Array(Gn),i=new I(0,1,0);return new _n({name:"SphericalGaussianBlur",defines:{n:Gn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Wa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:wn,depthTest:!1,depthWrite:!1})}function $o(){return new _n({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Wa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:wn,depthTest:!1,depthWrite:!1})}function qo(){return new _n({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Wa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:wn,depthTest:!1,depthWrite:!1})}function Wa(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Mp(s){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Gr||l===Vr,h=l===yi||l===bi;if(c||h){let d=e.get(o);const f=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new Wo(s)),d=c?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const m=o.image;return c&&m&&m.height>0||h&&m&&i(m)?(t===null&&(t=new Wo(s)),d=c?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",r),d.texture):null}}}return o}function i(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Sp(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&Zi("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Ep(s,e,t,n){const i={},r=new WeakMap;function a(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const _ in f.attributes)e.remove(f.attributes[_]);f.removeEventListener("dispose",a),delete i[f.id];const m=r.get(f);m&&(e.remove(m),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(d,f){return i[f.id]===!0||(f.addEventListener("dispose",a),i[f.id]=!0,t.memory.geometries++),f}function l(d){const f=d.attributes;for(const m in f)e.update(f[m],s.ARRAY_BUFFER)}function c(d){const f=[],m=d.index,_=d.attributes.position;let b=0;if(m!==null){const S=m.array;b=m.version;for(let E=0,M=S.length;E<M;E+=3){const A=S[E+0],T=S[E+1],R=S[E+2];f.push(A,T,T,R,R,A)}}else if(_!==void 0){const S=_.array;b=_.version;for(let E=0,M=S.length/3-1;E<M;E+=3){const A=E+0,T=E+1,R=E+2;f.push(A,T,T,R,R,A)}}else return;const p=new(Ll(f)?Bl:Ol)(f,1);p.version=b;const u=r.get(d);u&&e.remove(u),r.set(d,p)}function h(d){const f=r.get(d);if(f){const m=d.index;m!==null&&f.version<m.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function wp(s,e,t){let n;function i(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,m){s.drawElements(n,m,r,f*a),t.update(m,n,1)}function c(f,m,_){_!==0&&(s.drawElementsInstanced(n,m,r,f*a,_),t.update(m,n,_))}function h(f,m,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,f,0,_);let p=0;for(let u=0;u<_;u++)p+=m[u];t.update(p,n,1)}function d(f,m,_,b){if(_===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let u=0;u<f.length;u++)c(f[u]/a,m[u],b[u]);else{p.multiDrawElementsInstancedWEBGL(n,m,0,r,f,0,b,0,_);let u=0;for(let S=0;S<_;S++)u+=m[S]*b[S];t.update(u,n,1)}}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function Tp(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Ap(s,e,t){const n=new WeakMap,i=new je;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let f=n.get(o);if(f===void 0||f.count!==d){let v=function(){D.dispose(),n.delete(o),o.removeEventListener("dispose",v)};var m=v;f!==void 0&&f.texture.dispose();const _=o.morphAttributes.position!==void 0,b=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,u=o.morphAttributes.position||[],S=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let M=0;_===!0&&(M=1),b===!0&&(M=2),p===!0&&(M=3);let A=o.attributes.position.count*M,T=1;A>e.maxTextureSize&&(T=Math.ceil(A/e.maxTextureSize),A=e.maxTextureSize);const R=new Float32Array(A*T*4*d),D=new Il(R,A,T,d);D.type=sn,D.needsUpdate=!0;const x=M*4;for(let P=0;P<d;P++){const F=u[P],z=S[P],X=E[P],W=A*T*4*P;for(let $=0;$<F.count;$++){const j=$*x;_===!0&&(i.fromBufferAttribute(F,$),R[W+j+0]=i.x,R[W+j+1]=i.y,R[W+j+2]=i.z,R[W+j+3]=0),b===!0&&(i.fromBufferAttribute(z,$),R[W+j+4]=i.x,R[W+j+5]=i.y,R[W+j+6]=i.z,R[W+j+7]=0),p===!0&&(i.fromBufferAttribute(X,$),R[W+j+8]=i.x,R[W+j+9]=i.y,R[W+j+10]=i.z,R[W+j+11]=X.itemSize===4?i.w:1)}}f={count:d,texture:D,size:new He(A,T)},n.set(o,f),o.addEventListener("dispose",v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let _=0;for(let p=0;p<c.length;p++)_+=c[p];const b=o.morphTargetsRelative?1:1-_;l.getUniforms().setValue(s,"morphTargetBaseInfluence",b),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",f.size)}return{update:r}}function Rp(s,e,t,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=e.get(l,h);if(i.get(d)!==c&&(e.update(d),i.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==c&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return d}function a(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const ql=new Tt,Yo=new Vl(1,1),Yl=new Il,Kl=new jh,jl=new Hl,Ko=[],jo=[],Zo=new Float32Array(16),Jo=new Float32Array(9),Qo=new Float32Array(4);function Di(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=Ko[i];if(r===void 0&&(r=new Float32Array(i),Ko[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function ft(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function pt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function $s(s,e){let t=jo[e];t===void 0&&(t=new Int32Array(e),jo[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Cp(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Pp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;s.uniform2fv(this.addr,e),pt(t,e)}}function Dp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ft(t,e))return;s.uniform3fv(this.addr,e),pt(t,e)}}function Lp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;s.uniform4fv(this.addr,e),pt(t,e)}}function Ip(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(ft(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),pt(t,e)}else{if(ft(t,n))return;Qo.set(n),s.uniformMatrix2fv(this.addr,!1,Qo),pt(t,n)}}function Up(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(ft(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),pt(t,e)}else{if(ft(t,n))return;Jo.set(n),s.uniformMatrix3fv(this.addr,!1,Jo),pt(t,n)}}function Np(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(ft(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),pt(t,e)}else{if(ft(t,n))return;Zo.set(n),s.uniformMatrix4fv(this.addr,!1,Zo),pt(t,n)}}function Fp(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Op(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;s.uniform2iv(this.addr,e),pt(t,e)}}function Bp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ft(t,e))return;s.uniform3iv(this.addr,e),pt(t,e)}}function kp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;s.uniform4iv(this.addr,e),pt(t,e)}}function zp(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function Hp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ft(t,e))return;s.uniform2uiv(this.addr,e),pt(t,e)}}function Gp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ft(t,e))return;s.uniform3uiv(this.addr,e),pt(t,e)}}function Vp(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ft(t,e))return;s.uniform4uiv(this.addr,e),pt(t,e)}}function Wp(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Yo.compareFunction=Dl,r=Yo):r=ql,t.setTexture2D(e||r,i)}function Xp(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Kl,i)}function $p(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||jl,i)}function qp(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Yl,i)}function Yp(s){switch(s){case 5126:return Cp;case 35664:return Pp;case 35665:return Dp;case 35666:return Lp;case 35674:return Ip;case 35675:return Up;case 35676:return Np;case 5124:case 35670:return Fp;case 35667:case 35671:return Op;case 35668:case 35672:return Bp;case 35669:case 35673:return kp;case 5125:return zp;case 36294:return Hp;case 36295:return Gp;case 36296:return Vp;case 35678:case 36198:case 36298:case 36306:case 35682:return Wp;case 35679:case 36299:case 36307:return Xp;case 35680:case 36300:case 36308:case 36293:return $p;case 36289:case 36303:case 36311:case 36292:return qp}}function Kp(s,e){s.uniform1fv(this.addr,e)}function jp(s,e){const t=Di(e,this.size,2);s.uniform2fv(this.addr,t)}function Zp(s,e){const t=Di(e,this.size,3);s.uniform3fv(this.addr,t)}function Jp(s,e){const t=Di(e,this.size,4);s.uniform4fv(this.addr,t)}function Qp(s,e){const t=Di(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function em(s,e){const t=Di(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function tm(s,e){const t=Di(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function nm(s,e){s.uniform1iv(this.addr,e)}function im(s,e){s.uniform2iv(this.addr,e)}function sm(s,e){s.uniform3iv(this.addr,e)}function rm(s,e){s.uniform4iv(this.addr,e)}function am(s,e){s.uniform1uiv(this.addr,e)}function om(s,e){s.uniform2uiv(this.addr,e)}function lm(s,e){s.uniform3uiv(this.addr,e)}function cm(s,e){s.uniform4uiv(this.addr,e)}function hm(s,e,t){const n=this.cache,i=e.length,r=$s(t,i);ft(n,r)||(s.uniform1iv(this.addr,r),pt(n,r));for(let a=0;a!==i;++a)t.setTexture2D(e[a]||ql,r[a])}function um(s,e,t){const n=this.cache,i=e.length,r=$s(t,i);ft(n,r)||(s.uniform1iv(this.addr,r),pt(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Kl,r[a])}function dm(s,e,t){const n=this.cache,i=e.length,r=$s(t,i);ft(n,r)||(s.uniform1iv(this.addr,r),pt(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||jl,r[a])}function fm(s,e,t){const n=this.cache,i=e.length,r=$s(t,i);ft(n,r)||(s.uniform1iv(this.addr,r),pt(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||Yl,r[a])}function pm(s){switch(s){case 5126:return Kp;case 35664:return jp;case 35665:return Zp;case 35666:return Jp;case 35674:return Qp;case 35675:return em;case 35676:return tm;case 5124:case 35670:return nm;case 35667:case 35671:return im;case 35668:case 35672:return sm;case 35669:case 35673:return rm;case 5125:return am;case 36294:return om;case 36295:return lm;case 36296:return cm;case 35678:case 36198:case 36298:case 36306:case 35682:return hm;case 35679:case 36299:case 36307:return um;case 35680:case 36300:case 36308:case 36293:return dm;case 36289:case 36303:case 36311:case 36292:return fm}}class mm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Yp(t.type)}}class gm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=pm(t.type)}}class _m{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const Tr=/(\w+)(\])?(\[|\.)?/g;function el(s,e){s.seq.push(e),s.map[e.id]=e}function vm(s,e,t){const n=s.name,i=n.length;for(Tr.lastIndex=0;;){const r=Tr.exec(n),a=Tr.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){el(t,c===void 0?new mm(o,s,e):new gm(o,s,e));break}else{let d=t.map[o];d===void 0&&(d=new _m(o),el(t,d)),t=d}}}class Us{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),a=e.getUniformLocation(t,r.name);vm(r,a,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function tl(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const xm=37297;let ym=0;function bm(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const nl=new Ne;function Mm(s){Xe._getMatrix(nl,Xe.workingColorSpace,s);const e=`mat3( ${nl.elements.map(t=>t.toFixed(4))} )`;switch(Xe.getTransfer(s)){case ks:return[e,"LinearTransferOETF"];case Ke:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function il(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+bm(s.getShaderSource(e),o)}else return r}function Sm(s,e){const t=Mm(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Em(s,e){let t;switch(e){case lh:t="Linear";break;case ch:t="Reinhard";break;case hh:t="Cineon";break;case uh:t="ACESFilmic";break;case fh:t="AgX";break;case ph:t="Neutral";break;case dh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Rs=new I;function wm(){Xe.getLuminanceCoefficients(Rs);const s=Rs.x.toFixed(4),e=Rs.y.toFixed(4),t=Rs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Tm(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Hi).join(`
`)}function Am(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Rm(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function Hi(s){return s!==""}function sl(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function rl(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Cm=/^[ \t]*#include +<([\w\d./]+)>/gm;function ba(s){return s.replace(Cm,Dm)}const Pm=new Map;function Dm(s,e){let t=Oe[e];if(t===void 0){const n=Pm.get(e);if(n!==void 0)t=Oe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ba(t)}const Lm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function al(s){return s.replace(Lm,Im)}function Im(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function ol(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Um(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===yl?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Hc?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===mn&&(e="SHADOWMAP_TYPE_VSM"),e}function Nm(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case yi:case bi:e="ENVMAP_TYPE_CUBE";break;case Vs:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Fm(s){let e="ENVMAP_MODE_REFLECTION";return s.envMap&&s.envMapMode===bi&&(e="ENVMAP_MODE_REFRACTION"),e}function Om(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case bl:e="ENVMAP_BLENDING_MULTIPLY";break;case ah:e="ENVMAP_BLENDING_MIX";break;case oh:e="ENVMAP_BLENDING_ADD";break}return e}function Bm(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function km(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Um(t),c=Nm(t),h=Fm(t),d=Om(t),f=Bm(t),m=Tm(t),_=Am(r),b=i.createProgram();let p,u,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Hi).join(`
`),p.length>0&&(p+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Hi).join(`
`),u.length>0&&(u+=`
`)):(p=[ol(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Hi).join(`
`),u=[ol(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Tn?"#define TONE_MAPPING":"",t.toneMapping!==Tn?Oe.tonemapping_pars_fragment:"",t.toneMapping!==Tn?Em("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Oe.colorspace_pars_fragment,Sm("linearToOutputTexel",t.outputColorSpace),wm(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Hi).join(`
`)),a=ba(a),a=sl(a,t),a=rl(a,t),o=ba(o),o=sl(o,t),o=rl(o,t),a=al(a),o=al(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,u=["#define varying in",t.glslVersion===ho?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ho?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const E=S+p+a,M=S+u+o,A=tl(i,i.VERTEX_SHADER,E),T=tl(i,i.FRAGMENT_SHADER,M);i.attachShader(b,A),i.attachShader(b,T),t.index0AttributeName!==void 0?i.bindAttribLocation(b,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(b,0,"position"),i.linkProgram(b);function R(P){if(s.debug.checkShaderErrors){const F=i.getProgramInfoLog(b)||"",z=i.getShaderInfoLog(A)||"",X=i.getShaderInfoLog(T)||"",W=F.trim(),$=z.trim(),j=X.trim();let H=!0,re=!0;if(i.getProgramParameter(b,i.LINK_STATUS)===!1)if(H=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,b,A,T);else{const ce=il(i,A,"vertex"),Se=il(i,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(b,i.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+W+`
`+ce+`
`+Se)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):($===""||j==="")&&(re=!1);re&&(P.diagnostics={runnable:H,programLog:W,vertexShader:{log:$,prefix:p},fragmentShader:{log:j,prefix:u}})}i.deleteShader(A),i.deleteShader(T),D=new Us(i,b),x=Rm(i,b)}let D;this.getUniforms=function(){return D===void 0&&R(this),D};let x;this.getAttributes=function(){return x===void 0&&R(this),x};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=i.getProgramParameter(b,xm)),v},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(b),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=ym++,this.cacheKey=e,this.usedTimes=1,this.program=b,this.vertexShader=A,this.fragmentShader=T,this}let zm=0;class Hm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Gm(e),t.set(e,n)),n}}class Gm{constructor(e){this.id=zm++,this.code=e,this.usedTimes=0}}function Vm(s,e,t,n,i,r,a){const o=new Nl,l=new Hm,c=new Set,h=[],d=i.logarithmicDepthBuffer,f=i.vertexTextures;let m=i.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function b(x){return c.add(x),x===0?"uv":`uv${x}`}function p(x,v,P,F,z){const X=F.fog,W=z.geometry,$=x.isMeshStandardMaterial?F.environment:null,j=(x.isMeshStandardMaterial?t:e).get(x.envMap||$),H=j&&j.mapping===Vs?j.image.height:null,re=_[x.type];x.precision!==null&&(m=i.getMaxPrecision(x.precision),m!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",m,"instead."));const ce=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Se=ce!==void 0?ce.length:0;let Be=0;W.morphAttributes.position!==void 0&&(Be=1),W.morphAttributes.normal!==void 0&&(Be=2),W.morphAttributes.color!==void 0&&(Be=3);let Qe,it,$e,q;if(re){const qe=tn[re];Qe=qe.vertexShader,it=qe.fragmentShader}else Qe=x.vertexShader,it=x.fragmentShader,l.update(x),$e=l.getVertexShaderID(x),q=l.getFragmentShaderID(x);const Z=s.getRenderTarget(),de=s.state.buffers.depth.getReversed(),De=z.isInstancedMesh===!0,Me=z.isBatchedMesh===!0,Ge=!!x.map,vt=!!x.matcap,C=!!j,st=!!x.aoMap,Ie=!!x.lightMap,Re=!!x.bumpMap,ge=!!x.normalMap,rt=!!x.displacementMap,_e=!!x.emissiveMap,Fe=!!x.metalnessMap,mt=!!x.roughnessMap,ut=x.anisotropy>0,w=x.clearcoat>0,g=x.dispersion>0,O=x.iridescence>0,V=x.sheen>0,K=x.transmission>0,G=ut&&!!x.anisotropyMap,be=w&&!!x.clearcoatMap,ne=w&&!!x.clearcoatNormalMap,ve=w&&!!x.clearcoatRoughnessMap,xe=O&&!!x.iridescenceMap,ee=O&&!!x.iridescenceThicknessMap,le=V&&!!x.sheenColorMap,Ae=V&&!!x.sheenRoughnessMap,ye=!!x.specularMap,ae=!!x.specularColorMap,Ue=!!x.specularIntensityMap,L=K&&!!x.transmissionMap,te=K&&!!x.thicknessMap,ie=!!x.gradientMap,ue=!!x.alphaMap,J=x.alphaTest>0,Y=!!x.alphaHash,pe=!!x.extensions;let Le=Tn;x.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(Le=s.toneMapping);const et={shaderID:re,shaderType:x.type,shaderName:x.name,vertexShader:Qe,fragmentShader:it,defines:x.defines,customVertexShaderID:$e,customFragmentShaderID:q,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:m,batching:Me,batchingColor:Me&&z._colorsTexture!==null,instancing:De,instancingColor:De&&z.instanceColor!==null,instancingMorph:De&&z.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:Z===null?s.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:Mi,alphaToCoverage:!!x.alphaToCoverage,map:Ge,matcap:vt,envMap:C,envMapMode:C&&j.mapping,envMapCubeUVHeight:H,aoMap:st,lightMap:Ie,bumpMap:Re,normalMap:ge,displacementMap:f&&rt,emissiveMap:_e,normalMapObjectSpace:ge&&x.normalMapType===vh,normalMapTangentSpace:ge&&x.normalMapType===Pl,metalnessMap:Fe,roughnessMap:mt,anisotropy:ut,anisotropyMap:G,clearcoat:w,clearcoatMap:be,clearcoatNormalMap:ne,clearcoatRoughnessMap:ve,dispersion:g,iridescence:O,iridescenceMap:xe,iridescenceThicknessMap:ee,sheen:V,sheenColorMap:le,sheenRoughnessMap:Ae,specularMap:ye,specularColorMap:ae,specularIntensityMap:Ue,transmission:K,transmissionMap:L,thicknessMap:te,gradientMap:ie,opaque:x.transparent===!1&&x.blending===gi&&x.alphaToCoverage===!1,alphaMap:ue,alphaTest:J,alphaHash:Y,combine:x.combine,mapUv:Ge&&b(x.map.channel),aoMapUv:st&&b(x.aoMap.channel),lightMapUv:Ie&&b(x.lightMap.channel),bumpMapUv:Re&&b(x.bumpMap.channel),normalMapUv:ge&&b(x.normalMap.channel),displacementMapUv:rt&&b(x.displacementMap.channel),emissiveMapUv:_e&&b(x.emissiveMap.channel),metalnessMapUv:Fe&&b(x.metalnessMap.channel),roughnessMapUv:mt&&b(x.roughnessMap.channel),anisotropyMapUv:G&&b(x.anisotropyMap.channel),clearcoatMapUv:be&&b(x.clearcoatMap.channel),clearcoatNormalMapUv:ne&&b(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ve&&b(x.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&b(x.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&b(x.iridescenceThicknessMap.channel),sheenColorMapUv:le&&b(x.sheenColorMap.channel),sheenRoughnessMapUv:Ae&&b(x.sheenRoughnessMap.channel),specularMapUv:ye&&b(x.specularMap.channel),specularColorMapUv:ae&&b(x.specularColorMap.channel),specularIntensityMapUv:Ue&&b(x.specularIntensityMap.channel),transmissionMapUv:L&&b(x.transmissionMap.channel),thicknessMapUv:te&&b(x.thicknessMap.channel),alphaMapUv:ue&&b(x.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(ge||ut),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!W.attributes.uv&&(Ge||ue),fog:!!X,useFog:x.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:x.flatShading===!0&&x.wireframe===!1,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:de,skinning:z.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:Se,morphTextureStride:Be,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&P.length>0,shadowMapType:s.shadowMap.type,toneMapping:Le,decodeVideoTexture:Ge&&x.map.isVideoTexture===!0&&Xe.getTransfer(x.map.colorSpace)===Ke,decodeVideoTextureEmissive:_e&&x.emissiveMap.isVideoTexture===!0&&Xe.getTransfer(x.emissiveMap.colorSpace)===Ke,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Yt,flipSided:x.side===Rt,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:pe&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pe&&x.extensions.multiDraw===!0||Me)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return et.vertexUv1s=c.has(1),et.vertexUv2s=c.has(2),et.vertexUv3s=c.has(3),c.clear(),et}function u(x){const v=[];if(x.shaderID?v.push(x.shaderID):(v.push(x.customVertexShaderID),v.push(x.customFragmentShaderID)),x.defines!==void 0)for(const P in x.defines)v.push(P),v.push(x.defines[P]);return x.isRawShaderMaterial===!1&&(S(v,x),E(v,x),v.push(s.outputColorSpace)),v.push(x.customProgramCacheKey),v.join()}function S(x,v){x.push(v.precision),x.push(v.outputColorSpace),x.push(v.envMapMode),x.push(v.envMapCubeUVHeight),x.push(v.mapUv),x.push(v.alphaMapUv),x.push(v.lightMapUv),x.push(v.aoMapUv),x.push(v.bumpMapUv),x.push(v.normalMapUv),x.push(v.displacementMapUv),x.push(v.emissiveMapUv),x.push(v.metalnessMapUv),x.push(v.roughnessMapUv),x.push(v.anisotropyMapUv),x.push(v.clearcoatMapUv),x.push(v.clearcoatNormalMapUv),x.push(v.clearcoatRoughnessMapUv),x.push(v.iridescenceMapUv),x.push(v.iridescenceThicknessMapUv),x.push(v.sheenColorMapUv),x.push(v.sheenRoughnessMapUv),x.push(v.specularMapUv),x.push(v.specularColorMapUv),x.push(v.specularIntensityMapUv),x.push(v.transmissionMapUv),x.push(v.thicknessMapUv),x.push(v.combine),x.push(v.fogExp2),x.push(v.sizeAttenuation),x.push(v.morphTargetsCount),x.push(v.morphAttributeCount),x.push(v.numDirLights),x.push(v.numPointLights),x.push(v.numSpotLights),x.push(v.numSpotLightMaps),x.push(v.numHemiLights),x.push(v.numRectAreaLights),x.push(v.numDirLightShadows),x.push(v.numPointLightShadows),x.push(v.numSpotLightShadows),x.push(v.numSpotLightShadowsWithMaps),x.push(v.numLightProbes),x.push(v.shadowMapType),x.push(v.toneMapping),x.push(v.numClippingPlanes),x.push(v.numClipIntersection),x.push(v.depthPacking)}function E(x,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),v.gradientMap&&o.enable(22),x.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reversedDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),x.push(o.mask)}function M(x){const v=_[x.type];let P;if(v){const F=tn[v];P=cu.clone(F.uniforms)}else P=x.uniforms;return P}function A(x,v){let P;for(let F=0,z=h.length;F<z;F++){const X=h[F];if(X.cacheKey===v){P=X,++P.usedTimes;break}}return P===void 0&&(P=new km(s,v,x,r),h.push(P)),P}function T(x){if(--x.usedTimes===0){const v=h.indexOf(x);h[v]=h[h.length-1],h.pop(),x.destroy()}}function R(x){l.remove(x)}function D(){l.dispose()}return{getParameters:p,getProgramCacheKey:u,getUniforms:M,acquireProgram:A,releaseProgram:T,releaseShaderCache:R,programs:h,dispose:D}}function Wm(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function Xm(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function ll(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function cl(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(d,f,m,_,b,p){let u=s[e];return u===void 0?(u={id:d.id,object:d,geometry:f,material:m,groupOrder:_,renderOrder:d.renderOrder,z:b,group:p},s[e]=u):(u.id=d.id,u.object=d,u.geometry=f,u.material=m,u.groupOrder=_,u.renderOrder=d.renderOrder,u.z=b,u.group=p),e++,u}function o(d,f,m,_,b,p){const u=a(d,f,m,_,b,p);m.transmission>0?n.push(u):m.transparent===!0?i.push(u):t.push(u)}function l(d,f,m,_,b,p){const u=a(d,f,m,_,b,p);m.transmission>0?n.unshift(u):m.transparent===!0?i.unshift(u):t.unshift(u)}function c(d,f){t.length>1&&t.sort(d||Xm),n.length>1&&n.sort(f||ll),i.length>1&&i.sort(f||ll)}function h(){for(let d=e,f=s.length;d<f;d++){const m=s[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:o,unshift:l,finish:h,sort:c}}function $m(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new cl,s.set(n,[a])):i>=r.length?(a=new cl,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function qm(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new Pe};break;case"SpotLight":t={position:new I,direction:new I,color:new Pe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Pe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Pe,groundColor:new Pe};break;case"RectAreaLight":t={color:new Pe,position:new I,halfWidth:new I,halfHeight:new I};break}return s[e.id]=t,t}}}function Ym(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let Km=0;function jm(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Zm(s){const e=new qm,t=Ym(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);const i=new I,r=new Je,a=new Je;function o(c){let h=0,d=0,f=0;for(let x=0;x<9;x++)n.probe[x].set(0,0,0);let m=0,_=0,b=0,p=0,u=0,S=0,E=0,M=0,A=0,T=0,R=0;c.sort(jm);for(let x=0,v=c.length;x<v;x++){const P=c[x],F=P.color,z=P.intensity,X=P.distance,W=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=F.r*z,d+=F.g*z,f+=F.b*z;else if(P.isLightProbe){for(let $=0;$<9;$++)n.probe[$].addScaledVector(P.sh.coefficients[$],z);R++}else if(P.isDirectionalLight){const $=e.get(P);if($.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const j=P.shadow,H=t.get(P);H.shadowIntensity=j.intensity,H.shadowBias=j.bias,H.shadowNormalBias=j.normalBias,H.shadowRadius=j.radius,H.shadowMapSize=j.mapSize,n.directionalShadow[m]=H,n.directionalShadowMap[m]=W,n.directionalShadowMatrix[m]=P.shadow.matrix,S++}n.directional[m]=$,m++}else if(P.isSpotLight){const $=e.get(P);$.position.setFromMatrixPosition(P.matrixWorld),$.color.copy(F).multiplyScalar(z),$.distance=X,$.coneCos=Math.cos(P.angle),$.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),$.decay=P.decay,n.spot[b]=$;const j=P.shadow;if(P.map&&(n.spotLightMap[A]=P.map,A++,j.updateMatrices(P),P.castShadow&&T++),n.spotLightMatrix[b]=j.matrix,P.castShadow){const H=t.get(P);H.shadowIntensity=j.intensity,H.shadowBias=j.bias,H.shadowNormalBias=j.normalBias,H.shadowRadius=j.radius,H.shadowMapSize=j.mapSize,n.spotShadow[b]=H,n.spotShadowMap[b]=W,M++}b++}else if(P.isRectAreaLight){const $=e.get(P);$.color.copy(F).multiplyScalar(z),$.halfWidth.set(P.width*.5,0,0),$.halfHeight.set(0,P.height*.5,0),n.rectArea[p]=$,p++}else if(P.isPointLight){const $=e.get(P);if($.color.copy(P.color).multiplyScalar(P.intensity),$.distance=P.distance,$.decay=P.decay,P.castShadow){const j=P.shadow,H=t.get(P);H.shadowIntensity=j.intensity,H.shadowBias=j.bias,H.shadowNormalBias=j.normalBias,H.shadowRadius=j.radius,H.shadowMapSize=j.mapSize,H.shadowCameraNear=j.camera.near,H.shadowCameraFar=j.camera.far,n.pointShadow[_]=H,n.pointShadowMap[_]=W,n.pointShadowMatrix[_]=P.shadow.matrix,E++}n.point[_]=$,_++}else if(P.isHemisphereLight){const $=e.get(P);$.skyColor.copy(P.color).multiplyScalar(z),$.groundColor.copy(P.groundColor).multiplyScalar(z),n.hemi[u]=$,u++}}p>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=se.LTC_FLOAT_1,n.rectAreaLTC2=se.LTC_FLOAT_2):(n.rectAreaLTC1=se.LTC_HALF_1,n.rectAreaLTC2=se.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=f;const D=n.hash;(D.directionalLength!==m||D.pointLength!==_||D.spotLength!==b||D.rectAreaLength!==p||D.hemiLength!==u||D.numDirectionalShadows!==S||D.numPointShadows!==E||D.numSpotShadows!==M||D.numSpotMaps!==A||D.numLightProbes!==R)&&(n.directional.length=m,n.spot.length=b,n.rectArea.length=p,n.point.length=_,n.hemi.length=u,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=M+A-T,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=R,D.directionalLength=m,D.pointLength=_,D.spotLength=b,D.rectAreaLength=p,D.hemiLength=u,D.numDirectionalShadows=S,D.numPointShadows=E,D.numSpotShadows=M,D.numSpotMaps=A,D.numLightProbes=R,n.version=Km++)}function l(c,h){let d=0,f=0,m=0,_=0,b=0;const p=h.matrixWorldInverse;for(let u=0,S=c.length;u<S;u++){const E=c[u];if(E.isDirectionalLight){const M=n.directional[d];M.direction.setFromMatrixPosition(E.matrixWorld),i.setFromMatrixPosition(E.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(p),d++}else if(E.isSpotLight){const M=n.spot[m];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(p),M.direction.setFromMatrixPosition(E.matrixWorld),i.setFromMatrixPosition(E.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(p),m++}else if(E.isRectAreaLight){const M=n.rectArea[_];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(p),a.identity(),r.copy(E.matrixWorld),r.premultiply(p),a.extractRotation(r),M.halfWidth.set(E.width*.5,0,0),M.halfHeight.set(0,E.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),_++}else if(E.isPointLight){const M=n.point[f];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(p),f++}else if(E.isHemisphereLight){const M=n.hemi[b];M.direction.setFromMatrixPosition(E.matrixWorld),M.direction.transformDirection(p),b++}}}return{setup:o,setupView:l,state:n}}function hl(s){const e=new Zm(s),t=[],n=[];function i(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Jm(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new hl(s),e.set(i,[o])):r>=a.length?(o=new hl(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Qm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,eg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function tg(s,e,t){let n=new Ba;const i=new He,r=new He,a=new je,o=new Su({depthPacking:_h}),l=new Eu,c={},h=t.maxTextureSize,d={[Rn]:Rt,[Rt]:Rn,[Yt]:Yt},f=new _n({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new He},radius:{value:4}},vertexShader:Qm,fragmentShader:eg}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const _=new Ct;_.setAttribute("position",new Wt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const b=new me(_,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=yl;let u=this.type;this.render=function(T,R,D){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;const x=s.getRenderTarget(),v=s.getActiveCubeFace(),P=s.getActiveMipmapLevel(),F=s.state;F.setBlending(wn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const z=u!==mn&&this.type===mn,X=u===mn&&this.type!==mn;for(let W=0,$=T.length;W<$;W++){const j=T[W],H=j.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;i.copy(H.mapSize);const re=H.getFrameExtents();if(i.multiply(re),r.copy(H.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/re.x),i.x=r.x*re.x,H.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/re.y),i.y=r.y*re.y,H.mapSize.y=r.y)),H.map===null||z===!0||X===!0){const Se=this.type!==mn?{minFilter:Ft,magFilter:Ft}:{};H.map!==null&&H.map.dispose(),H.map=new Kn(i.x,i.y,Se),H.map.texture.name=j.name+".shadowMap",H.camera.updateProjectionMatrix()}s.setRenderTarget(H.map),s.clear();const ce=H.getViewportCount();for(let Se=0;Se<ce;Se++){const Be=H.getViewport(Se);a.set(r.x*Be.x,r.y*Be.y,r.x*Be.z,r.y*Be.w),F.viewport(a),H.updateMatrices(j,Se),n=H.getFrustum(),M(R,D,H.camera,j,this.type)}H.isPointLightShadow!==!0&&this.type===mn&&S(H,D),H.needsUpdate=!1}u=this.type,p.needsUpdate=!1,s.setRenderTarget(x,v,P)};function S(T,R){const D=e.update(b);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Kn(i.x,i.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(R,null,D,f,b,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(R,null,D,m,b,null)}function E(T,R,D,x){let v=null;const P=D.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(P!==void 0)v=P;else if(v=D.isPointLight===!0?l:o,s.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const F=v.uuid,z=R.uuid;let X=c[F];X===void 0&&(X={},c[F]=X);let W=X[z];W===void 0&&(W=v.clone(),X[z]=W,R.addEventListener("dispose",A)),v=W}if(v.visible=R.visible,v.wireframe=R.wireframe,x===mn?v.side=R.shadowSide!==null?R.shadowSide:R.side:v.side=R.shadowSide!==null?R.shadowSide:d[R.side],v.alphaMap=R.alphaMap,v.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,v.map=R.map,v.clipShadows=R.clipShadows,v.clippingPlanes=R.clippingPlanes,v.clipIntersection=R.clipIntersection,v.displacementMap=R.displacementMap,v.displacementScale=R.displacementScale,v.displacementBias=R.displacementBias,v.wireframeLinewidth=R.wireframeLinewidth,v.linewidth=R.linewidth,D.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const F=s.properties.get(v);F.light=D}return v}function M(T,R,D,x,v){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&v===mn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,T.matrixWorld);const z=e.update(T),X=T.material;if(Array.isArray(X)){const W=z.groups;for(let $=0,j=W.length;$<j;$++){const H=W[$],re=X[H.materialIndex];if(re&&re.visible){const ce=E(T,re,x,v);T.onBeforeShadow(s,T,R,D,z,ce,H),s.renderBufferDirect(D,null,z,ce,T,H),T.onAfterShadow(s,T,R,D,z,ce,H)}}}else if(X.visible){const W=E(T,X,x,v);T.onBeforeShadow(s,T,R,D,z,W,null),s.renderBufferDirect(D,null,z,W,T,null),T.onAfterShadow(s,T,R,D,z,W,null)}}const F=T.children;for(let z=0,X=F.length;z<X;z++)M(F[z],R,D,x,v)}function A(T){T.target.removeEventListener("dispose",A);for(const D in c){const x=c[D],v=T.target.uuid;v in x&&(x[v].dispose(),delete x[v])}}}const ng={[Nr]:Fr,[Or]:zr,[Br]:Hr,[xi]:kr,[Fr]:Nr,[zr]:Or,[Hr]:Br,[kr]:xi};function ig(s,e){function t(){let L=!1;const te=new je;let ie=null;const ue=new je(0,0,0,0);return{setMask:function(J){ie!==J&&!L&&(s.colorMask(J,J,J,J),ie=J)},setLocked:function(J){L=J},setClear:function(J,Y,pe,Le,et){et===!0&&(J*=Le,Y*=Le,pe*=Le),te.set(J,Y,pe,Le),ue.equals(te)===!1&&(s.clearColor(J,Y,pe,Le),ue.copy(te))},reset:function(){L=!1,ie=null,ue.set(-1,0,0,0)}}}function n(){let L=!1,te=!1,ie=null,ue=null,J=null;return{setReversed:function(Y){if(te!==Y){const pe=e.get("EXT_clip_control");Y?pe.clipControlEXT(pe.LOWER_LEFT_EXT,pe.ZERO_TO_ONE_EXT):pe.clipControlEXT(pe.LOWER_LEFT_EXT,pe.NEGATIVE_ONE_TO_ONE_EXT),te=Y;const Le=J;J=null,this.setClear(Le)}},getReversed:function(){return te},setTest:function(Y){Y?Z(s.DEPTH_TEST):de(s.DEPTH_TEST)},setMask:function(Y){ie!==Y&&!L&&(s.depthMask(Y),ie=Y)},setFunc:function(Y){if(te&&(Y=ng[Y]),ue!==Y){switch(Y){case Nr:s.depthFunc(s.NEVER);break;case Fr:s.depthFunc(s.ALWAYS);break;case Or:s.depthFunc(s.LESS);break;case xi:s.depthFunc(s.LEQUAL);break;case Br:s.depthFunc(s.EQUAL);break;case kr:s.depthFunc(s.GEQUAL);break;case zr:s.depthFunc(s.GREATER);break;case Hr:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ue=Y}},setLocked:function(Y){L=Y},setClear:function(Y){J!==Y&&(te&&(Y=1-Y),s.clearDepth(Y),J=Y)},reset:function(){L=!1,ie=null,ue=null,J=null,te=!1}}}function i(){let L=!1,te=null,ie=null,ue=null,J=null,Y=null,pe=null,Le=null,et=null;return{setTest:function(qe){L||(qe?Z(s.STENCIL_TEST):de(s.STENCIL_TEST))},setMask:function(qe){te!==qe&&!L&&(s.stencilMask(qe),te=qe)},setFunc:function(qe,ln,Jt){(ie!==qe||ue!==ln||J!==Jt)&&(s.stencilFunc(qe,ln,Jt),ie=qe,ue=ln,J=Jt)},setOp:function(qe,ln,Jt){(Y!==qe||pe!==ln||Le!==Jt)&&(s.stencilOp(qe,ln,Jt),Y=qe,pe=ln,Le=Jt)},setLocked:function(qe){L=qe},setClear:function(qe){et!==qe&&(s.clearStencil(qe),et=qe)},reset:function(){L=!1,te=null,ie=null,ue=null,J=null,Y=null,pe=null,Le=null,et=null}}}const r=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let h={},d={},f=new WeakMap,m=[],_=null,b=!1,p=null,u=null,S=null,E=null,M=null,A=null,T=null,R=new Pe(0,0,0),D=0,x=!1,v=null,P=null,F=null,z=null,X=null;const W=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,j=0;const H=s.getParameter(s.VERSION);H.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(H)[1]),$=j>=1):H.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),$=j>=2);let re=null,ce={};const Se=s.getParameter(s.SCISSOR_BOX),Be=s.getParameter(s.VIEWPORT),Qe=new je().fromArray(Se),it=new je().fromArray(Be);function $e(L,te,ie,ue){const J=new Uint8Array(4),Y=s.createTexture();s.bindTexture(L,Y),s.texParameteri(L,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(L,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let pe=0;pe<ie;pe++)L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY?s.texImage3D(te,0,s.RGBA,1,1,ue,0,s.RGBA,s.UNSIGNED_BYTE,J):s.texImage2D(te+pe,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,J);return Y}const q={};q[s.TEXTURE_2D]=$e(s.TEXTURE_2D,s.TEXTURE_2D,1),q[s.TEXTURE_CUBE_MAP]=$e(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[s.TEXTURE_2D_ARRAY]=$e(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),q[s.TEXTURE_3D]=$e(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Z(s.DEPTH_TEST),a.setFunc(xi),Re(!1),ge(ro),Z(s.CULL_FACE),st(wn);function Z(L){h[L]!==!0&&(s.enable(L),h[L]=!0)}function de(L){h[L]!==!1&&(s.disable(L),h[L]=!1)}function De(L,te){return d[L]!==te?(s.bindFramebuffer(L,te),d[L]=te,L===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=te),L===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=te),!0):!1}function Me(L,te){let ie=m,ue=!1;if(L){ie=f.get(te),ie===void 0&&(ie=[],f.set(te,ie));const J=L.textures;if(ie.length!==J.length||ie[0]!==s.COLOR_ATTACHMENT0){for(let Y=0,pe=J.length;Y<pe;Y++)ie[Y]=s.COLOR_ATTACHMENT0+Y;ie.length=J.length,ue=!0}}else ie[0]!==s.BACK&&(ie[0]=s.BACK,ue=!0);ue&&s.drawBuffers(ie)}function Ge(L){return _!==L?(s.useProgram(L),_=L,!0):!1}const vt={[Hn]:s.FUNC_ADD,[Vc]:s.FUNC_SUBTRACT,[Wc]:s.FUNC_REVERSE_SUBTRACT};vt[Xc]=s.MIN,vt[$c]=s.MAX;const C={[qc]:s.ZERO,[Yc]:s.ONE,[Kc]:s.SRC_COLOR,[Ir]:s.SRC_ALPHA,[th]:s.SRC_ALPHA_SATURATE,[Qc]:s.DST_COLOR,[Zc]:s.DST_ALPHA,[jc]:s.ONE_MINUS_SRC_COLOR,[Ur]:s.ONE_MINUS_SRC_ALPHA,[eh]:s.ONE_MINUS_DST_COLOR,[Jc]:s.ONE_MINUS_DST_ALPHA,[nh]:s.CONSTANT_COLOR,[ih]:s.ONE_MINUS_CONSTANT_COLOR,[sh]:s.CONSTANT_ALPHA,[rh]:s.ONE_MINUS_CONSTANT_ALPHA};function st(L,te,ie,ue,J,Y,pe,Le,et,qe){if(L===wn){b===!0&&(de(s.BLEND),b=!1);return}if(b===!1&&(Z(s.BLEND),b=!0),L!==Gc){if(L!==p||qe!==x){if((u!==Hn||M!==Hn)&&(s.blendEquation(s.FUNC_ADD),u=Hn,M=Hn),qe)switch(L){case gi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Xi:s.blendFunc(s.ONE,s.ONE);break;case ao:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case oo:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case gi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Xi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case ao:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case oo:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}S=null,E=null,A=null,T=null,R.set(0,0,0),D=0,p=L,x=qe}return}J=J||te,Y=Y||ie,pe=pe||ue,(te!==u||J!==M)&&(s.blendEquationSeparate(vt[te],vt[J]),u=te,M=J),(ie!==S||ue!==E||Y!==A||pe!==T)&&(s.blendFuncSeparate(C[ie],C[ue],C[Y],C[pe]),S=ie,E=ue,A=Y,T=pe),(Le.equals(R)===!1||et!==D)&&(s.blendColor(Le.r,Le.g,Le.b,et),R.copy(Le),D=et),p=L,x=!1}function Ie(L,te){L.side===Yt?de(s.CULL_FACE):Z(s.CULL_FACE);let ie=L.side===Rt;te&&(ie=!ie),Re(ie),L.blending===gi&&L.transparent===!1?st(wn):st(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const ue=L.stencilWrite;o.setTest(ue),ue&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),_e(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?Z(s.SAMPLE_ALPHA_TO_COVERAGE):de(s.SAMPLE_ALPHA_TO_COVERAGE)}function Re(L){v!==L&&(L?s.frontFace(s.CW):s.frontFace(s.CCW),v=L)}function ge(L){L!==kc?(Z(s.CULL_FACE),L!==P&&(L===ro?s.cullFace(s.BACK):L===zc?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):de(s.CULL_FACE),P=L}function rt(L){L!==F&&($&&s.lineWidth(L),F=L)}function _e(L,te,ie){L?(Z(s.POLYGON_OFFSET_FILL),(z!==te||X!==ie)&&(s.polygonOffset(te,ie),z=te,X=ie)):de(s.POLYGON_OFFSET_FILL)}function Fe(L){L?Z(s.SCISSOR_TEST):de(s.SCISSOR_TEST)}function mt(L){L===void 0&&(L=s.TEXTURE0+W-1),re!==L&&(s.activeTexture(L),re=L)}function ut(L,te,ie){ie===void 0&&(re===null?ie=s.TEXTURE0+W-1:ie=re);let ue=ce[ie];ue===void 0&&(ue={type:void 0,texture:void 0},ce[ie]=ue),(ue.type!==L||ue.texture!==te)&&(re!==ie&&(s.activeTexture(ie),re=ie),s.bindTexture(L,te||q[L]),ue.type=L,ue.texture=te)}function w(){const L=ce[re];L!==void 0&&L.type!==void 0&&(s.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function g(){try{s.compressedTexImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function O(){try{s.compressedTexImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function V(){try{s.texSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function K(){try{s.texSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function G(){try{s.compressedTexSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function be(){try{s.compressedTexSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ne(){try{s.texStorage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ve(){try{s.texStorage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function xe(){try{s.texImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ee(){try{s.texImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function le(L){Qe.equals(L)===!1&&(s.scissor(L.x,L.y,L.z,L.w),Qe.copy(L))}function Ae(L){it.equals(L)===!1&&(s.viewport(L.x,L.y,L.z,L.w),it.copy(L))}function ye(L,te){let ie=c.get(te);ie===void 0&&(ie=new WeakMap,c.set(te,ie));let ue=ie.get(L);ue===void 0&&(ue=s.getUniformBlockIndex(te,L.name),ie.set(L,ue))}function ae(L,te){const ue=c.get(te).get(L);l.get(te)!==ue&&(s.uniformBlockBinding(te,ue,L.__bindingPointIndex),l.set(te,ue))}function Ue(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},re=null,ce={},d={},f=new WeakMap,m=[],_=null,b=!1,p=null,u=null,S=null,E=null,M=null,A=null,T=null,R=new Pe(0,0,0),D=0,x=!1,v=null,P=null,F=null,z=null,X=null,Qe.set(0,0,s.canvas.width,s.canvas.height),it.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Z,disable:de,bindFramebuffer:De,drawBuffers:Me,useProgram:Ge,setBlending:st,setMaterial:Ie,setFlipSided:Re,setCullFace:ge,setLineWidth:rt,setPolygonOffset:_e,setScissorTest:Fe,activeTexture:mt,bindTexture:ut,unbindTexture:w,compressedTexImage2D:g,compressedTexImage3D:O,texImage2D:xe,texImage3D:ee,updateUBOMapping:ye,uniformBlockBinding:ae,texStorage2D:ne,texStorage3D:ve,texSubImage2D:V,texSubImage3D:K,compressedTexSubImage2D:G,compressedTexSubImage3D:be,scissor:le,viewport:Ae,reset:Ue}}function sg(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new He,h=new WeakMap;let d;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(w,g){return m?new OffscreenCanvas(w,g):Hs("canvas")}function b(w,g,O){let V=1;const K=ut(w);if((K.width>O||K.height>O)&&(V=O/Math.max(K.width,K.height)),V<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const G=Math.floor(V*K.width),be=Math.floor(V*K.height);d===void 0&&(d=_(G,be));const ne=g?_(G,be):d;return ne.width=G,ne.height=be,ne.getContext("2d").drawImage(w,0,0,G,be),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+G+"x"+be+")."),ne}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),w;return w}function p(w){return w.generateMipmaps}function u(w){s.generateMipmap(w)}function S(w){return w.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?s.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function E(w,g,O,V,K=!1){if(w!==null){if(s[w]!==void 0)return s[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let G=g;if(g===s.RED&&(O===s.FLOAT&&(G=s.R32F),O===s.HALF_FLOAT&&(G=s.R16F),O===s.UNSIGNED_BYTE&&(G=s.R8)),g===s.RED_INTEGER&&(O===s.UNSIGNED_BYTE&&(G=s.R8UI),O===s.UNSIGNED_SHORT&&(G=s.R16UI),O===s.UNSIGNED_INT&&(G=s.R32UI),O===s.BYTE&&(G=s.R8I),O===s.SHORT&&(G=s.R16I),O===s.INT&&(G=s.R32I)),g===s.RG&&(O===s.FLOAT&&(G=s.RG32F),O===s.HALF_FLOAT&&(G=s.RG16F),O===s.UNSIGNED_BYTE&&(G=s.RG8)),g===s.RG_INTEGER&&(O===s.UNSIGNED_BYTE&&(G=s.RG8UI),O===s.UNSIGNED_SHORT&&(G=s.RG16UI),O===s.UNSIGNED_INT&&(G=s.RG32UI),O===s.BYTE&&(G=s.RG8I),O===s.SHORT&&(G=s.RG16I),O===s.INT&&(G=s.RG32I)),g===s.RGB_INTEGER&&(O===s.UNSIGNED_BYTE&&(G=s.RGB8UI),O===s.UNSIGNED_SHORT&&(G=s.RGB16UI),O===s.UNSIGNED_INT&&(G=s.RGB32UI),O===s.BYTE&&(G=s.RGB8I),O===s.SHORT&&(G=s.RGB16I),O===s.INT&&(G=s.RGB32I)),g===s.RGBA_INTEGER&&(O===s.UNSIGNED_BYTE&&(G=s.RGBA8UI),O===s.UNSIGNED_SHORT&&(G=s.RGBA16UI),O===s.UNSIGNED_INT&&(G=s.RGBA32UI),O===s.BYTE&&(G=s.RGBA8I),O===s.SHORT&&(G=s.RGBA16I),O===s.INT&&(G=s.RGBA32I)),g===s.RGB&&(O===s.UNSIGNED_INT_5_9_9_9_REV&&(G=s.RGB9_E5),O===s.UNSIGNED_INT_10F_11F_11F_REV&&(G=s.R11F_G11F_B10F)),g===s.RGBA){const be=K?ks:Xe.getTransfer(V);O===s.FLOAT&&(G=s.RGBA32F),O===s.HALF_FLOAT&&(G=s.RGBA16F),O===s.UNSIGNED_BYTE&&(G=be===Ke?s.SRGB8_ALPHA8:s.RGBA8),O===s.UNSIGNED_SHORT_4_4_4_4&&(G=s.RGBA4),O===s.UNSIGNED_SHORT_5_5_5_1&&(G=s.RGB5_A1)}return(G===s.R16F||G===s.R32F||G===s.RG16F||G===s.RG32F||G===s.RGBA16F||G===s.RGBA32F)&&e.get("EXT_color_buffer_float"),G}function M(w,g){let O;return w?g===null||g===Yn||g===qi?O=s.DEPTH24_STENCIL8:g===sn?O=s.DEPTH32F_STENCIL8:g===$i&&(O=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===Yn||g===qi?O=s.DEPTH_COMPONENT24:g===sn?O=s.DEPTH_COMPONENT32F:g===$i&&(O=s.DEPTH_COMPONENT16),O}function A(w,g){return p(w)===!0||w.isFramebufferTexture&&w.minFilter!==Ft&&w.minFilter!==nn?Math.log2(Math.max(g.width,g.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?g.mipmaps.length:1}function T(w){const g=w.target;g.removeEventListener("dispose",T),D(g),g.isVideoTexture&&h.delete(g)}function R(w){const g=w.target;g.removeEventListener("dispose",R),v(g)}function D(w){const g=n.get(w);if(g.__webglInit===void 0)return;const O=w.source,V=f.get(O);if(V){const K=V[g.__cacheKey];K.usedTimes--,K.usedTimes===0&&x(w),Object.keys(V).length===0&&f.delete(O)}n.remove(w)}function x(w){const g=n.get(w);s.deleteTexture(g.__webglTexture);const O=w.source,V=f.get(O);delete V[g.__cacheKey],a.memory.textures--}function v(w){const g=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(g.__webglFramebuffer[V]))for(let K=0;K<g.__webglFramebuffer[V].length;K++)s.deleteFramebuffer(g.__webglFramebuffer[V][K]);else s.deleteFramebuffer(g.__webglFramebuffer[V]);g.__webglDepthbuffer&&s.deleteRenderbuffer(g.__webglDepthbuffer[V])}else{if(Array.isArray(g.__webglFramebuffer))for(let V=0;V<g.__webglFramebuffer.length;V++)s.deleteFramebuffer(g.__webglFramebuffer[V]);else s.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&s.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&s.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let V=0;V<g.__webglColorRenderbuffer.length;V++)g.__webglColorRenderbuffer[V]&&s.deleteRenderbuffer(g.__webglColorRenderbuffer[V]);g.__webglDepthRenderbuffer&&s.deleteRenderbuffer(g.__webglDepthRenderbuffer)}const O=w.textures;for(let V=0,K=O.length;V<K;V++){const G=n.get(O[V]);G.__webglTexture&&(s.deleteTexture(G.__webglTexture),a.memory.textures--),n.remove(O[V])}n.remove(w)}let P=0;function F(){P=0}function z(){const w=P;return w>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+i.maxTextures),P+=1,w}function X(w){const g=[];return g.push(w.wrapS),g.push(w.wrapT),g.push(w.wrapR||0),g.push(w.magFilter),g.push(w.minFilter),g.push(w.anisotropy),g.push(w.internalFormat),g.push(w.format),g.push(w.type),g.push(w.generateMipmaps),g.push(w.premultiplyAlpha),g.push(w.flipY),g.push(w.unpackAlignment),g.push(w.colorSpace),g.join()}function W(w,g){const O=n.get(w);if(w.isVideoTexture&&Fe(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&O.__version!==w.version){const V=w.image;if(V===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(O,w,g);return}}else w.isExternalTexture&&(O.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,O.__webglTexture,s.TEXTURE0+g)}function $(w,g){const O=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&O.__version!==w.version){q(O,w,g);return}t.bindTexture(s.TEXTURE_2D_ARRAY,O.__webglTexture,s.TEXTURE0+g)}function j(w,g){const O=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&O.__version!==w.version){q(O,w,g);return}t.bindTexture(s.TEXTURE_3D,O.__webglTexture,s.TEXTURE0+g)}function H(w,g){const O=n.get(w);if(w.version>0&&O.__version!==w.version){Z(O,w,g);return}t.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+g)}const re={[Wr]:s.REPEAT,[Vn]:s.CLAMP_TO_EDGE,[Xr]:s.MIRRORED_REPEAT},ce={[Ft]:s.NEAREST,[mh]:s.NEAREST_MIPMAP_NEAREST,[rs]:s.NEAREST_MIPMAP_LINEAR,[nn]:s.LINEAR,[js]:s.LINEAR_MIPMAP_NEAREST,[Wn]:s.LINEAR_MIPMAP_LINEAR},Se={[xh]:s.NEVER,[wh]:s.ALWAYS,[yh]:s.LESS,[Dl]:s.LEQUAL,[bh]:s.EQUAL,[Eh]:s.GEQUAL,[Mh]:s.GREATER,[Sh]:s.NOTEQUAL};function Be(w,g){if(g.type===sn&&e.has("OES_texture_float_linear")===!1&&(g.magFilter===nn||g.magFilter===js||g.magFilter===rs||g.magFilter===Wn||g.minFilter===nn||g.minFilter===js||g.minFilter===rs||g.minFilter===Wn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(w,s.TEXTURE_WRAP_S,re[g.wrapS]),s.texParameteri(w,s.TEXTURE_WRAP_T,re[g.wrapT]),(w===s.TEXTURE_3D||w===s.TEXTURE_2D_ARRAY)&&s.texParameteri(w,s.TEXTURE_WRAP_R,re[g.wrapR]),s.texParameteri(w,s.TEXTURE_MAG_FILTER,ce[g.magFilter]),s.texParameteri(w,s.TEXTURE_MIN_FILTER,ce[g.minFilter]),g.compareFunction&&(s.texParameteri(w,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(w,s.TEXTURE_COMPARE_FUNC,Se[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===Ft||g.minFilter!==rs&&g.minFilter!==Wn||g.type===sn&&e.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||n.get(g).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");s.texParameterf(w,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,i.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy}}}function Qe(w,g){let O=!1;w.__webglInit===void 0&&(w.__webglInit=!0,g.addEventListener("dispose",T));const V=g.source;let K=f.get(V);K===void 0&&(K={},f.set(V,K));const G=X(g);if(G!==w.__cacheKey){K[G]===void 0&&(K[G]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,O=!0),K[G].usedTimes++;const be=K[w.__cacheKey];be!==void 0&&(K[w.__cacheKey].usedTimes--,be.usedTimes===0&&x(g)),w.__cacheKey=G,w.__webglTexture=K[G].texture}return O}function it(w,g,O){return Math.floor(Math.floor(w/O)/g)}function $e(w,g,O,V){const G=w.updateRanges;if(G.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,g.width,g.height,O,V,g.data);else{G.sort((ee,le)=>ee.start-le.start);let be=0;for(let ee=1;ee<G.length;ee++){const le=G[be],Ae=G[ee],ye=le.start+le.count,ae=it(Ae.start,g.width,4),Ue=it(le.start,g.width,4);Ae.start<=ye+1&&ae===Ue&&it(Ae.start+Ae.count-1,g.width,4)===ae?le.count=Math.max(le.count,Ae.start+Ae.count-le.start):(++be,G[be]=Ae)}G.length=be+1;const ne=s.getParameter(s.UNPACK_ROW_LENGTH),ve=s.getParameter(s.UNPACK_SKIP_PIXELS),xe=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,g.width);for(let ee=0,le=G.length;ee<le;ee++){const Ae=G[ee],ye=Math.floor(Ae.start/4),ae=Math.ceil(Ae.count/4),Ue=ye%g.width,L=Math.floor(ye/g.width),te=ae,ie=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,Ue),s.pixelStorei(s.UNPACK_SKIP_ROWS,L),t.texSubImage2D(s.TEXTURE_2D,0,Ue,L,te,ie,O,V,g.data)}w.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,ne),s.pixelStorei(s.UNPACK_SKIP_PIXELS,ve),s.pixelStorei(s.UNPACK_SKIP_ROWS,xe)}}function q(w,g,O){let V=s.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(V=s.TEXTURE_2D_ARRAY),g.isData3DTexture&&(V=s.TEXTURE_3D);const K=Qe(w,g),G=g.source;t.bindTexture(V,w.__webglTexture,s.TEXTURE0+O);const be=n.get(G);if(G.version!==be.__version||K===!0){t.activeTexture(s.TEXTURE0+O);const ne=Xe.getPrimaries(Xe.workingColorSpace),ve=g.colorSpace===En?null:Xe.getPrimaries(g.colorSpace),xe=g.colorSpace===En||ne===ve?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,g.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,g.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);let ee=b(g.image,!1,i.maxTextureSize);ee=mt(g,ee);const le=r.convert(g.format,g.colorSpace),Ae=r.convert(g.type);let ye=E(g.internalFormat,le,Ae,g.colorSpace,g.isVideoTexture);Be(V,g);let ae;const Ue=g.mipmaps,L=g.isVideoTexture!==!0,te=be.__version===void 0||K===!0,ie=G.dataReady,ue=A(g,ee);if(g.isDepthTexture)ye=M(g.format===Ki,g.type),te&&(L?t.texStorage2D(s.TEXTURE_2D,1,ye,ee.width,ee.height):t.texImage2D(s.TEXTURE_2D,0,ye,ee.width,ee.height,0,le,Ae,null));else if(g.isDataTexture)if(Ue.length>0){L&&te&&t.texStorage2D(s.TEXTURE_2D,ue,ye,Ue[0].width,Ue[0].height);for(let J=0,Y=Ue.length;J<Y;J++)ae=Ue[J],L?ie&&t.texSubImage2D(s.TEXTURE_2D,J,0,0,ae.width,ae.height,le,Ae,ae.data):t.texImage2D(s.TEXTURE_2D,J,ye,ae.width,ae.height,0,le,Ae,ae.data);g.generateMipmaps=!1}else L?(te&&t.texStorage2D(s.TEXTURE_2D,ue,ye,ee.width,ee.height),ie&&$e(g,ee,le,Ae)):t.texImage2D(s.TEXTURE_2D,0,ye,ee.width,ee.height,0,le,Ae,ee.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){L&&te&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ue,ye,Ue[0].width,Ue[0].height,ee.depth);for(let J=0,Y=Ue.length;J<Y;J++)if(ae=Ue[J],g.format!==Zt)if(le!==null)if(L){if(ie)if(g.layerUpdates.size>0){const pe=zo(ae.width,ae.height,g.format,g.type);for(const Le of g.layerUpdates){const et=ae.data.subarray(Le*pe/ae.data.BYTES_PER_ELEMENT,(Le+1)*pe/ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,Le,ae.width,ae.height,1,le,et)}g.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,0,ae.width,ae.height,ee.depth,le,ae.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,J,ye,ae.width,ae.height,ee.depth,0,ae.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?ie&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,J,0,0,0,ae.width,ae.height,ee.depth,le,Ae,ae.data):t.texImage3D(s.TEXTURE_2D_ARRAY,J,ye,ae.width,ae.height,ee.depth,0,le,Ae,ae.data)}else{L&&te&&t.texStorage2D(s.TEXTURE_2D,ue,ye,Ue[0].width,Ue[0].height);for(let J=0,Y=Ue.length;J<Y;J++)ae=Ue[J],g.format!==Zt?le!==null?L?ie&&t.compressedTexSubImage2D(s.TEXTURE_2D,J,0,0,ae.width,ae.height,le,ae.data):t.compressedTexImage2D(s.TEXTURE_2D,J,ye,ae.width,ae.height,0,ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?ie&&t.texSubImage2D(s.TEXTURE_2D,J,0,0,ae.width,ae.height,le,Ae,ae.data):t.texImage2D(s.TEXTURE_2D,J,ye,ae.width,ae.height,0,le,Ae,ae.data)}else if(g.isDataArrayTexture)if(L){if(te&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ue,ye,ee.width,ee.height,ee.depth),ie)if(g.layerUpdates.size>0){const J=zo(ee.width,ee.height,g.format,g.type);for(const Y of g.layerUpdates){const pe=ee.data.subarray(Y*J/ee.data.BYTES_PER_ELEMENT,(Y+1)*J/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Y,ee.width,ee.height,1,le,Ae,pe)}g.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,le,Ae,ee.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,ye,ee.width,ee.height,ee.depth,0,le,Ae,ee.data);else if(g.isData3DTexture)L?(te&&t.texStorage3D(s.TEXTURE_3D,ue,ye,ee.width,ee.height,ee.depth),ie&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,le,Ae,ee.data)):t.texImage3D(s.TEXTURE_3D,0,ye,ee.width,ee.height,ee.depth,0,le,Ae,ee.data);else if(g.isFramebufferTexture){if(te)if(L)t.texStorage2D(s.TEXTURE_2D,ue,ye,ee.width,ee.height);else{let J=ee.width,Y=ee.height;for(let pe=0;pe<ue;pe++)t.texImage2D(s.TEXTURE_2D,pe,ye,J,Y,0,le,Ae,null),J>>=1,Y>>=1}}else if(Ue.length>0){if(L&&te){const J=ut(Ue[0]);t.texStorage2D(s.TEXTURE_2D,ue,ye,J.width,J.height)}for(let J=0,Y=Ue.length;J<Y;J++)ae=Ue[J],L?ie&&t.texSubImage2D(s.TEXTURE_2D,J,0,0,le,Ae,ae):t.texImage2D(s.TEXTURE_2D,J,ye,le,Ae,ae);g.generateMipmaps=!1}else if(L){if(te){const J=ut(ee);t.texStorage2D(s.TEXTURE_2D,ue,ye,J.width,J.height)}ie&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,le,Ae,ee)}else t.texImage2D(s.TEXTURE_2D,0,ye,le,Ae,ee);p(g)&&u(V),be.__version=G.version,g.onUpdate&&g.onUpdate(g)}w.__version=g.version}function Z(w,g,O){if(g.image.length!==6)return;const V=Qe(w,g),K=g.source;t.bindTexture(s.TEXTURE_CUBE_MAP,w.__webglTexture,s.TEXTURE0+O);const G=n.get(K);if(K.version!==G.__version||V===!0){t.activeTexture(s.TEXTURE0+O);const be=Xe.getPrimaries(Xe.workingColorSpace),ne=g.colorSpace===En?null:Xe.getPrimaries(g.colorSpace),ve=g.colorSpace===En||be===ne?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,g.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,g.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);const xe=g.isCompressedTexture||g.image[0].isCompressedTexture,ee=g.image[0]&&g.image[0].isDataTexture,le=[];for(let Y=0;Y<6;Y++)!xe&&!ee?le[Y]=b(g.image[Y],!0,i.maxCubemapSize):le[Y]=ee?g.image[Y].image:g.image[Y],le[Y]=mt(g,le[Y]);const Ae=le[0],ye=r.convert(g.format,g.colorSpace),ae=r.convert(g.type),Ue=E(g.internalFormat,ye,ae,g.colorSpace),L=g.isVideoTexture!==!0,te=G.__version===void 0||V===!0,ie=K.dataReady;let ue=A(g,Ae);Be(s.TEXTURE_CUBE_MAP,g);let J;if(xe){L&&te&&t.texStorage2D(s.TEXTURE_CUBE_MAP,ue,Ue,Ae.width,Ae.height);for(let Y=0;Y<6;Y++){J=le[Y].mipmaps;for(let pe=0;pe<J.length;pe++){const Le=J[pe];g.format!==Zt?ye!==null?L?ie&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,pe,0,0,Le.width,Le.height,ye,Le.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,pe,Ue,Le.width,Le.height,0,Le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?ie&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,pe,0,0,Le.width,Le.height,ye,ae,Le.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,pe,Ue,Le.width,Le.height,0,ye,ae,Le.data)}}}else{if(J=g.mipmaps,L&&te){J.length>0&&ue++;const Y=ut(le[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,ue,Ue,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(ee){L?ie&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,le[Y].width,le[Y].height,ye,ae,le[Y].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Ue,le[Y].width,le[Y].height,0,ye,ae,le[Y].data);for(let pe=0;pe<J.length;pe++){const et=J[pe].image[Y].image;L?ie&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,pe+1,0,0,et.width,et.height,ye,ae,et.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,pe+1,Ue,et.width,et.height,0,ye,ae,et.data)}}else{L?ie&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,ye,ae,le[Y]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Ue,ye,ae,le[Y]);for(let pe=0;pe<J.length;pe++){const Le=J[pe];L?ie&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,pe+1,0,0,ye,ae,Le.image[Y]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,pe+1,Ue,ye,ae,Le.image[Y])}}}p(g)&&u(s.TEXTURE_CUBE_MAP),G.__version=K.version,g.onUpdate&&g.onUpdate(g)}w.__version=g.version}function de(w,g,O,V,K,G){const be=r.convert(O.format,O.colorSpace),ne=r.convert(O.type),ve=E(O.internalFormat,be,ne,O.colorSpace),xe=n.get(g),ee=n.get(O);if(ee.__renderTarget=g,!xe.__hasExternalTextures){const le=Math.max(1,g.width>>G),Ae=Math.max(1,g.height>>G);K===s.TEXTURE_3D||K===s.TEXTURE_2D_ARRAY?t.texImage3D(K,G,ve,le,Ae,g.depth,0,be,ne,null):t.texImage2D(K,G,ve,le,Ae,0,be,ne,null)}t.bindFramebuffer(s.FRAMEBUFFER,w),_e(g)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,V,K,ee.__webglTexture,0,rt(g)):(K===s.TEXTURE_2D||K>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,V,K,ee.__webglTexture,G),t.bindFramebuffer(s.FRAMEBUFFER,null)}function De(w,g,O){if(s.bindRenderbuffer(s.RENDERBUFFER,w),g.depthBuffer){const V=g.depthTexture,K=V&&V.isDepthTexture?V.type:null,G=M(g.stencilBuffer,K),be=g.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ne=rt(g);_e(g)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ne,G,g.width,g.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,ne,G,g.width,g.height):s.renderbufferStorage(s.RENDERBUFFER,G,g.width,g.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,be,s.RENDERBUFFER,w)}else{const V=g.textures;for(let K=0;K<V.length;K++){const G=V[K],be=r.convert(G.format,G.colorSpace),ne=r.convert(G.type),ve=E(G.internalFormat,be,ne,G.colorSpace),xe=rt(g);O&&_e(g)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,xe,ve,g.width,g.height):_e(g)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,xe,ve,g.width,g.height):s.renderbufferStorage(s.RENDERBUFFER,ve,g.width,g.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Me(w,g){if(g&&g.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,w),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const V=n.get(g.depthTexture);V.__renderTarget=g,(!V.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),W(g.depthTexture,0);const K=V.__webglTexture,G=rt(g);if(g.depthTexture.format===Yi)_e(g)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,K,0,G):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,K,0);else if(g.depthTexture.format===Ki)_e(g)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,K,0,G):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,K,0);else throw new Error("Unknown depthTexture format")}function Ge(w){const g=n.get(w),O=w.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==w.depthTexture){const V=w.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),V){const K=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,V.removeEventListener("dispose",K)};V.addEventListener("dispose",K),g.__depthDisposeCallback=K}g.__boundDepthTexture=V}if(w.depthTexture&&!g.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const V=w.texture.mipmaps;V&&V.length>0?Me(g.__webglFramebuffer[0],w):Me(g.__webglFramebuffer,w)}else if(O){g.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(t.bindFramebuffer(s.FRAMEBUFFER,g.__webglFramebuffer[V]),g.__webglDepthbuffer[V]===void 0)g.__webglDepthbuffer[V]=s.createRenderbuffer(),De(g.__webglDepthbuffer[V],w,!1);else{const K=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,G=g.__webglDepthbuffer[V];s.bindRenderbuffer(s.RENDERBUFFER,G),s.framebufferRenderbuffer(s.FRAMEBUFFER,K,s.RENDERBUFFER,G)}}else{const V=w.texture.mipmaps;if(V&&V.length>0?t.bindFramebuffer(s.FRAMEBUFFER,g.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=s.createRenderbuffer(),De(g.__webglDepthbuffer,w,!1);else{const K=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,G=g.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,G),s.framebufferRenderbuffer(s.FRAMEBUFFER,K,s.RENDERBUFFER,G)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function vt(w,g,O){const V=n.get(w);g!==void 0&&de(V.__webglFramebuffer,w,w.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),O!==void 0&&Ge(w)}function C(w){const g=w.texture,O=n.get(w),V=n.get(g);w.addEventListener("dispose",R);const K=w.textures,G=w.isWebGLCubeRenderTarget===!0,be=K.length>1;if(be||(V.__webglTexture===void 0&&(V.__webglTexture=s.createTexture()),V.__version=g.version,a.memory.textures++),G){O.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(g.mipmaps&&g.mipmaps.length>0){O.__webglFramebuffer[ne]=[];for(let ve=0;ve<g.mipmaps.length;ve++)O.__webglFramebuffer[ne][ve]=s.createFramebuffer()}else O.__webglFramebuffer[ne]=s.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){O.__webglFramebuffer=[];for(let ne=0;ne<g.mipmaps.length;ne++)O.__webglFramebuffer[ne]=s.createFramebuffer()}else O.__webglFramebuffer=s.createFramebuffer();if(be)for(let ne=0,ve=K.length;ne<ve;ne++){const xe=n.get(K[ne]);xe.__webglTexture===void 0&&(xe.__webglTexture=s.createTexture(),a.memory.textures++)}if(w.samples>0&&_e(w)===!1){O.__webglMultisampledFramebuffer=s.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let ne=0;ne<K.length;ne++){const ve=K[ne];O.__webglColorRenderbuffer[ne]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,O.__webglColorRenderbuffer[ne]);const xe=r.convert(ve.format,ve.colorSpace),ee=r.convert(ve.type),le=E(ve.internalFormat,xe,ee,ve.colorSpace,w.isXRRenderTarget===!0),Ae=rt(w);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ae,le,w.width,w.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ne,s.RENDERBUFFER,O.__webglColorRenderbuffer[ne])}s.bindRenderbuffer(s.RENDERBUFFER,null),w.depthBuffer&&(O.__webglDepthRenderbuffer=s.createRenderbuffer(),De(O.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(G){t.bindTexture(s.TEXTURE_CUBE_MAP,V.__webglTexture),Be(s.TEXTURE_CUBE_MAP,g);for(let ne=0;ne<6;ne++)if(g.mipmaps&&g.mipmaps.length>0)for(let ve=0;ve<g.mipmaps.length;ve++)de(O.__webglFramebuffer[ne][ve],w,g,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ve);else de(O.__webglFramebuffer[ne],w,g,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);p(g)&&u(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(be){for(let ne=0,ve=K.length;ne<ve;ne++){const xe=K[ne],ee=n.get(xe);let le=s.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(le=w.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(le,ee.__webglTexture),Be(le,xe),de(O.__webglFramebuffer,w,xe,s.COLOR_ATTACHMENT0+ne,le,0),p(xe)&&u(le)}t.unbindTexture()}else{let ne=s.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ne=w.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ne,V.__webglTexture),Be(ne,g),g.mipmaps&&g.mipmaps.length>0)for(let ve=0;ve<g.mipmaps.length;ve++)de(O.__webglFramebuffer[ve],w,g,s.COLOR_ATTACHMENT0,ne,ve);else de(O.__webglFramebuffer,w,g,s.COLOR_ATTACHMENT0,ne,0);p(g)&&u(ne),t.unbindTexture()}w.depthBuffer&&Ge(w)}function st(w){const g=w.textures;for(let O=0,V=g.length;O<V;O++){const K=g[O];if(p(K)){const G=S(w),be=n.get(K).__webglTexture;t.bindTexture(G,be),u(G),t.unbindTexture()}}}const Ie=[],Re=[];function ge(w){if(w.samples>0){if(_e(w)===!1){const g=w.textures,O=w.width,V=w.height;let K=s.COLOR_BUFFER_BIT;const G=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,be=n.get(w),ne=g.length>1;if(ne)for(let xe=0;xe<g.length;xe++)t.bindFramebuffer(s.FRAMEBUFFER,be.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+xe,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,be.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+xe,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,be.__webglMultisampledFramebuffer);const ve=w.texture.mipmaps;ve&&ve.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,be.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,be.__webglFramebuffer);for(let xe=0;xe<g.length;xe++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(K|=s.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(K|=s.STENCIL_BUFFER_BIT)),ne){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,be.__webglColorRenderbuffer[xe]);const ee=n.get(g[xe]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ee,0)}s.blitFramebuffer(0,0,O,V,0,0,O,V,K,s.NEAREST),l===!0&&(Ie.length=0,Re.length=0,Ie.push(s.COLOR_ATTACHMENT0+xe),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Ie.push(G),Re.push(G),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Re)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Ie))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ne)for(let xe=0;xe<g.length;xe++){t.bindFramebuffer(s.FRAMEBUFFER,be.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+xe,s.RENDERBUFFER,be.__webglColorRenderbuffer[xe]);const ee=n.get(g[xe]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,be.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+xe,s.TEXTURE_2D,ee,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,be.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const g=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[g])}}}function rt(w){return Math.min(i.maxSamples,w.samples)}function _e(w){const g=n.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function Fe(w){const g=a.render.frame;h.get(w)!==g&&(h.set(w,g),w.update())}function mt(w,g){const O=w.colorSpace,V=w.format,K=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||O!==Mi&&O!==En&&(Xe.getTransfer(O)===Ke?(V!==Zt||K!==an)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),g}function ut(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=F,this.setTexture2D=W,this.setTexture2DArray=$,this.setTexture3D=j,this.setTextureCube=H,this.rebindTextures=vt,this.setupRenderTarget=C,this.updateRenderTargetMipmap=st,this.updateMultisampleRenderTarget=ge,this.setupDepthRenderbuffer=Ge,this.setupFrameBufferTexture=de,this.useMultisampledRTT=_e}function rg(s,e){function t(n,i=En){let r;const a=Xe.getTransfer(i);if(n===an)return s.UNSIGNED_BYTE;if(n===Ca)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Pa)return s.UNSIGNED_SHORT_5_5_5_1;if(n===wl)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Tl)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Sl)return s.BYTE;if(n===El)return s.SHORT;if(n===$i)return s.UNSIGNED_SHORT;if(n===Ra)return s.INT;if(n===Yn)return s.UNSIGNED_INT;if(n===sn)return s.FLOAT;if(n===Ji)return s.HALF_FLOAT;if(n===Al)return s.ALPHA;if(n===Rl)return s.RGB;if(n===Zt)return s.RGBA;if(n===Yi)return s.DEPTH_COMPONENT;if(n===Ki)return s.DEPTH_STENCIL;if(n===Da)return s.RED;if(n===La)return s.RED_INTEGER;if(n===Cl)return s.RG;if(n===Ia)return s.RG_INTEGER;if(n===Ua)return s.RGBA_INTEGER;if(n===Ps||n===Ds||n===Ls||n===Is)if(a===Ke)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ps)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ds)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ls)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Is)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ps)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ds)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ls)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Is)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===$r||n===qr||n===Yr||n===Kr)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===$r)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===qr)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Yr)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Kr)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===jr||n===Zr||n===Jr)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===jr||n===Zr)return a===Ke?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Jr)return a===Ke?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Qr||n===ea||n===ta||n===na||n===ia||n===sa||n===ra||n===aa||n===oa||n===la||n===ca||n===ha||n===ua||n===da)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Qr)return a===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ea)return a===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ta)return a===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===na)return a===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ia)return a===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===sa)return a===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ra)return a===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===aa)return a===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===oa)return a===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===la)return a===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ca)return a===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ha)return a===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ua)return a===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===da)return a===Ke?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===fa||n===pa||n===ma)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===fa)return a===Ke?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===pa)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ma)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ga||n===_a||n===va||n===xa)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===ga)return r.COMPRESSED_RED_RGTC1_EXT;if(n===_a)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===va)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===xa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===qi?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const ag=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,og=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class lg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Wl(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new _n({vertexShader:ag,fragmentShader:og,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new me(new Ei(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class cg extends Ti{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,f=null,m=null,_=null;const b=typeof XRWebGLBinding<"u",p=new lg,u={},S=t.getContextAttributes();let E=null,M=null;const A=[],T=[],R=new He;let D=null;const x=new Gt;x.viewport=new je;const v=new Gt;v.viewport=new je;const P=[x,v],F=new Cu;let z=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let Z=A[q];return Z===void 0&&(Z=new _r,A[q]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(q){let Z=A[q];return Z===void 0&&(Z=new _r,A[q]=Z),Z.getGripSpace()},this.getHand=function(q){let Z=A[q];return Z===void 0&&(Z=new _r,A[q]=Z),Z.getHandSpace()};function W(q){const Z=T.indexOf(q.inputSource);if(Z===-1)return;const de=A[Z];de!==void 0&&(de.update(q.inputSource,q.frame,c||a),de.dispatchEvent({type:q.type,data:q.inputSource}))}function $(){i.removeEventListener("select",W),i.removeEventListener("selectstart",W),i.removeEventListener("selectend",W),i.removeEventListener("squeeze",W),i.removeEventListener("squeezestart",W),i.removeEventListener("squeezeend",W),i.removeEventListener("end",$),i.removeEventListener("inputsourceschange",j);for(let q=0;q<A.length;q++){const Z=T[q];Z!==null&&(T[q]=null,A[q].disconnect(Z))}z=null,X=null,p.reset();for(const q in u)delete u[q];e.setRenderTarget(E),m=null,f=null,d=null,i=null,M=null,$e.stop(),n.isPresenting=!1,e.setPixelRatio(D),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return d===null&&b&&(d=new XRWebGLBinding(i,t)),d},this.getFrame=function(){return _},this.getSession=function(){return i},this.setSession=async function(q){if(i=q,i!==null){if(E=e.getRenderTarget(),i.addEventListener("select",W),i.addEventListener("selectstart",W),i.addEventListener("selectend",W),i.addEventListener("squeeze",W),i.addEventListener("squeezestart",W),i.addEventListener("squeezeend",W),i.addEventListener("end",$),i.addEventListener("inputsourceschange",j),S.xrCompatible!==!0&&await t.makeXRCompatible(),D=e.getPixelRatio(),e.getSize(R),b&&"createProjectionLayer"in XRWebGLBinding.prototype){let de=null,De=null,Me=null;S.depth&&(Me=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,de=S.stencil?Ki:Yi,De=S.stencil?qi:Yn);const Ge={colorFormat:t.RGBA8,depthFormat:Me,scaleFactor:r};d=this.getBinding(),f=d.createProjectionLayer(Ge),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),M=new Kn(f.textureWidth,f.textureHeight,{format:Zt,type:an,depthTexture:new Vl(f.textureWidth,f.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,de),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const de={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(i,t,de),i.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),M=new Kn(m.framebufferWidth,m.framebufferHeight,{format:Zt,type:an,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),$e.setContext(i),$e.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function j(q){for(let Z=0;Z<q.removed.length;Z++){const de=q.removed[Z],De=T.indexOf(de);De>=0&&(T[De]=null,A[De].disconnect(de))}for(let Z=0;Z<q.added.length;Z++){const de=q.added[Z];let De=T.indexOf(de);if(De===-1){for(let Ge=0;Ge<A.length;Ge++)if(Ge>=T.length){T.push(de),De=Ge;break}else if(T[Ge]===null){T[Ge]=de,De=Ge;break}if(De===-1)break}const Me=A[De];Me&&Me.connect(de)}}const H=new I,re=new I;function ce(q,Z,de){H.setFromMatrixPosition(Z.matrixWorld),re.setFromMatrixPosition(de.matrixWorld);const De=H.distanceTo(re),Me=Z.projectionMatrix.elements,Ge=de.projectionMatrix.elements,vt=Me[14]/(Me[10]-1),C=Me[14]/(Me[10]+1),st=(Me[9]+1)/Me[5],Ie=(Me[9]-1)/Me[5],Re=(Me[8]-1)/Me[0],ge=(Ge[8]+1)/Ge[0],rt=vt*Re,_e=vt*ge,Fe=De/(-Re+ge),mt=Fe*-Re;if(Z.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(mt),q.translateZ(Fe),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Me[10]===-1)q.projectionMatrix.copy(Z.projectionMatrix),q.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const ut=vt+Fe,w=C+Fe,g=rt-mt,O=_e+(De-mt),V=st*C/w*ut,K=Ie*C/w*ut;q.projectionMatrix.makePerspective(g,O,V,K,ut,w),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function Se(q,Z){Z===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(Z.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(i===null)return;let Z=q.near,de=q.far;p.texture!==null&&(p.depthNear>0&&(Z=p.depthNear),p.depthFar>0&&(de=p.depthFar)),F.near=v.near=x.near=Z,F.far=v.far=x.far=de,(z!==F.near||X!==F.far)&&(i.updateRenderState({depthNear:F.near,depthFar:F.far}),z=F.near,X=F.far),F.layers.mask=q.layers.mask|6,x.layers.mask=F.layers.mask&3,v.layers.mask=F.layers.mask&5;const De=q.parent,Me=F.cameras;Se(F,De);for(let Ge=0;Ge<Me.length;Ge++)Se(Me[Ge],De);Me.length===2?ce(F,x,v):F.projectionMatrix.copy(x.projectionMatrix),Be(q,F,De)};function Be(q,Z,de){de===null?q.matrix.copy(Z.matrixWorld):(q.matrix.copy(de.matrixWorld),q.matrix.invert(),q.matrix.multiply(Z.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(Z.projectionMatrix),q.projectionMatrixInverse.copy(Z.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=ji*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(q){l=q,f!==null&&(f.fixedFoveation=q),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=q)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(F)},this.getCameraTexture=function(q){return u[q]};let Qe=null;function it(q,Z){if(h=Z.getViewerPose(c||a),_=Z,h!==null){const de=h.views;m!==null&&(e.setRenderTargetFramebuffer(M,m.framebuffer),e.setRenderTarget(M));let De=!1;de.length!==F.cameras.length&&(F.cameras.length=0,De=!0);for(let C=0;C<de.length;C++){const st=de[C];let Ie=null;if(m!==null)Ie=m.getViewport(st);else{const ge=d.getViewSubImage(f,st);Ie=ge.viewport,C===0&&(e.setRenderTargetTextures(M,ge.colorTexture,ge.depthStencilTexture),e.setRenderTarget(M))}let Re=P[C];Re===void 0&&(Re=new Gt,Re.layers.enable(C),Re.viewport=new je,P[C]=Re),Re.matrix.fromArray(st.transform.matrix),Re.matrix.decompose(Re.position,Re.quaternion,Re.scale),Re.projectionMatrix.fromArray(st.projectionMatrix),Re.projectionMatrixInverse.copy(Re.projectionMatrix).invert(),Re.viewport.set(Ie.x,Ie.y,Ie.width,Ie.height),C===0&&(F.matrix.copy(Re.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),De===!0&&F.cameras.push(Re)}const Me=i.enabledFeatures;if(Me&&Me.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&b){d=n.getBinding();const C=d.getDepthInformation(de[0]);C&&C.isValid&&C.texture&&p.init(C,i.renderState)}if(Me&&Me.includes("camera-access")&&b){e.state.unbindTexture(),d=n.getBinding();for(let C=0;C<de.length;C++){const st=de[C].camera;if(st){let Ie=u[st];Ie||(Ie=new Wl,u[st]=Ie);const Re=d.getCameraImage(st);Ie.sourceTexture=Re}}}}for(let de=0;de<A.length;de++){const De=T[de],Me=A[de];De!==null&&Me!==void 0&&Me.update(De,Z,c||a)}Qe&&Qe(q,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),_=null}const $e=new $l;$e.setAnimationLoop(it),this.setAnimationLoop=function(q){Qe=q},this.dispose=function(){}}}const On=new on,hg=new Je;function ug(s,e){function t(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,kl(s)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function i(p,u,S,E,M){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(p,u):u.isMeshToonMaterial?(r(p,u),d(p,u)):u.isMeshPhongMaterial?(r(p,u),h(p,u)):u.isMeshStandardMaterial?(r(p,u),f(p,u),u.isMeshPhysicalMaterial&&m(p,u,M)):u.isMeshMatcapMaterial?(r(p,u),_(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),b(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(a(p,u),u.isLineDashedMaterial&&o(p,u)):u.isPointsMaterial?l(p,u,S,E):u.isSpriteMaterial?c(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,t(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,t(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===Rt&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,t(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===Rt&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,t(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,t(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);const S=e.get(u),E=S.envMap,M=S.envMapRotation;E&&(p.envMap.value=E,On.copy(M),On.x*=-1,On.y*=-1,On.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(On.y*=-1,On.z*=-1),p.envMapRotation.value.setFromMatrix4(hg.makeRotationFromEuler(On)),p.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap&&(p.lightMap.value=u.lightMap,p.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,p.lightMapTransform)),u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,p.aoMapTransform))}function a(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,t(u.map,p.mapTransform))}function o(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function l(p,u,S,E){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*S,p.scale.value=E*.5,u.map&&(p.map.value=u.map,t(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function c(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,t(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function h(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function d(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function f(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,p.roughnessMapTransform)),u.envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function m(p,u,S){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Rt&&p.clearcoatNormalScale.value.negate())),u.dispersion>0&&(p.dispersion.value=u.dispersion),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=S.texture,p.transmissionSamplerSize.value.set(S.width,S.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,u){u.matcap&&(p.matcap.value=u.matcap)}function b(p,u){const S=e.get(u).light;p.referencePosition.value.setFromMatrixPosition(S.matrixWorld),p.nearDistance.value=S.shadow.camera.near,p.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function dg(s,e,t,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,E){const M=E.program;n.uniformBlockBinding(S,M)}function c(S,E){let M=i[S.id];M===void 0&&(_(S),M=h(S),i[S.id]=M,S.addEventListener("dispose",p));const A=E.program;n.updateUBOMapping(S,A);const T=e.render.frame;r[S.id]!==T&&(f(S),r[S.id]=T)}function h(S){const E=d();S.__bindingPointIndex=E;const M=s.createBuffer(),A=S.__size,T=S.usage;return s.bindBuffer(s.UNIFORM_BUFFER,M),s.bufferData(s.UNIFORM_BUFFER,A,T),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,E,M),M}function d(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(S){const E=i[S.id],M=S.uniforms,A=S.__cache;s.bindBuffer(s.UNIFORM_BUFFER,E);for(let T=0,R=M.length;T<R;T++){const D=Array.isArray(M[T])?M[T]:[M[T]];for(let x=0,v=D.length;x<v;x++){const P=D[x];if(m(P,T,x,A)===!0){const F=P.__offset,z=Array.isArray(P.value)?P.value:[P.value];let X=0;for(let W=0;W<z.length;W++){const $=z[W],j=b($);typeof $=="number"||typeof $=="boolean"?(P.__data[0]=$,s.bufferSubData(s.UNIFORM_BUFFER,F+X,P.__data)):$.isMatrix3?(P.__data[0]=$.elements[0],P.__data[1]=$.elements[1],P.__data[2]=$.elements[2],P.__data[3]=0,P.__data[4]=$.elements[3],P.__data[5]=$.elements[4],P.__data[6]=$.elements[5],P.__data[7]=0,P.__data[8]=$.elements[6],P.__data[9]=$.elements[7],P.__data[10]=$.elements[8],P.__data[11]=0):($.toArray(P.__data,X),X+=j.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,F,P.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function m(S,E,M,A){const T=S.value,R=E+"_"+M;if(A[R]===void 0)return typeof T=="number"||typeof T=="boolean"?A[R]=T:A[R]=T.clone(),!0;{const D=A[R];if(typeof T=="number"||typeof T=="boolean"){if(D!==T)return A[R]=T,!0}else if(D.equals(T)===!1)return D.copy(T),!0}return!1}function _(S){const E=S.uniforms;let M=0;const A=16;for(let R=0,D=E.length;R<D;R++){const x=Array.isArray(E[R])?E[R]:[E[R]];for(let v=0,P=x.length;v<P;v++){const F=x[v],z=Array.isArray(F.value)?F.value:[F.value];for(let X=0,W=z.length;X<W;X++){const $=z[X],j=b($),H=M%A,re=H%j.boundary,ce=H+re;M+=re,ce!==0&&A-ce<j.storage&&(M+=A-ce),F.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=M,M+=j.storage}}}const T=M%A;return T>0&&(M+=A-T),S.__size=M,S.__cache={},this}function b(S){const E={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(E.boundary=4,E.storage=4):S.isVector2?(E.boundary=8,E.storage=8):S.isVector3||S.isColor?(E.boundary=16,E.storage=12):S.isVector4?(E.boundary=16,E.storage=16):S.isMatrix3?(E.boundary=48,E.storage=48):S.isMatrix4?(E.boundary=64,E.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),E}function p(S){const E=S.target;E.removeEventListener("dispose",p);const M=a.indexOf(E.__bindingPointIndex);a.splice(M,1),s.deleteBuffer(i[E.id]),delete i[E.id],delete r[E.id]}function u(){for(const S in i)s.deleteBuffer(i[S]);a=[],i={},r={}}return{bind:l,update:c,dispose:u}}class fg{constructor(e={}){const{canvas:t=Vh(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;const _=new Uint32Array(4),b=new Int32Array(4);let p=null,u=null;const S=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Tn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const M=this;let A=!1;this._outputColorSpace=Ht;let T=0,R=0,D=null,x=-1,v=null;const P=new je,F=new je;let z=null;const X=new Pe(0);let W=0,$=t.width,j=t.height,H=1,re=null,ce=null;const Se=new je(0,0,$,j),Be=new je(0,0,$,j);let Qe=!1;const it=new Ba;let $e=!1,q=!1;const Z=new Je,de=new I,De=new je,Me={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ge=!1;function vt(){return D===null?H:1}let C=n;function st(y,U){return t.getContext(y,U)}try{const y={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Aa}`),t.addEventListener("webglcontextlost",ie,!1),t.addEventListener("webglcontextrestored",ue,!1),t.addEventListener("webglcontextcreationerror",J,!1),C===null){const U="webgl2";if(C=st(U,y),C===null)throw st(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let Ie,Re,ge,rt,_e,Fe,mt,ut,w,g,O,V,K,G,be,ne,ve,xe,ee,le,Ae,ye,ae,Ue;function L(){Ie=new Sp(C),Ie.init(),ye=new rg(C,Ie),Re=new gp(C,Ie,e,ye),ge=new ig(C,Ie),Re.reversedDepthBuffer&&f&&ge.buffers.depth.setReversed(!0),rt=new Tp(C),_e=new Wm,Fe=new sg(C,Ie,ge,_e,Re,ye,rt),mt=new vp(M),ut=new Mp(M),w=new Du(C),ae=new pp(C,w),g=new Ep(C,w,rt,ae),O=new Rp(C,g,w,rt),ee=new Ap(C,Re,Fe),ne=new _p(_e),V=new Vm(M,mt,ut,Ie,Re,ae,ne),K=new ug(M,_e),G=new $m,be=new Jm(Ie),xe=new fp(M,mt,ut,ge,O,m,l),ve=new tg(M,O,Re),Ue=new dg(C,rt,Re,ge),le=new mp(C,Ie,rt),Ae=new wp(C,Ie,rt),rt.programs=V.programs,M.capabilities=Re,M.extensions=Ie,M.properties=_e,M.renderLists=G,M.shadowMap=ve,M.state=ge,M.info=rt}L();const te=new cg(M,C);this.xr=te,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const y=Ie.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Ie.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(y){y!==void 0&&(H=y,this.setSize($,j,!1))},this.getSize=function(y){return y.set($,j)},this.setSize=function(y,U,B=!0){if(te.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=y,j=U,t.width=Math.floor(y*H),t.height=Math.floor(U*H),B===!0&&(t.style.width=y+"px",t.style.height=U+"px"),this.setViewport(0,0,y,U)},this.getDrawingBufferSize=function(y){return y.set($*H,j*H).floor()},this.setDrawingBufferSize=function(y,U,B){$=y,j=U,H=B,t.width=Math.floor(y*B),t.height=Math.floor(U*B),this.setViewport(0,0,y,U)},this.getCurrentViewport=function(y){return y.copy(P)},this.getViewport=function(y){return y.copy(Se)},this.setViewport=function(y,U,B,k){y.isVector4?Se.set(y.x,y.y,y.z,y.w):Se.set(y,U,B,k),ge.viewport(P.copy(Se).multiplyScalar(H).round())},this.getScissor=function(y){return y.copy(Be)},this.setScissor=function(y,U,B,k){y.isVector4?Be.set(y.x,y.y,y.z,y.w):Be.set(y,U,B,k),ge.scissor(F.copy(Be).multiplyScalar(H).round())},this.getScissorTest=function(){return Qe},this.setScissorTest=function(y){ge.setScissorTest(Qe=y)},this.setOpaqueSort=function(y){re=y},this.setTransparentSort=function(y){ce=y},this.getClearColor=function(y){return y.copy(xe.getClearColor())},this.setClearColor=function(){xe.setClearColor(...arguments)},this.getClearAlpha=function(){return xe.getClearAlpha()},this.setClearAlpha=function(){xe.setClearAlpha(...arguments)},this.clear=function(y=!0,U=!0,B=!0){let k=0;if(y){let N=!1;if(D!==null){const Q=D.texture.format;N=Q===Ua||Q===Ia||Q===La}if(N){const Q=D.texture.type,oe=Q===an||Q===Yn||Q===$i||Q===qi||Q===Ca||Q===Pa,fe=xe.getClearColor(),he=xe.getClearAlpha(),Te=fe.r,Ce=fe.g,Ee=fe.b;oe?(_[0]=Te,_[1]=Ce,_[2]=Ee,_[3]=he,C.clearBufferuiv(C.COLOR,0,_)):(b[0]=Te,b[1]=Ce,b[2]=Ee,b[3]=he,C.clearBufferiv(C.COLOR,0,b))}else k|=C.COLOR_BUFFER_BIT}U&&(k|=C.DEPTH_BUFFER_BIT),B&&(k|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ie,!1),t.removeEventListener("webglcontextrestored",ue,!1),t.removeEventListener("webglcontextcreationerror",J,!1),xe.dispose(),G.dispose(),be.dispose(),_e.dispose(),mt.dispose(),ut.dispose(),O.dispose(),ae.dispose(),Ue.dispose(),V.dispose(),te.dispose(),te.removeEventListener("sessionstart",Jt),te.removeEventListener("sessionend",qa),Pn.stop()};function ie(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function ue(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;const y=rt.autoReset,U=ve.enabled,B=ve.autoUpdate,k=ve.needsUpdate,N=ve.type;L(),rt.autoReset=y,ve.enabled=U,ve.autoUpdate=B,ve.needsUpdate=k,ve.type=N}function J(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Y(y){const U=y.target;U.removeEventListener("dispose",Y),pe(U)}function pe(y){Le(y),_e.remove(y)}function Le(y){const U=_e.get(y).programs;U!==void 0&&(U.forEach(function(B){V.releaseProgram(B)}),y.isShaderMaterial&&V.releaseShaderCache(y))}this.renderBufferDirect=function(y,U,B,k,N,Q){U===null&&(U=Me);const oe=N.isMesh&&N.matrixWorld.determinant()<0,fe=Zl(y,U,B,k,N);ge.setMaterial(k,oe);let he=B.index,Te=1;if(k.wireframe===!0){if(he=g.getWireframeAttribute(B),he===void 0)return;Te=2}const Ce=B.drawRange,Ee=B.attributes.position;let ke=Ce.start*Te,Ye=(Ce.start+Ce.count)*Te;Q!==null&&(ke=Math.max(ke,Q.start*Te),Ye=Math.min(Ye,(Q.start+Q.count)*Te)),he!==null?(ke=Math.max(ke,0),Ye=Math.min(Ye,he.count)):Ee!=null&&(ke=Math.max(ke,0),Ye=Math.min(Ye,Ee.count));const ct=Ye-ke;if(ct<0||ct===1/0)return;ae.setup(N,k,fe,B,he);let tt,Ze=le;if(he!==null&&(tt=w.get(he),Ze=Ae,Ze.setIndex(tt)),N.isMesh)k.wireframe===!0?(ge.setLineWidth(k.wireframeLinewidth*vt()),Ze.setMode(C.LINES)):Ze.setMode(C.TRIANGLES);else if(N.isLine){let we=k.linewidth;we===void 0&&(we=1),ge.setLineWidth(we*vt()),N.isLineSegments?Ze.setMode(C.LINES):N.isLineLoop?Ze.setMode(C.LINE_LOOP):Ze.setMode(C.LINE_STRIP)}else N.isPoints?Ze.setMode(C.POINTS):N.isSprite&&Ze.setMode(C.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)Zi("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ze.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Ie.get("WEBGL_multi_draw"))Ze.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const we=N._multiDrawStarts,at=N._multiDrawCounts,Ve=N._multiDrawCount,Pt=he?w.get(he).bytesPerElement:1,Zn=_e.get(k).currentProgram.getUniforms();for(let Dt=0;Dt<Ve;Dt++)Zn.setValue(C,"_gl_DrawID",Dt),Ze.render(we[Dt]/Pt,at[Dt])}else if(N.isInstancedMesh)Ze.renderInstances(ke,ct,N.count);else if(B.isInstancedBufferGeometry){const we=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,at=Math.min(B.instanceCount,we);Ze.renderInstances(ke,ct,at)}else Ze.render(ke,ct)};function et(y,U,B){y.transparent===!0&&y.side===Yt&&y.forceSinglePass===!1?(y.side=Rt,y.needsUpdate=!0,ns(y,U,B),y.side=Rn,y.needsUpdate=!0,ns(y,U,B),y.side=Yt):ns(y,U,B)}this.compile=function(y,U,B=null){B===null&&(B=y),u=be.get(B),u.init(U),E.push(u),B.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(u.pushLight(N),N.castShadow&&u.pushShadow(N))}),y!==B&&y.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(u.pushLight(N),N.castShadow&&u.pushShadow(N))}),u.setupLights();const k=new Set;return y.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const Q=N.material;if(Q)if(Array.isArray(Q))for(let oe=0;oe<Q.length;oe++){const fe=Q[oe];et(fe,B,N),k.add(fe)}else et(Q,B,N),k.add(Q)}),u=E.pop(),k},this.compileAsync=function(y,U,B=null){const k=this.compile(y,U,B);return new Promise(N=>{function Q(){if(k.forEach(function(oe){_e.get(oe).currentProgram.isReady()&&k.delete(oe)}),k.size===0){N(y);return}setTimeout(Q,10)}Ie.get("KHR_parallel_shader_compile")!==null?Q():setTimeout(Q,10)})};let qe=null;function ln(y){qe&&qe(y)}function Jt(){Pn.stop()}function qa(){Pn.start()}const Pn=new $l;Pn.setAnimationLoop(ln),typeof self<"u"&&Pn.setContext(self),this.setAnimationLoop=function(y){qe=y,te.setAnimationLoop(y),y===null?Pn.stop():Pn.start()},te.addEventListener("sessionstart",Jt),te.addEventListener("sessionend",qa),this.render=function(y,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),te.enabled===!0&&te.isPresenting===!0&&(te.cameraAutoUpdate===!0&&te.updateCamera(U),U=te.getCamera()),y.isScene===!0&&y.onBeforeRender(M,y,U,D),u=be.get(y,E.length),u.init(U),E.push(u),Z.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),it.setFromProjectionMatrix(Z,rn,U.reversedDepth),q=this.localClippingEnabled,$e=ne.init(this.clippingPlanes,q),p=G.get(y,S.length),p.init(),S.push(p),te.enabled===!0&&te.isPresenting===!0){const Q=M.xr.getDepthSensingMesh();Q!==null&&qs(Q,U,-1/0,M.sortObjects)}qs(y,U,0,M.sortObjects),p.finish(),M.sortObjects===!0&&p.sort(re,ce),Ge=te.enabled===!1||te.isPresenting===!1||te.hasDepthSensing()===!1,Ge&&xe.addToRenderList(p,y),this.info.render.frame++,$e===!0&&ne.beginShadows();const B=u.state.shadowsArray;ve.render(B,y,U),$e===!0&&ne.endShadows(),this.info.autoReset===!0&&this.info.reset();const k=p.opaque,N=p.transmissive;if(u.setupLights(),U.isArrayCamera){const Q=U.cameras;if(N.length>0)for(let oe=0,fe=Q.length;oe<fe;oe++){const he=Q[oe];Ka(k,N,y,he)}Ge&&xe.render(y);for(let oe=0,fe=Q.length;oe<fe;oe++){const he=Q[oe];Ya(p,y,he,he.viewport)}}else N.length>0&&Ka(k,N,y,U),Ge&&xe.render(y),Ya(p,y,U);D!==null&&R===0&&(Fe.updateMultisampleRenderTarget(D),Fe.updateRenderTargetMipmap(D)),y.isScene===!0&&y.onAfterRender(M,y,U),ae.resetDefaultState(),x=-1,v=null,E.pop(),E.length>0?(u=E[E.length-1],$e===!0&&ne.setGlobalState(M.clippingPlanes,u.state.camera)):u=null,S.pop(),S.length>0?p=S[S.length-1]:p=null};function qs(y,U,B,k){if(y.visible===!1)return;if(y.layers.test(U.layers)){if(y.isGroup)B=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(U);else if(y.isLight)u.pushLight(y),y.castShadow&&u.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||it.intersectsSprite(y)){k&&De.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Z);const oe=O.update(y),fe=y.material;fe.visible&&p.push(y,oe,fe,B,De.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||it.intersectsObject(y))){const oe=O.update(y),fe=y.material;if(k&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),De.copy(y.boundingSphere.center)):(oe.boundingSphere===null&&oe.computeBoundingSphere(),De.copy(oe.boundingSphere.center)),De.applyMatrix4(y.matrixWorld).applyMatrix4(Z)),Array.isArray(fe)){const he=oe.groups;for(let Te=0,Ce=he.length;Te<Ce;Te++){const Ee=he[Te],ke=fe[Ee.materialIndex];ke&&ke.visible&&p.push(y,oe,ke,B,De.z,Ee)}}else fe.visible&&p.push(y,oe,fe,B,De.z,null)}}const Q=y.children;for(let oe=0,fe=Q.length;oe<fe;oe++)qs(Q[oe],U,B,k)}function Ya(y,U,B,k){const N=y.opaque,Q=y.transmissive,oe=y.transparent;u.setupLightsView(B),$e===!0&&ne.setGlobalState(M.clippingPlanes,B),k&&ge.viewport(P.copy(k)),N.length>0&&ts(N,U,B),Q.length>0&&ts(Q,U,B),oe.length>0&&ts(oe,U,B),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function Ka(y,U,B,k){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[k.id]===void 0&&(u.state.transmissionRenderTarget[k.id]=new Kn(1,1,{generateMipmaps:!0,type:Ie.has("EXT_color_buffer_half_float")||Ie.has("EXT_color_buffer_float")?Ji:an,minFilter:Wn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Xe.workingColorSpace}));const Q=u.state.transmissionRenderTarget[k.id],oe=k.viewport||P;Q.setSize(oe.z*M.transmissionResolutionScale,oe.w*M.transmissionResolutionScale);const fe=M.getRenderTarget(),he=M.getActiveCubeFace(),Te=M.getActiveMipmapLevel();M.setRenderTarget(Q),M.getClearColor(X),W=M.getClearAlpha(),W<1&&M.setClearColor(16777215,.5),M.clear(),Ge&&xe.render(B);const Ce=M.toneMapping;M.toneMapping=Tn;const Ee=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),u.setupLightsView(k),$e===!0&&ne.setGlobalState(M.clippingPlanes,k),ts(y,B,k),Fe.updateMultisampleRenderTarget(Q),Fe.updateRenderTargetMipmap(Q),Ie.has("WEBGL_multisampled_render_to_texture")===!1){let ke=!1;for(let Ye=0,ct=U.length;Ye<ct;Ye++){const tt=U[Ye],Ze=tt.object,we=tt.geometry,at=tt.material,Ve=tt.group;if(at.side===Yt&&Ze.layers.test(k.layers)){const Pt=at.side;at.side=Rt,at.needsUpdate=!0,ja(Ze,B,k,we,at,Ve),at.side=Pt,at.needsUpdate=!0,ke=!0}}ke===!0&&(Fe.updateMultisampleRenderTarget(Q),Fe.updateRenderTargetMipmap(Q))}M.setRenderTarget(fe,he,Te),M.setClearColor(X,W),Ee!==void 0&&(k.viewport=Ee),M.toneMapping=Ce}function ts(y,U,B){const k=U.isScene===!0?U.overrideMaterial:null;for(let N=0,Q=y.length;N<Q;N++){const oe=y[N],fe=oe.object,he=oe.geometry,Te=oe.group;let Ce=oe.material;Ce.allowOverride===!0&&k!==null&&(Ce=k),fe.layers.test(B.layers)&&ja(fe,U,B,he,Ce,Te)}}function ja(y,U,B,k,N,Q){y.onBeforeRender(M,U,B,k,N,Q),y.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),N.onBeforeRender(M,U,B,k,y,Q),N.transparent===!0&&N.side===Yt&&N.forceSinglePass===!1?(N.side=Rt,N.needsUpdate=!0,M.renderBufferDirect(B,U,k,N,y,Q),N.side=Rn,N.needsUpdate=!0,M.renderBufferDirect(B,U,k,N,y,Q),N.side=Yt):M.renderBufferDirect(B,U,k,N,y,Q),y.onAfterRender(M,U,B,k,N,Q)}function ns(y,U,B){U.isScene!==!0&&(U=Me);const k=_e.get(y),N=u.state.lights,Q=u.state.shadowsArray,oe=N.state.version,fe=V.getParameters(y,N.state,Q,U,B),he=V.getProgramCacheKey(fe);let Te=k.programs;k.environment=y.isMeshStandardMaterial?U.environment:null,k.fog=U.fog,k.envMap=(y.isMeshStandardMaterial?ut:mt).get(y.envMap||k.environment),k.envMapRotation=k.environment!==null&&y.envMap===null?U.environmentRotation:y.envMapRotation,Te===void 0&&(y.addEventListener("dispose",Y),Te=new Map,k.programs=Te);let Ce=Te.get(he);if(Ce!==void 0){if(k.currentProgram===Ce&&k.lightsStateVersion===oe)return Ja(y,fe),Ce}else fe.uniforms=V.getUniforms(y),y.onBeforeCompile(fe,M),Ce=V.acquireProgram(fe,he),Te.set(he,Ce),k.uniforms=fe.uniforms;const Ee=k.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Ee.clippingPlanes=ne.uniform),Ja(y,fe),k.needsLights=Ql(y),k.lightsStateVersion=oe,k.needsLights&&(Ee.ambientLightColor.value=N.state.ambient,Ee.lightProbe.value=N.state.probe,Ee.directionalLights.value=N.state.directional,Ee.directionalLightShadows.value=N.state.directionalShadow,Ee.spotLights.value=N.state.spot,Ee.spotLightShadows.value=N.state.spotShadow,Ee.rectAreaLights.value=N.state.rectArea,Ee.ltc_1.value=N.state.rectAreaLTC1,Ee.ltc_2.value=N.state.rectAreaLTC2,Ee.pointLights.value=N.state.point,Ee.pointLightShadows.value=N.state.pointShadow,Ee.hemisphereLights.value=N.state.hemi,Ee.directionalShadowMap.value=N.state.directionalShadowMap,Ee.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Ee.spotShadowMap.value=N.state.spotShadowMap,Ee.spotLightMatrix.value=N.state.spotLightMatrix,Ee.spotLightMap.value=N.state.spotLightMap,Ee.pointShadowMap.value=N.state.pointShadowMap,Ee.pointShadowMatrix.value=N.state.pointShadowMatrix),k.currentProgram=Ce,k.uniformsList=null,Ce}function Za(y){if(y.uniformsList===null){const U=y.currentProgram.getUniforms();y.uniformsList=Us.seqWithValue(U.seq,y.uniforms)}return y.uniformsList}function Ja(y,U){const B=_e.get(y);B.outputColorSpace=U.outputColorSpace,B.batching=U.batching,B.batchingColor=U.batchingColor,B.instancing=U.instancing,B.instancingColor=U.instancingColor,B.instancingMorph=U.instancingMorph,B.skinning=U.skinning,B.morphTargets=U.morphTargets,B.morphNormals=U.morphNormals,B.morphColors=U.morphColors,B.morphTargetsCount=U.morphTargetsCount,B.numClippingPlanes=U.numClippingPlanes,B.numIntersection=U.numClipIntersection,B.vertexAlphas=U.vertexAlphas,B.vertexTangents=U.vertexTangents,B.toneMapping=U.toneMapping}function Zl(y,U,B,k,N){U.isScene!==!0&&(U=Me),Fe.resetTextureUnits();const Q=U.fog,oe=k.isMeshStandardMaterial?U.environment:null,fe=D===null?M.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:Mi,he=(k.isMeshStandardMaterial?ut:mt).get(k.envMap||oe),Te=k.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Ce=!!B.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Ee=!!B.morphAttributes.position,ke=!!B.morphAttributes.normal,Ye=!!B.morphAttributes.color;let ct=Tn;k.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(ct=M.toneMapping);const tt=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,Ze=tt!==void 0?tt.length:0,we=_e.get(k),at=u.state.lights;if($e===!0&&(q===!0||y!==v)){const bt=y===v&&k.id===x;ne.setState(k,y,bt)}let Ve=!1;k.version===we.__version?(we.needsLights&&we.lightsStateVersion!==at.state.version||we.outputColorSpace!==fe||N.isBatchedMesh&&we.batching===!1||!N.isBatchedMesh&&we.batching===!0||N.isBatchedMesh&&we.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&we.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&we.instancing===!1||!N.isInstancedMesh&&we.instancing===!0||N.isSkinnedMesh&&we.skinning===!1||!N.isSkinnedMesh&&we.skinning===!0||N.isInstancedMesh&&we.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&we.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&we.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&we.instancingMorph===!1&&N.morphTexture!==null||we.envMap!==he||k.fog===!0&&we.fog!==Q||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==ne.numPlanes||we.numIntersection!==ne.numIntersection)||we.vertexAlphas!==Te||we.vertexTangents!==Ce||we.morphTargets!==Ee||we.morphNormals!==ke||we.morphColors!==Ye||we.toneMapping!==ct||we.morphTargetsCount!==Ze)&&(Ve=!0):(Ve=!0,we.__version=k.version);let Pt=we.currentProgram;Ve===!0&&(Pt=ns(k,U,N));let Zn=!1,Dt=!1,Li=!1;const ot=Pt.getUniforms(),Ot=we.uniforms;if(ge.useProgram(Pt.program)&&(Zn=!0,Dt=!0,Li=!0),k.id!==x&&(x=k.id,Dt=!0),Zn||v!==y){ge.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),ot.setValue(C,"projectionMatrix",y.projectionMatrix),ot.setValue(C,"viewMatrix",y.matrixWorldInverse);const At=ot.map.cameraPosition;At!==void 0&&At.setValue(C,de.setFromMatrixPosition(y.matrixWorld)),Re.logarithmicDepthBuffer&&ot.setValue(C,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&ot.setValue(C,"isOrthographic",y.isOrthographicCamera===!0),v!==y&&(v=y,Dt=!0,Li=!0)}if(N.isSkinnedMesh){ot.setOptional(C,N,"bindMatrix"),ot.setOptional(C,N,"bindMatrixInverse");const bt=N.skeleton;bt&&(bt.boneTexture===null&&bt.computeBoneTexture(),ot.setValue(C,"boneTexture",bt.boneTexture,Fe))}N.isBatchedMesh&&(ot.setOptional(C,N,"batchingTexture"),ot.setValue(C,"batchingTexture",N._matricesTexture,Fe),ot.setOptional(C,N,"batchingIdTexture"),ot.setValue(C,"batchingIdTexture",N._indirectTexture,Fe),ot.setOptional(C,N,"batchingColorTexture"),N._colorsTexture!==null&&ot.setValue(C,"batchingColorTexture",N._colorsTexture,Fe));const Bt=B.morphAttributes;if((Bt.position!==void 0||Bt.normal!==void 0||Bt.color!==void 0)&&ee.update(N,B,Pt),(Dt||we.receiveShadow!==N.receiveShadow)&&(we.receiveShadow=N.receiveShadow,ot.setValue(C,"receiveShadow",N.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(Ot.envMap.value=he,Ot.flipEnvMap.value=he.isCubeTexture&&he.isRenderTargetTexture===!1?-1:1),k.isMeshStandardMaterial&&k.envMap===null&&U.environment!==null&&(Ot.envMapIntensity.value=U.environmentIntensity),Dt&&(ot.setValue(C,"toneMappingExposure",M.toneMappingExposure),we.needsLights&&Jl(Ot,Li),Q&&k.fog===!0&&K.refreshFogUniforms(Ot,Q),K.refreshMaterialUniforms(Ot,k,H,j,u.state.transmissionRenderTarget[y.id]),Us.upload(C,Za(we),Ot,Fe)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Us.upload(C,Za(we),Ot,Fe),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&ot.setValue(C,"center",N.center),ot.setValue(C,"modelViewMatrix",N.modelViewMatrix),ot.setValue(C,"normalMatrix",N.normalMatrix),ot.setValue(C,"modelMatrix",N.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const bt=k.uniformsGroups;for(let At=0,Ys=bt.length;At<Ys;At++){const Dn=bt[At];Ue.update(Dn,Pt),Ue.bind(Dn,Pt)}}return Pt}function Jl(y,U){y.ambientLightColor.needsUpdate=U,y.lightProbe.needsUpdate=U,y.directionalLights.needsUpdate=U,y.directionalLightShadows.needsUpdate=U,y.pointLights.needsUpdate=U,y.pointLightShadows.needsUpdate=U,y.spotLights.needsUpdate=U,y.spotLightShadows.needsUpdate=U,y.rectAreaLights.needsUpdate=U,y.hemisphereLights.needsUpdate=U}function Ql(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(y,U,B){const k=_e.get(y);k.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),_e.get(y.texture).__webglTexture=U,_e.get(y.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:B,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,U){const B=_e.get(y);B.__webglFramebuffer=U,B.__useDefaultFramebuffer=U===void 0};const ec=C.createFramebuffer();this.setRenderTarget=function(y,U=0,B=0){D=y,T=U,R=B;let k=!0,N=null,Q=!1,oe=!1;if(y){const he=_e.get(y);if(he.__useDefaultFramebuffer!==void 0)ge.bindFramebuffer(C.FRAMEBUFFER,null),k=!1;else if(he.__webglFramebuffer===void 0)Fe.setupRenderTarget(y);else if(he.__hasExternalTextures)Fe.rebindTextures(y,_e.get(y.texture).__webglTexture,_e.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const Ee=y.depthTexture;if(he.__boundDepthTexture!==Ee){if(Ee!==null&&_e.has(Ee)&&(y.width!==Ee.image.width||y.height!==Ee.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Fe.setupDepthRenderbuffer(y)}}const Te=y.texture;(Te.isData3DTexture||Te.isDataArrayTexture||Te.isCompressedArrayTexture)&&(oe=!0);const Ce=_e.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Ce[U])?N=Ce[U][B]:N=Ce[U],Q=!0):y.samples>0&&Fe.useMultisampledRTT(y)===!1?N=_e.get(y).__webglMultisampledFramebuffer:Array.isArray(Ce)?N=Ce[B]:N=Ce,P.copy(y.viewport),F.copy(y.scissor),z=y.scissorTest}else P.copy(Se).multiplyScalar(H).floor(),F.copy(Be).multiplyScalar(H).floor(),z=Qe;if(B!==0&&(N=ec),ge.bindFramebuffer(C.FRAMEBUFFER,N)&&k&&ge.drawBuffers(y,N),ge.viewport(P),ge.scissor(F),ge.setScissorTest(z),Q){const he=_e.get(y.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+U,he.__webglTexture,B)}else if(oe){const he=U;for(let Te=0;Te<y.textures.length;Te++){const Ce=_e.get(y.textures[Te]);C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0+Te,Ce.__webglTexture,B,he)}}else if(y!==null&&B!==0){const he=_e.get(y.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,he.__webglTexture,B)}x=-1},this.readRenderTargetPixels=function(y,U,B,k,N,Q,oe,fe=0){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let he=_e.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&oe!==void 0&&(he=he[oe]),he){ge.bindFramebuffer(C.FRAMEBUFFER,he);try{const Te=y.textures[fe],Ce=Te.format,Ee=Te.type;if(!Re.textureFormatReadable(Ce)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Re.textureTypeReadable(Ee)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=y.width-k&&B>=0&&B<=y.height-N&&(y.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+fe),C.readPixels(U,B,k,N,ye.convert(Ce),ye.convert(Ee),Q))}finally{const Te=D!==null?_e.get(D).__webglFramebuffer:null;ge.bindFramebuffer(C.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(y,U,B,k,N,Q,oe,fe=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let he=_e.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&oe!==void 0&&(he=he[oe]),he)if(U>=0&&U<=y.width-k&&B>=0&&B<=y.height-N){ge.bindFramebuffer(C.FRAMEBUFFER,he);const Te=y.textures[fe],Ce=Te.format,Ee=Te.type;if(!Re.textureFormatReadable(Ce))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Re.textureTypeReadable(Ee))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ke=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,ke),C.bufferData(C.PIXEL_PACK_BUFFER,Q.byteLength,C.STREAM_READ),y.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+fe),C.readPixels(U,B,k,N,ye.convert(Ce),ye.convert(Ee),0);const Ye=D!==null?_e.get(D).__webglFramebuffer:null;ge.bindFramebuffer(C.FRAMEBUFFER,Ye);const ct=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await Wh(C,ct,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,ke),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,Q),C.deleteBuffer(ke),C.deleteSync(ct),Q}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,U=null,B=0){const k=Math.pow(2,-B),N=Math.floor(y.image.width*k),Q=Math.floor(y.image.height*k),oe=U!==null?U.x:0,fe=U!==null?U.y:0;Fe.setTexture2D(y,0),C.copyTexSubImage2D(C.TEXTURE_2D,B,0,0,oe,fe,N,Q),ge.unbindTexture()};const tc=C.createFramebuffer(),nc=C.createFramebuffer();this.copyTextureToTexture=function(y,U,B=null,k=null,N=0,Q=null){Q===null&&(N!==0?(Zi("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Q=N,N=0):Q=0);let oe,fe,he,Te,Ce,Ee,ke,Ye,ct;const tt=y.isCompressedTexture?y.mipmaps[Q]:y.image;if(B!==null)oe=B.max.x-B.min.x,fe=B.max.y-B.min.y,he=B.isBox3?B.max.z-B.min.z:1,Te=B.min.x,Ce=B.min.y,Ee=B.isBox3?B.min.z:0;else{const Bt=Math.pow(2,-N);oe=Math.floor(tt.width*Bt),fe=Math.floor(tt.height*Bt),y.isDataArrayTexture?he=tt.depth:y.isData3DTexture?he=Math.floor(tt.depth*Bt):he=1,Te=0,Ce=0,Ee=0}k!==null?(ke=k.x,Ye=k.y,ct=k.z):(ke=0,Ye=0,ct=0);const Ze=ye.convert(U.format),we=ye.convert(U.type);let at;U.isData3DTexture?(Fe.setTexture3D(U,0),at=C.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Fe.setTexture2DArray(U,0),at=C.TEXTURE_2D_ARRAY):(Fe.setTexture2D(U,0),at=C.TEXTURE_2D),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,U.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,U.unpackAlignment);const Ve=C.getParameter(C.UNPACK_ROW_LENGTH),Pt=C.getParameter(C.UNPACK_IMAGE_HEIGHT),Zn=C.getParameter(C.UNPACK_SKIP_PIXELS),Dt=C.getParameter(C.UNPACK_SKIP_ROWS),Li=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,tt.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,tt.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Te),C.pixelStorei(C.UNPACK_SKIP_ROWS,Ce),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Ee);const ot=y.isDataArrayTexture||y.isData3DTexture,Ot=U.isDataArrayTexture||U.isData3DTexture;if(y.isDepthTexture){const Bt=_e.get(y),bt=_e.get(U),At=_e.get(Bt.__renderTarget),Ys=_e.get(bt.__renderTarget);ge.bindFramebuffer(C.READ_FRAMEBUFFER,At.__webglFramebuffer),ge.bindFramebuffer(C.DRAW_FRAMEBUFFER,Ys.__webglFramebuffer);for(let Dn=0;Dn<he;Dn++)ot&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,_e.get(y).__webglTexture,N,Ee+Dn),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,_e.get(U).__webglTexture,Q,ct+Dn)),C.blitFramebuffer(Te,Ce,oe,fe,ke,Ye,oe,fe,C.DEPTH_BUFFER_BIT,C.NEAREST);ge.bindFramebuffer(C.READ_FRAMEBUFFER,null),ge.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if(N!==0||y.isRenderTargetTexture||_e.has(y)){const Bt=_e.get(y),bt=_e.get(U);ge.bindFramebuffer(C.READ_FRAMEBUFFER,tc),ge.bindFramebuffer(C.DRAW_FRAMEBUFFER,nc);for(let At=0;At<he;At++)ot?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Bt.__webglTexture,N,Ee+At):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Bt.__webglTexture,N),Ot?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,bt.__webglTexture,Q,ct+At):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,bt.__webglTexture,Q),N!==0?C.blitFramebuffer(Te,Ce,oe,fe,ke,Ye,oe,fe,C.COLOR_BUFFER_BIT,C.NEAREST):Ot?C.copyTexSubImage3D(at,Q,ke,Ye,ct+At,Te,Ce,oe,fe):C.copyTexSubImage2D(at,Q,ke,Ye,Te,Ce,oe,fe);ge.bindFramebuffer(C.READ_FRAMEBUFFER,null),ge.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else Ot?y.isDataTexture||y.isData3DTexture?C.texSubImage3D(at,Q,ke,Ye,ct,oe,fe,he,Ze,we,tt.data):U.isCompressedArrayTexture?C.compressedTexSubImage3D(at,Q,ke,Ye,ct,oe,fe,he,Ze,tt.data):C.texSubImage3D(at,Q,ke,Ye,ct,oe,fe,he,Ze,we,tt):y.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,Q,ke,Ye,oe,fe,Ze,we,tt.data):y.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,Q,ke,Ye,tt.width,tt.height,Ze,tt.data):C.texSubImage2D(C.TEXTURE_2D,Q,ke,Ye,oe,fe,Ze,we,tt);C.pixelStorei(C.UNPACK_ROW_LENGTH,Ve),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Pt),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Zn),C.pixelStorei(C.UNPACK_SKIP_ROWS,Dt),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Li),Q===0&&U.generateMipmaps&&C.generateMipmap(at),ge.unbindTexture()},this.initRenderTarget=function(y){_e.get(y).__webglFramebuffer===void 0&&Fe.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?Fe.setTextureCube(y,0):y.isData3DTexture?Fe.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?Fe.setTexture2DArray(y,0):Fe.setTexture2D(y,0),ge.unbindTexture()},this.resetState=function(){T=0,R=0,D=null,ge.reset(),ae.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return rn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Xe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Xe._getUnpackColorSpace()}}const Ns=Math.PI*2;function jt(s,e=.9,t=.4){return new wi({color:s,emissive:new Pe(s),emissiveIntensity:e,metalness:t,roughness:.35})}function qn(s,e){return new wi({color:s,emissive:new Pe(e),emissiveIntensity:.22,metalness:.75,roughness:.32})}class pg{renderer;scene=new mu;camera;world=new Vt;menuGroup=new Vt;stars=[];particles=[];particleMesh;friendlyBullets;hostileBullets;pickups;dummy=new Je;tempColor=new Pe;nebula;planet;glow;hero=null;playerMesh=null;bossMesh=null;stationMesh=null;droneMeshes=[];beamPool=[];enemyMeshes=new Map;enemyPool=new Map;asteroidMeshes=[];quality="high";aspect=.46;shake=0;menuTime=0;constructor(e){this.renderer=new fg({canvas:e,antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.renderer.setClearColor("#04060f",1),this.camera=new Va(-50,50,89,-89,.1,400),this.camera.position.set(0,We.height/2,160),this.camera.lookAt(0,We.height/2,0),this.scene.add(this.camera),this.scene.add(this.world),this.scene.add(this.menuGroup),this.world.visible=!1,this.scene.add(new Ru("#8fa8ff",.75));const t=new ko("#ffffff",1.5);t.position.set(-40,130,90),this.scene.add(t);const n=new ko("#7dd3fc",.85);n.position.set(50,30,40),this.scene.add(n),this.glow=new Tu("#4de1ff",22,90,2),this.glow.position.set(0,40,30),this.scene.add(this.glow),this.nebula=this.buildNebula(),this.scene.add(this.nebula),this.planet=new me(new Nt(26,32,24),new wi({color:"#3b6ea8",emissive:"#1b3a5f",emissiveIntensity:.6,roughness:.8})),this.planet.position.set(-30,210,-80),this.scene.add(this.planet),this.buildStars(),this.particleMesh=this.instanced(new Ha(.75,0),jt("#ffffff",1.4),900),this.friendlyBullets=this.instanced(new es(.55,1.6,3,6),jt("#ffffff",1.7),260),this.hostileBullets=this.instanced(new Nt(.95,8,6),jt("#ffffff",1.6),300),this.pickups=this.instanced(new Xs(1.5,0),jt("#ffffff",1.8),32);for(let i=0;i<8;i+=1){const r=new me(new Ei(1,We.height),new Ws({color:"#fca5a5",transparent:!0,opacity:.75,side:Yt,blending:Xi}));r.visible=!1,this.world.add(r),this.beamPool.push(r)}this.setQuality("high"),this.resize()}instanced(e,t,n){const i=new vu(e,t,n);i.frustumCulled=!1,i.count=n,i.instanceMatrix.setUsage(Th),this.dummy.makeScale(0,0,0);for(let r=0;r<n;r+=1)i.setMatrixAt(r,this.dummy);return this.scene.add(i),i}buildNebula(){const e=new _n({depthWrite:!1,uniforms:{uTime:{value:0},uColorA:{value:new Pe("#2b3d8f")},uColorB:{value:new Pe("#7c3f8c")},uSky:{value:new Pe("#05091a")}},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uSky;
        varying vec2 vUv;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }
        float fbm(vec2 p) {
          float total = 0.0;
          float amp = 0.5;
          for (int i = 0; i < 5; i++) {
            total += noise(p) * amp;
            p *= 2.03;
            amp *= 0.5;
          }
          return total;
        }
        void main() {
          vec2 uv = vUv;
          float t = uTime * 0.015;
          float clouds = fbm(uv * 3.2 + vec2(t, -t * 0.6));
          float wisps = fbm(uv * 7.0 - vec2(t * 0.8, t));
          float density = smoothstep(0.35, 1.05, clouds + wisps * 0.35);
          vec3 color = uSky;
          color = mix(color, uColorA, density * 0.85);
          color = mix(color, uColorB, smoothstep(0.4, 0.95, wisps) * 0.55);
          float stars = step(0.9992, hash(floor(uv * 520.0)));
          color += vec3(stars) * 0.9;
          gl_FragColor = vec4(color, 1.0);
        }
      `}),t=new me(new Ei(560,460),e);return t.position.set(0,90,-160),t}buildStars(){const e=[{count:700,size:.55,z:-40,speed:3.2,opacity:.9},{count:420,size:.9,z:-80,speed:6.5,opacity:.75},{count:220,size:1.4,z:-120,speed:11,opacity:.55}];for(const t of e){const n=new Float32Array(t.count*3);for(let o=0;o<t.count;o+=1)n[o*3]=(Math.random()-.5)*300,n[o*3+1]=(Math.random()-.5)*320,n[o*3+2]=t.z+(Math.random()-.5)*40;const i=new Ct;i.setAttribute("position",new Wt(n,3));const r=new Gl({color:"#e2f2ff",size:t.size,transparent:!0,opacity:t.opacity,sizeAttenuation:!0,depthWrite:!1,blending:Xi}),a=new Mu(i,r);a.userData.speed=t.speed,this.scene.add(a),this.stars.push(a)}}setQuality(e){this.quality=e;const t=eo[e];this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,t.pixelRatio));for(const[n,i]of this.stars.entries()){const r=Math.round(t.stars*(n===0?.62:n===1?.28:.1)),a=i.geometry.getAttribute("position");i.geometry.setDrawRange(0,Math.min(r,a.count))}this.resize()}setSector(e){const t=this.nebula.material;t.uniforms.uColorA.value=new Pe(e.palette.nebula),t.uniforms.uColorB.value=new Pe(e.palette.nebula2),t.uniforms.uSky.value=new Pe(e.palette.sky),this.renderer.setClearColor(e.palette.sky,1),this.planet.material.color=new Pe(e.palette.planet),this.planet.material.emissive=new Pe(e.palette.accent).multiplyScalar(.22),this.planet.position.set(-34,208,-80),this.glow.color=new Pe(e.palette.accent),this.scene.fog=new Oa(new Pe(e.palette.fog),200,340)}setShip(e){const t=Ta(e);this.playerMesh&&this.world.remove(this.playerMesh),this.playerMesh=ul(t.shape,t.hullColor,t.accentColor),this.world.add(this.playerMesh),this.hero&&this.menuGroup.remove(this.hero),this.hero=ul(t.shape,t.hullColor,t.accentColor),this.hero.scale.setScalar(1.35),this.menuGroup.add(this.hero)}resize(){const e=window.innerWidth,t=window.innerHeight;this.aspect=e/Math.max(1,t),this.renderer.setSize(e,t,!1);const n=We.halfWidth*1.08,i=n/this.aspect;this.camera.left=-n,this.camera.right=n,this.camera.top=We.height/2+i,this.camera.bottom=We.height/2-i,this.camera.updateProjectionMatrix()}showMenu(){this.world.visible=!1,this.menuGroup.visible=!0,this.scene.fog=null,this.simulation&&(this.simulation=null)}showGame(e){this.simulation=e,this.world.visible=!0,this.menuGroup.visible=!1,this.clearEnemyMeshes()}simulation=null;render(e){const t=performance.now()/1e3,n=this.nebula.material;n.uniforms.uTime.value=t,this.planet.rotation.y+=e*.05;for(const i of this.stars){const r=i.geometry.getAttribute("position"),a=r.array,o=Number(i.userData.speed??4)*(this.world.visible?1:.3);for(let l=1;l<a.length;l+=3)a[l]=a[l]-o*e,a[l]<-160&&(a[l]=160);r.needsUpdate=!0}if(this.simulation&&this.world.visible?this.syncGame(this.simulation,e):(this.menuTime+=e,this.hero&&(this.hero.position.set(0,72+Math.sin(this.menuTime*.8)*2.2,0),this.hero.rotation.y=Math.sin(this.menuTime*.5)*.7,this.hero.rotation.z=Math.sin(this.menuTime*.9)*.08),this.menuGroup.position.x=Math.sin(this.menuTime*.25)*3,this.updateParticles(e)),this.shake>0){this.shake=Math.max(0,this.shake-e*3.2);const i=this.shake*.9;this.camera.position.x=(Math.random()-.5)*i,this.camera.position.y=We.height/2+(Math.random()-.5)*i}else this.camera.position.x+=(0-this.camera.position.x)*Math.min(1,e*8),this.camera.position.y+=(We.height/2-this.camera.position.y)*Math.min(1,e*8);this.renderer.render(this.scene,this.camera)}consume(e){for(const t of e)switch(t.type){case"explode":this.burst(t.x,t.y,t.size??5,t.color??"#fbbf24"),this.shake=Math.min(1.4,this.shake+(t.size??4)*.02);break;case"hit":this.burst(t.x,t.y,1.6,t.color??"#fef3c7",4);break;case"death":this.burst(t.x,t.y,14,"#fca5a5",40),this.shake=Math.min(2,this.shake+1.2);break;case"pickup":this.burst(t.x,t.y,3,t.color??"#8ef0c8",8);break;case"arc":t.x2!==void 0&&t.y2!==void 0&&this.burst((t.x+t.x2)/2,(t.y+t.y2)/2,3,"#c4b5fd",6);break;case"boss":this.shake=Math.min(2,this.shake+.8);break;case"phase":this.shake=Math.min(2,this.shake+.9);break;case"beam":this.burst(t.x,t.y,3,t.color??"#fca5a5",5);break}}syncGame(e,t){if(this.playerMesh){this.playerMesh.position.set(e.player.x,e.player.y,0),this.playerMesh.rotation.z=fo.clamp(-e.player.vx*.02,-.45,.45),this.playerMesh.rotation.x=fo.clamp(e.player.vy*.004,-.25,.25);const n=e.player.invuln>0&&Math.floor(performance.now()/90)%2===0;this.playerMesh.visible=!n||e.player.invuln>.9;const i=this.playerMesh.getObjectByName("shield");if(i){i.visible=e.player.shield>0;const r=1+Math.sin(performance.now()/300)*.04;i.scale.setScalar(r)}}this.glow.position.set(e.player.x,e.player.y+4,24),this.syncEnemies(e),this.syncBoss(e),this.syncBullets(e),this.syncPickups(e),this.syncBeams(e),this.syncStation(e),this.syncDrones(e),this.syncAsteroids(e),this.updateParticles(t)}clearEnemyMeshes(){for(const e of this.enemyMeshes.values()){this.world.remove(e);const t=String(e.userData.poolKey??"");if(t){const n=this.enemyPool.get(t)??[];n.push(e),this.enemyPool.set(t,n)}}this.enemyMeshes.clear()}syncEnemies(e){const t=new Set;for(const n of e.enemies){t.add(n.id);let i=this.enemyMeshes.get(n.id);i||(i=this.acquireEnemyMesh(n.spec),this.enemyMeshes.set(n.id,i)),i.position.set(n.x,n.y,0),i.rotation.z=Math.sin(e.time*1.4+n.path)*.2;const r=n.flash>0?1+n.flash*.16:1;i.scale.setScalar(r);for(const a of i.children){const o=a.material;o&&"emissiveIntensity"in o&&(o.emissiveIntensity=n.flash>0?2.2:n.shielded>0?1.1:.3)}}for(const[n,i]of this.enemyMeshes){if(t.has(n))continue;this.world.remove(i);const r=String(i.userData.poolKey??""),a=this.enemyPool.get(r)??[];a.push(i),this.enemyPool.set(r,a),this.enemyMeshes.delete(n)}}acquireEnemyMesh(e){const t=`${e.shape}:${e.color}:${e.accent}`,i=this.enemyPool.get(t)?.pop();if(i)return i.visible=!0,this.world.add(i),i;const r=mg(e.shape,e.color,e.accent,e.behavior);return r.userData.poolKey=t,this.world.add(r),r}syncBoss(e){const t=e.boss;if(!t||!t.alive){this.bossMesh&&(this.bossMesh.visible=!1);return}(!this.bossMesh||this.bossMesh.userData.bossId!==t.spec.id)&&(this.bossMesh&&this.world.remove(this.bossMesh),this.bossMesh=gg(t.spec.shape,t.spec.color,t.spec.accent),this.bossMesh.userData.bossId=t.spec.id,this.world.add(this.bossMesh)),this.bossMesh.visible=!0,this.bossMesh.position.set(t.x,t.y,0),this.bossMesh.rotation.z=Math.sin(e.time*.4)*.04;const n=t.flash;this.bossMesh.traverse(r=>{const o=r.material;o&&"emissiveIntensity"in o&&(o.emissiveIntensity=.35+n*1.6)});const i=this.bossMesh.getObjectByName("parts");i&&i.children.forEach((r,a)=>{const o=t.parts[a];r.visible=!!o?.alive})}syncBullets(e){let t=0,n=0;for(const i of e.bullets)if(this.dummy.makeTranslation(i.x,i.y,0),i.kind==="wave"?this.dummy.scale(new I(2.4,1.2,1)):i.kind==="missile"?this.dummy.scale(new I(.8,1.4,.8)):this.dummy.scale(new I(1,1,1)),i.hostile){if(n>=300)continue;this.hostileBullets.setMatrixAt(n,this.dummy),this.hostileBullets.setColorAt(n,this.tempColor.set(i.color)),n+=1}else{if(t>=260)continue;this.friendlyBullets.setMatrixAt(t,this.dummy),this.friendlyBullets.setColorAt(t,this.tempColor.set(i.color)),t+=1}this.hideRest(this.friendlyBullets,t,260),this.hideRest(this.hostileBullets,n,300)}hideRest(e,t,n){this.dummy.makeScale(0,0,0);for(let i=t;i<n;i+=1)e.setMatrixAt(i,this.dummy);e.instanceMatrix.needsUpdate=!0,e.instanceColor&&(e.instanceColor.needsUpdate=!0)}syncPickups(e){let t=0;for(const n of e.pickups){if(this.dummy.makeRotationY(performance.now()/500+t),this.dummy.setPosition(n.x,n.y,0),this.dummy.scale(new I(1,1,1)),t>=32)break;this.pickups.setMatrixAt(t,this.dummy);const i=n.resource?"#8ef0c8":n.effect==="pierce"?"#e2e8f0":"#fcd34d";this.pickups.setColorAt(t,this.tempColor.set(i)),t+=1}this.hideRest(this.pickups,t,32)}syncBeams(e){let t=0;for(const n of e.beams){const i=this.beamPool[t];if(!i)break;i.visible=!0,i.position.set(n.x,80,6),i.scale.set(n.width,1,1);const r=i.material;r.opacity=n.warm>0?.22+Math.sin(performance.now()/60)*.12:.8,r.color.set(n.warm>0?"#fca5a5":"#fff1f2"),t+=1}for(let n=t;n<this.beamPool.length;n+=1){const i=this.beamPool[n];i&&(i.visible=!1)}}syncStation(e){if(!e.station){this.stationMesh&&(this.stationMesh.visible=!1);return}if(!this.stationMesh){const i=new Vt,r=new me(new Cn(5,5,12,8),qn("#334155","#93c5fd"));r.rotation.x=Math.PI/2,i.add(r);const a=new me(new An(8,.7,8,24),jt("#7dd3fc",1.2));a.name="ring",i.add(a),this.stationMesh=i,this.world.add(i)}this.stationMesh.visible=!0,this.stationMesh.position.set(e.station.x,e.station.y,0);const t=this.stationMesh.getObjectByName("ring");t&&(t.rotation.z+=.01);const n=e.station.hp/e.station.maxHp;this.stationMesh.scale.setScalar(.8+n*.2)}syncDrones(e){for(;this.droneMeshes.length<e.drones.length;){const t=new Vt,n=new me(new Ut(1.1,2.6,5),qn("#cbd5e1","#4de1ff"));n.rotation.x=Math.PI,t.add(n),this.world.add(t),this.droneMeshes.push(t)}this.droneMeshes.forEach((t,n)=>{const i=e.drones[n];if(!i){t.visible=!1;return}t.visible=!0,t.position.set(i.x,i.y,0),t.rotation.y=e.time*2})}syncAsteroids(e){for(;this.asteroidMeshes.length<e.asteroids.length;){const t=new me(new ka(1,0),new wi({color:"#78716c",roughness:.95,metalness:.1}));this.world.add(t),this.asteroidMeshes.push(t)}this.asteroidMeshes.forEach((t,n)=>{const i=e.asteroids[n];if(!i){t.visible=!1;return}t.visible=!0,t.position.set(i.x,i.y,0),t.scale.setScalar(i.r),t.rotation.set(i.spin,i.spin*.6,0)})}burst(e,t,n,i,r){const a=eo[this.quality],o=Math.round(a.particles/8),l=Math.max(3,Math.min(o,r??Math.round(n*.8)));for(let c=0;c<l&&!(this.particles.length>=a.particles);c+=1){const h=Math.random()*Ns,d=3+Math.random()*n*1.6;this.particles.push({x:e,y:t,z:(Math.random()-.5)*6,vx:Math.cos(h)*d,vy:Math.sin(h)*d,vz:(Math.random()-.5)*4,life:.35+Math.random()*.7,maxLife:1,size:.6+Math.random()*Math.min(2.6,n*.14),color:new Pe(i)})}}updateParticles(e){let n=0;for(const i of this.particles){if(i.life-=e,i.life<=0)continue;if(i.x+=i.vx*e,i.y+=i.vy*e,i.z+=i.vz*e,i.vx*=.96,i.vy*=.96,n>=900)break;const r=i.size*Math.max(.05,i.life/i.maxLife);this.dummy.makeScale(r,r,r),this.dummy.setPosition(i.x,i.y,i.z),this.particleMesh.setMatrixAt(n,this.dummy),this.particleMesh.setColorAt(n,i.color),n+=1}this.hideRest(this.particleMesh,n,900),this.particles.splice(0,this.particles.length,...this.particles.filter(i=>i.life>0)),this.particles.length>900&&(this.particles.length=900)}dispose(){this.renderer.dispose(),this.scene.traverse(e=>{const t=e;t.geometry?.dispose();const n=t.material;Array.isArray(n)?n.forEach(i=>i.dispose()):n?.dispose()})}}function ul(s,e,t){const n=new Vt,i=new me(new Ut(2.2,8,6),qn(e,t));i.rotation.x=Math.PI,i.position.y=1.2,n.add(i);const r=new me(new Nt(1.15,12,10),jt(t,1.4,.1));r.position.set(0,1.4,.6),r.scale.set(1,.8,.7),n.add(r);const a={falcon:{span:6.4,sweep:.5,count:2,height:.4},viper:{span:5.2,sweep:.9,count:2,height:.3},titan:{span:8.6,sweep:.2,count:2,height:.9},spear:{span:4.4,sweep:1.2,count:2,height:.25},phantom:{span:7.2,sweep:.85,count:2,height:.3},phoenix:{span:7.4,sweep:.35,count:2,height:.6},sentinel:{span:6.8,sweep:.1,count:2,height:1.1},tempest:{span:6.6,sweep:.7,count:2,height:.4},eclipse:{span:7.8,sweep:.95,count:2,height:.35},prime:{span:8.2,sweep:.45,count:2,height:.7}},o=a[s]??a.falcon;for(const d of[-1,1]){const f=new me(new wt(o.span/2,o.height+.5,2.2),qn(e,t));f.position.set(d*o.span/4,-.5,0),f.rotation.z=d*o.sweep*.22,n.add(f);const m=new me(new es(.35,o.span/3,3,6),jt(t,1.3));m.rotation.z=Math.PI/2,m.position.set(d*o.span/2.2,-.9,0),n.add(m)}if(o.count>2){const d=new me(new wt(.5,4,1.4),qn(e,t));d.position.set(0,2.4,-.6),n.add(d)}const l=new me(new Cn(1.1,1.4,1.6,8),jt("#ffffff",2.2,.1));l.position.set(0,-3.4,0),n.add(l);const c=new me(new Ut(.9,3.4,8),new Ws({color:t,transparent:!0,opacity:.75,blending:Xi}));c.rotation.x=0,c.position.set(0,-5.4,0),n.add(c);const h=new me(new Nt(6.6,20,14),new wi({color:t,emissive:t,emissiveIntensity:.9,transparent:!0,opacity:.16,side:Yt,depthWrite:!1}));return h.name="shield",n.add(h),n}function mg(s,e,t,n){const i=new Vt,r=qn(e,t),a=jt(t,1.2);switch(s){case"dart":{const o=new me(new Ut(1.7,6,5),r);o.rotation.x=Math.PI,i.add(o);const l=new me(new wt(4.6,.4,1.2),r);l.position.y=-.8,i.add(l);break}case"wedge":{const o=new me(new Ut(2.4,5,3),r);o.rotation.x=Math.PI,i.add(o);const l=new me(new Nt(.7,8,6),a);l.position.set(0,-.6,1.2),i.add(l);break}case"hex":{const o=new me(new Cn(2.2,2.2,3.2,6),r);o.rotation.x=Math.PI/2,i.add(o);const l=new me(new An(2.6,.28,6,18),a);i.add(l);break}case"orb":{const o=new me(new Nt(2.4,12,10),r);i.add(o);const l=new me(new An(2.7,.24,6,20),a);l.rotation.x=Math.PI/2.4,i.add(l);break}case"cruiser":{const o=new me(new wt(5.2,7.5,3),r);i.add(o);const l=new me(new Ut(2.4,3.2,5),r);l.position.y=-5,l.rotation.x=Math.PI,i.add(l);for(const c of[-1,1]){const h=new me(new Cn(.9,.9,3.4,6),a);h.rotation.z=Math.PI/2,h.position.set(c*3.6,1.2,0),i.add(h)}break}case"organic":{const o=new me(new za(2.8,0),r);o.scale.set(1,.8,1),i.add(o);for(const l of[-1,1]){const c=new me(new Ut(.7,3.4,4),a);c.position.set(l*2.6,-.6,0),c.rotation.z=l*.8,i.add(c)}break}case"ring":{const o=new me(new An(2.6,.8,8,20),a);i.add(o);const l=new me(new Nt(1.4,10,8),r);i.add(l);break}default:{const o=new me(new Ut(2,5,5),r);o.rotation.x=Math.PI,i.add(o)}}if(n==="shield"){const o=new me(new Nt(4.4,16,12),new wi({color:t,emissive:t,emissiveIntensity:.7,transparent:!0,opacity:.16,depthWrite:!1}));i.add(o)}return i}function gg(s,e,t){const n=new Vt,i=qn(e,t),r=jt(t,1.4);switch(s){case"serpent":{for(let l=0;l<6;l+=1){const c=new me(new Nt(7-l*.6,14,10),i);c.position.set(Math.sin(l*.9)*6,l*3-8,0),n.add(c)}const o=new me(new Ut(7,14,6),r);o.rotation.x=Math.PI,o.position.y=-14,n.add(o);break}case"crystal":{for(let l=0;l<8;l+=1){const c=new me(new Xs(6.5,0),l%2===0?i:r),h=l/8*Ns;c.position.set(Math.cos(h)*11,Math.sin(h)*7,0),c.rotation.z=h,n.add(c)}const o=new me(new Nt(6,16,12),r);n.add(o);break}case"carrier":case"ark":n.add(new me(new wt(34,12,8),i)),n.add(new me(new wt(14,7,6),r));for(const o of[-1,1]){const l=new me(new wt(8,18,5),i);l.position.set(o*18,-2,0),n.add(l)}break;case"leviathan":case"harbinger":{const o=new me(new es(9,22,6,14),i);o.rotation.z=Math.PI/2,n.add(o);for(const l of[-1,1]){const c=new me(new An(13,1.1,8,30),r);c.position.set(l*7,0,0),c.rotation.y=Math.PI/2,n.add(c)}break}case"volt":case"fortress":{n.add(new me(new wt(30,20,10),i));for(let o=0;o<4;o+=1){const l=new me(new wt(32-o*3,2.2,11),r);l.position.y=-8+o*5,n.add(l)}break}case"devourer":{const o=new me(new Nt(15,20,16),i);n.add(o);for(let c=0;c<10;c+=1){const h=new me(new Ut(2.6,13,4),r),d=c/10*Ns;h.position.set(Math.cos(d)*16,Math.sin(d)*12,0),h.rotation.z=d-Math.PI/2,n.add(h)}const l=new me(new An(24,1.2,8,44),r);l.name="halo",n.add(l);break}default:{n.add(new me(new wt(36,16,9),i));const o=new me(new Ut(8,16,6),r);o.rotation.x=Math.PI,n.add(o)}}const a=new Vt;a.name="parts";for(let o=0;o<10;o+=1){const l=new me(new Cn(2.2,2.6,4.4,6),jt(t,1.6)),c=o/10*Ns;l.position.set(Math.cos(c)*15,Math.sin(c)*9,4),l.rotation.x=Math.PI/2,a.add(l)}return n.add(a),n}function Qt(s){return[0,1,2,3,4].map(e=>({damage:Number((s.damage*(1+e*.27)).toFixed(2)),cooldown:Number((s.cooldown*(1-e*.075)).toFixed(3)),shots:s.shots+Math.floor(e*s.shotGrowth),spread:Number((s.spread+e*s.spreadGrowth).toFixed(1)),speed:Number((s.speed*(1+e*.04)).toFixed(1)),radius:Number((s.radius*(1+e*.05)).toFixed(2)),pierce:(s.pierce??0)+(e>=3?1:0)}))}const Xa=[{id:"pulse",name:"Pulse Cannon",kind:"pulse",blurb:"The reliable one. Single bolts that grow into a three-stream volley.",color:"#4de1ff",levels:Qt({damage:3.4,cooldown:.115,shots:1,shotGrowth:.6,spread:0,spreadGrowth:1.4,speed:150,radius:.9})},{id:"spread",name:"Plasma Spread",kind:"spread",blurb:"A widening fan of superheated gas. Excellent against formations.",color:"#c084fc",levels:Qt({damage:2.7,cooldown:.26,shots:3,shotGrowth:.8,spread:20,spreadGrowth:5,speed:128,radius:1.05})},{id:"beam",name:"Laser Beam",kind:"beam",blurb:"A tightly focused line of light with almost no gap between pulses.",color:"#a5f3fc",levels:Qt({damage:1.55,cooldown:.05,shots:1,shotGrowth:.3,spread:0,spreadGrowth:.6,speed:220,radius:.62})},{id:"ion",name:"Ion Cannon",kind:"ion",blurb:"Heavy charged rounds that punch straight through the first hull.",color:"#67e8f9",levels:Qt({damage:7.6,cooldown:.27,shots:1,shotGrowth:.4,spread:0,spreadGrowth:1.2,speed:145,radius:1.15,pierce:2})},{id:"photon",name:"Photon Blaster",kind:"photon",blurb:"Fast, bright and forgiving. Trades punch for volume.",color:"#fde68a",levels:Qt({damage:4.1,cooldown:.09,shots:1,shotGrowth:.5,spread:0,spreadGrowth:1.6,speed:195,radius:.85})},{id:"rail",name:"Railgun",kind:"rail",blurb:"One shot, one line. Slow to cycle and worth every second.",color:"#f8fafc",levels:Qt({damage:17,cooldown:.62,shots:1,shotGrowth:.35,spread:0,spreadGrowth:1,speed:265,radius:1.25,pierce:4})},{id:"arc",name:"Arc Lightning",kind:"arc",special:"chain",blurb:"Each hit forks into the nearest ship. Designed for crowded lanes.",color:"#c4b5fd",levels:Qt({damage:5.1,cooldown:.23,shots:1,shotGrowth:.4,spread:0,spreadGrowth:1.4,speed:175,radius:1.05})},{id:"particle",name:"Particle Cannon",kind:"particle",blurb:"A stream of tiny rounds. Weak alone, relentless together.",color:"#8ef0c8",levels:Qt({damage:1.1,cooldown:.038,shots:1,shotGrowth:.5,spread:0,spreadGrowth:1.2,speed:205,radius:.5})},{id:"fusion",name:"Fusion Blaster",kind:"fusion",special:"aoe",blurb:"Slow orbs that detonate and take the neighbours with them.",color:"#fb923c",levels:Qt({damage:9.2,cooldown:.4,shots:1,shotGrowth:.4,spread:0,spreadGrowth:1.5,speed:118,radius:1.65})},{id:"wave",name:"Wave Cannon",kind:"wave",special:"wave",blurb:"Expanding crescents that sweep entire rows out of the sky.",color:"#f472b6",levels:Qt({damage:6.3,cooldown:.36,shots:1,shotGrowth:.35,spread:0,spreadGrowth:.8,speed:100,radius:2.15,pierce:2})}],_g=new Map(Xa.map(s=>[s.id,s]));function dl(s){return _g.get(s)??Xa[0]}function vg(s,e){const t=Math.max(0,Math.min(4,Math.round(e)-1));return s.levels[t]}const $a=[{id:"missiles",name:"Homing Missiles",blurb:"Two seekers that never miss.",charges:4,cooldown:.7,damage:14,radius:9,color:"#fdba74"},{id:"torpedo",name:"Torpedo Salvo",blurb:"A heavy spread of dumb rockets.",charges:3,cooldown:1.1,damage:22,radius:12,color:"#fca5a5"},{id:"emp",name:"EMP Burst",blurb:"Stuns everything on screen.",charges:2,cooldown:1.4,damage:9,radius:60,color:"#a5f3fc"},{id:"mine",name:"Plasma Mines",blurb:"Drops a field of waiting explosions.",charges:3,cooldown:1,damage:18,radius:14,color:"#fcd34d"},{id:"orbital",name:"Orbital Strike",blurb:"Calls down a column of fire.",charges:2,cooldown:1.6,damage:30,radius:20,color:"#f0abfc"}],xg=new Map($a.map(s=>[s.id,s]));function Ar(s){return xg.get(s)??$a[0]}const Mt=(s,e,t)=>s<e?e:s>t?t:s,Bn=Math.PI*2;function yg(s,e){return s>=e.starScore[2]?3:s>=e.starScore[1]?2:s>=e.starScore[0]?1:0}class bg{mission;ship;mods;primary;secondary;rng;phase="active";time=0;score=0;kills=0;eliteKills=0;priorityKilled=0;priorityEscaped=0;resources=0;credits=0;combo=0;damageTaken=0;shotsFired=0;shotsHit=0;player={x:0,y:30,targetX:0,targetY:30,vx:0,vy:0,hull:100,maxHull:100,shield:60,maxShield:60,invuln:1.2,fireTimer:0,secondaryTimer:0,secondaryCharges:4,abilityCooldown:0,jam:0,lives:Qa.lives};weaponId;weaponLevel;bullets=[];enemies=[];pickups=[];asteroids=[];beams=[];boss=null;station=null;drones=[];effects=new Map;charges={bombs:1,barrage:0};events=[];nextId=1;nextWave=0;bossSpawned=!1;bossDefeated=!1;comboTimer=0;missileTimer=0;resourceTimer=3;asteroidTimer=2;shieldRegenDelay=0;constructor(e){this.mission=e.mission,this.ship=Ta(e.shipId),this.mods=e.mods??{},this.primary=e.mods?.basicWeapon?"pulse":e.primary,this.secondary=e.secondary,this.weaponId=this.primary,this.weaponLevel=Mt(e.primaryLevel??1,1,5),this.rng=Ma(vi(`sim:${e.mission.id}:${e.mission.seed}`)),this.resetPlayer(!0)}resetPlayer(e){const t=this.ship,n=this.mods.noShields?0:1;this.player.maxHull=t.hull,this.player.hull=t.hull,this.player.maxShield=Math.round(t.shield*n),this.player.shield=this.player.maxShield,this.player.x=0,this.player.y=32,this.player.targetX=0,this.player.targetY=32,this.player.vx=0,this.player.vy=0,this.player.invuln=e?1.4:Qa.respawnInvuln,this.player.jam=0,this.player.fireTimer=.2,this.player.abilityCooldown=0,this.player.secondaryCharges=Ar(this.secondary).charges,this.drones=[];const i=Math.min(cn.drones,t.drones+(this.mods.drones??0));for(let r=0;r<i;r+=1)this.drones.push({x:0,y:26,fireTimer:.4,offset:r===0?-7:7});e||(this.player.lives=Math.max(0,this.player.lives-1))}setTarget(e,t){this.player.targetX=Mt(e,-47,We.halfWidth-3),this.player.targetY=Mt(t,We.playerMinY,We.playerMaxY)}grantVictory(){this.phase==="active"&&this.complete()}grantPowerup(e){this.applyPowerup(e)}step(e=Rr){if(this.phase!=="active")return;const t=this.mods.speed??1,n=e*t;this.time+=n,this.tickEffects(n),this.updatePlayer(n),this.spawnWaves(),this.updateEnemies(n),this.updateBoss(n),this.updateAsteroids(n),this.updateBullets(n),this.updateBeams(n),this.updatePickups(n),this.updateStation(n),this.shieldRegenDelay=Math.max(0,this.shieldRegenDelay-n),this.regen(n),this.checkObjective(),this.cleanup()}tickEffects(e){for(const[t,n]of this.effects){const i=n-e;i<=0?this.effects.delete(t):this.effects.set(t,i)}this.comboTimer=Math.max(0,this.comboTimer-e),this.comboTimer===0&&(this.combo=0),this.player.secondaryTimer=Math.max(0,this.player.secondaryTimer-e),this.player.abilityCooldown=Math.max(0,this.player.abilityCooldown-e),this.player.jam=Math.max(0,this.player.jam-e),this.charges.barrage>0&&(this.charges.barrage-=e,this.missileTimer-=e,this.missileTimer<=0&&(this.missileTimer=.12,this.fireMissiles(2)))}active(e){return(this.effects.get(e)??0)>0}regen(e){this.player.shield<this.player.maxShield&&this.shieldRegenDelay<=0&&(this.player.shield=Math.min(this.player.maxShield,this.player.shield+this.ship.shieldRegen*e)),this.active("repairDrone")&&(this.player.hull=Math.min(this.player.maxHull,this.player.hull+2.5*e))}updatePlayer(e){const t=this.player,n=this.ship.speed*(this.active("speedBoost")?1.35:1)*(this.mods.speed??1)*.85,i=this.ship.accel*(this.active("speedBoost")?1.3:1),r=t.targetX-t.x,a=t.targetY-t.y;t.vx=Mt(t.vx+Mt(r*9,-i,i)*e,-n*2.4,n*2.4),t.vy=Mt(t.vy+Mt(a*9,-i,i)*e,-n*2.4,n*2.4);const o=Math.max(0,1-7*e);t.vx*=o,t.vy*=o,t.x=Mt(t.x+t.vx*e,-47,We.halfWidth-3),t.y=Mt(t.y+t.vy*e,We.playerMinY,We.playerMaxY),t.invuln=Math.max(0,t.invuln-e),this.mission.hazards.includes("gravity")&&t.y>50&&!this.active("invuln")&&(t.vy-=1.6*e);for(const l of this.enemies)l.spec.behavior==="gravity"&&l.y<150&&Math.abs(l.x-t.x)<26&&(t.vx+=Math.sign(l.x-t.x)*6*e);t.fireTimer-=e,t.fireTimer<=0&&t.jam<=0&&this.fireWeapon(),this.fireDrones(e),this.missileTimer-=e,this.active("missiles")&&this.missileTimer<=0&&(this.missileTimer=1.1,this.fireMissiles(2))}fireDrones(e){const t=this.active("droneUpgrade")?.32:.55;for(const n of this.drones)n.x=this.player.x+n.offset,n.y=this.player.y+6,n.fireTimer-=e,n.fireTimer<=0&&(n.fireTimer=t,this.spawnBullet(n.x,n.y+2,0,150,1.6,"#93c5fd",!1,{r:.55}))}fireWeapon(){if(this.mods.missileOnly){this.player.fireTimer=.5,this.fireMissiles(1);return}const e=dl(this.weaponId),t=vg(e,this.weaponLevel),n=this.ship.damage*(this.active("overdrive")?1.6:1)*(this.active("damageBoost")?1.3:1)*(this.active("laserUp")&&e.id==="beam"?1.3:1),i=t.shots+(this.active("double")?1:0)+(this.active("triple")?1:0),r=t.spread+(this.active("spread")?9:0),a=t.cooldown*(this.active("rapid")?.6:1)*(this.active("overdrive")?.65:1)/this.ship.fireRate;this.player.fireTimer=Math.max(.028,a),this.shotsFired+=i;for(let o=0;o<i;o+=1){const c=(i===1?0:o/(i-1)-.5)*r*Math.PI/180,h=3.4;this.spawnBullet(this.player.x+Math.sin(c)*h,this.player.y+Math.cos(c)*h,Math.sin(c)*t.speed,Math.cos(c)*t.speed,t.damage*n,e.color,!1,{r:t.radius,pierce:t.pierce+(this.active("pierce")?2:0),kind:e.kind==="wave"?"wave":e.kind==="spread"||e.kind==="fusion"?"orb":"bolt",explosive:(e.special==="aoe"?7:0)+(this.active("explosive")?6:0),chain:e.special==="chain"||this.active("chain")})}this.events.push({type:"shot",x:this.player.x,y:this.player.y+4,color:e.color})}spawnBullet(e,t,n,i,r,a,o,l={}){const c=o?cn.enemyBullets:cn.playerBullets;this.bullets.length>=c||this.bullets.push({id:this.nextId++,x:e,y:t,vx:n,vy:i,r:.9,damage:r,hostile:o,life:3,pierce:0,color:a,kind:"bolt",chain:!1,explosive:0,crit:!1,trail:!o,...l})}fireMissiles(e){for(let t=0;t<e;t+=1){const n=this.nearestEnemy(this.player.x+(t-e/2)*5,this.player.y),i=n?Math.atan2(n.y-this.player.y,n.x-this.player.x):Math.PI/2;this.spawnBullet(this.player.x+(t-e/2)*2,this.player.y,Math.cos(i)*70,Math.sin(i)*70+30,9*this.ship.damage,"#fdba74",!1,{kind:"missile",r:1.1,trail:!0,explosive:5,life:4})}}spawnWaves(){for(;this.nextWave<this.mission.waves.length;){const e=this.mission.waves[this.nextWave];if(!e||this.time<e.at)break;this.nextWave+=1;for(const t of e.entries){const n=this.formation(t.formation,t.count,t.x);for(const i of n){if(this.enemies.length>=cn.enemies)break;this.spawnEnemy(t.archetype,i.x,We.spawnY+i.y,!!t.priority)}}}}formation(e,t,n){const r=[];for(let a=0;a<t;a+=1){const o=a-(t-1)/2;switch(e){case"v":r.push({x:n+o*9,y:-Math.abs(o)*6});break;case"line":r.push({x:n+o*9,y:0});break;case"diamond":{const l=Math.abs(o)>1?1:0;r.push({x:n+o*9*.8,y:l*8});break}case"wedge":r.push({x:n+o*9*.7,y:Math.abs(o)*5});break;case"spiral":{const l=a/t*Bn;r.push({x:n+Math.cos(l)*9*1.4,y:Math.sin(l)*7});break}case"pincer":r.push({x:n+Math.sign(o||1)*(9+Math.abs(o)*2),y:a%2*6});break;case"swarm":r.push({x:n+(this.rng()-.5)*9*t,y:(this.rng()-.5)*12});break;case"stagger":r.push({x:n+o*9,y:a%2*7});break;case"escort":r.push({x:n+o*9*1.3,y:Math.abs(o)*4});break;default:r.push({x:n+o*9,y:0})}}return r.map(a=>({x:Mt(a.x,-45,We.halfWidth-5),y:a.y}))}spawnEnemy(e,t,n,i){const r=Xn(e),a=1+this.mission.difficulty*.09;this.enemies.push({id:this.nextId++,spec:r,x:t,y:n,vx:0,vy:0,baseX:t,hp:r.hull*a,maxHp:r.hull*a,r:r.radius,fireTimer:.6+this.rng()*r.fireCooldown,path:this.rng()*Bn,stun:0,priority:i,shielded:0,flash:0,drift:(this.rng()-.5)*14})}updateEnemies(e){const n=(this.active("timeSlow")?.45:1)*(this.mods.speed??1);for(const i of this.enemies){const r=i.spec;if(i.flash=Math.max(0,i.flash-e*3),i.path+=e*1.6,i.stun>0){i.stun-=e,i.y-=r.speed*.18*e;continue}const a=r.speed*n,o=Math.sign(this.player.x-i.x);switch(r.behavior){case"advance":i.y-=a*e,i.x+=Math.sin(i.path*.7)*5*e+i.drift*e*.2;break;case"sine":i.y-=a*e,i.x=Mt(i.baseX+Math.sin(i.path)*11,-46,We.halfWidth-4);break;case"dive":i.vy=Math.min(70,(i.vy||a*.4)+60*e),i.y-=i.vy*e,i.x+=o*16*e;break;case"strafe":case"ace":i.y=Math.max(112,i.y-a*e),i.x+=Math.sin(i.path*1.4)*a*.7*e;break;case"hover":case"artillery":i.y=Math.max(128,i.y-a*e),i.x=Mt(i.baseX+Math.sin(i.path*.8)*8,-46,We.halfWidth-4);break;case"turret":case"sniper":case"shield":case"repair":case"carrier":i.y=Math.max(132,i.y-a*.8*e),i.x=i.baseX+Math.sin(i.path*.5)*6;break;case"kamikaze":{const l=this.player.x-i.x,c=this.player.y-i.y,h=Math.max(1,Math.hypot(l,c));i.x+=l/h*a*e,i.y+=c/h*a*e;break}case"minelayer":i.y-=a*.5*e,i.x+=Math.sin(i.path*.45)*9*e;break;case"teleport":i.y-=a*.6*e,Math.floor(i.path)%5===0&&(i.x=Mt(i.baseX+Math.sin(i.path*3)*20,-46,We.halfWidth-4));break;case"leech":{const l=this.player.x-i.x,c=this.player.y-i.y,h=Math.max(1,Math.hypot(l,c));i.x+=l/h*a*.7*e,i.y+=c/h*a*.7*e;break}case"emp":case"gravity":i.y=Math.max(140,i.y-a*.6*e),i.x=i.baseX;break}i.x=Mt(i.x,-47,We.halfWidth-3),i.fireTimer-=e,i.fireTimer<=0&&i.y<We.height+4&&i.y>16&&(this.enemyFire(i),i.fireTimer=r.fireCooldown*(.85+this.rng()*.3)),i.shielded>0&&(i.shielded-=e),i.y<We.despawnY&&(i.priority&&(this.priorityEscaped+=1),i.hp=0)}this.enemies=this.enemies.filter(i=>i.hp>0&&i.y>We.despawnY)}enemyFire(e){const t=e.spec,n=t.bulletDamage*(1+this.mission.difficulty*.05),i=Math.atan2(this.player.y-e.y,this.player.x-e.x);switch(t.behavior){case"sniper":this.spawnBullet(e.x,e.y,Math.cos(i)*96,Math.sin(i)*96,n*1.4,"#fbcfe8",!0,{kind:"orb",r:1.2,life:2.4});break;case"artillery":this.spawnBullet(e.x,e.y,Math.cos(i)*40,Math.sin(i)*40,n*1.5,"#fb923c",!0,{kind:"orb",r:2.2,life:5});break;case"turret":for(let r=-1;r<=1;r+=1){const a=i+r*.18;this.spawnBullet(e.x,e.y,Math.cos(a)*62,Math.sin(a)*62,n*.8,"#fca5a5",!0)}break;case"minelayer":this.spawnBullet(e.x,e.y-4,0,-8,n,"#fcd34d",!0,{kind:"mine",r:2.6,life:9});break;case"carrier":{this.enemies.length<cn.enemies-2&&(this.spawnEnemy("scout",e.x+6,e.y-6,!1),this.spawnEnemy("scout",e.x-6,e.y-6,!1));break}case"shield":{for(const r of this.enemies)r!==e&&Math.hypot(r.x-e.x,r.y-e.y)<26&&(r.shielded=3);break}case"repair":{for(const r of this.enemies)r!==e&&r.hp<r.maxHp&&Math.hypot(r.x-e.x,r.y-e.y)<26&&(r.hp=Math.min(r.maxHp,r.hp+r.maxHp*.25));break}case"emp":this.player.jam=Math.max(this.player.jam,1.5),this.events.push({type:"beam",x:e.x,y:e.y,color:"#c4b5fd"});break;case"gravity":this.player.vx+=Math.sign(e.x-this.player.x)*12;break;case"ace":for(let r=0;r<3;r+=1){const a=i+(r-1)*.14;this.spawnBullet(e.x,e.y,Math.cos(a)*78,Math.sin(a)*78,n,"#f9a8d4",!0,{kind:"bolt"})}break;case"kamikaze":break;default:this.spawnBullet(e.x,e.y-e.r,Math.cos(i)*58,Math.sin(i)*58,n,t.accent,!0,{r:.9})}}spawnBoss(){if(this.bossSpawned||!this.mission.boss)return;const e=gc(this.mission.boss);if(!e)return;this.bossSpawned=!0;const t=[];for(let i=0;i<e.turrets;i+=1){const r=i/e.turrets*Bn;t.push({x:Math.cos(r)*e.radius*.9,y:Math.sin(r)*e.radius*.55,hp:e.turretHp,maxHp:e.turretHp,fireTimer:1+i*.2,alive:!0})}const n=this.mods.eliteFleet?1.2:1;this.boss={spec:e,x:0,y:We.height+40,hp:e.hp*n,maxHp:e.hp*n,phase:0,fireTimer:2.2,patternIndex:0,parts:t,flash:0,spiral:0,direction:1,entering:!0,blink:0,alive:!0},this.events.push({type:"boss",x:0,y:140,size:e.radius})}updateBoss(e){if(this.mission.boss&&!this.bossSpawned){const r=this.mission.waves[this.mission.waves.length-1];this.time>(r?r.at+8:8)&&this.spawnBoss()}const t=this.boss;if(!t||!t.alive)return;if(t.flash=Math.max(0,t.flash-e*2.4),t.blink=Math.max(0,t.blink-e),t.entering){t.y-=34*e,t.y<=142&&(t.y=142,t.entering=!1);return}t.x=Math.sin(this.time*.55)*24;const n=t.hp/t.maxHp>.66?0:t.hp/t.maxHp>.33?1:2;n!==t.phase&&(t.phase=n,t.fireTimer=1.4,this.enemies=this.enemies.filter(r=>r.y>20),this.bullets=this.bullets.filter(r=>!r.hostile),this.events.push({type:"phase",x:t.x,y:t.y}));const i=t.spec.phases[Math.min(t.phase,t.spec.phases.length-1)];if(t.fireTimer-=e,t.fireTimer<=0){const r=i.patterns[t.patternIndex%i.patterns.length];t.patternIndex+=1,this.bossPattern(t,r,i.bulletSpeed),t.fireTimer=i.fireCooldown*(.9+this.rng()*.2)}for(const r of t.parts)if(r.alive&&(r.fireTimer-=e,r.fireTimer<=0)){r.fireTimer=2.2+this.rng()*.6;const a=t.x+r.x,o=t.y+r.y,l=Math.atan2(this.player.y-o,this.player.x-a);this.spawnBullet(a,o,Math.cos(l)*54,Math.sin(l)*54,8,t.spec.accent,!0,{r:1.1})}}bossPattern(e,t,n){const i=Math.atan2(this.player.y-e.y,this.player.x-e.x);switch(t){case"radial":{for(let a=0;a<14;a+=1){const o=a/14*Bn+this.rng()*.1;this.spawnBullet(e.x,e.y,Math.cos(o)*n*.7,Math.sin(o)*n*.7,9,e.spec.accent,!0,{kind:"orb",r:1.3})}break}case"aimed":for(let r=-2;r<=2;r+=1){const a=i+r*.11;this.spawnBullet(e.x,e.y-4,Math.cos(a)*n,Math.sin(a)*n,9,e.spec.accent,!0,{r:1.1})}break;case"sweep":for(let r=0;r<6;r+=1){const a=Math.PI/2+(r-2.5)*.16;this.spawnBullet(e.x,e.y-6,Math.cos(a)*n*.9,Math.sin(a)*n*.9,8,"#fca5a5",!0,{r:1.2})}break;case"spiral":e.spiral+=.5;for(let r=0;r<4;r+=1){const a=e.spiral+r*Bn/4;this.spawnBullet(e.x,e.y,Math.cos(a)*n*.75,Math.sin(a)*n*.75,8,e.spec.accent,!0,{kind:"orb",r:1.2})}break;case"minions":this.enemies.length<cn.enemies-3&&(this.spawnEnemy("scout",e.x-10,e.y-6,!1),this.spawnEnemy("interceptor",e.x+10,e.y-6,!1));break;case"mines":for(let r=0;r<4;r+=1)this.spawnBullet(e.x+(r-1.5)*8,e.y-4,0,-10,10,"#fcd34d",!0,{kind:"mine",r:2.4,life:10});break;case"burst":for(let r=0;r<5;r+=1){const a=i+(this.rng()-.5)*.5,o=r*.12;this.spawnBullet(e.x,e.y,Math.cos(a)*n,Math.sin(a)*n,7,"#fda4af",!0,{life:2+o,r:1.1})}break;case"laser":{const r=this.player.x>0?-12:12;this.beams.push({x:this.player.x,width:7,warm:.95,life:.5,damage:18,hostile:!0}),this.beams.push({x:Mt(this.player.x+r,-40,40),width:6,warm:1.2,life:.45,damage:14,hostile:!0}),this.events.push({type:"beam",x:this.player.x,y:e.y});break}}}damageBoss(e){const t=this.boss;if(!t||!t.alive)return;const i=t.parts.filter(a=>a.alive).length>0?.35:1;t.hp-=e*i,t.flash=1;const r=Math.max(0,Math.ceil(t.parts.length*Math.max(0,t.hp/t.maxHp)));if(t.parts.forEach((a,o)=>{a.alive=o<r}),t.hp<=0){t.hp=0,t.alive=!1,this.bossDefeated=!0,this.boss=t,this.award(2e3+t.spec.reward),this.credits+=t.spec.reward;for(let a=0;a<8;a+=1)this.events.push({type:"explode",x:t.x+(this.rng()-.5)*t.spec.radius*2,y:t.y+(this.rng()-.5)*t.spec.radius,size:8+this.rng()*10,color:t.spec.accent});this.bullets=this.bullets.filter(a=>!a.hostile),this.effects.set("invuln",Math.max(this.effects.get("invuln")??0,1.5))}}updateAsteroids(e){if(this.mission.hazards.includes("asteroid")&&(this.asteroidTimer-=e,this.asteroidTimer<=0&&this.asteroids.length<10)){this.asteroidTimer=1.4+this.rng()*1.2;const t=3+this.rng()*4.5;this.asteroids.push({id:this.nextId++,x:(this.rng()-.5)*(We.width-12),y:We.height+6,vx:(this.rng()-.5)*10,vy:-(16+this.rng()*22),r:t,hp:t*12,spin:this.rng()*Bn})}for(const t of this.asteroids){if(t.x+=t.vx*e,t.y+=t.vy*e,t.spin+=e,t.hp<=0){this.events.push({type:"explode",x:t.x,y:t.y,size:t.r*2,color:"#a8a29e"}),this.asteroids=this.asteroids.filter(n=>n!==t);continue}Math.hypot(t.x-this.player.x,t.y-this.player.y)<t.r+3.2&&(this.hurtPlayer(14+t.r*2.4),t.hp=0),this.station&&Math.hypot(t.x-this.station.x,t.y-this.station.y)<t.r+6&&(this.station.hp-=10,t.hp=0)}this.asteroids=this.asteroids.filter(t=>t.y>We.despawnY-10&&t.hp>0)}updateBullets(e){for(const t of this.bullets){if(t.kind==="missile"){const r=this.nearestEnemy(t.x,t.y);if(r){const a=Math.atan2(r.y-t.y,r.x-t.x);t.vx+=Math.cos(a)*260*e,t.vy+=Math.sin(a)*260*e;const o=Math.hypot(t.vx,t.vy),l=130;o>l&&(t.vx=t.vx/o*l,t.vy=t.vy/o*l)}}if(t.x+=t.vx*e,t.y+=t.vy*e,t.life-=e,t.hostile){if(this.station&&Math.hypot(t.x-this.station.x,t.y-this.station.y)<8){this.station.hp-=t.damage,t.life=0;continue}if(Math.hypot(t.x-this.player.x,t.y-this.player.y)<t.r+2.4){if(this.active("reflect")){t.hostile=!1,t.vx*=-.6,t.vy=Math.abs(t.vy)*.8+40,t.damage*=2,t.color="#fef3c7",this.events.push({type:"hit",x:t.x,y:t.y});continue}this.hurtPlayer(t.damage),t.life=0;continue}continue}for(const r of this.asteroids)if(!(r.hp<=0)&&Math.hypot(t.x-r.x,t.y-r.y)<t.r+r.r){r.hp-=t.damage,r.hp<=0&&this.award(30),this.damageSplash(t),t.life=0;break}if(t.life<=0)continue;let n=!1;for(const r of this.enemies)if(!(r.hp<=0)&&Math.hypot(t.x-r.x,t.y-r.y)<t.r+r.r){if(this.hitEnemy(r,t),n=!0,t.pierce>0){t.pierce-=1;continue}t.life=0;break}if(n)continue;const i=this.boss;i&&i.alive&&!i.entering&&Math.abs(t.x-i.x)<i.spec.radius&&Math.abs(t.y-i.y)<i.spec.radius*.7&&(this.damageBoss(t.damage),this.damageSplash(t),this.shotsHit+=1,t.pierce>0?t.pierce-=1:t.life=0,this.events.push({type:"hit",x:t.x,y:t.y}))}this.bullets=this.bullets.filter(t=>t.life>0&&Math.abs(t.x)<We.halfWidth+14&&t.y>-20&&t.y<We.height+24)}damageSplash(e){if(!(e.explosive<=0)){for(const t of this.enemies)t.hp>0&&Math.hypot(t.x-e.x,t.y-e.y)<e.explosive+3&&(t.hp-=e.damage*.5,t.flash=1,t.hp<=0&&this.killEnemy(t));this.boss&&this.boss.alive&&this.damageBoss(e.damage*.25),this.events.push({type:"explode",x:e.x,y:e.y,size:e.explosive,color:"#fdba74"})}}hitEnemy(e,t){this.shotsHit+=1;const n=e.shielded>0?.45:1,i=this.active("critBoost")?this.rng()<.45:this.rng()<.06,r=t.damage*n*(i?2:1);if(e.hp-=r,e.flash=1,this.events.push({type:"hit",x:t.x,y:t.y,color:i?"#fef08a":t.color}),t.chain){const a=this.enemies.filter(o=>o!==e&&o.hp>0).sort((o,l)=>Math.hypot(o.x-e.x,o.y-e.y)-Math.hypot(l.x-e.x,l.y-e.y))[0];a&&Math.hypot(a.x-e.x,a.y-e.y)<26&&(a.hp-=r*.45,a.flash=1,this.events.push({type:"arc",x:e.x,y:e.y,x2:a.x,y2:a.y}),a.hp<=0&&this.killEnemy(a))}t.explosive>0&&this.damageSplash(t),e.hp<=0&&this.killEnemy(e)}killEnemy(e){if(e.hp<=-1||(e.hp<=0&&e.y>We.despawnY&&this.events.push({type:"explode",x:e.x,y:e.y,size:e.r*1.8,color:e.spec.accent}),e.hp=-1,this.kills+=1,(e.spec.behavior==="ace"||e.spec.id==="miniboss")&&(this.eliteKills+=1),e.priority&&(this.priorityKilled+=1),this.combo+=1,this.comboTimer=2.6,this.award(e.spec.score),this.credits+=Math.round(e.spec.score/8),this.mods.noPowerups)||this.mission.allowedPowerUps.length===0)return;const t=.16+this.mission.difficulty*.004;if(this.rng()<t){const n=this.mission.allowedPowerUps,i=ac(this.rng,[[1,is[1]],[2,is[2]],[3,is[3]],[4,is[4]]]),r=n.filter(o=>Ks.get(o)?.rarity===i),a=r.length>0?r[Math.floor(this.rng()*r.length)]:n[Math.floor(this.rng()*n.length)];this.spawnPickup(e.x,e.y,a,!1)}}spawnPickup(e,t,n,i){this.pickups.length>=cn.pickups||this.pickups.push({id:this.nextId++,x:e,y:t,vy:i?-22:-26,effect:n,resource:i,ttl:12})}updatePickups(e){this.mission.objective.kind==="resource"&&(this.resourceTimer-=e,this.resourceTimer<=0&&this.resources+this.pickups.filter(n=>n.resource).length<this.mission.objective.target&&(this.resourceTimer=3.2,this.spawnPickup((this.rng()-.5)*60,We.height+4,"credits",!0)));const t=this.active("magnet");for(const n of this.pickups){if(n.ttl-=e,n.y+=n.vy*e,n.vy=Math.max(-40,n.vy-8*e),t){const i=this.player.x-n.x,r=this.player.y-n.y,a=Math.max(1,Math.hypot(i,r));n.x+=i/a*60*e,n.y+=r/a*60*e}Math.hypot(n.x-this.player.x,n.y-this.player.y)<6&&(n.ttl=0,n.resource?(this.resources+=1,this.award(120),this.events.push({type:"pickup",x:n.x,y:n.y,color:"#8ef0c8"})):this.applyPowerup(n.effect))}this.pickups=this.pickups.filter(n=>n.ttl>0&&n.y>We.despawnY)}applyPowerup(e){const t=Ks.get(e);if(!t)return;this.events.push({type:"pickup",x:this.player.x,y:this.player.y+4,color:t.color});const n=(i,r)=>{this.effects.set(i,Math.max(this.effects.get(i)??0,r))};switch(e){case"weaponUp":this.weaponLevel=Math.min(5,this.weaponLevel+1);break;case"weaponSwap":{const i=["pulse","spread","beam","ion","photon","rail","arc","particle","fusion","wave"],r=i.indexOf(this.weaponId);this.weaponId=i[(r+1)%i.length];break}case"rapid":case"double":case"triple":case"spread":case"laserUp":case"plasmaUp":n(e,t.duration);break;case"missiles":n("missiles",t.duration);break;case"missileBarrage":this.charges.barrage=2,this.missileTimer=0;break;case"shieldRecharge":this.player.shield=Math.min(this.player.maxShield,this.player.shield+this.player.maxShield*.5);break;case"megaShield":{const i=this.ship.shield;this.player.maxShield=Math.round(i*2),this.player.shield=this.player.maxShield,n("megaShield",t.duration);break}case"invuln":n("invuln",t.duration);break;case"hullRepair":this.player.hull=Math.min(this.player.maxHull,this.player.hull+35);break;case"fullRepair":this.player.hull=this.player.maxHull,this.player.shield=this.player.maxShield;break;case"extraLife":this.player.lives=Math.min(5,this.player.lives+1);break;case"speedBoost":n("speedBoost",t.duration);break;case"timeSlow":n("timeSlow",t.duration);break;case"emp":for(const i of this.enemies)i.stun=Math.max(i.stun,2.4);this.bullets=this.bullets.filter(i=>!i.hostile);break;case"screenBomb":this.charges.bombs+=1;break;case"megaBomb":this.charges.bombs+=2;break;case"drone":this.drones.length<cn.drones&&this.drones.push({x:this.player.x-7,y:this.player.y,fireTimer:.3,offset:-7});break;case"twinDrone":for(;this.drones.length<Math.min(cn.drones,2);)this.drones.push({x:this.player.x+7,y:this.player.y,fireTimer:.3,offset:7});break;case"droneUpgrade":n("droneUpgrade",t.duration);break;case"damageBoost":n("damageBoost",t.duration);break;case"critBoost":n("critBoost",t.duration);break;case"energyRegen":n("energyRegen",t.duration),this.player.abilityCooldown=Math.max(0,this.player.abilityCooldown-6);break;case"reflect":n("reflect",t.duration);break;case"magnet":n("magnet",t.duration);break;case"scoreMult":n("scoreMult",t.duration);break;case"credits":this.credits+=250;break;case"chain":n("chain",t.duration);break;case"pierce":n("pierce",t.duration);break;case"explosive":n("explosive",t.duration);break;case"phoenix":this.radialDamage(28,220);break;case"gravity":for(const i of this.enemies){const r=i.x-this.player.x,a=i.y-this.player.y,o=Math.max(1,Math.hypot(r,a));i.x+=r/o*18,i.y+=a/o*18,i.stun=Math.max(i.stun,1.2)}this.bullets=this.bullets.filter(i=>!i.hostile);break;case"repairDrone":n("repairDrone",t.duration);break;case"shieldDrone":n("shieldDrone",t.duration);break;case"overdrive":n("overdrive",t.duration);break;case"starfall":this.radialDamage(120,520),this.bullets=this.bullets.filter(i=>!i.hostile);break}}radialDamage(e,t){for(const n of this.enemies)Math.hypot(n.x-this.player.x,n.y-this.player.y)<e&&(n.hp-=t,n.flash=1,n.hp<=0&&this.killEnemy(n));this.boss?.alive&&this.damageBoss(t*.7);for(let n=0;n<10;n+=1){const i=n/10*Bn;this.events.push({type:"explode",x:this.player.x+Math.cos(i)*e*.6,y:this.player.y+Math.sin(i)*e*.6,size:e*.4,color:"#fdba74"})}}updateBeams(e){for(const t of this.beams){if(t.warm>0){t.warm-=e,t.warm<=0&&(t.hostile&&Math.abs(this.player.x-t.x)<t.width/2+2.2&&this.player.y<150&&this.hurtPlayer(t.damage),this.events.push({type:"beam",x:t.x,y:60,color:"#fca5a5"}));continue}t.life-=e}this.beams=this.beams.filter(t=>t.life>0||t.warm>0)}updateStation(e){if(!this.station){const t=this.mission.objective.kind==="defense"?"relay":this.mission.objective.kind==="escort"?"courier":null;t&&(this.station={x:0,y:t==="relay"?150:132,hp:t==="relay"?260:150,maxHp:t==="relay"?260:150,kind:t,angle:0});return}this.station.kind==="courier"&&(this.station.angle+=e,this.station.x=Math.sin(this.station.angle*.8)*26),this.station.hp<=0&&this.fail("The escort was destroyed."),this.station.kind==="relay"&&this.time>0&&this.time%1<e&&(this.station.hp-=.4)}hurtPlayer(e){if(this.phase!=="active"||this.mods.noDamage||this.player.invuln>0||this.active("invuln"))return;if(this.active("shieldDrone")&&this.rng()<.35){this.events.push({type:"hit",x:this.player.x,y:this.player.y+4});return}let t=e;if(this.player.shield>0){const n=Math.min(this.player.shield,t);this.player.shield-=n,t-=n,this.shieldRegenDelay=3}t>0&&(this.player.hull-=t,this.damageTaken+=t,this.player.invuln=.7,this.events.push({type:"explode",x:this.player.x,y:this.player.y,size:5,color:"#f87171"})),this.active("megaShield")&&this.player.shield<=0&&this.effects.delete("megaShield"),this.player.hull<=0&&this.playerDown()}playerDown(){if(this.player.hull=0,this.events.push({type:"death",x:this.player.x,y:this.player.y,size:10,color:"#fca5a5"}),!(!this.mods.oneLife&&this.player.lives>1)){this.fail("Your hull was breached.");return}this.resetPlayer(!1),this.combo=0}fail(e){this.phase==="active"&&(this.phase="defeat",this.events.push({type:"lose",x:0,y:0,color:e}))}checkObjective(){if(this.phase!=="active")return;if(this.mods.noDamage&&this.damageTaken>0){this.fail("No-damage run broken.");return}if(this.priorityEscaped>0){this.fail("A runner escaped.");return}const e=this.mission.objective,t=this.progress();switch(e.kind){case"eliminate":case"gauntlet":this.kills>=e.target&&this.complete();break;case"survive":case"asteroid":this.time>=e.target&&this.complete();break;case"escort":case"defense":this.time>=e.target&&this.complete();break;case"resource":this.resources>=e.target&&this.complete();break;case"interception":this.priorityKilled>=e.target&&this.complete();break;case"elite":this.eliteKills>=e.target&&this.complete();break;case"boss":this.bossDefeated&&this.complete();break}this.time>this.mission.duration+1.5&&e.kind!=="boss"&&t<1&&this.fail("The window closed.")}complete(){this.phase==="active"&&(this.phase="victory",this.award(500),this.events.push({type:"win",x:0,y:0}))}award(e){const t=1+Math.min(1.5,this.combo*.04),n=this.active("scoreMult")?2:1;this.score+=Math.round(e*t*n)}progress(){const e=this.mission.objective;switch(e.kind){case"eliminate":case"gauntlet":return Math.min(e.target,this.kills);case"survive":case"asteroid":case"escort":case"defense":return Math.min(e.target,Math.floor(this.time));case"resource":return this.resources;case"interception":return this.priorityKilled;case"elite":return this.eliteKills;case"boss":return this.bossDefeated?1:0}}fireSecondary(){if(this.phase!=="active"||this.player.secondaryTimer>0||this.player.secondaryCharges<=0)return!1;const e=Ar(this.secondary);switch(this.player.secondaryCharges-=1,this.player.secondaryTimer=e.cooldown*(this.active("energyRegen")?.6:1),e.id){case"missiles":this.fireMissiles(3);break;case"torpedo":for(let t=-1;t<=1;t+=1)this.spawnBullet(this.player.x,this.player.y,t*40,120,e.damage,e.color,!1,{kind:"orb",r:1.6,explosive:e.radius});break;case"emp":for(const t of this.enemies)t.stun=3;this.bullets=this.bullets.filter(t=>!t.hostile),this.radialDamage(e.radius,e.damage);break;case"mine":for(let t=0;t<3;t+=1)this.spawnBullet(this.player.x+(t-1)*4,this.player.y+8,0,30,e.damage,e.color,!1,{kind:"mine",r:2.2,life:12,explosive:e.radius});break;case"orbital":this.radialDamage(e.radius,e.damage),this.events.push({type:"beam",x:this.player.x,y:120,color:e.color});break}return this.events.push({type:"shot",x:this.player.x,y:this.player.y,color:e.color}),!0}useBomb(){return this.phase!=="active"||this.charges.bombs<=0?!1:(this.charges.bombs-=1,this.radialDamage(120,160),this.bullets=this.bullets.filter(e=>!e.hostile),this.player.invuln=Math.max(this.player.invuln,1),!0)}useAbility(){if(this.phase!=="active"||this.player.abilityCooldown>0)return!1;const e=this.active("energyRegen")?15:22;switch(this.player.abilityCooldown=e,this.ship.ability){case"overdrive":this.effects.set("overdrive",8);break;case"phase":this.player.invuln=2.5;break;case"bastion":this.player.shield=this.player.maxShield;break;case"pierce":this.effects.set("pierce",6);break;case"cloak":this.player.invuln=3,this.bullets=this.bullets.filter(t=>!t.hostile);break;case"inferno":this.radialDamage(70,220);break;case"aegis":this.player.maxShield=Math.round(this.ship.shield*2),this.player.shield=this.player.maxShield,this.effects.set("megaShield",10);break;case"storm":for(const t of this.enemies)t.hp-=180,t.hp<=0&&this.killEnemy(t),this.events.push({type:"arc",x:this.player.x,y:this.player.y,x2:t.x,y2:t.y});this.boss?.alive&&this.damageBoss(160);break;case"crit":this.effects.set("critBoost",4);break;case"nova":this.radialDamage(140,420),this.bullets=this.bullets.filter(t=>!t.hostile);break}return!0}nearestEnemy(e,t){let n=null,i=1/0;for(const r of this.enemies){if(r.hp<=0)continue;const a=Math.hypot(r.x-e,r.y-t);a<i&&(i=a,n=r)}return this.boss?.alive&&Math.hypot(this.boss.x-e,this.boss.y-t)<i?null:n}cleanup(){this.enemies=this.enemies.filter(e=>e.hp>0),this.bullets=this.bullets.filter(e=>e.life>0),!this.active("megaShield")&&this.player.maxShield>Math.round(this.ship.shield*1.9)&&(this.player.maxShield=Math.round(this.ship.shield),this.player.shield=Math.min(this.player.shield,this.player.maxShield)),this.events.length>220&&(this.events=this.events.slice(-120))}snapshot(){const e=[...this.effects.entries()].filter(([,n])=>n>0).map(([n,i])=>{const r=Ks.get(n);return{id:n,name:r?.name??n,glyph:r?.glyph??"?",remaining:i}}),t=this.boss;return{phase:this.phase,score:this.score,hull:Math.max(0,Math.round(this.player.hull)),maxHull:this.player.maxHull,shield:Math.max(0,Math.round(this.player.shield)),maxShield:this.player.maxShield,lives:this.player.lives,weapon:dl(this.weaponId).name,weaponLevel:this.weaponLevel,secondary:Ar(this.secondary).name,secondaryCharges:this.player.secondaryCharges,abilityReady:1-this.player.abilityCooldown/22,bombs:this.charges.bombs,drones:this.drones.length,combo:this.combo,kills:this.kills,time:this.time,progress:this.progress(),progressTarget:this.mission.objective.target,objective:this.mission.objective,boss:t?{name:t.spec.name,hp:Math.max(0,Math.round(t.hp)),maxHp:Math.round(t.maxHp),phase:t.phase,parts:t.parts.filter(n=>n.alive).length}:null,effects:e,station:this.station?{hp:Math.max(0,Math.round(this.station.hp)),maxHp:this.station.maxHp,kind:this.station.kind}:null,lowHull:this.player.hull/this.player.maxHull<.3}}stats(){return{kills:this.kills,damageTaken:Math.round(this.damageTaken),accuracy:this.shotsFired>0?Math.min(1,this.shotsHit/Math.max(1,this.shotsFired)):0,score:this.score,credits:this.credits}}behaviorOf(e){return e.spec.behavior}}const fl="★",pl=s=>`${fl.repeat(Math.max(0,Math.min(3,s)))}<span class="dim">${fl.repeat(Math.max(0,3-s))}</span>`,Mg={campaign:"300 missions",endless:"climb forever",bossrush:"ten flagships",daily:"one shared sky",arcade:"pure score",zen:"no pressure",challenge:"rules attached"};class Sg{root;handlers;save;screen="menu";mission=null;hud=null;overlay=null;lastEffects="";lastScore=-1;toastTimer=null;constructor(e,t,n){this.root=e,this.save=t,this.handlers=n,this.root.addEventListener("click",i=>this.onClick(i))}setSave(e){this.save=e,this.refreshCredits()}onClick(e){const t=e.target.closest("[data-action]");if(!t)return;const n=t.dataset.action??"",i=t.dataset.value??"";if(!t.hasAttribute("data-disabled"))switch(n){case"continue":this.handlers.continueCampaign();break;case"sectors":this.handlers.openSectors();break;case"sector":this.handlers.openMissions(Number(i));break;case"mission":this.handlers.startMission(Number(i));break;case"mode":this.handlers.startMode(i);break;case"challenge":this.handlers.startChallenge(i);break;case"challenges-screen":this.showChallenges();break;case"hangar":this.showHangar();break;case"settings":this.showSettings();break;case"achievements":this.showAchievements();break;case"menu":this.handlers.quit();break;case"back-sectors":this.handlers.openSectors();break;case"pause":this.handlers.pause();break;case"resume":this.handlers.resume();break;case"restart":this.handlers.restart();break;case"retry":this.handlers.retry();break;case"next":this.handlers.nextMission();break;case"secondary":this.handlers.secondary();break;case"bomb":this.handlers.bomb();break;case"ability":this.handlers.ability();break;case"buy-ship":this.handlers.buyShip(i);break;case"equip-ship":this.handlers.equipShip(i);break;case"buy-weapon":this.handlers.buyWeapon(i);break;case"equip-weapon":this.handlers.equipWeapon(i);break;case"equip-secondary":this.handlers.equipSecondary(i);break;case"buy-cosmetic":this.handlers.buyCosmetic(i);break;case"equip-cosmetic":this.handlers.equipCosmetic(i);break;case"setting":this.toggleSetting(i);break;case"quality":this.handlers.setting("quality",i);break;case"control":this.handlers.setting("control",i);break;case"erase":window.confirm("Erase all Starfall Squadron progress on this device?")&&this.handlers.eraseProgress();break;case"share":this.handlers.share();break}}toggleSetting(e){const n=this.save.settings[e];typeof n=="boolean"&&this.handlers.setting(e,!n)}shell(e,t=""){this.root.innerHTML=`<div class="screen ${t}"><div class="screen-inner">${e}</div></div>`}showMenu(){this.screen="menu",this.overlay=null;const e=Bs(this.save),t=Math.max(1,Math.min(lt.missions,this.save.lastMission)),n=["endless","bossrush","daily","arcade","zen"];this.shell(`
      <div class="menu-hero">
        <p class="eyebrow">LITTLE JOY ARCADE</p>
        <h1 class="title">STARFALL<span>SQUADRON</span></h1>
        <p class="tagline">Fly ten fighters. Break ten flagships. Hold the last sky.</p>
      </div>
      <div class="menu-stats">
        <span><b>${e}</b> / 300 missions</span>
        <span><b>${Lc(this.save)}</b> stars</span>
        <span><b class="credits">${this.save.credits.toLocaleString()}</b> credits</span>
      </div>
      <div class="menu-actions">
        <button class="btn big primary" data-action="continue">
          <span>CONTINUE</span>
          <small>Mission ${t} · ${this.save.progress[t]?.cleared?"replay":"next sortie"}</small>
        </button>
        <button class="btn" data-action="sectors"><b>CAMPAIGN</b><small>10 sectors · 300 missions</small></button>
      </div>
      <div class="mode-grid">
        ${n.map(i=>`
          <button class="btn mode" data-action="mode" data-value="${i}">
            <b>${i==="bossrush"?"BOSS RUSH":i==="arcade"?"ARCADE CLASSIC":i==="zen"?"ZEN PATROL":i==="daily"?"DAILY":"ENDLESS"}</b>
            <small>${Mg[i]}</small>
          </button>`).join("")}
        <button class="btn mode" data-action="challenges-screen"><b>CHALLENGES</b><small>10 rule sets</small></button>
      </div>
      <div class="menu-row">
        <button class="btn ghost" data-action="hangar">HANGAR</button>
        <button class="btn ghost" data-action="settings">SETTINGS</button>
        <button class="btn ghost" data-action="achievements">AWARDS</button>
      </div>
      <p class="footnote">Best ship: ${Pr.get(this.save.ship)?.name??"Falcon"} · Drag anywhere below the HUD to fly. Guns fire themselves.</p>
    `,"menu")}showSectors(){this.screen="sectors",this.root.innerHTML=`
      <div class="screen sectors">
        <div class="screen-inner">
          <header class="page-head">
            <button class="link" data-action="menu">← MENU</button>
            <h2>CAMPAIGN</h2>
            <span class="muted">${Bs(this.save)} / 300</span>
          </header>
          <div class="sector-grid">
            ${Cr.map(e=>{const t=Ic(this.save,e.id),n=Lr(this.save,e.id);return`
                <button class="sector-card ${t?"":"locked"}" data-action="sector" data-value="${e.id}" ${t?"":"data-disabled"}>
                  <span class="sector-art" style="--a:${e.palette.nebula};--b:${e.palette.accent}">
                    <span class="sector-num">${String(e.id).padStart(2,"0")}</span>
                  </span>
                  <span class="sector-body">
                    <b>${e.name}</b>
                    <small>${t?e.subtitle:"Clear the previous sector flagship"}</small>
                    <span class="sector-bar"><i style="width:${Math.round(n.cleared/30*100)}%"></i></span>
                    <small class="muted">${n.cleared}/30 · ${n.stars}★</small>
                  </span>
                  ${t?"":'<span class="lock">LOCKED</span>'}
                </button>`}).join("")}
          </div>
        </div>
      </div>`}showMissions(e){this.screen="missions";const t=Cs(e),n=(e-1)*lt.missionsPerSector+1,i=[];for(let r=1;r<=lt.missionsPerSector;r+=1){const a=n+r-1,o=Wi(this.save,a),l=this.save.progress[a],c=r===lt.missionsPerSector;i.push(`
        <button class="mission-tile ${o?"":"locked"} ${c?"boss":""}" data-action="mission" data-value="${a}" ${o?"":"data-disabled"}>
          <span class="num">${r}</span>
          <span class="tile-stars">${pl(l?.stars??0)}</span>
          ${c?'<span class="boss-mark">FLAGSHIP</span>':""}
        </button>`)}this.root.innerHTML=`
      <div class="screen missions">
        <div class="screen-inner">
          <header class="page-head">
            <button class="link" data-action="back-sectors">← SECTORS</button>
            <h2>${t.name}</h2>
            <span class="muted">${Lr(this.save,e).cleared}/30</span>
          </header>
          <div class="mission-grid">${i.join("")}</div>
        </div>
      </div>`}showChallenges(){this.screen="challenges",this.root.innerHTML=`
      <div class="screen">
        <div class="screen-inner">
          <header class="page-head">
            <button class="link" data-action="menu">← MENU</button>
            <h2>CHALLENGES</h2>
            <span class="muted">${Fs.length}</span>
          </header>
          <div class="list">
            ${Fs.map(e=>`
              <button class="row" data-action="challenge" data-value="${e.id}">
                <span><b>${e.name}</b><small>${e.blurb}</small></span>
                <span class="chev">›</span>
              </button>`).join("")}
          </div>
        </div>
      </div>`}showHangar(){this.screen="hangar";const e=Pr.get(this.save.ship)??Os[0];this.root.innerHTML=`
      <div class="screen hangar">
        <div class="screen-inner">
          <header class="page-head">
            <button class="link" data-action="menu">← MENU</button>
            <h2>HANGAR</h2>
            <span class="muted credits">${this.save.credits.toLocaleString()} ¤</span>
          </header>
          <section class="panel">
            <p class="eyebrow">SELECTED</p>
            <h3>${e.name}</h3>
            <p class="muted">${e.blurb}</p>
            <div class="stat-row">
              ${this.stat("Hull",e.hull,180)}
              ${this.stat("Shield",e.shield,180)}
              ${this.stat("Speed",e.speed,90)}
              ${this.stat("Damage",e.damage*100,170)}
            </div>
            <p class="ability-line"><b>${e.abilityName}</b> · ${e.abilityBlurb}</p>
          </section>
          <p class="eyebrow section-title">SHIPS</p>
          <div class="list">
            ${Os.map(t=>{const n=this.save.ships.includes(t.id),i=this.save.ship===t.id;return`
                <div class="row ship-row">
                  <span class="ship-swatch" style="--h:${t.hullColor};--a:${t.accentColor}"></span>
                  <span class="grow">
                    <b>${t.name}</b>
                    <small>${t.className} · ${t.abilityName}</small>
                  </span>
                  ${i?'<span class="pill">EQUIPPED</span>':n?`<button class="btn tiny" data-action="equip-ship" data-value="${t.id}">EQUIP</button>`:`<button class="btn tiny ${this.save.credits>=t.cost?"":"disabled"}" data-action="buy-ship" data-value="${t.id}">${t.cost.toLocaleString()} ¤</button>`}
                </div>`}).join("")}
          </div>
          <p class="eyebrow section-title">PRIMARY WEAPONS</p>
          <div class="list">
            ${Xa.map(t=>{const n=this.save.weapons[t.id]??1,i=this.save.primary===t.id;return`
                <div class="row">
                  <span class="grow">
                    <b style="color:${t.color}">${t.name}</b>
                    <small>Level ${n} / 5 · ${t.blurb}</small>
                  </span>
                  ${i?`<span class="pill">EQUIPPED</span><button class="btn tiny" data-action="buy-weapon" data-value="${t.id}" ${n>=5?"data-disabled":""}>${n>=5?"MAX":`UP ${350*n} ¤`}</button>`:`<button class="btn tiny" data-action="equip-weapon" data-value="${t.id}">EQUIP</button>`}
                </div>`}).join("")}
          </div>
          <p class="eyebrow section-title">SECONDARY</p>
          <div class="list">
            ${$a.map(t=>`
              <div class="row">
                <span class="grow"><b>${t.name}</b><small>${t.blurb}</small></span>
                ${this.save.secondary===t.id?'<span class="pill">EQUIPPED</span>':`<button class="btn tiny" data-action="equip-secondary" data-value="${t.id}">EQUIP</button>`}
              </div>`).join("")}
          </div>
          <p class="eyebrow section-title">TRAILS</p>
          <div class="list">
            ${Cc.map(t=>{const n=this.save.cosmetics.trails.includes(t.id);return`
                <div class="row">
                  <span class="ship-swatch" style="--h:${t.color};--a:${t.color}"></span>
                  <span class="grow"><b>${t.name}</b><small>${t.trail?"Engine trail":"Default"}</small></span>
                  ${this.save.cosmetics.trail===t.id?'<span class="pill">IN USE</span>':n?`<button class="btn tiny" data-action="equip-cosmetic" data-value="${t.id}">USE</button>`:`<button class="btn tiny" data-action="buy-cosmetic" data-value="${t.id}">${t.cost} ¤</button>`}
                </div>`}).join("")}
          </div>
        </div>
      </div>`}stat(e,t,n){return`<div class="stat"><span>${e}</span><span class="stat-bar"><i style="width:${Math.min(100,t/n*100)}%"></i></span></div>`}showSettings(){this.screen="settings";const e=this.save.settings,t=(n,i,r)=>`
      <button class="row" data-action="setting" data-value="${n}">
        <span><b>${i}</b></span>
        <span class="switch ${r?"on":""}"><i></i></span>
      </button>`;this.root.innerHTML=`
      <div class="screen">
        <div class="screen-inner">
          <header class="page-head">
            <button class="link" data-action="menu">← MENU</button>
            <h2>SETTINGS</h2>
            <span></span>
          </header>
          <div class="list">
            ${t("sound","Sound effects",e.sound)}
            ${t("music","Music",e.music)}
            ${t("motion","Screen shake and motion",e.motion)}
            ${t("highContrast","High-contrast projectiles",e.highContrast)}
            ${t("leftHanded","Left-handed layout",e.leftHanded)}
          </div>
          <p class="eyebrow section-title">GRAPHICS</p>
          <div class="segmented">
            ${["low","medium","high"].map(n=>`<button class="${e.quality===n?"on":""}" data-action="quality" data-value="${n}">${n.toUpperCase()}</button>`).join("")}
          </div>
          <p class="eyebrow section-title">CONTROLS</p>
          <div class="segmented">
            <button class="${e.control==="absolute"?"on":""}" data-action="control" data-value="absolute">FOLLOW FINGER</button>
            <button class="${e.control==="relative"?"on":""}" data-action="control" data-value="relative">RELATIVE DRAG</button>
          </div>
          <p class="eyebrow section-title">DATA</p>
          <button class="row danger" data-action="erase"><span><b>Erase progress</b><small>Wipes campaign, credits and unlocks on this device.</small></span><span class="chev">›</span></button>
          <p class="footnote">Starfall Squadron · v1.0.0 · a Little Joy Arcade original</p>
        </div>
      </div>`}showAchievements(){this.screen="achievements",this.root.innerHTML=`
      <div class="screen">
        <div class="screen-inner">
          <header class="page-head">
            <button class="link" data-action="menu">← MENU</button>
            <h2>AWARDS</h2>
            <span class="muted">${this.save.achievements.length}/${Dr.length}</span>
          </header>
          <div class="list">
            ${Dr.map(e=>{const t=this.save.achievements.includes(e.id);return`<div class="row ${t?"":"locked"}">
                <span class="award ${t?"on":""}">★</span>
                <span class="grow"><b>${e.name}</b><small>${e.blurb}</small></span>
                <span class="pill ${t?"gold":""}">${t?"EARNED":"—"}</span>
              </div>`}).join("")}
          </div>
        </div>
      </div>`}showGame(e){this.screen="game",this.mission=e,this.overlay=null,this.lastEffects="",this.lastScore=-1,this.root.innerHTML=`
      <div id="hud" class="hud">
        <div class="hud-top">
          <div class="hud-left">
            <span class="hud-mission">M${String(e.index).padStart(3,"0")} · ${e.name}</span>
            <span class="hud-score" data-hud="score">0</span>
          </div>
          <div class="hud-bars">
            <div class="bar hull"><i data-hud="hullfill"></i><span data-hud="hulltext">100</span></div>
            <div class="bar shield"><i data-hud="shieldfill"></i><span data-hud="shieldtext">60</span></div>
          </div>
          <button class="icon-btn" data-action="pause" aria-label="Pause">II</button>
        </div>
        <div class="hud-objective">
          <span data-hud="objective">${e.objective.label}</span>
          <span class="objective-progress"><i data-hud="progressfill"></i></span>
          <span data-hud="progresstext">0/${e.objective.target}</span>
        </div>
        <div class="hud-boss" data-hud="bosswrap" hidden>
          <div class="boss-line"><span data-hud="bossname"></span><span data-hud="bossparts"></span></div>
          <div class="boss-bar"><i data-hud="bossfill"></i></div>
        </div>
        <div class="hud-effects" data-hud="effects"></div>
        <div class="hud-station" data-hud="station" hidden></div>
        <div class="hud-bottom">
          <div class="hud-weapon">
            <span data-hud="weapon">PULSE CANNON</span>
            <span data-hud="combo" class="combo"></span>
          </div>
          <div class="hud-actions">
            <button class="action-btn" data-action="secondary"><b>${this.secondaryGlyph()}</b><small data-hud="secondary">MISSILES</small></button>
            <button class="action-btn bomb" data-action="bomb"><b>✸</b><small data-hud="bombs">1</small></button>
            <button class="action-btn ability" data-action="ability"><b>✦</b><small data-hud="ability">READY</small></button>
          </div>
          <span class="hud-lives" data-hud="lives">♥♥♥</span>
        </div>
      </div>`;const t=n=>{const i=this.root.querySelector(`[data-hud="${n}"]`);if(!i)throw new Error(`missing HUD element ${n}`);return i};this.hud={score:t("score"),hull:t("hullfill"),shield:t("shieldfill"),hullText:t("hulltext"),shieldText:t("shieldtext"),objective:t("objective"),progress:t("progresstext"),progressFill:t("progressfill"),weapon:t("weapon"),lives:t("lives"),combo:t("combo"),effects:t("effects"),boss:t("bossfill"),bossName:t("bossname"),bossWrap:t("bosswrap"),bossParts:t("bossparts"),secondary:t("secondary"),bombs:t("bombs"),ability:t("ability"),station:t("station")}}secondaryGlyph(){return"➤"}hudEl(e){return this.root.querySelector(`[data-hud="${e}"]`)}updateHud(e){if(!this.hud)return;e.score!==this.lastScore&&(this.hud.score.textContent=e.score.toLocaleString(),this.lastScore=e.score);const t=Math.max(0,e.hull/e.maxHull);this.hud.hull.style.width=`${t*100}%`,this.hud.hull.classList.toggle("low",t<.3),this.hud.hullText.textContent=`${e.hull}`,this.hud.shield.style.width=`${e.maxShield>0?Math.max(0,e.shield/e.maxShield*100):0}%`,this.hud.shieldText.textContent=`${e.shield}`,this.hud.objective.textContent=e.objective.label,this.hud.progress.textContent=`${Math.min(e.progress,e.progressTarget)}/${e.progressTarget}`,this.hud.progressFill.style.width=`${Math.min(100,e.progress/Math.max(1,e.progressTarget)*100)}%`,this.hud.weapon.textContent=`${e.weapon.toUpperCase()} · ${e.weaponLevel}`,this.hud.lives.textContent="♥".repeat(Math.max(0,e.lives)),this.hud.combo.textContent=e.combo>=3?`×${e.combo}`:"";const n=this.hudEl("secondary");n&&(n.textContent=`${e.secondaryCharges}`);const i=this.hudEl("bombs");i&&(i.textContent=`${e.bombs}`);const r=this.hudEl("ability");r&&(r.textContent=e.abilityReady>=1?"READY":`${Math.round(e.abilityReady*100)}%`,r.classList.toggle("ready",e.abilityReady>=1));const a=this.hudEl("bosswrap");if(a&&(a.hidden=!e.boss),e.boss){this.hud.boss.style.width=`${Math.max(0,e.boss.hp/e.boss.maxHp*100)}%`,this.hud.bossName.textContent=e.boss.name;const c=this.hudEl("bossparts");c&&(c.textContent=`${e.boss.parts} TURRETS · PHASE ${e.boss.phase+1}`)}const o=this.hudEl("station");o&&(o.hidden=!e.station,e.station&&(o.textContent=`${e.station.kind==="relay"?"RELAY":"COURIER"} ${e.station.hp}/${e.station.maxHp}`));const l=e.effects.map(c=>`${c.id}:${Math.ceil(c.remaining)}`).join("|");l!==this.lastEffects&&(this.lastEffects=l,this.hud.effects.innerHTML=e.effects.slice(0,7).map(c=>`<span class="effect-chip" style="--c:${wa.find(d=>d.id===c.id)?.color??"#4de1ff"}"><b>${c.glyph}</b>${Math.ceil(c.remaining)}s</span>`).join(""))}showPause(){this.closeOverlay();const e=document.createElement("div");e.className="overlay",e.innerHTML=`
      <div class="sheet">
        <p class="eyebrow">PAUSED</p>
        <h2>Holding pattern</h2>
        <p class="muted">${this.mission?.name??"Sortie"} · ${this.mission?.objective.label??""}</p>
        <div class="sheet-actions">
          <button class="btn primary" data-action="resume"><b>RESUME</b></button>
          <button class="btn" data-action="restart"><b>RESTART</b></button>
          <button class="btn ghost" data-action="menu"><b>EXIT TO MENU</b></button>
        </div>
      </div>`,this.root.appendChild(e),this.overlay=e}closeOverlay(){this.overlay&&(this.overlay.remove(),this.overlay=null)}showResult(e,t,n,i,r){this.closeOverlay(),this.screen="game";const a=e.mission,o=Math.min(lt.missions,a.index+1),l=Wi(this.save,o)&&a.index<lt.missions,c=document.createElement("div");c.className="overlay",c.innerHTML=`
      <div class="sheet result ${n?"win":"lose"}">
        <p class="eyebrow">${n?"MISSION COMPLETE":"SIGNAL LOST"}</p>
        <h2>${n?a.name:"Sortie failed"}</h2>
        <div class="result-stars">${pl(n?e.stars:0)}</div>
        <div class="result-grid">
          <span>Score<b>${e.score.toLocaleString()}</b></span>
          <span>Kills<b>${i.kills}</b></span>
          <span>Accuracy<b>${Math.round(i.accuracy*100)}%</b></span>
          <span>Credits<b>+${e.credits.toLocaleString()}</b></span>
        </div>
        ${n?`<p class="muted">${e.newStars?"New star record. ":""}${e.newBest?"New personal best.":""}</p>`:`<p class="muted">${r??"The lane belongs to them for now."}</p>`}
        <div class="sheet-actions">
          ${n&&(t==="endless"||t==="bossrush"||l&&t==="campaign")?`<button class="btn primary" data-action="next"><b>${t==="endless"?"NEXT WAVE":t==="bossrush"?"NEXT FLAGSHIP":"NEXT MISSION"}</b><small>${t==="campaign"?`M${String(o).padStart(3,"0")}`:t==="bossrush"?"keep going":"it gets worse"}</small></button>`:n?'<button class="btn primary" data-action="retry"><b>FLY AGAIN</b></button>':'<button class="btn primary" data-action="retry"><b>RETRY</b></button>'}
          <button class="btn" data-action="menu"><b>HANGAR / MENU</b></button>
        </div>
        <p class="footnote">${n?`Next star target: ${a.starScore[Math.min(2,e.stars)]?.toLocaleString()??"—"}`:"Your upgrades and unlocks are safe."}</p>
      </div>`,this.root.appendChild(c),this.overlay=c}toast(e){let t=this.root.querySelector(".toast");t||(t=document.createElement("div"),t.className="toast",this.root.appendChild(t)),t.textContent=e,t.classList.add("show"),this.toastTimer!==null&&window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>t?.classList.remove("show"),2200)}refreshCredits(){const e=this.root.querySelector(".credits");e&&(e.textContent=`${this.save.credits.toLocaleString()}`)}get currentScreen(){return this.screen}}const Eg={std:0,solar:400,void:550,emerald:650,crimson:800,aurora:1100};function wg(){const s=new Date;return`${s.getUTCFullYear()}-${String(s.getUTCMonth()+1).padStart(2,"0")}-${String(s.getUTCDate()).padStart(2,"0")}`}const Tg={oneLife:{oneLife:!0},noShields:{noShields:!0},basicWeapon:{basicWeapon:!0},missileOnly:{missileOnly:!0},droneCommander:{drones:2},speedClear:{speed:1.25},noDamage:{noDamage:!0},survival:{oneLife:!0,eliteFleet:!0},precision:{speed:1.1},eliteFleet:{eliteFleet:!0}};class Ag{canvas;renderer;ui;save;campaign;sim=null;mission=null;mode="campaign";paused=!1;resultShown=!1;last=performance.now();accumulator=0;stage=1;round=1;driverKills=0;keys=new Set;pointerId=null;pointerStart={x:0,y:0};shipStart={x:0,y:0};dronePeak=0;lastSound=0;constructor(){const e=document.querySelector("#scene"),t=document.querySelector("#ui");if(!e||!t)throw new Error("Starfall Squadron needs #scene and #ui");this.canvas=e,this.renderer=new pg(e),this.save=Dc(),this.campaign=Tc(),this.ui=new Sg(t,this.save,this),this.applySettings(),this.ui.showMenu(),this.renderer.showMenu(),this.renderer.setShip(this.save.ship),this.renderer.setSector(Cs(1)),this.bindInput(),window.addEventListener("resize",()=>this.renderer.resize()),document.addEventListener("visibilitychange",()=>{document.hidden&&this.sim&&this.sim.phase==="active"&&this.pause()}),window.addEventListener("beforeunload",()=>kt(this.save)),this.last=performance.now(),requestAnimationFrame(this.frame)}applySettings(){const e=this.save.settings;nt.setEnabled(e.sound),nt.setMusic(e.music),this.renderer.setQuality(e.quality),this.renderer.setShip(this.save.ship),document.body.classList.toggle("reduce-motion",!e.motion),document.body.classList.toggle("high-contrast",e.highContrast),document.body.classList.toggle("left-handed",e.leftHanded)}setting(e,t){const n=this.save.settings;n[e]=t,kt(this.save),this.applySettings(),nt.play("ui"),this.ui.toast("Setting saved"),(e==="quality"||e==="control"||e==="leftHanded"||e==="highContrast"||e==="motion")&&this.ui.showSettings()}continueCampaign(){const e=Math.max(1,Math.min(lt.missions,this.save.lastMission));this.startMission(e)}openSectors(){nt.play("ui"),this.ui.showSectors()}openMissions(e){nt.play("ui"),this.ui.showMissions(e)}startMission(e){if(!Wi(this.save,e)){this.ui.toast("Clear the previous mission first.");return}const t=this.campaign[e-1]??$n(e);this.begin(t,"campaign")}startMode(e){switch(nt.play("ui"),this.stage=1,this.round=1,e){case"campaign":this.continueCampaign();return;case"endless":this.begin(io(1),"endless");return;case"bossrush":this.begin(so(1),"bossrush");return;case"daily":this.begin(Ac(new Date),"daily");return;case"arcade":this.begin($n(31),"arcade",{oneLife:!0});return;case"zen":this.begin({...$n(121),name:"Zen Patrol",brief:"No pressure. Fly the lane for as long as you like.",objective:{kind:"survive",target:600,label:"Fly as long as you like"},duration:620},"zen",{speed:.9});return;case"challenge":this.ui.showChallenges();return}}startChallenge(e){this.begin(Rc(e),"challenge",Tg[e])}begin(e,t,n={}){this.mission=e,this.mode=t,this.paused=!1,this.resultShown=!1,this.accumulator=0,this.dronePeak=0,this.driverKills=0,this.sim=new bg({mission:e,shipId:this.save.ship,primary:this.save.primary,secondary:this.save.secondary,primaryLevel:t==="arcade"||t==="challenge"?1:this.save.weapons[this.save.primary]??1,mods:n}),this.renderer.setSector(Cs(e.sector)),this.renderer.setShip(this.save.ship),this.renderer.showGame(this.sim),this.ui.showGame(e),nt.unlock(),this.save.settings.music&&nt.startMusic(),this.last=performance.now()}pause(){!this.sim||this.sim.phase!=="active"||this.paused||(this.paused=!0,this.ui.showPause(),nt.play("ui"))}resume(){this.paused=!1,this.ui.closeOverlay(),this.last=performance.now(),nt.play("ui")}restart(){this.mission&&this.begin(this.mission,this.mode,this.sim?.mods??{})}retry(){this.restart()}nextMission(){if(this.mission){if(this.mode==="endless"){this.stage+=1,this.begin(io(this.stage),"endless");return}if(this.mode==="bossrush"){if(this.round+=1,this.round>10){this.save.bossRushBest=10,kt(this.save),this.ui.toast("All ten flagships down."),this.quit();return}this.begin(so(this.round),"bossrush");return}if(this.mode==="campaign"){const e=Math.min(lt.missions,this.mission.index+1);Wi(this.save,e)?this.startMission(e):this.quit();return}this.restart()}}quit(){nt.play("ui"),nt.stopMusic(),this.sim=null,this.mission=null,this.paused=!1,this.resultShown=!1,this.renderer.showMenu(),this.renderer.setShip(this.save.ship),this.renderer.setSector(Cs(1)),this.ui.showMenu()}secondary(){this.sim?.fireSecondary()&&(this.save.secondaryUsed=[...new Set([...this.save.secondaryUsed,this.save.secondary])].slice(0,10),nt.play("missile"))}bomb(){this.sim?.useBomb()&&nt.play("explode")}ability(){this.sim?.useAbility()&&nt.play("shield")}buyShip(e){Nc(this.save,e)?(kt(this.save),this.ui.toast("Hangar expanded."),nt.play("pickup")):this.ui.toast("Not enough credits."),this.ui.setSave(this.save),this.ui.showHangar()}equipShip(e){Bc(this.save,e),kt(this.save),this.renderer.setShip(this.save.ship),this.ui.setSave(this.save),this.ui.showHangar()}buyWeapon(e){Fc(this.save,e)?(kt(this.save),this.ui.toast("Weapon upgraded."),nt.play("pickup")):this.ui.toast("Not enough credits, or already maxed."),this.ui.setSave(this.save),this.ui.showHangar()}equipWeapon(e){this.save.primary=e,kt(this.save),this.ui.showHangar()}equipSecondary(e){this.save.secondary=e,kt(this.save),this.ui.showHangar()}buyCosmetic(e){const t=Eg[e]??0;Oc(this.save,e,t)?(this.save.cosmetics.trail=e,kt(this.save),nt.play("pickup")):this.ui.toast("Not enough credits."),this.ui.setSave(this.save),this.ui.showHangar()}equipCosmetic(e){this.save.cosmetics.trail=e,kt(this.save),this.ui.showHangar()}eraseProgress(){this.save=zi(),kt(this.save),this.ui.setSave(this.save),this.applySettings(),this.ui.showSettings(),this.ui.toast("Progress erased.")}share(){const e=`Starfall Squadron — ${Bs(this.save)}/300 missions cleared, ${this.save.credits} credits.`;navigator.share?navigator.share({title:"Starfall Squadron",text:e}):(navigator.clipboard?.writeText(e),this.ui.toast("Copied to clipboard."))}bindInput(){const e=this.canvas;e.addEventListener("pointerdown",n=>{if(!this.sim||this.paused)return;nt.unlock(),this.pointerId=n.pointerId,e.setPointerCapture?.(n.pointerId);const i=this.toWorld(n.clientX,n.clientY);this.pointerStart=i,this.shipStart={x:this.sim.player.targetX,y:this.sim.player.targetY},this.save.settings.control==="absolute"&&this.sim.setTarget(i.x,i.y+11)}),e.addEventListener("pointermove",n=>{if(!this.sim||this.paused||this.pointerId!==n.pointerId)return;const i=this.toWorld(n.clientX,n.clientY);if(this.save.settings.control==="absolute"){const r=11*(this.save.settings.sensitivity??1);this.sim.setTarget(i.x,i.y+r)}else this.sim.setTarget(this.shipStart.x+(i.x-this.pointerStart.x),this.shipStart.y+(i.y-this.pointerStart.y))});const t=n=>{this.pointerId===n.pointerId&&(this.pointerId=null)};e.addEventListener("pointerup",t),e.addEventListener("pointercancel",t),e.addEventListener("contextmenu",n=>n.preventDefault()),window.addEventListener("keydown",n=>{const i=n.key.toLowerCase();["arrowleft","arrowright","arrowup","arrowdown"," ","w","a","s","d"].includes(i)&&n.preventDefault(),this.keys.add(i),(i==="escape"||i==="p")&&(this.paused?this.resume():this.pause()),i===" "&&this.secondary(),i==="b"&&this.bomb(),(i==="e"||i==="shift")&&this.ability()}),window.addEventListener("keyup",n=>this.keys.delete(n.key.toLowerCase()))}toWorld(e,t){const n=this.canvas.getBoundingClientRect(),i=50*1.08,r=i/(n.width/Math.max(1,n.height)),a=((e-n.left)/Math.max(1,n.width)-.5)*2*i,o=89+(.5-(t-n.top)/Math.max(1,n.height))*2*r;return{x:a,y:o}}updateKeys(e){if(!this.sim||this.paused||this.keys.size===0)return;const t=this.sim.player;let n=0,i=0;if((this.keys.has("arrowleft")||this.keys.has("a"))&&(n-=1),(this.keys.has("arrowright")||this.keys.has("d"))&&(n+=1),(this.keys.has("arrowup")||this.keys.has("w"))&&(i+=1),(this.keys.has("arrowdown")||this.keys.has("s"))&&(i-=1),n!==0||i!==0){const r=70*e;this.sim.setTarget(t.targetX+n*r,t.targetY+i*r)}}frame=e=>{const t=Math.min(.08,Math.max(5e-4,(e-this.last)/1e3));if(this.last=e,this.updateKeys(t),this.sim&&!this.paused){this.accumulator+=t;let n=0;for(;this.accumulator>=Rr&&n<6&&this.sim.phase==="active";)this.sim.step(),this.accumulator-=Rr,n+=1;this.dronePeak=Math.max(this.dronePeak,this.sim.drones.length),this.sim.events.length>0&&(this.renderer.consume(this.sim.events),this.playEvents(),this.sim.events.length=0),this.ui.updateHud(this.sim.snapshot()),!this.resultShown&&this.sim.phase!=="active"&&this.finish()}this.renderer.render(t),requestAnimationFrame(this.frame)};playEvents(){const e=this.sim;if(!e)return;const t=performance.now();if(t-this.lastSound<50)return;this.lastSound=t;const n=i=>e.events.some(r=>r.type===i);n("death")||n("lose")?nt.play("death"):n("explode")?nt.play("explode"):n("pickup")?nt.play("pickup"):n("hit")?nt.play("hit"):n("shot")&&nt.play("shoot")}finish(){const e=this.sim,t=this.mission;if(!e||!t)return;this.resultShown=!0;const n=e.phase==="victory",i=e.stats(),r=n?Math.max(1,yg(e.score,t)):0,a=n?Math.round(e.credits*.35)+40:Math.round(e.credits*.12);this.driverKills+=i.kills,this.save.totalKills+=i.kills;let o;if(n&&this.mode==="campaign"?o=Uc(this.save,t,e.score,r,a):(n&&(this.save.credits+=a),o={mission:t,score:n?e.score:i.score,stars:r,credits:a,newBest:!1,newStars:!1}),this.mode==="daily"){const c=wg(),h=new Date(Date.now()-864e5).toISOString().slice(0,10),d=this.save.daily.date===c?this.save.daily.streak:this.save.daily.date===h?this.save.daily.streak+1:1;this.save.daily={date:c,score:Math.max(this.save.daily.score,e.score),done:!0,streak:n?d:this.save.daily.streak}}this.mode==="endless"&&n&&(this.save.endlessBest=Math.max(this.save.endlessBest,this.stage+1)),this.mode==="arcade"&&(this.save.arcadeBest=Math.max(this.save.arcadeBest,n?e.score:0)),this.mode==="bossrush"&&(this.save.bossRushBest=Math.max(this.save.bossRushBest,n?this.round:this.round-1)),this.evaluateAchievements(n,r),kt(this.save),this.ui.setSave(this.save),nt.play(n?"win":"lose");const l=e.events.find(c=>c.type==="lose")?.color??void 0;this.ui.showResult(o,this.mode,n,{kills:i.kills,accuracy:i.accuracy,damageTaken:i.damageTaken},l)}evaluateAchievements(e,t){const n=new Set(this.save.achievements),i=a=>{if(n.has(a))return;n.add(a);const o=Dr.find(l=>l.id===a);o&&(this.save.credits+=150,this.ui.toast(`Award unlocked: ${o.name} (+150 ¤)`))},r=Bs(this.save);r>=1&&i("first-contact"),r>=10&&i("squadron-rookie"),this.save.totalKills>=250&&i("alien-hunter"),e&&this.sim&&this.sim.damageTaken===0&&i("shield-master"),this.save.secondaryUsed.length>=5&&i("missile-commander"),this.dronePeak>=2&&i("drone-specialist"),e&&this.mission?.objective.kind==="boss"&&i("boss-breaker");for(let a=1;a<=10;a+=1)Lr(this.save,a).cleared>=lt.missionsPerSector&&i("sector-liberator");r>=100&&i("missions-100"),r>=200&&i("missions-200"),r>=300&&i("missions-300"),this.save.endlessBest>=10&&i("endless-survivor"),t===3&&this.mission?.sector===10&&i("starfall-legend"),this.save.ships.length>=5&&i("hangar-collector"),this.save.daily.done&&i("daily-habit"),this.save.bossRushBest>=3&&i("rush-hour"),this.save.achievements=[...n]}debugState(){return this.sim?{...this.sim.snapshot(),mission:this.mission?.id??null,mode:this.mode,enemies:this.sim.enemies.length,bullets:this.sim.bullets.length,paused:this.paused,playerX:Math.round(this.sim.player.x*10)/10,playerY:Math.round(this.sim.player.y*10)/10,kills:this.sim.kills,damageTaken:Math.round(this.sim.damageTaken)}:null}debugWin(){this.sim?.grantVictory()}debugGrant(e){this.sim?.grantPowerup(e)}}const en=new Ag,Rg={state:()=>en.debugState(),start:s=>en.startMission(s),win:()=>en.debugWin(),grant:s=>en.debugGrant(s),pause:()=>en.pause(),resume:()=>en.resume(),menu:()=>en.quit(),secondary:()=>en.secondary(),bomb:()=>en.bomb(),ability:()=>en.ability()};window.__ss=Rg;
