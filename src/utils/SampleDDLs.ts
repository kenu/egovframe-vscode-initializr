// 샘플 DDL 정의 (DBMS별로 구분)
export const SAMPLE_DDLS = {
	"board-mysql": {
		name: "Board Table (MySQL)",
		dialect: "mysql",
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

	"board-pgsql": {
		name: "Board Table (PostgreSQL)",
		dialect: "pgsql",
		ddl: `CREATE TABLE board(
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  author VARCHAR(100) NOT NULL,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE board IS 'Board Table';
COMMENT ON COLUMN board.id IS 'Board ID';
COMMENT ON COLUMN board.title IS 'Title';
COMMENT ON COLUMN board.content IS 'Content';
COMMENT ON COLUMN board.author IS 'Author';
COMMENT ON COLUMN board.view_count IS 'View Count';
COMMENT ON COLUMN board.created_at IS 'Created At';
COMMENT ON COLUMN board.updated_at IS 'Updated At';`,
	},

	"user-mysql": {
		name: "User Table (MySQL)",
		dialect: "mysql",
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

	"user-pgsql": {
		name: "User Table (PostgreSQL)",
		dialect: "pgsql",
		ddl: `CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'User Table';
COMMENT ON COLUMN users.id IS 'User ID';
COMMENT ON COLUMN users.username IS 'Username';
COMMENT ON COLUMN users.email IS 'Email';
COMMENT ON COLUMN users.password IS 'Password';
COMMENT ON COLUMN users.full_name IS 'Full Name';
COMMENT ON COLUMN users.phone IS 'Phone';
COMMENT ON COLUMN users.is_active IS 'Active';
COMMENT ON COLUMN users.created_at IS 'Created At';
COMMENT ON COLUMN users.updated_at IS 'Updated At';`,
	},

	"product-mysql": {
		name: "Product Table (MySQL)",
		dialect: "mysql",
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

	"product-pgsql": {
		name: "Product Table (PostgreSQL)",
		dialect: "pgsql",
		ddl: `CREATE TABLE products(
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT DEFAULT 0,
  category VARCHAR(100),
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE products IS 'Product Table';
COMMENT ON COLUMN products.id IS 'Product ID';
COMMENT ON COLUMN products.name IS 'Name';
COMMENT ON COLUMN products.description IS 'Description';
COMMENT ON COLUMN products.price IS 'Price';
COMMENT ON COLUMN products.stock_quantity IS 'Stock Quantity';
COMMENT ON COLUMN products.category IS 'Category';
COMMENT ON COLUMN products.image_url IS 'Image URL';
COMMENT ON COLUMN products.is_active IS 'Sale Status';
COMMENT ON COLUMN products.created_at IS 'Created At';
COMMENT ON COLUMN products.updated_at IS 'Updated At';`,
	},

	"order-mysql": {
		name: "Order Table (MySQL)",
		dialect: "mysql",
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

	"order-pgsql": {
		name: "Order Table (PostgreSQL)",
		dialect: "pgsql",
		ddl: `CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  shipping_address TEXT,
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

COMMENT ON TABLE orders IS 'Order Table';
COMMENT ON COLUMN orders.id IS 'Order ID';
COMMENT ON COLUMN orders.user_id IS 'User ID';
COMMENT ON COLUMN orders.order_date IS 'Order Date';
COMMENT ON COLUMN orders.total_amount IS 'Total Amount';
COMMENT ON COLUMN orders.status IS 'Order Status';
COMMENT ON COLUMN orders.shipping_address IS 'Shipping Address';
COMMENT ON COLUMN orders.payment_method IS 'Payment Method';
COMMENT ON COLUMN orders.created_at IS 'Created At';
COMMENT ON COLUMN orders.updated_at IS 'Updated At';`,
	},

	"comment-mysql": {
		name: "Comment Table (MySQL)",
		dialect: "mysql",
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

	"comment-pgsql": {
		name: "Comment Table (PostgreSQL)",
		dialect: "pgsql",
		ddl: `CREATE TABLE comments(
  id SERIAL PRIMARY KEY,
  board_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  parent_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES board(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (parent_id) REFERENCES comments(id)
);

COMMENT ON TABLE comments IS 'Comment Table';
COMMENT ON COLUMN comments.id IS 'Comment ID';
COMMENT ON COLUMN comments.board_id IS 'Board ID';
COMMENT ON COLUMN comments.user_id IS 'User ID';
COMMENT ON COLUMN comments.content IS 'Content';
COMMENT ON COLUMN comments.parent_id IS 'Parent Comment ID';
COMMENT ON COLUMN comments.created_at IS 'Created At';
COMMENT ON COLUMN comments.updated_at IS 'Updated At';`,
	},
}
