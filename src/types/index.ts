export type RetailerId = "amazon" | "temu";

export type Retailer = {
  id: RetailerId;
  name: string;
};

export type Price = {
  amount: number;
  currency: "USD";
};

export type Photo = {
  src: string;
  alt: string;
};

export type Audience = "men" | "women" | "kids" | "couples" | "everyone";

// Category ids come from the backend, so new ones can be added from the dashboard.
export type InterestId = string;

export type Interest = {
  id: InterestId;
  label: string;
  image: Photo;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: Price;
  retailer: RetailerId;
  image: Photo;
  affiliateUrl: string;
  badge?: string;
  // Longer write-up shown on product grids.
  details?: string;
  // Shown when someone hovers over the product photo.
  altImage?: Photo;
  video?: { src: string };
  audiences: Audience[];
  interests: InterestId[];
  trending?: boolean;
  // True until real prices come from an approved affiliate feed.
  isSampleData: boolean;
};

// Plain text, or a link shown inside the intro paragraph.
export type IntroPart = string | { label: string; href: string };

export type RecipientFeature = {
  headline: string;
  highlight: string;
  updated: string;
  image: Photo;
  intro: IntroPart[];
};

export type ListingSection = "gifts" | "occasions" | "discover" | "unique-finds";

// Decides which products a listing page shows. Every rule that is set must match.
export type ProductRule = {
  audiences?: Audience[];
  interests?: InterestId[];
  maxPrice?: number;
  ids?: string[];
  trending?: boolean;
  sort?: "featured" | "newest";
};

export type ListingPage = {
  section: ListingSection;
  // Empty slug means the main page of the section, for example /discover.
  slug: string;
  label: string;
  title: string;
  tagline: string;
  about: string;
  rule: ProductRule;
  interests: InterestId[];
  related: string[];
  guideId: string;
  feature: RecipientFeature;
  metaTitle?: string;
  gridTitle?: string;
  picksTitle?: string;
};

export type Recipient = {
  id: string;
  label: string;
  href: string;
  image: Photo;
};

export type Collection = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: Photo;
  tone: "blush" | "sage" | "sand" | "ink" | "clay";
};

export type Occasion = {
  id: string;
  title: string;
  note: string;
  href: string;
  image: Photo;
};

export type Article = {
  id: string;
  label: string;
  title: string;
  intro: string;
  href: string;
  readTime: string;
  image: Photo;
  // Paragraphs shown on the guide's own page.
  body?: string[];
  // Decides which products the guide lists.
  rule?: ProductRule;
};

export type DiscoveryVideo = {
  id: string;
  title: string;
  caption: string;
  duration: string;
  poster: Photo;
  // Left empty until real product videos are ready.
  videoUrl?: string;
};

export type HeroSlide = {
  id: string;
  eyebrow: string;
  titleTop: string;
  titleBottom: string;
  text: string;
  image: Photo;
  primaryLink: NavLink;
  secondaryLink?: NavLink;
  color: "forest" | "clay" | "ink";
};

export type NavLink = {
  label: string;
  href: string;
};

export type NavMenu = {
  label: string;
  href: string;
  intro: string;
  links: NavLink[];
  feature?: {
    title: string;
    href: string;
    image: Photo;
  };
};

export type HeroShortcut = {
  label: string;
  href: string;
  image: string;
};

export type SiteInfo = {
  name: string;
  tagline: string;
  description: string;
  announcement: string;
  contactEmail: string;
};

export type SectionInfo = {
  basePath: string;
  // Middle link in the breadcrumb. Left out for the main page of a section.
  parent: NavLink;
  pillsTitle: string;
  relatedLead: string;
};

export type FinderPerson = {
  id: string;
  label: string;
  // Used in sentences like "gifts for your dad".
  phrase: string;
  photo: Photo;
  // Empty means any product can work.
  audiences: Audience[];
};

export type FinderOccasion = {
  id: string;
  label: string;
  rule: ProductRule;
};

export type FinderBudget = {
  id: string;
  label: string;
  note: string;
  max?: number;
};

// Everything the backend keeps under /api/content.
export type SiteContent = {
  site: SiteInfo;
  mainMenus: NavMenu[];
  footerColumns: { title: string; links: NavLink[] }[];
  socialLinks: NavLink[];
  exampleSearches: string[];
  popularSearches: string[];
  recipients: Recipient[];
  collections: Collection[];
  occasions: Occasion[];
  articles: Article[];
  discoveryVideos: DiscoveryVideo[];
  heroSlides: HeroSlide[];
  heroShortcuts: HeroShortcut[];
  finderPeople: FinderPerson[];
  finderBudgets: FinderBudget[];
  sections: Record<ListingSection, SectionInfo>;
  similarCategories: NavLink[];
};
