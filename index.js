const app = require('./app')

const { PORT } = process.env
app.listen(PORT, () => {
    console.log(`app is running on PORT: ${PORT}`);
})