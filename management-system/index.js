#!/usr/bin/env node

/**
 * FruviStore Management System
 * Independent program for managing products, prices, and orders
 * Separate from the web application
 */

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ipjkpgmptexkhilrjnsl.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'your-service-key'; // Use service key for admin operations

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// CLI Interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

class FruviManager {
  constructor() {
    this.currentUser = null;
  }

  async login() {
    console.log('🔐 FruviStore Management System');
    console.log('==============================\n');

    const email = await ask('Email: ');
    const password = await ask('Password: ');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) throw error;

      this.currentUser = data.user;
      console.log(`✅ Welcome, ${this.currentUser.email}!\n`);
      return true;
    } catch (error) {
      console.log(`❌ Login failed: ${error.message}\n`);
      return false;
    }
  }

  async showMenu() {
    while (true) {
      console.log('📋 Management Menu:');
      console.log('==================');
      console.log('1. 📦 Manage Products');
      console.log('2. 💰 Manage Prices');
      console.log('3. 📋 View Orders');
      console.log('4. 📊 View Statistics');
      console.log('5. 🚪 Logout');
      console.log('6. ❌ Exit\n');

      const choice = await ask('Choose an option (1-6): ');

      switch (choice) {
        case '1':
          await this.manageProducts();
          break;
        case '2':
          await this.managePrices();
          break;
        case '3':
          await this.viewOrders();
          break;
        case '4':
          await this.viewStatistics();
          break;
        case '5':
          await this.logout();
          return;
        case '6':
          console.log('👋 Goodbye!');
          rl.close();
          process.exit(0);
        default:
          console.log('❌ Invalid option. Please try again.\n');
      }
    }
  }

  async manageProducts() {
    console.log('\n📦 Product Management');
    console.log('====================');

    const products = await this.getProducts();
    console.log(`Found ${products.length} products:\n`);

    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.category}) - ${product.is_active ? 'Active' : 'Inactive'}`);
    });

    console.log('\nOptions:');
    console.log('1. Add new product');
    console.log('2. Edit product');
    console.log('3. Toggle active/inactive');
    console.log('4. Back to main menu\n');

    const choice = await ask('Choose an option: ');

    switch (choice) {
      case '1':
        await this.addProduct();
        break;
      case '2':
        await this.editProduct(products);
        break;
      case '3':
        await this.toggleProductStatus(products);
        break;
      default:
        return;
    }
  }

  async managePrices() {
    console.log('\n💰 Price Management');
    console.log('==================');

    const products = await this.getProducts();
    console.log('Select a product to manage prices:\n');

    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
    });

    const choice = await ask('Choose a product (number): ');
    const productIndex = parseInt(choice) - 1;

    if (productIndex >= 0 && productIndex < products.length) {
      await this.manageProductPrices(products[productIndex]);
    } else {
      console.log('❌ Invalid selection.\n');
    }
  }

  async viewOrders() {
    console.log('\n📋 Order Management');
    console.log('==================');

    const orders = await this.getOrders();
    console.log(`Found ${orders.length} orders:\n`);

    orders.forEach((order, index) => {
      console.log(`${index + 1}. Order #${order.order_number} - ${order.status} - $${order.total_amount}`);
      console.log(`   User: ${order.user_id} - Created: ${new Date(order.created_at).toLocaleDateString()}`);
    });

    if (orders.length > 0) {
      const choice = await ask('\nEnter order number to view details (or press Enter to go back): ');
      if (choice.trim()) {
        const order = orders.find(o => o.order_number === choice.trim());
        if (order) {
          await this.viewOrderDetails(order);
        } else {
          console.log('❌ Order not found.\n');
        }
      }
    } else {
      console.log('No orders found.\n');
    }
  }

  async viewStatistics() {
    console.log('\n📊 Statistics');
    console.log('============');

    try {
      // Get product count
      const { count: productCount, error: productError } = await supabase
        .from('management_products')
        .select('*', { count: 'exact', head: true });

      // Get order stats
      const { data: orders, error: orderError } = await supabase
        .from('management_orders')
        .select('status, total_amount');

      if (productError || orderError) throw productError || orderError;

      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;

      console.log(`📦 Total Products: ${productCount}`);
      console.log(`📋 Total Orders: ${totalOrders}`);
      console.log(`💰 Total Revenue: $${totalRevenue.toFixed(2)}`);
      console.log(`⏳ Pending Orders: ${pendingOrders}\n`);

    } catch (error) {
      console.log(`❌ Error loading statistics: ${error.message}\n`);
    }
  }

  async logout() {
    await supabase.auth.signOut();
    this.currentUser = null;
    console.log('👋 Logged out successfully!\n');
  }

  // Helper methods
  async getProducts() {
    const { data, error } = await supabase
      .from('management_products')
      .select('*')
      .order('name');

    if (error) {
      console.log(`❌ Error loading products: ${error.message}`);
      return [];
    }
    return data || [];
  }

  async getOrders() {
    const { data, error } = await supabase
      .from('management_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.log(`❌ Error loading orders: ${error.message}`);
      return [];
    }
    return data || [];
  }

  async addProduct() {
    console.log('\n➕ Add New Product');
    console.log('=================');

    const name = await ask('Product name: ');
    const category = await ask('Category: ');
    const description = await ask('Description: ');

    try {
      const { data, error } = await supabase
        .from('management_products')
        .insert([{
          name: name.trim(),
          category: category.trim(),
          description: description.trim()
        }])
        .select();

      if (error) throw error;

      console.log(`✅ Product "${name}" added successfully!\n`);
    } catch (error) {
      console.log(`❌ Error adding product: ${error.message}\n`);
    }
  }

  async manageProductPrices(product) {
    console.log(`\n💰 Managing prices for: ${product.name}`);
    console.log('=====================================');

    // Get current prices
    const { data: prices, error } = await supabase
      .from('management_product_prices')
      .select('*')
      .eq('product_id', product.id)
      .order('effective_date', { ascending: false });

    if (error) {
      console.log(`❌ Error loading prices: ${error.message}\n`);
      return;
    }

    console.log('Current prices:');
    prices?.forEach((price, index) => {
      console.log(`${index + 1}. $${price.price_per_kg}/kg - ${price.is_organic ? 'Organic' : 'Conventional'} - ${price.is_current ? 'Current' : 'Historical'}`);
    });

    const choice = await ask('\n1. Add new price\n2. Back\nChoose: ');

    if (choice === '1') {
      await this.addProductPrice(product.id);
    }
  }

  async addProductPrice(productId) {
    const price = await ask('Price per kg: ');
    const isOrganic = (await ask('Is organic? (y/n): ')).toLowerCase() === 'y';
    const rating = await ask('Rating (1-5): ');
    const origin = await ask('Origin: ');

    try {
      // First, set all existing prices for this product to not current
      await supabase
        .from('management_product_prices')
        .update({ is_current: false })
        .eq('product_id', productId);

      // Add new price
      const { data, error } = await supabase
        .from('management_product_prices')
        .insert([{
          product_id: productId,
          price_per_kg: parseFloat(price),
          is_organic: isOrganic,
          rating: parseFloat(rating),
          origin: origin.trim(),
          is_current: true
        }])
        .select();

      if (error) throw error;

      console.log(`✅ Price updated successfully!\n`);
    } catch (error) {
      console.log(`❌ Error updating price: ${error.message}\n`);
    }
  }

  async viewOrderDetails(order) {
    console.log(`\n📋 Order Details: #${order.order_number}`);
    console.log('=====================================');

    const { data: items, error } = await supabase
      .from('management_order_items')
      .select('*')
      .eq('order_id', order.id);

    if (error) {
      console.log(`❌ Error loading order items: ${error.message}\n`);
      return;
    }

    console.log(`Status: ${order.status}`);
    console.log(`Total: $${order.total_amount}`);
    console.log(`Created: ${new Date(order.created_at).toLocaleString()}`);
    console.log('\nItems:');

    items?.forEach(item => {
      console.log(`- ${item.product_name}: ${item.quantity}kg x $${item.unit_price} = $${item.total_price}`);
    });

    console.log('\n');
  }
}

// Main execution
async function main() {
  const manager = new FruviManager();

  // Check if we have required environment variables
  if (!SUPABASE_URL || SUPABASE_SERVICE_KEY === 'your-service-key') {
    console.log('❌ Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables');
    process.exit(1);
  }

  let loggedIn = false;
  while (!loggedIn) {
    loggedIn = await manager.login();
  }

  await manager.showMenu();
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Goodbye!');
  rl.close();
  process.exit(0);
});

// Run the program
main().catch(console.error);