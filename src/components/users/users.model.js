const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../../config");

// let dbConnection = mongoose.createConnection(`${config.dbURI}BOX_MERCHANTS`);
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    age: {
      type: Number,
      trim: true
    },
    password: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  },
  { collection: "users" }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    const hash = await bcrypt.hashSync(this.password);
    this.password = hash;

    return next();
  } catch (e) {
    return next(e);
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
