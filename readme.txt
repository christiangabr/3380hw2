Project: Enterprise Database Application (hw2)
Team: Team 10
Date: 11/22/2023

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
The Home page has many functions. If the user is a first-time user, there will simply be a button to initialize all tables. It is 
necessary for first-time users to click this button in order to test the website. Doing so will create the tables in the database 
and initialize them with starter data. Clicking the button will also grant the user access to other features of the web application.
Additionally, upon clicking the button, it will be replaced into a 'Clear Tables' button that will give the user the option to 
completely clear all tables in the database. Because this is considered to be a 'dangerous' operation, a pop-up should appear upon 
clicking it to warn users. Below the 'Clear Tables' button, there will be a 'Make a Transaction' section. Check the "How 
Transactions Work" segment below for more information about how transactions work. Under the 'Make a Transaction' section, there 
will be buttons to navigate all of the other pages. Lastly, the bottom of the Home page will contain links that lead to this 
readme file and the demo video for the web application.

Customers Page
The Customers page contains all of the customers' information including their account information (Note that the data being
displayed is a combination of the two tables 'customer' and 'account_info' in the database). Below the customers' information,
there are three features. The first feature is the 'Add New Customer' feature. By entering all of the necessary information,
the user will be able to create a new customer through this feature. Doing this creates a new row for the 'customer' table and 
the 'account_info' table. The next feature is the 'Add Funds to Account Balance' feature. As the name suggests, the user can
add funds to a customer's account balance by simply entering a customer ID and the amount of funds that the user wants to add.
Lastly, there is the 'Update Membership' feature which allows the user to change a customer's membership status by simply
entering that customer's customer ID.

Restaurants and Menus Page
The Restaurants and Menus page contains all of the restaurants along with each of the restaurants' food items and other
information about those food items. At the bottom of this page, there are are two features. The first feature is the 'Add New
Restaurant' feature which allows the user to create a new restaurant by entering the restaurant name, location and type of food
served in that restaurant. The second feature is the 'Add New Food Item' feature which allows the user to add a new food item to
a specific restaurant by selecting a restaurant ID and then entering the name of the food item and its price.

Transactions Page
The Transactions page contains transaction information from all customers. This includes transaction ID, customer ID,
food ID, quantity and transaction date. At the bottom of this page, the user may enter a specific customer ID in order
to view all of that customer's transactions along with the total amount of money they spent from all of their transactions.

How Transactions Work:
The main way to make a transaction in this web application is through the 'Make a Transaction' section of the Home page.
To make a transaction, the user must first select a customer ID and a food ID (Recall that customer IDs can be found in the 
Customers page and food IDs can be found in the Restaurants and Menus page). Then, the user must select the quantity of the
chosen food item that they want to buy for their chosen customer (max quantity is 10). Lastly, the user may choose to add a tip,
but doing so is completely optional. It is important to note that all food items have a 5% tax. Additionally, if a chosen
customer is a member, then that customer will receive a 10% discount. The discount is applied first, followed by the tax and
the tip is added last. For example, if a customer is a member and that customer buys 10 of a food item that costs $10 and chooses
to tip $10, the base cost will be $100, then it will be $90 after the 10% discount, $94.5 after the 5% tax is applied and the final 
cost will be $104.5 after the $10 tip is added.