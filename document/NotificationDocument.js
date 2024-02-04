const mongoose = require("mongoose");
const NotificationCatrgoryType = require("../contract/NotificationCatrgoryType")
const NotificationType = require("../contract/NotificationType")
const NotificationSubCatrgoryType = require("../contract/NotificationSubCatrgoryType")


const Notification = mongoose.Schema({
    id: String,
    userId: String,
    email: String,
    phone: String, // for later if we decide to send sms in future
    deviceTokens: [String], // for sending push notification in mobile device
    isProcessed: {
        type: Boolean,
        default: false
    },
    notificationEvent: {
        receipients: [String], // whom we are sending these notification
        category: {
            type: String,
            enum: Object.values(NotificationCatrgoryType) 
        },
        channel: { // medium to send notification like sms, email
            type: String,
            enum: Object.values(NotificationType) 
        },
        subCategory: {
            type: String,
            enum: Object.values(NotificationSubCatrgoryType) 
        },
        categoryId: [{  // extra data to create template like dynamic values
            key: String, 
            value: String
        }]
    },
    created: Date
})

exports.NotificationDocument = mongoose.model('notificationdocument', Notification)
