const maskedPhone = (phone) => {
    if (!phone || typeof phone !== 'string') return "";

    const visibleLength = 4;
    if (phone.length <= visibleLength) {
        return "*".repeat(phone.length);
    }

    return phone.slice(0, visibleLength) + "*".repeat(phone.length - visibleLength);
};

const maskedEmail = (email) => {
    if (!email || typeof email !== 'string' || !email.includes("@")) return "";

    const [name, domain] = email.split("@");

    if (name.length <= 3) {
        return "*".repeat(name.length) + "@" + domain;
    }

    return name.slice(0, 3) + "*".repeat(name.length - 3) + "@" + domain;
};

module.exports = {
    maskedPhone,
    maskedEmail
};
