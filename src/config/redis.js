// config/redis.js

// Fake Redis client: same methods as used in project, but all no-op.

const fakeClient = {
  connect: async () => {},
  quit: async () => {},

  set: async () => {},
  get: async () => null,
  del: async () => {},
  expire: async () => {},
  expireAt: async () => {},

  exists: async () => 0,   // 🔥 add: used in auth blacklist check

  on: () => {},
};

module.exports = fakeClient;
