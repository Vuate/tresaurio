export type Cell = "check" | "x" | "lock" | "plus" | "-";

export type FeatureRow = {
  feature: string;
  trader: Cell;
  proTrader: Cell;
  enterprise: Cell;
  addOn: Cell;
  desc: string;
};

export type CategoryBlock = {
  category: string;
  rows: FeatureRow[];
};

export const PRICING_TABLE: CategoryBlock[] = [
  // -------------------------------------------------------------
  // 1) TEMEL VERİ
  // -------------------------------------------------------------
  {
    category: "Temel Veri",
    rows: [
      {
        feature: "Canlı fiyatlar",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Tüm coinlerin anlık spot fiyatlarını gösterir.",
      },
      {
        feature: "Çoklu borsa fiyat karşılaştırması",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Coin'in farklı borsalardaki fiyatlarını kıyaslar.",
      },
      {
        feature: "Watchlist",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Takip edilen coin listesini kaydeder.",
      },
      {
        feature: "Coin bilgi kartları",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Marketcap, hacim, arz, geçmiş fiyat verilerini sunar.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 2) LİKİDİTE & ORDERBOOK
  // -------------------------------------------------------------
  {
    category: "Likidite & Orderbook",
    rows: [
      {
        feature: "5 seviyeli orderbook",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "5 seviye alış ve satış emirlerini gösterir.",
      },
      {
        feature: "20 seviyeli orderbook",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "20 seviyeye kadar tüm market derinliğini sunar.",
      },
      {
        feature: "Spread & depth özeti",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Spread ve kümülatif derinlik analizini yapar.",
      },
      {
        feature: "LP Market fiyat takibi",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Likidite sağlayıcının fiyatlarını izler.",
      },
      {
        feature: "Likidite heatmap",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Emir yoğunluklarını ısı haritası şeklinde gösterir.",
      },
      {
        feature: "Spread anomalileri",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Spread davranışındaki anormal sıçramaları tespit eder.",
      },
      {
        feature: "Duvar/boyluk analizi",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Büyük emir blokları analiz edilir.",
      },
      {
        feature: "Multi-LP fiyat karşılaştırma",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Birden fazla likidite sağlayıcısının fiyatlarını kıyaslar.",
      },
      {
        feature: "Volume cluster analizi",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Hacim kümelerini analiz ederek baskın seviyeleri belirler.",
      },
      {
        feature: "Market pressure (buy/sell dominance)",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Alıcı ve satıcı baskısını yüzdesel olarak sunar.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 3) TRADER PORTFÖY
  // -------------------------------------------------------------
  {
    category: "Trader Portföy",
    rows: [
      {
        feature: "PnL analizi",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Kâr/zarar analizini hesaplar.",
      },
      {
        feature: "Açık pozisyon takibi",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Açık pozisyonların anlık durumunu gösterir.",
      },
      {
        feature: "Kapalı pozisyon takibi",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Kapanmış pozisyon geçmişini sunar.",
      },
      {
        feature: "Realized PnL",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Gerçekleşmiş kâr/zararı hesaplar.",
      },
      {
        feature: "Unrealized PnL",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Gerçekleşmemiş kâr/zararı hesaplar.",
      },
      {
        feature: "Futures pozisyon takibi",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Vadeli pozisyonları detaylı izler.",
      },
      {
        feature: "Ticaret geçmişi analizi",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Geçmiş işlemleri analiz eder.",
      },
      {
        feature: "Liq/stop detayları",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Likidasyon ve stop seviyelerini gösterir.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 4) DW & FLOW
  // -------------------------------------------------------------
  {
    category: "DW & Flow",
    rows: [
      {
        feature: "Net flow (pozitif/negatif)",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Toplam giriş ve çıkış farkını gösterir.",
      },
      {
        feature: "Chain bazlı D/W breakdown",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Ağ bazlı deposit/withdraw dağılımını sunar.",
      },
      {
        feature: "Whale alert",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Büyük tutarlı transferleri tespit eder.",
      },
      {
        feature: "Internal flow haritası",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Cüzdanlar arası dahili transfer akışını gösterir.",
      },
      {
        feature: "Fee hesaplama (maker/taker)",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "İşlem bazlı fee hesaplaması yapar.",
      },
      {
        feature: "D/W limit kontrolü",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Limit aşımı durumlarını kontrol eder.",
      },
      {
        feature: "Chain health score",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Blockchain ağı sağlığını puanlar.",
      },
      {
        feature: "Token flow anomaly",
        trader: "x",
        proTrader: "x",
        enterprise: "check",
        addOn: "plus",
        desc: "Token bazlı sıra dışı giriş/çıkışları tespit eder.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 5) FEE & TAX
  // -------------------------------------------------------------
  {
    category: "Fee & Tax",
    rows: [
      {
        feature: "Fee breakdown (BTC/USDT/TRY)",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Komisyonların hangi varlıktan tahsil edildiğini gösterir.",
      },
      {
        feature: "KDV ayrıştırma",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Fee içindeki KDV tutarını ayırır.",
      },
      {
        feature: "Fee revenue raporu",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Komisyon gelirlerini zaman bazlı raporlar.",
      },
      {
        feature: "Fee model karşılaştırıcı",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Farklı borsalardaki fee modellerini kıyaslar.",
      },
      {
        feature: "Borsa bazlı limit",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Borsalara özel fee limitleri belirler.",
      },
      {
        feature: "Multi-asset fee breakdown",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "BTC/USDT/TRY bazlı fee ayrımını yapar.",
      },
      {
        feature: "Fee tahsilat uyarısı",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Fee tahsilatında anomali olduğunda uyarı verir.",
      },
      {
        feature: "Vergi uyumluluk modu",
        trader: "lock",
        proTrader: "lock",
        enterprise: "check",
        addOn: "plus",
        desc: "Yerel mevzuat uyumlu vergi raporu üretir.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 6) LİKİDİTE RİSK & LIMIT
  // -------------------------------------------------------------
  {
    category: "Likidite Risk & Limit",
    rows: [
      {
        feature: "Umutgun alt limit",
        trader: "lock",
        proTrader: "lock",
        enterprise: "check",
        addOn: "-",
        desc: "Yalnızca enterprise için limit ayarlama.",
      },
      {
        feature: "Düşük likidite coin uyarısı",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Likiditesi düşük coinlerde alarm üretir.",
      },
      {
        feature: "Coin risk planı",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Coin bazlı risk puanlamasını gösterir.",
      },
      {
        feature: "Borsa bazlı limit",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Her borsaya özel limit belirlenir.",
      },
      {
        feature: "Düşük likidite coin puanı",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Likidite gücüne göre puanlama sunar.",
      },
      {
        feature: "Coin uyarı sistemi",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Riskli coinlerde otomatik uyarı sağlar.",
      },
      {
        feature: "Üst limit analiz",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Coin üst limit analizleri sağlar.",
      },
      {
        feature: "Likidite eşik alarmı",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Likidite eşik altına düştüğünde uyarı verir.",
      },
      {
        feature: "Wallet tolerans analizi",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Cüzdanlar için tolerans seviyelerini hesaplar.",
      },
      {
        feature: "Cüzdan hareket sınırlayıcı",
        trader: "lock",
        proTrader: "lock",
        enterprise: "check",
        addOn: "plus",
        desc: "Sistem genelinde cüzdan hareket limitleri belirler.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 7) TREASURY & WALLET
  // -------------------------------------------------------------
  {
    category: "Treasury & Wallet",
    rows: [
      {
        feature: "Wallet grupları (LP/HW/CW)",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "LP, Hot, Warm, Cold cüzdan yapılarını yönetir.",
      },
      {
        feature: "Coin & wallet dağılımı",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Varlıkların tüm cüzdanlara dağılımını gösterir.",
      },
      {
        feature: "Bant analiz & down",
        trader: "lock",
        proTrader: "lock",
        enterprise: "check",
        addOn: "plus",
        desc: "Cüzdan bant dışına çıkma durumlarında uyarı verir.",
      },
      {
        feature: "Health score",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Cüzdanların genel sağlık skorunu hesaplar.",
      },
      {
        feature: "Hedef dağılım modeli",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Cüzdan hedef dağılım modelleri oluşturur.",
      },
      {
        feature: "Internal transfer flow",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Cüzdanlar arası transfer akışını sunar.",
      },
      {
        feature: "Simülasyon modu",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Cüzdan hareketlerinin simülasyonunu sağlar.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 8) AUTOBALANCER & SİMÜLASYON
  // -------------------------------------------------------------
  {
    category: "Autobalancer & Simülasyon",
    rows: [
      {
        feature: "What-if senaryoları",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Varsayımsal piyasa durumlarını simüle eder.",
      },
      {
        feature: "Otomatik dengeleme önerisi",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Cüzdan dengesizliklerinde öneri sunar.",
      },
      {
        feature: "Transfer politikaları",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "HW–LP transfer politikalarını yönetir.",
      },
      {
        feature: "Price shock stress test",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Fiyat şoklarında sistem davranışını test eder.",
      },
      {
        feature: "Treasury volatilite analizi",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Varlıkların volatilite etkisini analiz eder.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 9) ALERT SİSTEMİ
  // -------------------------------------------------------------
  {
    category: "Alert Sistemi",
    rows: [
      {
        feature: "Spread alert",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Spread anomalisinde alarm üretir.",
      },
      {
        feature: "Likidite alarmı",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Likidite eşik altına düştüğünde uyarı verir.",
      },
      {
        feature: "Wallet alarm",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Cüzdanlarda anormal hareket tespit eder.",
      },
      {
        feature: "D/W anomaly alert",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Giriş/çıkış anormalliklerini algılar.",
      },
      {
        feature: "Price movement alert",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Ani fiyat hareketlerinde uyarmayı sağlar.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 10) RAPORLAMA
  // -------------------------------------------------------------
  {
    category: "Raporlama",
    rows: [
      {
        feature: "Günlük rapor",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Günlük özet metrik raporu oluşturur.",
      },
      {
        feature: "Gelişmiş rapor",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Detaylı veri içeren rapor üretir.",
      },
      {
        feature: "Custom rapor üretici",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Kullanıcıya özel rapor oluşturur.",
      },
      {
        feature: "PDF/Excel çıktı",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Raporlar PDF/Excel formatında dışa aktarılır.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 11) GÜVENLİK / ENTERPRISE
  // -------------------------------------------------------------
  {
    category: "Güvenlik / Enterprise",
    rows: [
      {
        feature: "API yetki kısıtlamaları",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "API erişim izinlerini sınırlar.",
      },
      {
        feature: "Multi-user & role yönetimi",
        trader: "lock",
        proTrader: "lock",
        enterprise: "check",
        addOn: "-",
        desc: "Kurumsal düzey kullanıcı ve rol yönetimi sağlar.",
      },
      {
        feature: "IP whitelist",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Belirli IP adreslerine özel erişim izni tanımlar.",
      },
    ],
  },
];
