# Polyglot Management System for an E-Commerce Platform

## Objective  
Build an application for an e-commerce platform that manages order creation, shopping carts, cart-to-order conversion, order completion, invoice generation, payment registration, and user account management. The focus is on **polyglot persistence**, using different types of NoSQL databases.  

## Part 1: Database Model Definition  

### Justification  
Explain the choice of database models for each system component (**users, carts, orders, invoices, payments, product catalog**).  

### Physical Modeling  
Present the physical model of each database structure, considering optimization for queries and transactions.  

## Part 2: Application Development  

### User Authentication and Session Management ✅  
Store and retrieve the session of the logged-in user along with their activity.  

### User Categorization  
Register user activity and determine their categorization (**TOP, MEDIUM, LOW**).  

### Shopping Cart Management  
- Add, remove, or modify products and quantities in a shopping cart.  
- Save, retrieve, and restore previous states of an active shopping cart.  

### Cart-to-Order Conversion  
Convert the shopping cart contents into an order, including customer details, total amount, discounts, and taxes.  

### Invoicing and Payment Registration  
Generate invoices for orders and record payments, specifying the payment method.  

### Operations Control  
Track invoicing and payment operations performed by users.  

### Product Catalog  
Maintain a **product catalog** with engaging information to enhance the shopping experience.  

### Price List  
Keep an **updated price list** for sales.  

### Catalog Change Log  
Record all activities related to the **product catalog** modifications.  
