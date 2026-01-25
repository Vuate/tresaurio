# Tresaurio - Teknik Dökümentasyon

## Proje Özeti

**Tresaurio**, profesyonel trader'lar için geliştirilmiş bir **Kişiselleştirilebilir Trading Dashboard** platformudur. Next.js 16 üzerine inşa edilmiş, gerçek zamanlı piyasa verileri sunan, çoklu borsa desteği olan modüler bir sistemdir.

---

## Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 18, Tailwind CSS |
| State Management | Zustand (persist middleware) |
| Real-time Data | WebSocket (Multi-exchange) |
| API | REST APIs (Binance, OKX, Bybit, Coinbase, CoinGecko, DeFiLlama, Etherscan) |
| Language | TypeScript |

---

## Mimari Yapı

```
tresaurio/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── analytics/pnl/        # PnL hesaplama API
│   │   └── v2/binance/           # Binance proxy endpoints
│   ├── terminal/                 # Terminal sayfaları
│   └── personalized-dashboard/   # Ana dashboard sayfası
├── components/
│   └── terminal/
│       └── personalized-dashboard/   # 35+ Trading Modülü
├── services/
│   └── WebSocketService.ts       # Merkezi WebSocket yönetimi
├── store/                        # Zustand state stores
├── lib/
│   └── personalized-dashboard/   # Hooks, types, utils
└── public/                       # Static assets
```

---

## Çekirdek Servisler

### 1. WebSocketService (`services/WebSocketService.ts`)

Tüm modüllerin gerçek zamanlı veri aldığı merkezi WebSocket yönetim servisi.

**Desteklenen Borsalar:**
| Borsa | Spot Endpoint | Futures Endpoint |
|-------|---------------|------------------|
| Binance | `wss://stream.binance.com:9443/ws` | `wss://fstream.binance.com/ws` |
| OKX | `wss://ws.okx.com:8443/ws/v5/public` | `wss://ws.okx.com:8443/ws/v5/public` |
| Bybit | `wss://stream.bybit.com/v5/public/spot` | `wss://stream.bybit.com/v5/public/linear` |
| Coinbase | `wss://ws-feed.exchange.coinbase.com` | `wss://ws-feed.exchange.coinbase.com` |

**Özellikler:**
- Multi-exchange normalizasyonu (tüm borsalardan gelen veri Binance formatına dönüştürülür)
- Otomatik reconnect (3 deneme)
- REST API fallback (sadece Binance)
- Symbol format dönüşümü (BTCUSDT → BTC-USDT for OKX)

**Kullanım:**
```typescript
import { wsService } from "@/services/WebSocketService";

const unsubscribe = wsService.subscribe(
  "btcusdt@ticker",           // stream
  (data) => console.log(data), // callback
  "spot",                      // marketType
  "binance"                    // exchange
);
```

---

## State Management (Zustand Stores)

### Store Listesi

| Store | Dosya | Amaç |
|-------|-------|------|
| `portfolioStore` | `store/portfolioStore.ts` | Spot ve Futures pozisyonları |
| `futuresPositionStore` | `store/futuresPositionStore.ts` | Futures pozisyon yönetimi |
| `priceStore` | `store/priceStore.ts` | Canlı fiyat cache'i |
| `alertStore` | `store/alertStore.ts` | Fiyat alarmları |
| `orderBookStore` | `store/orderBookStore.ts` | Order book verileri |
| `whaleStore` | `store/whaleStore.ts` | Whale transferleri |
| `exchangeFlowStore` | `store/exchangeFlowStore.ts` | Borsa giriş/çıkış akışları |
| `dashboardNotificationStore` | `store/dashboardNotificationStore.ts` | UI bildirimleri |
| `personalizedDashboardStore` | `store/personalizedDashboardStore.ts` | Dashboard layout/workspace |

### portfolioStore Örneği
```typescript
interface SpotPosition {
  id: string;
  exchange: string;        // "binance", "okx", etc.
  baseAsset: string;       // "BTC"
  quoteAsset: string;      // "USDT"
  symbol: string;          // "BTCUSDT"
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  totalCost: number;
}
```

