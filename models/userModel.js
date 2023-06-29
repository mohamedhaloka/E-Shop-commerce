const mongoose = require('mongoose');
const { crypt } = require("../utils/cryptHelper")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        trim: true,
    },
    email: {
        type: String,
        unique: [true, 'email must be unique'],
        required: [true, 'email is required'],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    passwordChangedAt: Date,
    verificationCodeHashed: String,
    verificationCodeExp: Date,
    verificationCodeDone: Boolean,
    phone: String,
    role: {
        type: String,
        enum: ['user', 'admin', 'manager'],
        default: 'user',
    },
    profImage: String,
}
    , { timestaps: true })

const reAssignImageWithBaseUrl = (doc) => {
    if (doc.profImage) {
        doc.profImage = `${process.env.BASE_URL}/${doc.profImage}`
    }
}

userSchema.post('init', reAssignImageWithBaseUrl)

userSchema.post('save', reAssignImageWithBaseUrl)

userSchema.pre('save', function (next) {
    this.password = crypt(this.password)
    next()
})

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;