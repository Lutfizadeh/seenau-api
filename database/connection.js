import mongoose from 'mongoose';

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Database terhubung!')
    } catch (error) {
        console.log('Database error: ', error)
        
    }
}

export default connection