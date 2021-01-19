const { AbilityBuilder, Ability } = require("@casl/ability");

const policies = {
  user(user, { can }) {
    can("read", "Product");
    can("create", "Order");
    can("read", "Order", { user_id: user._id });
    can("read", "Cart", { user_id: user._id });
    can("update", "Cart", { user_id: user.id });
  },
  admin(user, { can }) {
    can("manage", "all");
  },
};

function policiyFor(user) {
  let builder = new AbilityBuilder();
  if (user && typeof policies[user.role] === "function") {
    policies[user.role](user, builder);
  } else {
    policies["guest"](user, builder);
  }
  return new Ability(builder.rules);
}

module.exports = { policiyFor };
