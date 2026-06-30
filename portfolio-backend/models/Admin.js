const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true } // stored hashed
  },
  { timestamps: true }
);

//in case the admin will change the password from the .env we might need to add a method to
//hash the password before saving it to the database, but the admin gets seeded once FOR NOW.


adminSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
