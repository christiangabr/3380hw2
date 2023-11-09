Project: Enterprise Database Application (hw2)
Team: Team 10
Date: 11/9/2023

Objective: Develop a web application for a chain of restaurants that features transaction and query processing.

Note: For this project, we decided to use the hw2 js starter code provided in the 'faq-and-announcements' channel of
our class discord as a template. Thus, getting the web application to run will be similar:
1. Download nodejs(https://nodejs.org/en/download)
2. Run following command to install libraries: npm install express pg
3. Alter ./creds.json with your local psql credentials
4. Start server using command: node hw2.js
5. Open browser and go to http://localhost:3000/;

Our web application consists of the following pages:

Home Page
The Home page has many functions. At the top of the page, there is a button to initialize all tables. It is necessary
to click this button in order to test the website. However, clicking this button may also clear current tables.
Thus, we decided to add a pop-up upon clicking it to warn users. Below this, there are two input boxes to make a transaction 
for a specific customer. It is necessary to input a valid customer ID and food ID for these input boxes. To find valid IDs,
navigate the Food List and Customers page. Lastly, the bottom of the page contains buttons to navigate all of the other pages.

Food List Page
The Food List page contains all of the food items from all restaurants along with their food ID and price.

Customers Page
The Customers page contains all customer names along with their customer IDs and age. The bottom of the Customers
page contains an input box that allows users to get all of a specific customer's transactions along with
the total amount of money they spent from all their transactions.

Bank Account Page
The Bank Account page contains all of the customers' bank account information. This includes customer ID,
card number and account balance. This page can be useful for checking whether a transaction correctly 
updates a customer's account balance.

Transactions Page
The Transactions page contains transaction information from all customers. This includes transaction ID, customer ID,
food ID and transaction date.