---

## Modül Sistemi

### Modül Kategorileri

| Kategori | Açıklama | Modül Sayısı |
|----------|----------|--------------|
| `market-data` | Piyasa Verileri | 5 |
| `market-microstructure` | Likidite & Spread Analizi | 5 |
| `flow` | Akış & Transfer Analizi | 5 |
| `portfolio` | Portföy Yönetimi | 6 |
| `alert` | Alarm Sistemi | 2 |
| `news` | Haberler | 1 |
| `events` | Takvim & Etkinlikler | 3 |
| `analytics` | Analitik Araçlar | 4 |
| `actions` | Trading Aksiyonları | 4 |

---

## Modül Detayları

### Market Data Modülleri

#### 1. LivePricesModule
- **Amaç:** Canlı kripto fiyatları
- **Veri Kaynağı:** WebSocket (Anlık)
- **Özellikler:** Multi-exchange, 24h değişim, hacim

#### 2. OrderBookModule
- **Amaç:** Emir defteri görselleştirme
- **Veri Kaynağı:** WebSocket (Anlık)
- **Özellikler:** Bid/Ask derinliği, spread hesaplama

#### 3. FundingRateModule
- **Amaç:** Futures funding rate takibi
- **Veri Kaynağı:** WebSocket (Anlık)
- **Özellikler:** Multi-exchange funding karşılaştırma

#### 4. RSIHeatmapModule
- **Amaç:** RSI değerlerinin ısı haritası
- **Veri Kaynağı:** REST API (5 dakika)
- **Özellikler:** Overbought/oversold tespiti

#### 5. ExchangeComparisonModule
- **Amaç:** Borsalar arası fiyat karşılaştırma
- **Veri Kaynağı:** REST API (5 dakika)
- **Özellikler:** Arbitraj fırsatları tespiti

---

### Market Microstructure Modülleri

#### 6. SpreadMonitorModule
- **Amaç:** Bid-Ask spread takibi
- **Veri Kaynağı:** WebSocket (Anlık, 500ms throttle)
- **Özellikler:** Gerçek spread hesaplama, multi-exchange

#### 7. LiquidityAnalysisModule
- **Amaç:** Likidite derinlik analizi
- **Veri Kaynağı:** WebSocket (Anlık)
- **Özellikler:** Alış/satış basıncı, likidite skoru

#### 8. SlippageMonitorModule
- **Amaç:** Slippage takibi
- **Veri Kaynağı:** Order execution data
- **Özellikler:** Ortalama slippage, maksimum kayıp

#### 9. MarketEfficiencyModule
- **Amaç:** Piyasa etkinlik skoru
- **Veri Kaynağı:** Calculated metrics
- **Özellikler:** Spread, derinlik, volatilite skorları

---

### Flow Modülleri

#### 10. ExchangeFlowModule
- **Amaç:** Borsa giriş/çıkış akışları
- **Veri Kaynağı:** REST API (5 dakika)
- **Özellikler:** Deposit/withdraw takibi

#### 11. ExchangeNetflowModule
- **Amaç:** Net borsa akışı
- **Veri Kaynağı:** WebSocket (Anlık)
- **Özellikler:** Accumulation/distribution tespiti

#### 12. WhaleAlertsModule
- **Amaç:** Büyük transferlerin takibi
- **Veri Kaynağı:** WebSocket (Anlık)
- **Özellikler:** $100K+ transferler

#### 13. TokenFlowModule
- **Amaç:** Token akış analizi
- **Veri Kaynağı:** Blockchain API
- **Özellikler:** Cüzdan-borsa transferleri

#### 14. ETFFlowsModule
- **Amaç:** Bitcoin ETF akışları
- **Veri Kaynağı:** REST API (24 saat)
- **Özellikler:** IBIT, GBTC, FBTC takibi

---

### Portfolio Modülleri

#### 15. SpotPositionsModule
- **Amaç:** Spot pozisyon yönetimi
- **Veri Kaynağı:** portfolioStore + WebSocket fiyatlar
- **Özellikler:** PnL hesaplama, pozisyon ekleme/silme

