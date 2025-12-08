process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
import './config.js';
import { createRequire } from 'module';
import path, { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import fs, { readdirSync, statSync, unlinkSync, existsSync, mkdirSync, rmSync, watch } from 'fs';
import yargs from 'yargs';
import { spawn } from 'child_process';
import lodash from 'lodash';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import { tmpdir } from 'os';
import { format } from 'util';
import pino from 'pino';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import readline from 'readline';
import NodeCache from 'node-cache';

const sessionFolder = path.join(process.cwd(), global.authFile || 'sessioni');

function clearSessionFolderSelective(dir = sessionFolder) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return;
  }
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (entry === 'creds.json') continue;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      clearSessionFolderSelective(fullPath);
      fs.rmdirSync(fullPath);
    } else {
      if (!entry.startsWith('pre-key')) {
        try {
          fs.unlinkSync(fullPath);
        } catch {}
      }
    }
  }
  console.log(`Cartella sessioni pulita (file non critici rimossi): ${new Date().toLocaleTimeString()}`);
}

function purgeSession(sessionDir, cleanPreKeys = false) {
  if (!existsSync(sessionDir)) return;
  const files = readdirSync(sessionDir);
  files.forEach(file => {
    if (file === 'creds.json') return;
    const filePath = path.join(sessionDir, file);
    const stats = statSync(filePath);
    const fileAge = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24);
    if (file.startsWith('pre-key') && cleanPreKeys) {
      if (fileAge > 1) {
        try {
          unlinkSync(filePath);
        } catch {}
      }
    } else if (!file.startsWith('pre-key')) {
      try {
        if (stats.isDirectory()) {
          rmSync(filePath, { recursive: true, force: true });
        } else {
          unlinkSync(filePath);
        }
      } catch {}
    }
  });
}

setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  clearSessionFolderSelective();
}, 30 * 60 * 1000);

setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  purgeSession(`./sessioni`);
  const subBotDir = `./${global.authFileJB}`;
  if (existsSync(subBotDir)) {
    const subBotFolders = readdirSync(subBotDir).filter(file => statSync(join(subBotDir, file)).isDirectory());
    subBotFolders.forEach(folder => purgeSession(join(subBotDir, folder)));
  }
}, 3 * 60 * 1000);

setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  purgeSession(`./${global.authFile}`, true);
  const subBotDir = `./${global.authFileJB}`;
  if (existsSync(subBotDir)) {
    const subBotFolders = readdirSync(subBotDir).filter(file => statSync(join(subBotDir, file)).isDirectory());
    subBotFolders.forEach(folder => purgeSession(join(subBotDir, folder), true));
  }
}, 3 * 60 * 60 * 1000);

const DisconnectReason = {
  connectionClosed: 428,
  connectionLost: 408,
  connectionReplaced: 440,
  timedOut: 408,
  loggedOut: 401,
  badSession: 500,
  restartRequired: 515,
  multideviceMismatch: 411,
  forbidden: 403,
  unavailableService: 503
};

const { useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, Browsers, jidNormalizedUser, getPerformanceConfig, setPerformanceConfig, getCacheStats, clearCache, Logger, makeInMemoryStore } = await import('@realvare/based');
const { chain } = lodash;
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
protoType();
serialize();
global.isLogoPrinted = false;
global.qrGenerated = false;
global.connectionMessagesPrinted = {};
let methodCodeQR = process.argv.includes("qr");
let methodCode = process.argv.includes("code");
let MethodMobile = process.argv.includes("mobile");
let phoneNumber = global.botNumberCode;

function redefineConsoleMethod(methodName, filterStrings) {
  const originalConsoleMethod = console[methodName];
  console[methodName] = function () {
    const message = arguments[0];
    if (typeof message === 'string' && filterStrings.some(filterString => message.includes(atob(filterString)))) {
      arguments[0] = "";
    }
    originalConsoleMethod.apply(console, arguments);
  };
}

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};

global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
};

global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '');
global.timestamp = { start: new Date };
const __dirname = global.__dirname(import.meta.url);
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp('^[' + (opts['prefix'] || '*/!#$%+£¢€¥^°=¶∆×÷π√✓©®&.\\-.@').replace(/[|\\{}()[\]^$+*.\-\^]/g, '\\$&') + ']');
global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile('database.json'));
global.DATABASE = global.db;
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) {
    return new Promise((resolve) => setInterval(async function () {
      if (!global.db.READ) {
        clearInterval(this);
        resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
      }
    }, 1 * 1000));
  }
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read().catch(console.error);
  global.db.READ = null;
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {}),
  };
  global.db.chain = chain(global.db.data);
};
loadDatabase();

if (global.conns instanceof Array) {
  console.log('Connessioni già inizializzate...');
} else {
  global.conns = [];
}

global.creds = 'creds.json';
global.authFile = 'sessioni';
global.authFileJB = 'chatunity-sub';

setPerformanceConfig({
  performance: {
    enableCache: true,
    enableMetrics: true
  },
  debug: {
    enableLidLogging: true,
    logLevel: 'silent'
  }
});

const { state, saveCreds } = await useMultiFileAuthState(global.authFile);
const msgRetryCounterMap = (MessageRetryMap) => { };
const msgRetryCounterCache = new NodeCache();
const { version } = await fetchLatestBaileysVersion();
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

const question = (t) => {
  rl.clearLine(rl.input, 0);
  return new Promise((resolver) => {
    rl.question(t, (r) => {
      rl.clearLine(rl.input, 0);
      resolver(r.trim());
    });
  });
};

let opzione;
if (!methodCodeQR && !methodCode && !fs.existsSync(`./${authFile}/creds.json`)) {
  do {
    const menu = `
  1️⃣ Codice QR
  2️⃣ Codice 8 caratteri
`;
    opzione = await question(menu + '\nInserisci la tua scelta ---> ');
    if (!/^[1-2]$/.test(opzione)) {
      console.log('Opzione non valida, inserisci 1 o 2');
    }
  } while ((opzione !== '1' && opzione !== '2') || fs.existsSync(`./${authFile}/creds.json`));
}

// ─────────────────────────────
// ASCII LOGO DTH-BOT
// ─────────────────────────────
if (!global.isLogoPrinted) {
  const DTH_BOT_LOGO = chalk.hex('#3b0d95')(`
 _____  _____ _   _     ____   ____  _____ 
|  __ \\|_   _| \\ | |   |  _ \\ / __ \\|_   _|
| |  | | | | |  \\| |   | |_) | |  | | | |  
| |  | | | | | . \` |   |  _ <| |  | | | |  
| |__| |_| |_| |\\  |   | |_) | |__| |_| |_ 
|_____/|_____|_| \\_|   |____/ \\____/|_____|

               DTH-BOT
`);
  console.log(DTH_BOT_LOGO);
  global.isLogoPrinted = true;
  await chatunityedition();
}

// ─────────────────────────────
// Il resto del main.js rimane identico al file originale
// con tutte le funzioni: connectionUpdate, connectSubBots, reloadHandler, watcher, quickTest, sub-bot ecc.
// ─────────────────────────────
