DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS food_list;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS restaurant;

CREATE TABLE customer (
    customer_id INT,
    first_name VARCHAR,
    last_name VARCHAR,
    age INT,
    payment_method VARCHAR
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

CREATE SEQUENCE transaction_id_seq;
CREATE TABLE transactions (
    t_id SERIAL PRIMARY KEY,
    customer_id INT,
    food_id INT,
    transaction_date VARCHAR
);

INSERT INTO customer (customer_id, first_name, last_name, age, payment_method) VALUES
(1, 'John', 'Doe', 28, 'Card'),
(2, 'Jane', 'Smith', 26, 'Cash'),
(3, 'Alice', 'Johnson', 25, 'Card'),
(4, 'Bob', 'Williams', 24, 'Cash'),
(5, 'Charlie', 'Brown', 36, 'Card');


INSERT INTO food_list (food_id, food_name, price, restaurant_id) VALUES
(101, 'Eggroll', 5, 100),
(102, 'Spring Roll', 4, 100),
(103, 'Steamed Bun', 8, 100),
(104, 'Wonton Soup', 7, 100),
(105, 'Chow Mein', 12, 100),
(106, 'Fried Rice', 10, 100),
(107, 'Kung Pao Chicken', 14, 100),
(201, 'Lasagna', 17, 200),
(202, 'Pizza', 25, 200),
(203, 'Carbonara', 20, 200),
(204, 'Fettuccine Alfredo', 18, 200),
(205, 'Tortellini', 15, 200),
(206, 'Risoto', 18, 200),
(207, 'Tiramisu', 16, 200),
(301, 'Enchiladas', 12, 300),
(302, 'Tacos', 12, 300),
(303, 'Tamales', 10, 300),
(304, 'Burrito', 10, 300),
(305, 'Fajita', 11, 300),
(306, 'Birria', 12, 300),
(307, 'Churros', 8, 300),
(401, 'Sushi', 12, 400),
(402, 'Ramen', 15, 400),
(403, 'Tempura', 10, 400),
(404, 'Takoyaki', 8, 400),
(405, 'Miso Soup', 8, 400),
(406, 'Udon', 10, 400),
(407, 'Mochi', 7, 400);

INSERT INTO restaurant (restaurant_id, restaurant_name, food_type) VALUES
(100, 'Chinese Restaurant', 'Chinese'),
(200, 'Italian Restaurant', 'Italian'),
(300, 'Mexican Restaurant', 'Mexican'),
(400, 'Japanese Restaurant', 'Japanese');

-- INSERT INTO transactions (t_id, customer_id, food_id, transaction_date) VALUES 
-- (1, 1, 103, '2023-10-20'),
-- (2, 1, 104, '2023-10-21'),
-- (3, 2, 301, '2023-10-19'),
-- (4, 2, 306, '2023-10-20'),
-- (5, 3, 203, '2023-10-15'),
-- (6, 3, 207, '2023-10-16'),
-- (7, 4, 402, '2023-10-14'),
-- (8, 4, 404, '2023-10-15'),
-- (9, 5, 107, '2023-10-13'),
-- (10, 5, 401, '2023-10-14');



