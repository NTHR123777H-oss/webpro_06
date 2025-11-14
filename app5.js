const express = require("express");
const app = express();
const port = 8080; // ポート番号を先頭で定義

// EJSと静的ファイル（CSSや画像用）の設定
app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

// --- 京葉線データ1（駅の追加・一覧）---

// ▼ 修正点3: station変数を使用するルーティング（/keiyo_add）の前に定義
let station = [
  { id:1, code:"JE01", name:"東京駅"},
  { id:2, code:"JE07", name:"舞浜駅"},
  { id:3, code:"JE12", name:"新習志野駅"},
  { id:4, code:"JE13", name:"幕張豊砂駅"},
  { id:5, code:"JE14", name:"海浜幕張駅"},
  { id:6, code:"JE05", name:"新浦安駅"},
];

app.get("/keiyo", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('db1', { data: station });
});

// このルートは station 変数を使用
app.get("/keiyo_add", (req, res) => {
  let id = req.query.id;
  let code = req.query.code;
  let name = req.query.name;
  let newdata = { id: id, code: code, name: name };
  station.push( newdata );
  
  // 処理後に一覧ページに戻る（リダイレクト）ことを推奨
  res.redirect('/keiyo'); 
});


// --- 京葉線データ2（詳細ページあり）---

let station2 = [
  { id:1, code:"JE01", name:"東京駅", change:"総武本線，中央線，etc", passengers:403831, distance:0 },
  { id:2, code:"JE02", name:"八丁堀駅", change:"日比谷線", passengers:31071, distance:1.2 },
  { id:3, code:"JE05", name:"新木場駅", change:"有楽町線，りんかい線", passengers:67206, distance:7.4 },
  { id:4, code:"JE07", name:"舞浜駅", change:"舞浜リゾートライン", passengers:76156,distance:12.7 },
  { id:5, code:"JE12", name:"新習志野駅", change:"", passengers:11655, distance:28.3 },
  { id:6, code:"JE17", name:"千葉みなと駅", change:"千葉都市モノレール", passengers:16602, distance:39.0 },
  { id:7, code:"JE18", name:"蘇我駅", change:"内房線，外房線", passengers:31328, distance:43.0 },
];

// 一覧ページ
app.get("/keiyo2", (req, res) => {
  res.render('keiyo2', {data: station2} );
});

// 詳細ページ
// ▼ 修正点4: 配列インデックスではなく「id」で検索し、エラー処理を追加
app.get("/keiyo2/:number", (req, res) => {
  const number = req.params.number;
  
  // id が number と一致するデータを配列から探す
  const detail = station2.find( item => item.id == number );
  
  if (detail) {
    // データが見つかった場合
    res.render('keiyo2_detail', {data: detail} );
  } else {
    // データが見つからなかった場合
    res.status(404).send("Error: Station not found");
  }
});


// --- その他のルート ---

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/omikuji1", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  
  // ▼ 修正点1: 1〜6までの全てのパターンを網羅
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  else if( num==3 ) luck = '小吉';
  else if( num==4 ) luck = '吉';
  else if( num==5 ) luck = '末吉';
  else luck = '凶'; // numが6の場合

  res.send( '今日の運勢は' + luck + 'です' );
});

app.get("/omikuji2", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';

  // ▼ 修正点1: 1〜6までの全てのパターンを網羅
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  else if( num==3 ) luck = '小吉';
  else if( num==4 ) luck = '吉';
  else if( num==5 ) luck = '末吉';
  else luck = '凶'; // numが6の場合

  res.render( 'omikuji2', {result:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win ) || 0; // || 0 を追加 (初回アクセス時のエラー防止)
  let total = Number( req.query.total ) || 0; // || 0 を追加

  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';

  // ▼ 修正点2: 勝敗判定ロジックを実装
  let judgement = '';
  if( hand == cpu ){
    judgement = 'あいこ';
  } else if(
    (hand == 'グー' && cpu == 'チョキ') ||
    (hand == 'チョキ' && cpu == 'パー') ||
    (hand == 'パー' && cpu == 'グー')
  ){
    judgement = '勝ち';
    win += 1; // 勝った時だけwinを増やす
  } else {
    judgement = '負け';
  }
  
  // あいこでも「合計」は増やす
  if(judgement != 'あいこ') {
      total += 1;
  }
  
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});


// --- サーバー起動 ---
// (app.listen は、通常ファイルの最後に1回だけ記述します)
app.listen(port, () => console.log(`Example app listening on port ${port}!`));