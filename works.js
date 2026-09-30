/*
  音ふらり サイトのデータ（ここだけ直せば内容が変わります）
*/

/* 会場（何度も使うのでまとめておく） */
const COEN = {
  venue: "coen Cafe&Bar 月日",
  venueLink: "https://party-co.jp/coen/en-joy",
  venueLogo: "assets/venues/coen.png",
  area: "下北沢",
  address: "〒155-0033 東京都世田谷区代田6-6-1 4F",
};

/* ── Works：開催するたびに 1 ブロック足す。no の小さい順（Vol.01 が上）に並びます ──
  no        : 回数（数字）
  date      : "2026.10.24" の形。未定なら ""（今日以降の日付は Upcoming と予約ボタンが付きます）
  venue     : 会場名
  venueLink : 会場のURL（任意）
  venueLogo : 会場ロゴ（白抜きPNG）。任意。ロゴの下に会場名も出ます
  area      : エリア
  address   : 住所（任意。地図にリンクします）
  lineup    : 出演者・出展者の配列
  photo     : "assets/works/ファイル名.jpg"。無ければ ""
  photoFit  : "contain" にすると切らずに全体を表示（告知画像など）
  title     : コラボ名など（任意）
  link      : 相手先のURL（任意。title がリンクになります）
  text      : ひとこと（任意。\n で改行）
*/
const WORKS = [
  {
    no: 2, date: "2026.10.24", lineup: [], photo: "assets/works/nouei-logo.jpg",
    title: "NOUEI", link: "https://nouei.base.shop/",
    text: "Oto Furariを通じて、\nNOUEIのレアベジに出会う。",
  },
  {
    no: 1, date: "2026.06.13", venue: "", venueLogo: "", area: "浅草", lineup: ["Oto Furari Band"], photo: "assets/works/dobopro-logo.jpg",
    title: "土木実践学生集団 ドボプロ", link: "https://dobo-pro.studio.site/",
    text: "海外渡航前の研修と交流の場を、\n音楽で盛り上げました。",
  },
];

/* ── Videos ── */
const MEDIA = {
  youtubeId: "",          // 例: https://youtu.be/AbCdEf12345 なら "AbCdEf12345"
  instagram: "otofurari_music_tokyo",
  instagramPosts: [       // 投稿URLを 3〜6 件
    // "https://www.instagram.com/p/XXXXXXXX/",
  ],
};

/* ── Reserve：予約ページのイベント ──
  time は任意。coupon があると、ボタンを押した人にクーポンを見せてから link へ進みます
*/
const EVENTS = [
  {
    date: "2026.10.24", day: "Sat",
    title: "音ふらり × NOUEI",
    sub: "音と野菜で繋がる国際交流会",
    ...COEN,
    image: "assets/events/20261024-nouei.jpg", imageBg: "",
    link: "https://luma.com/fnr14fys",
    coupon: "",
  },
  {
    date: "2026.11.14", day: "Sat",
    title: "音ふらり at coen",
    sub: "共創フェス",
    ...COEN,
    time: "10:00-21:00  Music 18:00 / 20:00",
    image: "assets/events/20261114-kyoso-fes.jpg", imageBg: "",
    link: "https://party-co.jp/coen/fes/2611",
    coupon: "KFOF500",
  },
];
