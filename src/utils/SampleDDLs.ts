// 샘플 DDL 정의
export const SAMPLE_DDLS = {
	board: {
		name: "Board Table",
		ddl: `CREATE TABLE board(
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Board ID',
  title VARCHAR(200) NOT NULL COMMENT 'Title',
  content TEXT COMMENT 'Content',
  author VARCHAR(100) NOT NULL COMMENT 'Author',
  view_count INT DEFAULT 0 COMMENT 'View Count',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Created At',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated At'
) COMMENT 'Board Table';`,
	},

	user: {
		name: "User Table",
		ddl: `CREATE TABLE users(
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'User ID',
  username VARCHAR(50) UNIQUE NOT NULL COMMENT 'Username',
  email VARCHAR(100) UNIQUE NOT NULL COMMENT 'Email',
  password VARCHAR(255) NOT NULL COMMENT 'Password',
  full_name VARCHAR(100) COMMENT 'Full Name',
  phone VARCHAR(20) COMMENT 'Phone',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Created At',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated At'
) COMMENT 'User Table';`,
	},

	product: {
		name: "Product Table",
		ddl: `CREATE TABLE products(
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Product ID',
  name VARCHAR(200) NOT NULL COMMENT 'Name',
  description TEXT COMMENT 'Description',
  price DECIMAL(10,2) NOT NULL COMMENT 'Price',
  stock_quantity INT DEFAULT 0 COMMENT 'Stock Quantity',
  category VARCHAR(100) COMMENT 'Category',
  image_url VARCHAR(500) COMMENT 'Image URL',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Sale Status',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Created At',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated At'
) COMMENT 'Product Table';`,
	},

	order: {
		name: "Order Table",
		ddl: `CREATE TABLE orders(
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Order ID',
  user_id INT NOT NULL COMMENT 'User ID',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Order Date',
  total_amount DECIMAL(10,2) NOT NULL COMMENT 'Total Amount',
  status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending' COMMENT 'Order Status',
  shipping_address TEXT COMMENT 'Shipping Address',
  payment_method VARCHAR(50) COMMENT 'Payment Method',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Created At',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated At',
  FOREIGN KEY (user_id) REFERENCES users(id)
) COMMENT 'Order Table';`,
	},

	comment: {
		name: "Comment Table",
		ddl: `CREATE TABLE comments(
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Comment ID',
  board_id INT NOT NULL COMMENT 'Board ID',
  user_id INT NOT NULL COMMENT 'User ID',
  content TEXT NOT NULL COMMENT 'Content',
  parent_id INT COMMENT 'Parent Comment ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Created At',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated At',
  FOREIGN KEY (board_id) REFERENCES board(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (parent_id) REFERENCES comments(id)
) COMMENT 'Comment Table';`,
	},
}
