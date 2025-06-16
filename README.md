# 🔐 Smart Gateway Server (Express.js)

This repository contains the Express.js-based Smart Gateway Server for an IoT system leveraging Self-Sovereign Identity (SSI) and blockchain (Hyperledger Fabric) for privacy-preserving identity and access management.

The Smart Gateway acts as a trusted intermediary between IoT actors (users, devices, services) and the backend blockchain infrastructure. It handles secure communication, identity verification, and access control logic based on Verifiable Credentials (VCs) and Decentralized Identifiers (DIDs).

---

## 🚀 Features

- ✅ RESTful API built with Express.js

---

## 📁 Project Structure

```bash
smart-gateway-server/
├── src/
│   ├── controllers/       # Request handlers
│   ├── services/          # Core logic: verification, access decisions
│   ├── routes/            # Express routes
│   ├── utils/             # Utility functions
│   └── app.js           # Entry point
├── .env                   # Environment variables
├── package.json           # Project metadata and dependencies
└── README.md              # Project documentation


