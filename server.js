// Mocajuba Mortal — servidor de salas (HTTP para o jogo + WebSocket para as partidas)
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');
const MAX_PLAYERS = 8;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.json': 'application/json', '.ico': 'image/x-icon' };

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url === '/saude') { res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end('ok'); }
  let file = path.normalize(path.join(PUBLIC, url === '/' ? 'index.html' : url));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('não encontrado'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server, maxPayload: 64 * 1024 });
const rooms = new Map();   // código -> { code, seed, host, state, players: Map(id -> {id, name, car, ws}) }
let nextId = 1;

const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
function newCode() {
  for (;;) { const c = 'MOC-' + LETTERS[Math.random() * LETTERS.length | 0] + (10 + (Math.random() * 90 | 0)); if (!rooms.has(c)) return c; }
}
const roster = room => [...room.players.values()].map(p => ({ id: p.id, name: p.name, car: p.car }));
function send(ws, msg) { if (ws.readyState === 1) ws.send(JSON.stringify(msg)); }
function broadcast(room, msg, exceptId) { const s = JSON.stringify(msg); for (const p of room.players.values()) if (p.id !== exceptId && p.ws.readyState === 1) p.ws.send(s); }
const clean = (s, n) => String(s || '').replace(/[<>&"]/g, '').trim().slice(0, n);

// mensagens de jogo que o servidor apenas repassa para os outros da sala
const RELAY = new Set(['s', 'imp', 'fire', 'boom', 'dead', 'pick', 'pspawn', 'mine', 'mineX', 'hit', 'end', 'chat', 'boto']);

wss.on('connection', ws => {
  const me = { id: nextId++, name: 'Jogador', car: 'eletrico', ws, room: null };
  ws.isAlive = true; ws.on('pong', () => { ws.isAlive = true; });
  send(ws, { t: 'hello', id: me.id });

  ws.on('message', raw => {
    let m; try { m = JSON.parse(raw); } catch (e) { return; }
    const room = me.room;
    if (m.t === 'create' || m.t === 'join') {
      if (room) leave();
      me.name = clean(m.name, 14) || 'Jogador'; me.car = clean(m.car, 12) || 'eletrico';
      let r;
      if (m.t === 'create') {
        const seed = Math.max(1, Math.min(999999, (m.seed | 0) || 1 + (Math.random() * 99999 | 0)));
        r = { code: newCode(), seed, host: me.id, state: 'lobby', players: new Map() };
        rooms.set(r.code, r);
      } else {
        r = rooms.get(clean(m.code, 10).toUpperCase());
        if (!r) return send(ws, { t: 'err', msg: 'Sala não encontrada. Confira o código.' });
        if (r.players.size >= MAX_PLAYERS) return send(ws, { t: 'err', msg: 'Sala cheia (máximo 8).' });
        if (r.state !== 'lobby') return send(ws, { t: 'err', msg: 'A partida já começou. Espere ela acabar e tente de novo.' });
      }
      r.players.set(me.id, me); me.room = r;
      send(ws, { t: 'joined', you: me.id, code: r.code, seed: r.seed, host: r.host, players: roster(r) });
      broadcast(r, { t: 'roster', host: r.host, players: roster(r) }, me.id);
      return;
    }
    if (!room) return;
    if (m.t === 'setCar' || m.t === 'setName') {
      if (m.car) me.car = clean(m.car, 12); if (m.name) me.name = clean(m.name, 14) || me.name;
      broadcast(room, { t: 'roster', host: room.host, players: roster(room) });
      return;
    }
    if (m.t === 'start' && me.id === room.host && room.state === 'lobby') {
      room.state = 'playing';
      broadcast(room, { t: 'start', plan: m.plan, from: me.id });   // o anfitrião define bots, nascimentos e armas
      return;
    }
    if (m.t === 'lobby' && me.id === room.host) {
      room.state = 'lobby';
      broadcast(room, { t: 'lobby', host: room.host, players: roster(room) });
      return;
    }
    if (m.t === 'leave') return leave();
    if (RELAY.has(m.t)) { m.from = me.id; broadcast(room, m, me.id); }
  });

  function leave() {
    const r = me.room; if (!r) return;
    r.players.delete(me.id); me.room = null;
    if (!r.players.size) { rooms.delete(r.code); return; }
    if (r.host === me.id) r.host = r.players.keys().next().value;   // outro jogador vira anfitrião
    broadcast(r, { t: 'left', id: me.id, host: r.host, players: roster(r) });
  }
  ws.on('close', leave);
  ws.on('error', leave);
});

// derruba conexões mortas (celular que perdeu sinal)
setInterval(() => { for (const ws of wss.clients) { if (!ws.isAlive) { ws.terminate(); continue; } ws.isAlive = false; ws.ping(); } }, 15000);

server.listen(PORT, () => console.log(`Mocajuba Mortal online na porta ${PORT}`));
