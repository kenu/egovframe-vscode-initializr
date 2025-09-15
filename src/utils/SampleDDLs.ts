// 샘플 DDL 정의
export const SAMPLE_DDLS = {
	board: {
		name: "게시판 테이블",
		ddl: `CREATE TABLE board(
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '게시글 번호',
  title VARCHAR(200) NOT NULL COMMENT '제목',
  content TEXT COMMENT '내용',
  author VARCHAR(100) NOT NULL COMMENT '작성자',
  view_count INT DEFAULT 0 COMMENT '조회수',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '작성일시',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시'
) COMMENT '게시판 테이블';`,
	},

	user: {
		name: "사용자 테이블",
		ddl: `CREATE TABLE users(
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '사용자 번호',
  username VARCHAR(50) UNIQUE NOT NULL COMMENT '사용자명',
  email VARCHAR(100) UNIQUE NOT NULL COMMENT '이메일',
  password VARCHAR(255) NOT NULL COMMENT '비밀번호',
  full_name VARCHAR(100) COMMENT '실명',
  phone VARCHAR(20) COMMENT '전화번호',
  is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '가입일시',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시'
) COMMENT '사용자 테이블';`,
	},

	product: {
		name: "상품 테이블",
		ddl: `CREATE TABLE products(
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '상품 번호',
  name VARCHAR(200) NOT NULL COMMENT '상품명',
  description TEXT COMMENT '상품 설명',
  price DECIMAL(10,2) NOT NULL COMMENT '가격',
  stock_quantity INT DEFAULT 0 COMMENT '재고 수량',
  category VARCHAR(100) COMMENT '카테고리',
  image_url VARCHAR(500) COMMENT '이미지 URL',
  is_active BOOLEAN DEFAULT TRUE COMMENT '판매 여부',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시'
) COMMENT '상품 테이블';`,
	},

	order: {
		name: "주문 테이블",
		ddl: `CREATE TABLE orders(
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '주문 번호',
  user_id INT NOT NULL COMMENT '사용자 번호',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '주문일시',
  total_amount DECIMAL(10,2) NOT NULL COMMENT '총 금액',
  status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending' COMMENT '주문 상태',
  shipping_address TEXT COMMENT '배송 주소',
  payment_method VARCHAR(50) COMMENT '결제 방법',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  FOREIGN KEY (user_id) REFERENCES users(id)
) COMMENT '주문 테이블';`,
	},

	comment: {
		name: "댓글 테이블",
		ddl: `CREATE TABLE comments(
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '댓글 번호',
  board_id INT NOT NULL COMMENT '게시글 번호',
  user_id INT NOT NULL COMMENT '사용자 번호',
  content TEXT NOT NULL COMMENT '댓글 내용',
  parent_id INT COMMENT '부모 댓글 번호',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '작성일시',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  FOREIGN KEY (board_id) REFERENCES board(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (parent_id) REFERENCES comments(id)
) COMMENT '댓글 테이블';`,
	},
}
