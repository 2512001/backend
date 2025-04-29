const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.logout = (req, res) => {
    res.cookie('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0)
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};


exports.login = async (req, res) => {
    try {
        const { email, password, } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const access_token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE
            }
        );



        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 5 * 60 * 60 * 1000
        });


        res.status(200).json({
            success: true,
            message: 'user loged successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) return res.status(400).json({ message: 'please provide data' });

        let user = await User.findOne({ email });
        
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        user.password = undefined;

        res.status(201).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateUser = async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    if (!name) {
        return res.status(404).json({ error: "provide name" });
    }
    try {
        const user = await User.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
}