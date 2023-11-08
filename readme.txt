Project: Enterprise Database Application (hw2)
Team: Team 10
Date: 11/9/2023

Objective: Develop a web application for a chain of restaurants that features transaction and query processing.

Note: For this project, we decided to use the hw2 js starter code provided in the 'faq-and-announcements' channel of
our class discord as a template. Thus, getting the web application to run will be similar:
1. Download nodejs(https://nodejs.org/en/download)
2. Run following command to install libraries: npm install express pg
3. Alter ./creds.json with your local psql credentials
4. Run all commands from the 'db.sql' into your local postgres server
5. Start server using command: node hw2.js
6. Open browser and go to http://localhost:3000/;

Our web application consists of the following pages:

The Food List Page:
The Food List page provides a list of all food items from each restaurant along with their food ID and price.
At the bottom of the Food List page, there are two input boxes that allow you to make a transaction for a specific customer.
This is done by entering a customer ID in the first input box and a food ID in the second input box.
Doing this updates the 'account_balance' column from the 'bank_account' table and inserts a transaction in the 'transactions' table.

The Customers Page:
The Customers page provides a list of all customers along with their customer ID and age.
At the top of the Customers page, there is a button to view the customers' bank account information.
Clicking this button will lead to separate page that displays the data from the 'bank_account' table.
At the bottom of the Customers page, there is an input box that allows you to view all of a customer's transactions
and the total amount of money they have spent from all of their transactions.