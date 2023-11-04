DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS employee;
CREATE TABLE product (
    product_id INT,
    name VARCHAR,
    price INT,
    quantity INT
);

CREATE TABLE employee (
    employee_id INT,
    first_name VARCHAR,
    last_name VARCHAR,
    age INT
);

INSERT INTO employee (employee_id, first_name, last_name, age) VALUES
(101, 'John', 'Doe', 28),
(102, 'Jane', 'Smith', 34),
(103, 'Alice', 'Johnson', 25),
(104, 'Bob', 'Williams', 30),
(105, 'Charlie', 'Brown', 29);




INSERT INTO product (product_id, name, price, quantity) VALUES 
(1, 'Apple', 99,10),
(2, 'Banana', 49,15),
(3, 'Cherry', 79,20),
(4, 'Date', 89,30),
(5, 'Elderberry', 109,10),
(6, 'Fig', 119,15),
(7, 'Grape', 129,5);

CREATE TABLE customer (
    customer_id INT,
    name VARCHAR
);

INSERT INTO customer (customer_id, name) VALUES 
(1, 'John'),
(2, 'Jane'),
(3, 'Alice'),
(4, 'Bob'),
(5, 'Charlie');

CREATE TABLE transactions (
    t_id INT,
    customer_id INT,
    product_id INT,
    transaction_date VARCHAR
);

INSERT INTO transactions (t_id, customer_id, product_id, transaction_date) VALUES 
(1, 1, 1, '2023-10-20'),
(2, 1, 2, '2023-10-21'),
(3, 2, 1, '2023-10-19'),
(4, 2, 3, '2023-10-20'),
(5, 3, 4, '2023-10-15'),
(6, 3, 5, '2023-10-16'),
(7, 4, 6, '2023-10-14'),
(8, 4, 7, '2023-10-15'),
(9, 5, 2, '2023-10-13'),
(10, 5, 3, '2023-10-14');