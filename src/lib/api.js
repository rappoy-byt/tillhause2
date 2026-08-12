import { supabase } from './supabase';

// ==========================================
// 🛒 FUNGSI UNTUK PENGUNJUNG / KUSTOMER
// ==========================================

export async function fetchMenu() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('is_available', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Gagal mengambil menu:', error.message);
    throw error;
  }
  return data;
}

export async function createOrder(customerData, cartItems) {
  const midtransId = `TILE-${Date.now()}`;
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      midtrans_order_id: midtransId,
      customer_name: customerData.name,
      whatsapp_number: customerData.whatsapp,
      table_number: customerData.tableNumber,
      total_amount: customerData.totalAmount,
      status: 'pending'
    }])
    .select()
    .single();

  if (orderError) {
    console.error('Gagal membuat order:', orderError.message);
    throw orderError;
  }

  const orderItemsData = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price_at_time: item.price,
    notes: item.notes || ''
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData);

  if (itemsError) {
    console.error('Gagal menyimpan detail pesanan:', itemsError.message);
    throw itemsError;
  }

  return order;
}

// ==========================================
// 👨‍💼 FUNGSI UNTUK ADMIN / KASIR
// ==========================================

export async function loginAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login gagal:', error.message);
    throw new Error('Email atau password salah!');
  }

  const role = data.user?.user_metadata?.role || 'admin';
  if (role !== 'admin') {
    await supabase.auth.signOut();
    throw new Error('Akses ditolak: Akun Anda bukan Admin!');
  }

  return data.user;
}

export async function logoutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function toggleProductAvailability(productId, currentStatus) {
  const { data, error } = await supabase
    .from('products')
    .update({ is_available: !currentStatus })
    .eq('id', productId)
    .select();

  if (error) {
    console.error('Gagal update status menu:', error.message);
    throw error;
  }
  return data;
}

export async function updateOrderStatus(orderId, newStatus) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)
    .select();

  if (error) {
    console.error('Gagal update status order:', error.message);
    throw error;
  }
  return data;
}