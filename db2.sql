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

CREATE TABLE account_info (
    customer_id SERIAL PRIMARY KEY,
    card_number VARCHAR,
    account_balance FLOAT,
    member BOOLEAN
);

CREATE TABLE food_list (
    food_id SERIAL PRIMARY KEY,
    food_name VARCHAR,
    price INT,
    restaurant_id INT
);

CREATE TABLE restaurant (
    restaurant_id SERIAL PRIMARY KEY,
    restaurant_name VARCHAR ,
    restaurant_location VARCHAR,
    food_type VARCHAR
);

CREATE TABLE transactions (
    t_id SERIAL PRIMARY KEY,
    customer_id INT,
    food_id INT,
    quantity INT,
    transaction_date VARCHAR,
    total_cost FLOAT
);