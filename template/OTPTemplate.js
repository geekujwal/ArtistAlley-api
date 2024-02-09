exports.OTPTemplate = {
    TemplateName: "OTPTemplate",
    SubjectPart: "Thi is your OTP",
    HTMLPart: (name, otp) => `<p>Hello ${name} </p><p>Your otp token is ${otp}</p>`
}
