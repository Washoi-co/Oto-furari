/*
  簡易パスワード（関係者だけに見せる期間用）
  ・本当の鍵ではありません。ソースを読めば中身は見えます。目隠し用です
  ・一般公開するときは、index.html と reserve.html から gate.js の1行を消すだけ
  ・パスワードを変える時は、新しいパスワードの SHA-256 を HASH に入れる
    （ターミナルで  printf '新しいパスワード' | shasum -a 256 ）
*/
(() => {
  const HASH = "43e77cc39d76424c059bfe8da6309d22f73bec4038d12491c2da3ebaa6e21b7e"; // otofurari
  const KEY = "otofurari-gate";
  try { if (localStorage.getItem(KEY) === HASH) return; } catch {}

  const root = document.documentElement;
  root.classList.add("is-locked");
  const sha256 = async (s) =>
    [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))]
      .map((b) => b.toString(16).padStart(2, "0")).join("");

  document.addEventListener("DOMContentLoaded", () => {
    const en = !(new URLSearchParams(location.search).get("lang") || navigator.language).startsWith("ja");
    const gate = document.createElement("form");
    gate.className = "gate";
    gate.innerHTML = `
      <span class="mark gate__mark" aria-hidden="true"></span>
      <label class="gate__label" for="gate-pass">${en ? "Password" : "パスワード"}</label>
      <input class="gate__input" id="gate-pass" type="password" autocomplete="current-password" required>
      <button class="btn gate__btn" type="submit">${en ? "Enter" : "入る"}</button>
      <p class="gate__error" role="alert" hidden>${en ? "That password isn’t right." : "パスワードが違います。"}</p>`;
    document.body.prepend(gate);
    gate.querySelector("input").focus();
    gate.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      if ((await sha256(gate.querySelector("input").value.trim())) === HASH) {
        try { localStorage.setItem(KEY, HASH); } catch {}
        gate.remove();
        root.classList.remove("is-locked");
      } else {
        gate.querySelector(".gate__error").hidden = false;
      }
    });
  });
})();
