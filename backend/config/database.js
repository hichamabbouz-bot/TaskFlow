const dns = require("dns");
const mongoose = require("mongoose");

const configureDnsServers = () => {
  if (!process.env.DNS_SERVERS) return;

  const servers = process.env.DNS_SERVERS.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (servers.length > 0) {
    dns.setServers(servers);
  }
};

const connectDatabase = async () => {
  configureDnsServers();

  if (!process.env.MONGO_URI) {
    console.error("MongoDB URI is missing. Check backend/.env.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.info("MongoDB connecte");
  } catch (err) {
    console.error("Erreur MongoDB:", err);
  }
};

module.exports = connectDatabase;
