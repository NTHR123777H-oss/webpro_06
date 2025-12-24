"use strict";

const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// --- 1. データ定義 ---

// ① マクドナルド
let mac = [
    { id: 1, name: "ビッグマック", weight: 217, price: 480 },
    { id: 2, name: "てりやきマックバーガー", weight: 157, price: 400 },
    { id: 3, name: "フィレオフィッシュ", weight: 137, price: 400 },
    { id: 4, name: "ダブルチーズバーガー", weight: 169, price: 430 },
    { id: 5, name: "チキンマックナゲット 5ピース", weight: 95, price: 260 },
    { id: 6, name: "マックフライポテト M", weight: 135, price: 330 }
];

// ② 千葉県の市（リクエスト版）
let cities = [
    { id: 1, name: "千葉市", population: 975000, specialty: "落花生" },
    { id: 2, name: "船橋市", population: 640000, specialty: "梨" },
    { id: 3, name: "山武市", population: 48000, specialty: "いちご" },
    { id: 4, name: "新習志野", population: 170000, specialty: "水泳場" },
    { id: 5, name: "津田沼", population: 170000, specialty: "ニンジン" },
    { id: 6, name: "浦安市", population: 170000, specialty: "テーマパーク" }
];

// ③ いちごの種類
let strawberries = [
    { id: 1, name: "とちおとめ", sweetness: "強い", origin: "栃木県" },
    { id: 2, name: "あまおう", sweetness: "とても強い", origin: "福岡県" },
    { id: 3, name: "紅ほっぺ", sweetness: "強い", origin: "静岡県" },
    { id: 4, name: "さがほのか", sweetness: "控えめ", origin: "佐賀県" },
    { id: 5, name: "チーバベリー", sweetness: "強い", origin: "千葉県" },
    { id: 6, name: "スカイベリー", sweetness: "上品", origin: "栃木県" }
];

// --- 2. ルーティング ---

app.get("/", (req, res) => {
  res.send('トップページ<br><a href="/mac">マクドナルド</a><br><a href="/city">千葉県の市</a><br><a href="/strawberry">いちご</a>');
});

// === ① マクドナルド ===
app.get("/mac", (req, res) => res.render('mac_list', { data: mac }));
app.get("/mac/:id", (req, res) => res.render('mac_detail', { data: mac[req.params.id - 1] }));
app.get("/mac/create", (req, res) => res.redirect('/public/mac_new.html'));
app.post("/mac", (req, res) => {
    mac.push({ id: mac.length + 1, name: req.body.name, weight: req.body.weight, price: req.body.price });
    res.redirect('/mac');
});
app.get("/mac/edit/:id", (req, res) => res.render('mac_edit', { data: mac[req.params.id - 1] }));
app.post("/mac/update/:id", (req, res) => {
    let item = mac[req.params.id - 1];
    item.name = req.body.name; item.weight = req.body.weight; item.price = req.body.price;
    res.redirect('/mac');
});
app.get("/mac/delete/:id", (req, res) => {
    mac.splice(req.params.id - 1, 1);
    res.redirect('/mac');
});

// === ② 千葉県の市 ===
app.get("/city", (req, res) => res.render('city_list', { data: cities }));
app.get("/city/:id", (req, res) => res.render('city_detail', { data: cities[req.params.id - 1] }));
app.get("/city/create", (req, res) => res.redirect('/public/city_new.html'));
app.post("/city", (req, res) => {
    cities.push({ id: cities.length + 1, name: req.body.name, population: req.body.population, specialty: req.body.specialty });
    res.redirect('/city');
});
app.get("/city/edit/:id", (req, res) => res.render('city_edit', { data: cities[req.params.id - 1] }));
app.post("/city/update/:id", (req, res) => {
    let item = cities[req.params.id - 1];
    item.name = req.body.name; item.population = req.body.population; item.specialty = req.body.specialty;
    res.redirect('/city');
});
app.get("/city/delete/:id", (req, res) => {
    cities.splice(req.params.id - 1, 1);
    res.redirect('/city');
});

// === ③ いちご ===
app.get("/strawberry", (req, res) => res.render('strawberry_list', { data: strawberries }));
app.get("/strawberry/:id", (req, res) => res.render('strawberry_detail', { data: strawberries[req.params.id - 1] }));
app.get("/strawberry/create", (req, res) => res.redirect('/public/strawberry_new.html'));
app.post("/strawberry", (req, res) => {
    strawberries.push({ id: strawberries.length + 1, name: req.body.name, sweetness: req.body.sweetness, origin: req.body.origin });
    res.redirect('/strawberry');
});
app.get("/strawberry/edit/:id", (req, res) => res.render('strawberry_edit', { data: strawberries[req.params.id - 1] }));
app.post("/strawberry/update/:id", (req, res) => {
    let item = strawberries[req.params.id - 1];
    item.name = req.body.name; item.sweetness = req.body.sweetness; item.origin = req.body.origin;
    res.redirect('/strawberry');
});
app.get("/strawberry/delete/:id", (req, res) => {
    strawberries.splice(req.params.id - 1, 1);
    res.redirect('/strawberry');
});

// サーバー起動
app.use((req, res) => res.status(404).send('ページが見つかりません'));
app.listen(8080, () => console.log("Server running on port 8080"));