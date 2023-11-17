DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS account_info;
DROP TABLE IF EXISTS food_list;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS restaurant;

CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR,
    last_name VARCHAR,
    age INT
);
ALTER SEQUENCE customer_customer_id_seq RESTART WITH 6;

CREATE TABLE account_info (
    customer_id SERIAL PRIMARY KEY,
    card_number VARCHAR,
    account_balance FLOAT
);

ALTER SEQUENCE account_info_customer_id_seq RESTART WITH 6;

CREATE TABLE food_list (
    food_id SERIAL PRIMARY KEY,
    food_name VARCHAR,
    price INT,
    restaurant_id INT
);

CREATE TABLE restaurant (
    restaurant_id SERIAL PRIMARY KEY,
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
(5, 'Charlie', 'Brown', 36);

INSERT INTO account_info (customer_id, card_number, account_balance) VALUES
(1, '8734432167821239', 100),
(2, '4356432155823123', 0),
(3, '4231237923832181', 0),
(4, '5634728398732734', 0),
(5, '9873231267528321', 0);

INSERT INTO food_list (food_id, food_name, price, restaurant_id) VALUES
(101, 'Eggroll', 6, 1),
(102, 'Spring Roll', 6, 1),
(103, 'Steamed Bun', 9, 1),
(104, 'Wonton Soup', 7, 1),
(105, 'Chow Mein', 12, 1),
(106, 'Fried Rice', 10, 1),
(107, 'Kung Pao Chicken', 14, 1),
(108, 'Sweet and Sour Pork', 15, 1),
(109, 'Peking Duck', 20, 1),
(110, 'Mooncake', 8, 1),
(201, 'Lasagna', 17, 2),
(202, 'Pizza', 25, 2),
(203, 'Carbonara', 20, 2),
(204, 'Fettuccine Alfredo', 18, 2),
(205, 'Tortellini', 15, 2),
(206, 'Risoto', 15, 2),
(207, 'Gnocchi', 18, 2),
(208, 'Focaccia', 16, 2),
(209, 'Gelato', 12, 2),
(210, 'Tiramisu', 16, 2),
(301, 'Enchiladas', 12, 3),
(302, 'Tacos', 12, 3),
(303, 'Tamales', 10, 3),
(304, 'Burrito', 10, 3),
(305, 'Fajita', 11, 3),
(306, 'Birria', 15, 3),
(307, 'Nachos', 9, 3),
(308, 'Pozole de Pollo', 16, 3),
(309, 'Menudo', 14, 3),
(310, 'Churros', 8, 3),
(401, 'Sushi', 12, 4),
(402, 'Ramen', 15, 4),
(403, 'Tempura', 10, 4),
(404, 'Takoyaki', 8, 4),
(405, 'Miso Soup', 8, 4),
(406, 'Udon', 14, 4),
(407, 'Unagi', 16, 4),
(408, 'Wagyu', 20, 4),
(409, 'Sashimi', 14, 4),
(410, 'Mochi', 7, 4);

INSERT INTO restaurant (restaurant_id, restaurant_name, food_type) VALUES
(1, 'The Flying Dumpling', 'Chinese'),
(2, 'Sorrento', 'Italian'),
(3, 'Picuaritos', 'Mexican'),
(4, 'Fukuoka', 'Japanese');

