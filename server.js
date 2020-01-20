const express = require("express");

const db = require("./data/dbConfig.js");

const server = express();

server.use(express.json());

// GET all accounts
server.get("/api/accounts", (req, res) => {
  db("accounts")
    .then(accounts => {
      res.json(accounts);
    })
    .catch(err => {
      res.status(500).json({ error_message: "Failed to get accounts" });
    });
});

// GET account by ID
server.get("/api/accounts/:id", (req, res) => {
  //SELECT * FROM Accounts WHERE id = param.id
  const { id } = req.params;
  db("accounts")
    .where({ id })
    .then(accounts => {
      const account = accounts[0];
      if (account) {
        res.json(account);
      } else {
        res.status(404).json({ errror_message: "account not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ error_message: "Failed to get account" });
    });
});

// POST new account
server.post("/api/accounts", (req, res) => {
  const accountData = req.body;
  db("accounts")
    .insert(accountData)
    .then(account => {
      res.status(201).json(account);
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Something happened when creating a new account" });
    });
});

// PUT update accounts
server.put("/api/accounts/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  db("accounts")
    .where({ id })
    .update(changes)
    .then(count => {
      if (count) {
        res.json({ updated: count });
      } else {
        res.status(404).json({ error_message: "invalid post ID" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to update account" });
    });
});

// DELETE remove account
server.delete("/api/accounts/:id", (req, res) => {
  const { id } = req.params;
  db("accounts")
    .where({ id })
    .del()
    .then(count => {
      if (count) {
        res.json({ deleted: count });
      } else {
        res.status(404).json({ error_message: "invalid post ID" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "Something happened when deleting an account" });
    });
});

module.exports = server;
