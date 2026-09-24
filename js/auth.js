// --- js/auth.js ---
// Fichier partagé par toutes les pages : connexion, token, lien "Profil" dans le menu.

// URL de ton service Render (déjà déployé). Si tu recrées un service, change juste cette ligne.
const API_URL = "https://japan-f537.onrender.com";

function getToken() { return localStorage.getItem('auth-token'); }
function getUsername() { return localStorage.getItem('username'); }
function getAvatar() { return localStorage.getItem('avatarUrl') || ""; }
function estConnecte() { return !!getToken(); }

function deconnexion() {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('username');
  localStorage.removeItem('avatarUrl');
  location.href = 'index.html';
}

// Wrapper fetch qui ajoute automatiquement le token
async function apiFetch(path, options = {}) {
  const headers = options.headers || {};
  headers['Content-Type'] = 'application/json';
  if (estConnecte()) headers['auth-token'] = getToken();
  const res = await fetch(API_URL + path, { ...options, headers });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Erreur ${res.status}`);
  }
  const contentType = res.headers.get('content-type') || '';
  return contentType.includes('application/json') ? res.json() : res.text();
}

// Injecte le lien "Profil" ou "Connexion" à la fin du menu <nav id="main-nav">
function injecterLienProfil() {
  const nav = document.getElementById('main-nav') || document.querySelector('nav');
  if (!nav) return;
  const a = document.createElement('a');
  if (estConnecte()) {
    a.href = 'profil.html';
    a.innerHTML = `👤 ${getUsername()}`;
  } else {
    a.href = 'profil.html';
    a.innerHTML = `👤 Connexion`;
  }
  nav.appendChild(a);
}

document.addEventListener('DOMContentLoaded', injecterLienProfil);
