DROP DATABASE IF EXISTS bamazonDB;

create database bamazonDB

use bamazonDB;

create table products (
 item_id INT NOT NULL AUTO_INCREMENT,
 product_name varchar(35)NULL,
 department_name varchar(35) NULL,
 price INT default 0,
 stock_quantity INT default 0,
 primary key (item_id)
);