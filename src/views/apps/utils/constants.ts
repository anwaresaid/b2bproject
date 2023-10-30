export const gameStatus = [
  { label: "active", id: 1 },
  { label: "passive", id: 2 },
];
export const marketPlaces = [
  { label: "Kinguin", id: 1 },
  { label: "Eneba", id: 2 },
  { label: "Gamivo", id: 3 },
];
export const gamivoStatus = [
  { label: "active", value: 0 },
  { label: "passive", value: 1 },
];
export const matchStatus = [
  { label: "active", value: 1 },
  { label: "passive", value: 0 },
];
export const isApproved = [
  { label: "Approved", value: 1 },
  { label: "Not Approved", value: 0 },
];

export const categoryType = [
  {
    label: "CONSOLE",
    id: 2,
  },
  {
    label: "PC",
    id: 1,
  },
  {
    label: "GIFTCARD/EPIN",
    id: 3,
  },
];
export const generalStatus = [
  {
    label: "successful",
    value: 1,
  },
  {
    label: "failed",
    value: 0,
  },
];
export const processType = [
  {
    label: "update stock",
    value: "UpdateStock",
  },
  {
    label: "Stock notification",
    value: "StockNotification",
  },
  {
    label: "match",
    value: "Match",
  },
];
export const keysTypeStatus = [
  {
    value: 1,
    label: "active",
    turkish: "Aktif",
    status: "primary",
  },
  {
    value: 2,
    label: "passive",
    turkish: "Pasif",
    status: "info",
  },
  {
    value: 3,
    label: "reserve",
    turkish: "Reserve",
    status: "warning",
  },
  {
    value: 4,
    label: "sold",
    turkish: "Satılmış",
    status: "success",
  },
  {
    value: 5,
    label: "refunded",
    turkish: "İade",
    status: "info",
  },
  {
    value: 6,
    label: "delivered",
    turkish: "Teslim edilmiş",
    status: "success",
  },
  {
    value: 7,
    label: "kinguin stock",
    turkish: "Kinguin de stokta",
  },
  {
    value: 8,
    label: "cancel",
  },
  {
    value: -1,
    label: "deleted",
    turkish: "Silinmiş",
  },
];

export const keyStatus = [
  {
    label: "ACTIVE",
    value: 1,
  },
  {
    label: "PASSIV",
    value: 2,
  },
  {
    label: "RESERVED",
    value: 3,
  },
  {
    label: "SOLD",
    value: 4,
  },
  {
    label: "REFUNDED",
    value: 5,
  },
  {
    label: "DELIVERED",
    value: 6,
  },
  {
    label: "KINGUIN_STOCK",
    value: 7,
  },
  {
    label: "CANCEL",
    value: 8,
  },
  {
    label: "DELETED",
    value: -1,
  },
];

export const orderBy = [
  {
    label: "ASC",
    value: 1,
  },
  {
    label: "DESC",
    value: 0,
  },
];

export const gamesOrderBy = [
  {
    label: "ASC",
    value: "asc",
  },
  {
    label: "DESC",
    value: "desc",
  },
];

export const currency = [
  {
    value: 1,
    label: "EUR",
    symbol: "€",
  },
  {
    value: 2,
    label: "TRY",
    symbol: "₺",
  },
  {
    value: 3,
    label: "GBP",
    symbol: "£",
  },
  {
    value: 4,
    label: "USD",
    symbol: "$",
  },
];
export const jarTransactionType = [
  {
    label: "INCOME",
    value: 1,
  },
  {
    label: "EXPENSE",
    value: 2,
  },
];

export const salesEnum = [
  {
    label: "Yesterday Sales",
    value: 1,
  },
  {
    label: "Today Sales",
    value: 2,
  },
  {
    label: "This Week Sales",
    value: 3,
  },
  {
    label: "This Month Sales",
    value: 4,
  },
  {
    label: "This Year Sales",
    value: 5,
  },
  {
    label: "Last Week And This Week Sales",
    value: 6,
  },
  {
    label: "Last Month Sales",
    value: 7,
  },
  {
    label: "General Sales",
    value: 8,
  },
];

export const orderType = [
  {
    value: 1,
    label: "api",
  },
  {
    value: 2,
    label: "customer",
  },
];
export const orderStatus = [
  {
    value: 1,
    label: "approved",
    turkish: "Onaylandı",
    color: "success",
  },
  {
    value: 2,
    label: "rejected",
    turkish: "Kabul Edilmedi",
    color: "warning",
  },
  {
    value: 3,
    label: "declined",
    turkish: "İptal Edildi",
    color: "danger",
  },
  {
    value: 4,
    label: "created",
    turkish: "Oluşturuldu",
    color: "info",
  },
  {
    value: 5,
    label: "delivered",
    turkish: "Teslim Edildi",
    color: "success",
  },
  {
    value: 6,
    label: "reserved",
    turkish: "Rezerve",
    color: "warning",
  },
  {
    value: 7,
    label: "auto reject",
    turkish: "Otomatik İptal ",
    color: "danger",
  },
  {
    value: 8,
    label: "returned",
    turkish: "Geri İade",
    color: "warning",
  },
  {
    value: 9,
    label: "pending",
    turkish: "Beklenen",
    color: "warning",
  },
  {
    value: -1,
    label: "all",
    turkish: "Tümü",
  },
];
