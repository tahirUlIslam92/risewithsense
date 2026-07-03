import {
  Watch,
  Headphones,
  Sparkles,
  Shirt,
  Wallet,
  Scissors,
  Glasses,
  type LucideIcon,
} from "lucide-react";

// Single source of truth for category/product-type -> icon mapping.
// Import this everywhere instead of redefining icon maps per page.
export const TYPE_ICONS: Record<string, LucideIcon> = {
  watches: Watch,
  watch: Watch,
  earbuds: Headphones,
  perfume: Sparkles,
  perfumes: Sparkles,
  clothing: Shirt,
  wallets: Wallet,
  wallet: Wallet,
  purse: Wallet,
  grooming: Scissors,
  accessories: Glasses,
};

export function getCategoryIcon(type: string): LucideIcon {
  return TYPE_ICONS[type] || Watch;
}

export const CATEGORY_LIST = [
  { name: "Watches", slug: "watches" },
  { name: "Earbuds", slug: "earbuds" },
  { name: "Perfumes", slug: "perfumes" },
  { name: "Clothing", slug: "clothing" },
  { name: "Wallets", slug: "wallets" },
  { name: "Grooming", slug: "grooming" },
  { name: "Accessories", slug: "accessories" },
] as const;
