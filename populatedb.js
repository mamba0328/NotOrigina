#! /usr/bin/env node
require('dotenv').config();

console.log('This script populates some test items, categories, and item instances to your database.');

const mongoose = require('mongoose');
const Item = require('./models/item');
const Category = require('./models/category');
const ItemInstance = require('./models/iteminstance');

const mongoDB = `${process.env.DB_URI}`;
main().catch((err) => console.log(err));

async function main() {
    console.log('Debug: About to connect');
    await mongoose.connect(mongoDB);
    console.log('Debug: Should be connected?');
    await createCategories();
    await createItems();
    await createItemInstances();
    console.log('Debug: Closing mongoose');
    mongoose.connection.close();
}

async function categoryCreate(name, description) {
    const category = new Category({ name, description });
    await category.save();
    console.log(`Added category: ${name}`);
    return category;
}

async function itemCreate(name, description, category, imgPath) {
    const itemDetail = { name, description, category, imgPath };
    const item = new Item(itemDetail);
    await item.save();
    console.log(`Added item: ${name}`);
    return item;
}

async function itemInstanceCreate(item, size, price, number_in_stock) {
    const itemInstanceDetail = { item, size, price, number_in_stock };
    const itemInstance = new ItemInstance(itemInstanceDetail);
    await itemInstance.save();
    console.log(`Added item instance for item: ${item.name}, size: ${size}`);
    return itemInstance;
}

async function createCategories() {
    console.log('Adding categories');
    await Promise.all([
        categoryCreate('Shoes', 'Footwear for all occasions'),
        categoryCreate('Shirts', 'Variety of stylish shirts for everyone'),
        categoryCreate('Coats', 'Warm and fashionable coats for all'),
    ]);
}

async function createItems() {
    console.log('Adding items');
    const categories = await Category.find();

    await Promise.all([
        itemCreate('Running Shoes', 'Comfortable and breathable running shoes', categories[0], 'path_to_running_shoes_image'),
        itemCreate('Casual Shirt', 'Casual and trendy shirt for everyday wear', categories[1], 'path_to_casual_shirt_image'),
        itemCreate('Winter Coat', 'Warm and stylish winter coat', categories[2], 'path_to_winter_coat_image'),
    ]);
}

async function createItemInstances() {
    console.log('Adding item instances');
    const items = await Item.find();

    await Promise.all([
        itemInstanceCreate(items[0], 'US 9', 65.99, 20),
        itemInstanceCreate(items[0], 'US 10', 65.99, 15),
        itemInstanceCreate(items[1], 'Medium', 45.99, 30),
        itemInstanceCreate(items[1], 'Large', 45.99, 25),
        itemInstanceCreate(items[2], 'Medium', 99.99, 10),
        itemInstanceCreate(items[2], 'Large', 99.99, 15),
    ]);
}
