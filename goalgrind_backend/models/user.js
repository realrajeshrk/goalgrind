const mongoose = require('mongoose');
const validator = require('validator')
const UserSchema = new mongoose.Schema({
  name: { type: String,
          required: true,
          maxlength: [ 30, "Name cannot exceed 30 characters"] ,
          trim: true
        },
  email: { type: String, required: [true, "Email is required"], unique: true,
    lowercase: true,
    validator: [validator.isEmail, "Invalid Email address"]
   },
  password: { type: String, required: [true, "password is required"], minlength:[8, "Password must contain atleast 8 chanracters"] ,select:false },
  isPremium: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);