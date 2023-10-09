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
  },
  {
    value: 2,
    label: "rejected",
    turkish: "Kabul Edilmedi",
  },
  {
    value: 3,
    label: "declined",
    turkish: "İptal Edildi",
  },
  {
    value: 4,
    label: "created",
    turkish: "Oluşturuldu",
  },
  {
    value: 5,
    label: "delivered",
    turkish: "Teslim Edildi",
  },
  {
    value: 6,
    label: "reserved",
    turkish: "Rezerve",
  },
];
