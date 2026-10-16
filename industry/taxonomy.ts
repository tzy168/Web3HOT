// 这个行业的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（教程、观点）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 *
 * 取向（道友定）：Web3 金融为主，影响 Web3 金融的传统金融热点为辅，Web3 技术只占小头。
 */
export const CATEGORIES = [
  { key: "defi", label: "DeFi", feedLabel: "DeFi", section: "DeFi 与链上金融", guide: "DeFi 协议与产品的发布、升级、数据变化：DEX、借贷、收益、RWA、流动性、质押。交易所/钱包里属于金融功能的部分也归这里；纯技术实现归 protocol。" },
  { key: "stablecoin", label: "稳定币", feedLabel: "稳定币", section: "稳定币", guide: "稳定币（USDC、USDT 等）的发行、赎回、监管、脱锚、采用与储备披露。只提稳定币作为支付工具的普通新闻归 defi 或 institution。" },
  { key: "markets", label: "行情", feedLabel: "行情与数据", section: "行情与数据", guide: "BTC/ETH 与主要数字资产的价格、ETF 资金流、链上数据、交易量、宏观对资产价格的影响。纯技术指标的教程归 tip。" },
  { key: "regulation", label: "监管", feedLabel: "监管与政策", section: "监管与政策", guide: "SEC、各国央行、立法、CBDC、合规、执法、制裁、上市/ETF 审批。监管对象是传统金融机构但与数字资产强相关时也归这里。" },
  { key: "security", label: "安全", feedLabel: "安全与风险", section: "安全与风险", guide: "黑客、漏洞、rug、审计、暴雷、失窃、钓鱼、桥被攻破。一次事故的调查进展与赔付也归这里。" },
  { key: "institution", label: "传统金融", feedLabel: "传统金融", section: "传统金融与机构", guide: "影响 Web3 金融的传统金融热点：上市公司、银行、ETF、TradFi 机构接入加密、利率/美联储、财报中与数字资产相关的部分。纯 Web3 原生机构的融资并购归 industry。" },
  { key: "protocol", label: "协议/基建", feedLabel: "协议与基础设施", section: "协议与基础设施", guide: "主网/重要升级、L2、跨链、客户端与密码学基础设施（技术小头，仅当其关系到金融可用性、安全、费用或可访问性时才收）。纯性能基准、开发者工具本身可归其他或压低。" },
  { key: "industry", label: "行业", feedLabel: "行业动态", section: "行业动态", guide: "Web3 金融原生机构的公司经营、融资并购、人事、合作、诉讼、政策、真实安全事故及调查进展。新闻由当事人发帖、带有态度，也不因此变成观点。" },
  { key: "tip", label: "教程", section: "技巧与观点", guide: "读者可以照着用的策略、看板、分析方法、工具用法、链上数据复盘与技术讲解。重点是可复用的做法；单纯发布产品归 defi/product，只有态度和预测而无做法归 opinion。", commentary: true },
  { key: "opinion", label: "观点", section: "技巧与观点", guide: "重点是作者的解释、判断、主张、预测、评论或访谈观点。讨论市场不自动归 industry，作者是名人不自动归 opinion。", commentary: true },
] as const satisfies ReadonlyArray<{ key: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布（AI 行业是新模型）：日报报头的“N 个新 XX”、改分类后修订已出的报告都按它数。
 * category 是类别，tag 是标签，两者都对上才算；unit 接在数字后面。
 * Web3 金融没有像“新模型”那样单一主导的发布类型，这里设成 null（报头不显示这个数）；
 * 若想跟踪主网/协议上线，可改成 { category: "protocol", tag: "协议上线", unit: "个新协议" }。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = null;

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = ["defi", "web3", "crypto", "btc", "eth", "stablecoin", "tvl", "usdc", "usdt", "ceo", "ipo", "etf", "fed", "sec", "rwa", "链上"];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["protocol_launch", "product_launch", "tool_or_method", "research_report", "industry_event", "opinion_analysis", "tutorial_explainer"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  "产品更新", "协议上线", "研究/报告", "开源/仓库", "教程/实践", "现象/趋势", "大佬观点", "评测/数据", "安全/风险", "行业动态", "政策/监管", "传统金融", "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "DeFi", "稳定币", "RWA", "L2/扩容", "跨链", "钱包/托管", "链上数据", "ETF/上市公司", "宏观/利率", "监管/合规", "NFT", "挖矿/质押", "支付结算",
] as const;

/** 可选的实体标签（公司、机构、平台）。 */
export const ENTITY_TAGS = ["Ethereum", "Bitcoin", "Uniswap", "Aave", "Circle", "Tether", "Coinbase", "Gate.io", "Chainalysis", "DefiLlama", "Federal Reserve", "SEC"] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  "教程/玩法": "教程/实践", "技巧/最佳实践": "教程/实践", "合作/生态": "行业动态", "融资/收购": "行业动态", "公司动态": "行业动态",
  合作: "行业动态", 生态: "行业动态", 融资: "行业动态", 收购: "行业动态", 投资: "行业动态", 并购: "行业动态",
  政策: "政策/监管", 监管: "政策/监管", 法规: "政策/监管", 合规: "政策/监管", 执法: "政策/监管",
  安全: "安全/风险", 风险: "安全/风险", 黑客: "安全/风险", 漏洞: "安全/风险", 暴雷: "安全/风险", rug: "安全/风险",
  研究: "研究/报告", 报告: "研究/报告", paper: "研究/报告", 研报: "研究/报告", 数据: "评测/数据",
  "open-source": "开源/仓库", 开源: "开源/仓库", 仓库: "开源/仓库", repo: "开源/仓库",
  教程: "教程/实践", 玩法: "教程/实践", 指南: "教程/实践", 技巧: "教程/实践", 最佳实践: "教程/实践", 实践: "教程/实践",
  上线: "协议上线", 主网上线: "协议上线", 升级: "协议上线", 协议: "协议上线",
  产品: "产品更新", 更新: "产品更新", 发布: "产品更新", 趋势: "现象/趋势", 现象: "现象/趋势", 观点: "大佬观点",
  传统金融: "传统金融", 银行: "传统金融", ETF: "传统金融", 上市公司: "传统金融", 机构: "传统金融",
  行业: "行业动态", 动态: "行业动态", 利率: "宏观/利率", 宏观: "宏观/利率",
};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/**
 * 公司主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；otherNames 是公司自己的其他称呼（官方账号名、子品牌），
 * 把事实的主体对到发布方时也认它们。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; otherNames?: string[] }> = {
  ethereum: { name: "Ethereum", displayTag: "Ethereum", aliases: ["Ethereum", "ETH", "以太坊"] },
  bitcoin: { name: "Bitcoin", displayTag: "Bitcoin", aliases: ["Bitcoin", "BTC", "比特币"] },
  uniswap: { name: "Uniswap", displayTag: "Uniswap", aliases: ["Uniswap", "UNI"] },
  aave: { name: "Aave", displayTag: "Aave", aliases: ["Aave"] },
  circle: { name: "Circle", displayTag: "Circle", aliases: ["Circle", "USDC"], otherNames: ["Circle Internet Group"] },
  tether: { name: "Tether", displayTag: "Tether", aliases: ["Tether", "USDT"] },
  coinbase: { name: "Coinbase", displayTag: "Coinbase", aliases: ["Coinbase", "COIN"], otherNames: ["Coinbase Global"] },
  gateio: { name: "Gate.io", displayTag: "Gate.io", aliases: ["Gate.io", "GateIO", "GT"] },
  chainalysis: { name: "Chainalysis", displayTag: "Chainalysis", aliases: ["Chainalysis"] },
  defillama: { name: "DefiLlama", displayTag: "DefiLlama", aliases: ["DefiLlama", "Defi Llama"] },
  federal_reserve: { name: "Federal Reserve", displayTag: "Federal Reserve", aliases: ["Federal Reserve", "Fed", "美联储", "FOMC"] },
  sec: { name: "SEC", displayTag: "SEC", aliases: ["SEC", "美国证券交易委员会", "U.S. SEC"] },
};

/**
 * 身份词典：摘要和标题里出现的公司，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 行业没有这个问题时可以留空数组。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "ethereum", name: "Ethereum", patterns: [/ethereum|\beth\b|以太坊/i, /\bETH\b/i] },
  { id: "bitcoin", name: "Bitcoin", patterns: [/bitcoin|\bbtc\b|比特币/i] },
  { id: "uniswap", name: "Uniswap", patterns: [/uniswap|\buni\b/i] },
  { id: "aave", name: "Aave", patterns: [/aave/i] },
  { id: "circle", name: "Circle", patterns: [/circle|\busdc\b/i] },
  { id: "tether", name: "Tether", patterns: [/tether|\busdt\b/i] },
  { id: "coinbase", name: "Coinbase", patterns: [/coinbase/i] },
  { id: "gateio", name: "Gate.io", patterns: [/gate\.?io|\bgt\b/i] },
  { id: "chainalysis", name: "Chainalysis", patterns: [/chainalysis/i] },
  { id: "defillama", name: "DefiLlama", patterns: [/defi\s?llama/i] },
  { id: "federal_reserve", name: "Federal Reserve", patterns: [/federal reserve|\bfed\b|美联储|\bfomc\b/i] },
  { id: "sec", name: "SEC", patterns: [/\bsec\b|美国证券交易委员会/i] },
];

/** 这些域名上的文章，发布方就是对应的公司（托管平台不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "ethereum", domains: ["ethereum.org", "blog.ethereum.org"] },
  { entityId: "uniswap", domains: ["uniswap.org", "blog.uniswap.org"] },
  { entityId: "aave", domains: ["aave.com"] },
  { entityId: "circle", domains: ["circle.com"] },
  { entityId: "coinbase", domains: ["coinbase.com", "blog.coinbase.com"] },
  { entityId: "gateio", domains: ["gate.io", "blog.gate.io"] },
  { entityId: "chainalysis", domains: ["chainalysis.com"] },
  { entityId: "federal_reserve", domains: ["federalreserve.gov"] },
  { entityId: "sec", domains: ["sec.gov"] },
];

/** 原文里的这些写法也算提到了对应公司。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [];