#### 16. FuturesPositionsModule
- **Amaç:** Futures pozisyon yönetimi
- **Veri Kaynağı:** futuresPositionStore + WebSocket
- **Özellikler:** Leverage, likidasyon fiyatı, margin

#### 17. PnLOverviewModule
- **Amaç:** Genel PnL özeti
- **Veri Kaynağı:** usePnL hook
- **Özellikler:** Spot + Futures birleşik PnL

#### 18. PnLAnalysisModule
- **Amaç:** Detaylı PnL analizi
- **Veri Kaynağı:** usePnL hook + stores
- **Özellikler:** ROI, en iyi/kötü performans, zaman bazlı analiz

#### 19. StackPositionModule
- **Amaç:** Staking pozisyonları
- **Veri Kaynağı:** localStorage
- **Özellikler:** APR takibi, reward takvimi

#### 20. WalletInspectorModule
- **Amaç:** Cüzdan inceleme
- **Veri Kaynağı:** Etherscan API
- **Özellikler:** ETH bakiye, son işlemler

---

### Analytics Modülleri

#### 21. RiskCalculatorModule
- **Amaç:** Risk hesaplama
- **Özellikler:** Position sizing, stop-loss hesaplama

#### 22. DCACalculatorModule
- **Amaç:** Dollar Cost Averaging hesaplama
- **Özellikler:** Ortalama maliyet simülasyonu

#### 23. AllInCostCalculatorModule
- **Amaç:** Toplam maliyet hesaplama
- **Özellikler:** Fee dahil gerçek maliyet

#### 24. FeeStructureAnalyzerModule
- **Amaç:** Fee yapısı analizi
- **Özellikler:** Maker/taker fee karşılaştırma

---

### Event Modülleri

#### 25. TokenUnlockModule
- **Amaç:** Token unlock takvimi
- **Veri Kaynağı:** CoinGecko API (24 saat)
- **Özellikler:** Yaklaşan unlocklar, vesting

#### 26. ICOCalendarModule
- **Amaç:** ICO/IDO takvimi
- **Veri Kaynağı:** DeFiLlama Raises API (24 saat)
- **Özellikler:** Yaklaşan token satışları

#### 27. RewardCalendarModule
- **Amaç:** Staking reward takvimi
- **Veri Kaynağı:** CoinGecko API (1 saat)
- **Özellikler:** Günlük reward tahminleri

---

### Alert & News Modülleri

#### 28. CreateAlertModule
- **Amaç:** Fiyat alarmı oluşturma
- **Veri Kaynağı:** alertStore
- **Özellikler:** Above/below koşulları

#### 29. ActiveAlertsModule
- **Amaç:** Aktif alarmlar listesi
- **Veri Kaynağı:** alertStore + WebSocket
- **Özellikler:** Gerçek zamanlı tetikleme

#### 30. NewsModule
- **Amaç:** Kripto haberleri
- **Veri Kaynağı:** News API
- **Özellikler:** Sentiment analizi

---

### Action Modülleri

#### 31. SpotActionsModule
- **Amaç:** Spot işlem arayüzü
- **Özellikler:** Buy/Sell, Market/Limit orders

#### 32. FuturesActionsModule
- **Amaç:** Futures işlem arayüzü
- **Özellikler:** Long/Short, Leverage ayarı

#### 33. LastOrdersModule
- **Amaç:** Son işlemler listesi
- **Veri Kaynağı:** useLastOrders hook
- **Özellikler:** Order history

---

## Veri Güncelleme Aralıkları

| Modül | Veri Kaynağı | Güncelleme |
|-------|--------------|------------|
| LivePricesModule | WebSocket | Anlık |
| OrderBookModule | WebSocket | Anlık |
| FundingRateModule | WebSocket | Anlık |
| SpreadMonitorModule | WebSocket | Anlık (500ms throttle) |
| ExchangeNetflowModule | WebSocket | Anlık |
| WhaleAlertsModule | WebSocket | Anlık |
| ExchangeComparisonModule | REST | 5 dakika |
| ExchangeFlowModule | REST | 5 dakika |
| RSIHeatmapModule | REST | 5 dakika |
| RewardCalendarModule | REST | 1 saat |
| TokenUnlockModule | REST | 24 saat |
| ICOCalendarModule | REST | 24 saat |
| ETFFlowsModule | REST | 24 saat |

