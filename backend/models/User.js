const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      trim: true,
      default: '',
    },
    last_name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password_hash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'agent', 'sales_rep'],
        message: '{VALUE} is not a valid user role',
      },
      default: 'agent',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!enteredPassword || !this.password_hash) return false;
  return await bcrypt.compare(enteredPassword, this.password_hash);
};

// Static helper to find by email
userSchema.statics.findByEmail = async function (email) {
  const cleanEmail = (email || '').toLowerCase().trim();
  if (mongoose.connection.readyState === 1) {
    try {
      const user = await this.findOne({ email: cleanEmail });
      if (user) return user;
    } catch (err) {
      console.warn('[User Model] MongoDB findByEmail query error:', err.message);
    }
  }
  return null;
};

// Static helper to compare raw candidate password with stored bcrypt hash
userSchema.statics.comparePassword = async function (candidatePassword, hashedPassword) {
  if (!candidatePassword || !hashedPassword) return false;
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

