const mongoose = require('mongoose');

const FinanceSchema = new mongoose.Schema({
  type: { type: String, enum: ['income', 'expense'] },
  category: String,
  amount: Number,
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Finance', FinanceSchema);
