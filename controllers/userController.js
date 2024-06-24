const { User } = require("../models");
const { sequelize } = require("../models");

exports.updateBalance = async (req, res) => {
  const { userId, amount } = req.body;

  const t = await sequelize.transaction();

  try {
    const user = await User.findByPk(userId, { transaction: t, lock: true });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    const newBalance = user.balance + amount;
    if (newBalance < 0) {
      await t.rollback();
      return res.status(400).json({ message: "Insufficient funds" });
    }

    user.balance = newBalance;
    await user.save({ transaction: t });

    await t.commit();
    res.json({ message: "Balance updated successfully", newBalance });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getBalance = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
