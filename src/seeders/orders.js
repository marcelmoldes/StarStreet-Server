const jwt = require("jsonwebtoken");
const jwtSecret = "290eu38f9hcefhsfaebesufbeaufeuyfgr8ygagtvdbkloigruoi";
const { Orders } = require("../models/Orders.js");
const { faker } = require("@faker-js/faker");

async function createOrders(numberOfOrders) {
  await Orders.destroy({
    truncate: true,
  });
  for (let i = 0; i < numberOfOrders; i++) {
    const subtotal = faker.number.int({ min: 20, max: 300 })
    const taxes = Math.round(subtotal * .1);
    const shipping = 5;
    const total = subtotal + taxes + shipping;
    const createdAt = faker.date.past({
        days: 365
    })
    const order = await Orders.create({
      email: faker.internet.email(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      card_number: faker.string.numeric({
        length: 14,
      }),
      expiration_date: "295",
      cvc: "467",
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      postal_code: faker.string.numeric({
        length: 5,
      }),
      card_name: faker.person.fullName(),
      phone: faker.string.numeric({
        allowLeadingZeros: false,
        length: 9,
      }),
      country_code: faker.location.countryCode(),
      client_id: i + 1,
      total,
      subtotal,
      taxes,
      shipping,
      state: faker.location.state(),
      shipping_status: "Shipped",
      shipping_company: "SEUR",
      tracking_number: i + 1,
      order_number: i + 1,
      createdAt,
      updatedAt: createdAt
    });
  }
  process.exit();
}

createOrders(100);
