const jwt = require("jsonwebtoken");
const jwtSecret = "290eu38f9hcefhsfaebesufbeaufeuyfgr8ygagtvdbkloigruoi";
const { Clients } = require("../models/Clients.js");
const { Orders } = require("../models/Orders.js");
const { faker } = require("@faker-js/faker");

async function createClients(numberOfClients) {
  await Clients.destroy({
    truncate: true,
  });
  for (let i = 0; i < numberOfClients; i++) {
    let email;
    let role = "customer";
    if (i === 0) {
      email = "marcel.moldes@gmail.com";
      role = "admin";
    } else if (i === 1) {
      email = "cliente@gmail.com";
    } else {
      email = faker.internet.email();
    }
    const client = await Clients.create({
      email: email,
      password: "12345",
      profile_image: faker.internet.url(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      postal_code: faker.string.numeric({
        length: 5,
      }),
      country_code: faker.location.countryCode(),
      phone: faker.string.numeric({
        allowLeadingZeros: false,
        length: 9,
      }),
      role: role,
    });
    console.log(`Created client ${client.first_name} ${client.last_name}`);
  }
  process.exit();
}

createClients(10);
