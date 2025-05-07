const maskedPhone = (phone) => {
    const maskPhone = phone.slice(0, 4)+"*".repeat(phone.length - 4);
    return maskPhone;
}
const maskedEmail = (email) => {
    const [name, domain] = email.split("@");
    const maskEmail = name.slice(0, 3) + "*".repeat(name.length - 3) + "@" +domain
    return maskEmail
}

module.exports = {
    maskedPhone,
    maskedEmail
}