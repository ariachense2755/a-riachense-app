const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

class Database {
  async init() {
    this.db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });
    await this.db.exec(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT,
      price REAL,
      description TEXT
    )`);
    await this.db.exec(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      customer_name TEXT,
      address TEXT,
      payment_method TEXT,
      delivery_method TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    await this.db.exec(`CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY,
      order_id INTEGER,
      product_name TEXT,
      quantity INTEGER,
      price REAL
    )`);
  }

  async getAllProducts() {
    await this.init();
    return this.db.all(`SELECT * FROM products`);
  }

  async createOrder(customer, items) {
    await this.init();
    const orderResult = await this.db.run(
      `INSERT INTO orders (customer_name, address, payment_method, delivery_method) VALUES (?, ?, ?, ?)`,
      customer.name,
      customer.address,
      customer.payment_method,
      customer.delivery_method
    );
    const orderId = orderResult.lastID;

    for (let item of items) {
      await this.db.run(
        `INSERT INTO order_items (order_id, product_name, quantity, price) VALUES (?, ?, ?, ?)`,
        orderId,
        item.name,
        item.quantity,
        item.price
      );
    }
    return orderId;
  }
}

module.exports = { Database };

