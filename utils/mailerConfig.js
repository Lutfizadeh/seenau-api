const mailerConfig = {
    // host: "smtp.gmail.com",
    // port: 587,
    // secure: false,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
    },
    connectionTimeout: 5000
}

export default mailerConfig;