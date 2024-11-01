import { Request, Response, NextFunction } from 'express';

// Define the password regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;

// Middleware function to validate password
const validatePassword = (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body; // Assuming the password is sent in the request body

    // Check if the password exists and matches the regex
    if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({ message: "Your password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character." });
    }

    next(); // Password is valid; proceed to the next middleware or controller
};

export default validatePassword;
