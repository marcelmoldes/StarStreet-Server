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
    let profile_image = "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg";
    let role = "customer";
    if (i === 0) {
      email = "marcel.moldes@gmail.com";
      role = "admin";
      profile_image = "https://t3.ftcdn.net/jpg/04/60/91/88/360_F_460918802_XVCymFr7MoziFpnInbTDvrlblYhvAOi2.jpg"
    } else if (i === 1) {
      email = "cliente@gmail.com";
      profile_image = "https://media.istockphoto.com/id/941737576/photo/close-up-portrait-of-handsome-successful-man-in-formal-wear-on-smoth-blue-background.jpg"
    } else {
      email = faker.internet.email();
    }
    const client = await Clients.create({
      email: email,
      password: "12345",
      profile_image: profile_image,
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
  }
  process.exit();
}

createClients(100);