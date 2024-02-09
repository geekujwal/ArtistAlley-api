exports.OTPTemplate = {
    TemplateName: "OTPTemplate",
    SubjectPart: "This is your OTP",
    HTMLPart: (otp) => `</p><p>Your otp token is ${otp}</p>`
}
