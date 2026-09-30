/* 言語：?lang=en / 前回の選択 / ブラウザの言語 の順で決める。切り替えはボタンで再読み込み */
const LANG = (() => {
  const q = new URLSearchParams(location.search).get("lang");
  try { if (q) localStorage.setItem("lang", q); else { const s = localStorage.getItem("lang"); if (s) return s; } } catch {}
  return q || (navigator.language.startsWith("ja") ? "ja" : "en");
})();
const EN = LANG === "en";
const t = (ja, en) => (EN ? en : ja);
const pick = (o, k) => (EN && o[k + "_en"]) || o[k]; // データの英語版（無ければ日本語）
if (EN) {
  document.documentElement.lang = "en";
  document.querySelectorAll("[data-en]").forEach((el) => (el.innerHTML = el.dataset.en));
  document.querySelectorAll("[data-en-value]").forEach((el) => (el.value = el.dataset.enValue));
  document.querySelectorAll("[data-en-alt]").forEach((el) => (el.alt = el.dataset.enAlt));
  document.querySelectorAll("[data-en-href]").forEach((el) => (el.href = el.dataset.enHref));
}
const langBtn = document.getElementById("lang-toggle");
if (langBtn) {
  langBtn.textContent = EN ? "JP" : "EN";
  langBtn.addEventListener("click", () => {
    const u = new URL(location.href);
    u.searchParams.set("lang", EN ? "ja" : "en");
    location.href = u;
  });
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const br = (s) => esc(s).replace(/\n/g, "<br>");
const $ = (id) => document.getElementById(id);
const venueHTML = (o) => o.venueLink ? `<a href="${esc(o.venueLink)}" target="_blank" rel="noopener">${esc(o.venue)}</a>` : esc(o.venue);
const addressHTML = (o) => o.address ? `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address)}" target="_blank" rel="noopener">${esc(pick(o, "address"))}</a>` : "";
const today = () => { const d = new Date(); return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`; };
const upcoming = EVENTS.filter((e) => e.date >= today());

/* 上部バナーの日付（終わった回は自動で消える） */
if ($("bar-dates")) {
  if (upcoming.length) $("bar-dates").textContent = "Next " + upcoming.map((e) => `${e.date.slice(5)} ${e.day}`).join(" / ");
  else document.querySelector(".bar__notice").remove();
}


/* イベント1件＝フライヤー＋詳細を見る。予約シートと予約ページで共通 */
const eventCard = (e, i) => `
  <li class="ev" id="event-${i}">
    <div class="ev__img${e.imageBg ? " is-logo" : ""}"${e.imageBg ? ` style="background:${esc(e.imageBg)}"` : ""}>
      <img src="${esc(e.image)}" alt="${esc(`${e.date} ${pick(e, "title")} ${pick(e, "sub")}`)}" decoding="async">
    </div>
    ${e.coupon
      ? `<button class="btn" type="button" data-coupon="${i}">${t("詳細を見る", "Details")}</button>`
      : `<a class="btn" href="${esc(e.link)}" target="_blank" rel="noopener">${t("詳細を見る", "Details")}</a>`}
  </li>`;

/* クーポン：予約シートの上にもう1枚ポップアップを重ねて見せる */
const couponPop = document.createElement("dialog");
couponPop.className = "sheet sheet--coupon";
couponPop.setAttribute("aria-label", t("クーポンコード", "Coupon code"));
document.body.append(couponPop);
couponPop.addEventListener("click", (ev) => {
  if (ev.target === couponPop || ev.target.closest(".sheet__close")) couponPop.close();
  const go = ev.target.closest("[data-copy]");
  if (!go) return;
  navigator.clipboard?.writeText(go.dataset.copy).catch(() => {}); // リンクはそのまま開く
  const btn = couponPop.querySelector(".coupon__copy");
  btn.textContent = t("コピーしました", "Copied");
  setTimeout(() => (btn.textContent = t("コピーする", "Copy")), 2000);
});

document.addEventListener("click", (ev) => {
  const open = ev.target.closest("[data-coupon]");
  if (!open) return;
  const e = EVENTS[open.dataset.coupon];
  couponPop.innerHTML = `
    <div class="sheet__inner">
      <button class="sheet__close" type="button" aria-label="${t("閉じる", "Close")}">Close</button>
      <p class="coupon__label">${esc(e.date.slice(5))} ${esc(pick(e, "title"))} ${esc(pick(e, "sub"))}</p>
      <p class="coupon__code">${esc(e.coupon)}</p>
      <button class="coupon__copy" type="button" data-copy="${esc(e.coupon)}">${t("コピーする", "Copy")}</button>
      <p class="coupon__note">${t("予約ページでこのコードを入力してください", "Enter this code on the booking page")}</p>
      <a class="btn" href="${esc(e.link)}" target="_blank" rel="noopener" data-copy="${esc(e.coupon)}">${t("コピーして詳細へ", "Copy &amp; go to details")}</a>
    </div>`;
  couponPop.showModal();
});

/* 予約シート：data-reserve を押すと開く */
const sheet = $("reserve-sheet");
if (sheet) {
  $("sheet-list").innerHTML = upcoming.map((e) => eventCard(e, EVENTS.indexOf(e))).join("");
  document.addEventListener("click", (ev) => {
    if (ev.target.closest("[data-reserve]") && sheet.showModal) { ev.preventDefault(); sheet.showModal(); }
  });
  sheet.querySelector(".sheet__close").addEventListener("click", () => sheet.close());
  sheet.addEventListener("click", (ev) => { if (ev.target === sheet) sheet.close(); }); // 外側タップで閉じる
}


/* 1ページ目の右下：今日以降で一番近いイベント。無ければ消す */
if ($("hero-next")) {
  const next = [...upcoming].sort((a, b) => a.date.localeCompare(b.date))[0];
  if (next) $("hero-next").textContent = `Next ${next.date.slice(5)} ${next.day}${next.venueShort ? ` @ ${next.venueShort}` : ""}`;
  else $("hero-next").remove();
}

/* Works */
if ($("works-list")) $("works-list").innerHTML = [...WORKS]
  .sort((a, b) => a.no - b.no)
  .map((w) => ({ ...w, upcoming: w.date && w.date >= today() }))
  .map((w) => `
    <li class="work">
      <div class="work__photo${w.photoFit === "contain" ? " is-contain" : ""}">${
        w.photo
          ? `<img src="${esc(w.photo)}" alt="Oto Furari Vol.${w.no}" loading="lazy" decoding="async">`
          : `<span class="mark" aria-hidden="true"></span>`
      }</div>
      <p class="work__head"><span>Vol.${String(w.no).padStart(2, "0")}</span>${w.date ? `<span>${esc(w.date)}</span>` : ""}${w.upcoming ? `<span>Upcoming</span>` : ""}</p>
      ${w.title ? `<p class="work__title">${w.link ? `<a href="${esc(w.link)}" target="_blank" rel="noopener">${esc(pick(w, "title"))}</a>` : esc(pick(w, "title"))}</p>` : ""}
      ${w.venueLogo ? `<p class="work__logo"><img src="${esc(w.venueLogo)}" alt="" loading="lazy"></p>` : ""}
      ${w.venue ? `<p class="work__venue">${venueHTML(w)}</p>` : ""}
      ${w.area ? `<p class="work__area">${esc(pick(w, "area"))}</p>` : ""}
      ${w.text ? `<p class="work__text">${br(pick(w, "text"))}</p>` : ""}
      ${w.lineup.length ? `<p class="work__lineup">${w.lineup.map(esc).join("<br>")}</p>` : ""}
      ${w.upcoming ? `<a class="btn work__reserve" href="reserve.html" data-reserve>${t("予約する", "Reserve")}</a>` : ""}
    </li>`)
  .join("");

/* Venue */
if ($("venue-name")) {
  $("venue-name").innerHTML = venueHTML(COEN);
  $("venue-address").innerHTML = addressHTML(COEN);
}

/* YouTube: クリックするまで iframe を読み込まない。未設定なら出さない */
const yt = $("yt");
if (yt && MEDIA.youtubeId) {
  const id = encodeURIComponent(MEDIA.youtubeId);
  yt.innerHTML = `<button class="yt__btn" type="button" aria-label="動画を再生" style="background-image:url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)"></button>`;
  yt.firstChild.addEventListener("click", () => {
    yt.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="Oto Furari" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  });
} else if (yt) yt.remove();

/* Instagram: セクションが近づいたら公式埋め込みを読み込む */
const ig = $("ig");
if (ig && MEDIA.instagramPosts.length) {
  ig.innerHTML = MEDIA.instagramPosts
    .map((u) => `<blockquote class="instagram-media" data-instgrm-permalink="${esc(u)}" data-instgrm-version="14"><a href="${esc(u)}">Instagram</a></blockquote>`)
    .join("");
  new IntersectionObserver((entries, o) => {
    if (!entries[0].isIntersecting) return;
    o.disconnect();
    const s = document.createElement("script");
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    document.body.append(s);
  }, { rootMargin: "600px" }).observe(ig);
}


/* Reserve ページ */
if ($("events")) {
  $("events").innerHTML = upcoming.map((e) => eventCard(e, EVENTS.indexOf(e))).join("");
  if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
}
