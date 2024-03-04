const bcrypt=require('bcryptjs')

// hashing the password
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error);
    }
}



module.exports={
    securePassword,
}  