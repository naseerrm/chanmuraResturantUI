// admin-sidebar-items.ts
export interface SidebarItem {
  icon: string;       // Emoji or icon class
  label: string;      // Display text
  route: string;      // Angular router path
  order?: number;     // Optional, to control order
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
{ icon: '👤', label: 'User Details', route: '/admin/user', order: 1 },
  { icon: '👤', label: 'Admin', route: '/admin', order: 2 },
  { icon: '📊', label: 'Sales Dashboard', route: '/dashboard', order: 3 },
  { icon: '📉', label: 'Expenses', route: '/expenses', order: 4 },
  { icon: '🛒', label: 'Cart', route: '/cart', order: 5 },
  { icon: '📋', label: 'Table Orders', route: '/table-order', order: 6 },
  { icon: '🍽️', label: 'Menu', route: '/menu', order: 7 },
  { icon: '💳', label: 'Subscription', route: '/admin/subscription', order: 8 },
  { icon: '⚙️', label: 'Settings', route: '/admin/settings', order: 9 }
];

 
