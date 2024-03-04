
const User = require('../Model/userModel');
const { securePassword } = require('../Utility/authHelper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')



const RegisterCreate = async (req, res) => {
    try {
        const { name, email, mobile, password, } = req.body;
        //validation
        if (!name) {
            return res.send({ message: "Name is required" });
        }
        if (!email) {
            return res.send({ message: "Email is Required" });
        }
        if (!mobile) {
            return res.send({ message: "Phone no is Required" });
        }
        if (!password) {
            return res.send({ message: "Password is Required" });
        }

        const passwordHash = await securePassword(req.body.password)
        const userData = await new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: passwordHash
        })

        // duplicate mail checking validation
        const duplicateEmail = await User.findOne({ email: req.body.email })

        if (duplicateEmail) {
            return res.status(400).json({
                status: 400,
                message: "email already exist....."
            })
        } else {
            const data = await userData.save()
            return res.status(200).json({
                status: 200,
                message: "Registered Successfully",
                data
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            error
        })
    }
}


const Login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            const pwd = user.password;

            if (bcrypt.compareSync(req.body.password, pwd)) {
                let role = 'user';

                if (user.isAdmin === 'admin') {
                    role = 'admin';
                }

                const userToken = jwt.sign({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    role: role
                }, process.env.JWT_SECRET, { expiresIn: '1h' });

                return res.status(200).json({
                    status: 200,
                    message: `${role.charAt(0).toUpperCase() + role.slice(1)} logged in successfully`,
                    userToken,
                    data: user
                });
            } else {
                return res.status(400).json({
                    status: 400,
                    message: "Password is wrong"
                });
            }
        } else {
            return res.status(400).json({
                status: 400,
                message: "User doesn't exist"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            error: error.message
        });
    }
};


const getUserDetails = async (req, res) => {
    try {
        // Extract user ID from the token
        const userIdFromToken = req.user.id;

        // Extract user ID from the route parameter
        const userIdFromParams = req.params.userId;
            
        if (userIdFromToken !== userIdFromParams) {
            return res.status(403).json({
                status: false,
                message: "Unauthorized access to user details"
            });
        }
        const user = await User.findById(userIdFromParams);
        if (user) {
            return res.status(200).json({
                status: 200,
                data: user,
                message: 'User details retrieved successfully',
            });
        } else {
            return res.status(404).json({
                status: 404,
                message: 'User not found',
            });
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({
            status: 500,
            error: 'Internal Server Error',
        });
    }
};



const userList = async (req, res) => {
    try {
        const userData = await User.find({ isAdmin: 'user' });
        
        return res.status(200).json({
            status: 200,
            data: userData,
            message: "Users Found",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    }
};





module.exports = {
    RegisterCreate,
    Login,
    getUserDetails,
    userList
}