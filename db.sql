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
    account_balance FLOAT,
    member BOOLEAN
);

ALTER SEQUENCE account_info_customer_id_seq RESTART WITH 6;

CREATE TABLE food_list (
    food_id SERIAL PRIMARY KEY,
    food_name VARCHAR,
    price INT,
    restaurant_id INT
);
ALTER SEQUENCE food_list_food_id_seq RESTART WITH 21;

CREATE TABLE restaurant (
    restaurant_id SERIAL PRIMARY KEY,
    restaurant_name VARCHAR ,
    restaurant_location VARCHAR,
    food_type VARCHAR
);
ALTER SEQUENCE restaurant_restaurant_id_seq RESTART WITH 5;

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

INSERT INTO account_info (customer_id, card_number, account_balance, member) VALUES
(1, '8734432167821239', 100, FALSE),
(2, '4356432155823123', 0, FALSE),
(3, '4231237923832181', 0, FALSE),
(4, '5634728398732734', 0, FALSE),
(5, '9873231267528321', 0, FALSE);

INSERT INTO food_list (food_id, food_name, price, restaurant_id) VALUES
(1, 'Eggrolls', 10, 1),
(2, 'Spring Roll', 7, 1),
(3, 'Steamed Bun', 9, 1),
(4, 'Wonton Soup', 8, 1),
(5, 'Mooncake', 9, 1),
(6, 'Lasagna', 17, 2),
(7, 'Pizza', 25, 2),
(8, 'Carbonara', 20, 2),
(9, 'Fettuccine Alfredo', 18, 2),
(10, 'Tortellini', 15, 2),
(11, 'Enchiladas', 12, 3),
(12, 'Tacos', 12, 3),
(13, 'Tamales', 10, 3),
(14, 'Burrito', 10, 3),
(15, 'Fajita', 11, 3),
(16, 'Sushi', 12, 4),
(17, 'Ramen', 15, 4),
(18, 'Tempura', 10, 4),
(19, 'Takoyaki', 8, 4),
(20, 'Miso Soup', 8, 4);

INSERT INTO restaurant (restaurant_id, restaurant_name, restaurant_location,food_type) VALUES
(1, 'The Flying Dumpling','9790 Lancaster St.o
Natchez, MS 39120', 'Chinese'),
(2, 'Sorrento', '866 East Dogwood Ave.
Martinsville, VA 24112','Italian'),
(3, 'Picuaritos', '239 North Westminster Drive
Chatsworth, GA 30705','Mexican'),
(4, 'Fukuoka', '97 Philmont Road
Lafayette, IN 47905','Japanese');

