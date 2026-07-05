import { SaleRecord } from "./types";

// First 15 items exactly matching the screenshot
const screenshotRecords: SaleRecord[] = [
  {
    id: 1,
    date: "2024-06-14",
    channel: "Offline - Agen",
    order_id: "ORD-20240614-9508",
    product: "Minyak Goreng 1L",
    category: "Retail",
    quantity: 11,
    price_per_unit: 18045,
    total_price: 198495,
    customer_name: "Customer 145",
    city: "Tangerang",
    payment_method: "QRIS",
    sales_rep: "Budi"
  },
  {
    id: 2,
    date: "2024-01-15",
    channel: "Online - Website",
    order_id: "ORD-20240115-7810",
    product: "Beras 5kg",
    category: "Retail",
    quantity: 17,
    price_per_unit: 24921,
    total_price: 423657,
    customer_name: "Customer 134",
    city: "Depok",
    payment_method: "QRIS",
    sales_rep: "Andi"
  },
  {
    id: 3,
    date: "2024-12-01",
    channel: "Online - Marketplace",
    order_id: "ORD-20241201-5079",
    product: "Beras 5kg",
    category: "Retail",
    quantity: 5,
    price_per_unit: 12845,
    total_price: 64225,
    customer_name: "Customer 192",
    city: "Bandung",
    payment_method: "COD",
    sales_rep: "Lina"
  },
  {
    id: 4,
    date: "2025-01-01",
    channel: "Online - WhatsApp",
    order_id: "ORD-20250101-3315",
    product: "Telur Ayam Kampung",
    category: "Poultry",
    quantity: 1,
    price_per_unit: 50282,
    total_price: 50282,
    customer_name: "Customer 193",
    city: "Depok",
    payment_method: "E-Wallet",
    sales_rep: "Budi"
  },
  {
    id: 5,
    date: "2024-03-13",
    channel: "Online - Website",
    order_id: "ORD-20240313-4895",
    product: "Ayam Potong",
    category: "Poultry",
    quantity: 3,
    price_per_unit: 7672,
    total_price: 23016,
    customer_name: "Customer 142",
    city: "Depok",
    payment_method: "COD",
    sales_rep: "Tono"
  },
  {
    id: 6,
    date: "2024-05-12",
    channel: "Offline - Toko",
    order_id: "ORD-20240512-3267",
    product: "Ayam Kampung Hidup",
    category: "Poultry",
    quantity: 15,
    price_per_unit: 49594,
    total_price: 743910,
    customer_name: "Customer 228",
    city: "Jakarta",
    payment_method: "Transfer",
    sales_rep: "Fajar"
  },
  {
    id: 7,
    date: "2024-09-18",
    channel: "Online - Marketplace",
    order_id: "ORD-20240918-6030",
    product: "Air Mineral Botol",
    category: "Retail",
    quantity: 18,
    price_per_unit: 26809,
    total_price: 482562,
    customer_name: "Customer 240",
    city: "Jakarta",
    payment_method: "COD",
    sales_rep: "Dewi"
  },
  {
    id: 8,
    date: "2024-04-17",
    channel: "Online - Marketplace",
    order_id: "ORD-20240417-9273",
    product: "Gula 1kg",
    category: "Retail",
    quantity: 17,
    price_per_unit: 7860,
    total_price: 133620,
    customer_name: "Customer 132",
    city: "Bandung",
    payment_method: "E-Wallet",
    sales_rep: "Fajar"
  },
  {
    id: 9,
    date: "2025-01-20",
    channel: "Online - WhatsApp",
    order_id: "ORD-20250120-3250",
    product: "Pakan Ayam 5kg",
    category: "Feed",
    quantity: 19,
    price_per_unit: 153065,
    total_price: 2908235,
    customer_name: "Customer 144",
    city: "Bekasi",
    payment_method: "Transfer",
    sales_rep: "Sari"
  },
  {
    id: 10,
    date: "2024-02-29",
    channel: "Online - Website",
    order_id: "ORD-20240229-1623",
    product: "Gula 1kg",
    category: "Retail",
    quantity: 10,
    price_per_unit: 35619,
    total_price: 356190,
    customer_name: "Customer 77",
    city: "Cirebon",
    payment_method: "E-Wallet",
    sales_rep: "Rudi"
  },
  {
    id: 11,
    date: "2024-07-31",
    channel: "Online - Website",
    order_id: "ORD-20240731-4266",
    product: "Pakan Ayam 5kg",
    category: "Feed",
    quantity: 17,
    price_per_unit: 68374,
    total_price: 1162358,
    customer_name: "Customer 30",
    city: "Bekasi",
    payment_method: "E-Wallet",
    sales_rep: "Dewi"
  },
  {
    id: 12,
    date: "2024-05-10",
    channel: "Online - Website",
    order_id: "ORD-20240510-1378",
    product: "Beras 5kg",
    category: "Retail",
    quantity: 12,
    price_per_unit: 4386,
    total_price: 52632,
    customer_name: "Customer 95",
    city: "Jakarta",
    payment_method: "E-Wallet",
    sales_rep: "Sari"
  },
  {
    id: 13,
    date: "2024-02-04",
    channel: "Online - Marketplace",
    order_id: "ORD-20240204-8797",
    product: "Telur Ayam Ras",
    category: "Poultry",
    quantity: 17,
    price_per_unit: 27326,
    total_price: 464542,
    customer_name: "Customer 259",
    city: "Tangerang",
    payment_method: "E-Wallet",
    sales_rep: "Fajar"
  },
  {
    id: 14,
    date: "2025-01-10",
    channel: "Offline - Toko",
    order_id: "ORD-20250110-6833",
    product: "Beras 5kg",
    category: "Retail",
    quantity: 16,
    price_per_unit: 46604,
    total_price: 745664,
    customer_name: "Customer 6",
    city: "Jakarta",
    payment_method: "QRIS",
    sales_rep: "Tono"
  },
  {
    id: 15,
    date: "2024-05-22",
    channel: "Online - Website",
    order_id: "ORD-20240522-3761",
    product: "Tempat Pakan",
    category: "Equipment",
    quantity: 6,
    price_per_unit: 102943,
    total_price: 617658,
    customer_name: "Customer 122",
    city: "Cirebon",
    payment_method: "COD",
    sales_rep: "Budi"
  }
];

