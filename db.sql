DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS bank_account;
DROP TABLE IF EXISTS food_list;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS restaurant;

CREATE TABLE customer (
    customer_id INT,
    first_name VARCHAR,
    last_name VARCHAR,
    age INT
);

CREATE TABLE bank_account (
    customer_id INT,
    card_number VARCHAR,
    account_balance INT
);

CREATE TABLE food_list (
    food_id INT,
    food_name VARCHAR,
    price INT,
    restaurant_id INT
);

CREATE TABLE restaurant (
    restaurant_id INT,
    restaurant_name VARCHAR,
    food_type VARCHAR
);

CREATE TABLE transactions (
    t_id SERIAL PRIMARY KEY,
    customer_id INT,
    food_id INT,
    transaction_date VARCHAR
);

INSERT INTO customer (customer_id, first_name, last_name, age) VALUES
(1, 'John', 'Doe', 28),
(2, 'Jane', 'Smith', 26),
(3, 'Alice', 'Johnson', 25),
(4, 'Bob', 'Williams', 24),
(5, 'Charlie', 'Brown', 36),
(6, 'William', 'Smith', 55),
(7, 'Jake', 'Chan', 59),
(8, 'Leon', 'Kennedy', 28),
(9, 'Ada', 'Wong', 29),
(10, 'Jill', 'Valentine', 27);

INSERT INTO bank_account (customer_id, card_number, account_balance) VALUES
(1, '1111111111111111', 100),
(2, '2222222222222222', 0),
(3, '3333333333333333', 0),
(4, '4444444444444444', 0),
(5, '5555555555555555', 0),
(6, '6666666666666666', 0),
(7, '7777777777777777', 0),
(8, '8888888888888888', 0),
(9, '9999999999999999', 0),
(10, '1010101010101010', 0);


INSERT INTO food_list (food_id, food_name, price, restaurant_id) VALUES
(101, 'Eggroll', 6, 100),
(102, 'Spring Roll', 6, 100),
(103, 'Steamed Bun', 9, 100),
(104, 'Wonton Soup', 7, 100),
(105, 'Chow Mein', 12, 100),
(106, 'Fried Rice', 10, 100),
(107, 'Kung Pao Chicken', 14, 100),
(107, 'Orange Chicken', 13, 100),
(108, 'Sweet and Sour Pork', 15, 100),
(109, 'Peking Duck', 20, 100),
(110, 'Mooncake', 8, 100),
(201, 'Lasagna', 17, 200),
(202, 'Pizza', 25, 200),
(203, 'Carbonara', 20, 200),
(204, 'Fettuccine Alfredo', 18, 200),
(205, 'Tortellini', 15, 200),
(206, 'Risoto', 15, 200),
(207, 'Gnocchi', 18, 200),
(208, 'Focaccia', 16, 200),
(209, 'Gelato', 12, 200),
(210, 'Tiramisu', 16, 200),
(301, 'Enchiladas', 12, 300),
(302, 'Tacos', 12, 300),
(303, 'Tamales', 10, 300),
(304, 'Burrito', 10, 300),
(305, 'Fajita', 11, 300),
(306, 'Birria', 15, 300),
(307, 'Nachos', 9, 300),
(308, 'Pozole de Pollo', 16, 300),
(309, 'Menudo', 14, 300),
(310, 'Churros', 8, 300),
(401, 'Sushi', 12, 400),
(402, 'Ramen', 15, 400),
(403, 'Tempura', 10, 400),
(404, 'Takoyaki', 8, 400),
(405, 'Miso Soup', 8, 400),
(406, 'Udon', 14, 400),
(407, 'Unagi', 16, 400),
(408, 'Wagyu', 20, 400),
(409, 'Sashimi', 14, 400),
(410, 'Mochi', 7, 400);

INSERT INTO restaurant (restaurant_id, restaurant_name, food_type) VALUES
(100, 'The Flying Dumpling', 'Chinese'),
(200, 'Sorrento', 'Italian'),
(300, 'Picuaritos', 'Mexican'),
(400, 'Fukuoka', 'Japanese');

