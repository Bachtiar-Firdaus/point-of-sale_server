const { AbilityBuilder, Ability } = require("@casl/ability");

const policies = {
  admin(user, { can }) {
    can("manage", "all");
  },
  user(user, { can }) {
    can("view", "Product");
    can("create", "Order");
    can("read", "Order", { user_id: user._id });
    can("read", "Cart", { user_id: user._id });
    can("update", "Cart", { user_id: user.id });
  },
};

function policyFor(user, admin) {
  let builder = new AbilityBuilder();
  if (user.role === "admin" && typeof policies[user.role] === "function") {
    policies["admin"](user, builder);
  } else {
    policies[user.role](user, builder);
  }
  return new Ability(builder.rules);
}

module.exports = { policyFor };