// Helper arrays for generation
const channels = ["Offline - Agen", "Online - Website", "Online - Marketplace", "Online - WhatsApp", "Offline - Toko"];
const paymentMethods = ["QRIS", "COD", "E-Wallet", "Transfer", "Cash"];
const cities = ["Tangerang", "Depok", "Bandung", "Jakarta", "Bekasi", "Cirebon", "Bogor", "Karawang"];
const salesReps = ["Budi", "Andi", "Lina", "Tono", "Fajar", "Dewi", "Sari", "Rudi"];

interface ProductMeta {
  name: string;
  category: string;
  basePrice: number;
}

const products: ProductMeta[] = [
  { name: "Minyak Goreng 1L", category: "Retail", basePrice: 18000 },
  { name: "Beras 5kg", category: "Retail", basePrice: 45000 },
  { name: "Telur Ayam Kampung", category: "Poultry", basePrice: 50000 },
  { name: "Ayam Potong", category: "Poultry", basePrice: 24000 },
  { name: "Ayam Kampung Hidup", category: "Poultry", basePrice: 49000 },
  { name: "Air Mineral Botol", category: "Retail", basePrice: 26000 },
  { name: "Gula 1kg", category: "Retail", basePrice: 14000 },
  { name: "Pakan Ayam 5kg", category: "Feed", basePrice: 150000 },
  { name: "Telur Ayam Ras", category: "Poultry", basePrice: 27000 },
  { name: "Tempat Pakan", category: "Equipment", basePrice: 102000 },
  { name: "Kandang Portable", category: "Equipment", basePrice: 178000 },
  { name: "Vitamin Ternak", category: "Supplement", basePrice: 23900 },
  { name: "Mie Instan", category: "Retail", basePrice: 19000 }
];

// Generate an additional 1000 rows deterministically to make 1015 total records
function generateMockRecords(): SaleRecord[] {
  const records = [...screenshotRecords];
  let currentId = 16;

  // Multi-month range
  const startDate = new Date("2024-01-01").getTime();
  const endDate = new Date("2025-06-30").getTime();

  for (let i = 0; i < 1000; i++) {
    // Generate dates spread across the range
    const progress = i / 1000;
    const randomTime = startDate + progress * (endDate - startDate) + (Math.sin(i) * 5 * 24 * 60 * 60 * 1000);
    const dateObj = new Date(Math.max(startDate, Math.min(endDate, randomTime)));
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    const channel = channels[(i * 3 + 1) % channels.length];
    const productMeta = products[(i * 7) % products.length];
    
    // Quantity mostly small numbers (1 to 20), similar to screenshot
    const quantity = ((i * 11) % 19) + 1;
    
    // Add small random fluctuation to price
    const priceFluctuation = Math.round((Math.cos(i) * 0.05) * productMeta.basePrice);
    const price_per_unit = productMeta.basePrice + priceFluctuation;
    const total_price = quantity * price_per_unit;
    
    const randomCode = String(1000 + ((i * 41) % 8999));
    const order_id = `ORD-${yyyy}${mm}${dd}-${randomCode}`;
    
    const customer_name = `Customer ${((i * 13) % 290) + 1}`;
    const city = cities[(i * 2) % cities.length];
    const payment_method = paymentMethods[(i * 4) % paymentMethods.length];
    const sales_rep = salesReps[(i * 5) % salesReps.length];

    records.push({
      id: currentId++,
      date: formattedDate,
      channel,
      order_id,
      product: productMeta.name,
      category: productMeta.category,
      quantity,
      price_per_unit,
      total_price,
      customer_name,
      city,
      payment_method,
      sales_rep
    });
  }

  // Sort by date descending so latest transactions appear first
  return records.sort((a, b) => b.date.localeCompare(a.date));
}

export const initialMockSales: SaleRecord[] = generateMockRecords();