---

## PnL Hesaplama Sistemi

### usePnL Hook (`lib/personalized-dashboard/usePnL.ts`)

Tüm PnL hesaplamalarını merkezi olarak yöneten hook.

**Bağlı Olduğu Store'lar:**
1. `portfolioStore` - Spot pozisyonlar
2. `futuresPositionStore` - Futures pozisyonlar
3. `priceStore` - Canlı fiyatlar

**Hesaplanan Metrikler:**
```typescript
{
  spotUnrealized: number;      // Spot unrealized PnL
  futuresUnrealized: number;   // Futures unrealized PnL
  totalUnrealized: number;     // Toplam unrealized PnL

  spotInvestment: number;      // Spot yatırım (cost basis)
  spotValue: number;           // Spot güncel değer
  futuresMargin: number;       // Futures margin
  futuresValue: number;        // Futures güncel değer

  totalInvestment: number;     // Toplam yatırım
  totalValue: number;          // Toplam portföy değeri
  totalPnLPercent: number;     // ROI %
}
```

**Futures PnL Formülü:**
```
Long: PnL = (markPrice - entryPrice) × quantity
Short: PnL = (entryPrice - markPrice) × quantity
```

---

## API Entegrasyonları

### Kullanılan Harici API'lar

| API | Kullanım Alanı | Endpoint |
|-----|----------------|----------|
| Binance REST | Fiyat, ticker, depth | `api.binance.com/api/v3/` |
| Binance Futures | Futures data | `fapi.binance.com/fapi/v1/` |
| CoinGecko | Token fiyatları, market data | `api.coingecko.com/api/v3/` |
| DeFiLlama | Raises/ICO data | `api.llama.fi/raises` |
| Etherscan | Wallet inspection | `api.etherscan.io/api` |

---

## Workspace Sistemi

Dashboard, sürükle-bırak ile kişiselleştirilebilir bir canvas sistemi kullanır.

**Özellikler:**
- Sonsuz canvas (pan & zoom)
- Modül boyutlandırma
- Workspace kaydetme/yükleme
- Modül minimize/maximize
- localStorage persistence

---

## Güvenlik Notları

1. **API Keys:** Client-side'da saklanmaz, server-side proxy kullanılır
2. **WebSocket:** Public streams kullanılır (auth gerektirmez)
3. **LocalStorage:** Sadece UI state ve pozisyon verileri saklanır
4. **CORS:** Next.js API routes proxy olarak kullanılır

---

## Performans Optimizasyonları

1. **WebSocket Throttling:** SpreadMonitor 500ms, diğerleri gerektiğinde
2. **Memoization:** useMemo ile gereksiz hesaplama önlenir
3. **Lazy Loading:** Modüller sadece canvas'ta görünür olduğunda yüklenir
4. **REST Caching:** API yanıtları uygun sürelerde cache'lenir
5. **Zustand Persist:** State localStorage'da persist edilir

---

## Geliştirici Notları

### Yeni Modül Ekleme

1. `components/terminal/personalized-dashboard/` altına `XxxModule.tsx` oluştur
2. `lib/personalized-dashboard/types.ts`'e ModuleType ekle
3. `AddToolPanel.tsx`'e modül tanımını ekle
4. Gerekirse ilgili store'u oluştur

### WebSocket Stream Ekleme

```typescript
wsService.subscribe(
  "symbol@streamtype",  // btcusdt@ticker, btcusdt@depth
  callback,
  "spot" | "futures",
  "binance" | "okx" | "bybit" | "coinbase"
);
```

---

## Versiyon Bilgisi

- **Next.js:** 16.0.7
- **React:** 18.x
- **TypeScript:** 5.x
- **Zustand:** 4.x

---

*Son Güncelleme: Ocak 2026*
