# 42 Scan Backup — scan.infinitedrive.xyz のクローン／予備サイト

42 Chain のブロックエクスプローラーを、本家 `scan.infinitedrive.xyz` とは
独立に立ち上げるためのプロジェクト。QL1 版（ql1-scan-backup）の姉妹版。

## 公開中（2026-11-07）

- **サイト: https://42-scan-backup.nepicobsv.workers.dev/**
  （Cloudflare Workers + KV で配信。QL1 版と同じ方式。`worker.js` が KV に
  置いた `index.html` をそのまま返す。Cloudflare Pages は直接アップロード
  API が 500 を返すため使っていない。）
- ページ上部に「予備エクスプローラー（超簡易版）」の告知を常時表示。
- フッターに Guppy's Guide リンク集へのリンクを掲載。
- Guppy's Guide リンク集では「超簡易版」として掲載し、本格版
  （Blockscout 製）は「近日公開」カードで案内している。

## いまあるもの（超簡易版：軽量クローンサイト）

`index.html` 1ファイルだけの静的サイト。サーバーもDBも不要。

- データは 42 Chain の公開EVM RPC（下記3つ、CORS `*`）から
  **ブラウザが直接**読む。本家scanとは無関係に動く。
  1. https://evm-rpc.infinitedrive.xyz （主）
  2. https://evm-rpc-infinite.mschihuahua.org
  3. https://evm-rpc.infinitepanda.xyz
  失敗したら次の RPC へ自動で切り替える（ローテーション）。
- できること：
  - 検索（アドレス / Tx Hash / ブロック番号・Hash）
  - ホーム：最新ブロック一覧、直近Tx（RPCで直近ブロックを走査）、
    平均ブロック時間、ガス価格
  - ブロック詳細（Tx一覧つき）
  - Tx詳細（成否、ガス、手数料、ログ件数、入力データ）
  - アドレス：[42] 残高、Nonce、コントラクト判定、既知トークン12種
    （FISH / PANIC / STARSHIP / ZAP / MARVIN / FOXXEY / TOWEL / CAT42 /
    st42 / QOM / USDT / USDC）残高
  - アドレスのTx履歴は、本家APIが生きている間だけ補完表示（出典明記）。
    本家が落ちたら履歴は出ないが、残高・ブロック・Tx単体はRPCで見られる
    ＝「予備」として一番効く部分は独立している。
- ヘッダーに RPC と本家API の生死を常時表示するので、
  「本家が落ちたから予備で見る」という切り替えが目で分かる。

### QL1 版との違い（2026-11-07 実測）

- **42 Chain の公開RPCは pruned ではない**：ブロック 1（2026-01-29、
  チェーン開始）から最新まで全ブロックが `eth_getBlockByNumber` で読める。
  そのため本サイトはブロック・Txとも全履歴を表示できる
  （QL1 版は直近のみ）。
- ただしチェーン初期（〜約250万ブロック）はEVMのTxが存在しない期間が
  長い（サンプル調査で 50,000 間隔のグリッド＋本家データで確認）。
  実在する初期のTxとして、ZAPトークン作成Tx（ブロック 2,559,696）と
  FISHトークン作成Tx（ブロック 3,251,190）が RPC の
  `eth_getTransactionByHash` / `eth_getTransactionReceipt` で読めることを
  確認済み。
- 空ブロックが多いチェーンなので、ホームの直近Txは最大1,800ブロック
  まで遡って走査する。

## 本格版（完全クローン）への道

本家と同等の「全履歴検索・トークン一覧・コントラクト検証表示」まで
再現したい場合：

- Blockscout v9 を Docker で自前運用する
  （バックエンド Elixir + フロント Next.js + PostgreSQL + Redis）。
  目安：4CPU / 16GB RAM〜、常時稼働のVPSが要る。
- QL1 と違い、42 Chain は公開RPCから全履歴が読めるため、
  アーカイブデータの入手という最大の壁は無い。「今日からインデックス
  開始」で過去分も含めて自前で蓄積できる。

## ファイル

- `index.html` — サイト本体（これだけデプロイすれば動く）
- `worker.js` — Cloudflare Worker（KV の `index.html` を返す）
- `dist/index.html` — デプロイ用コピー（`index.html` と同一）
- `README.md` — このファイル
- `LICENSE` — MIT
