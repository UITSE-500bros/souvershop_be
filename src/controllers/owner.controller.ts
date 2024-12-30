import { Request, Response } from 'express';
import { UpdateFields } from '../services/profile.service';
import * as xlsx from 'xlsx';
import { profileService, userService } from '../services';
import { User } from '../models';

class OwnerController {
    async createEmployeeAccount(req: Request, res: Response) {
        try {
            const { user_name, user_password, user_email } = req.body;
            const file = req.file;

            if (!user_name || !user_password || !user_email) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            // Check if employee account exists
            const employeeAccount = await userService.getUserByEmail(user_email);
            if (employeeAccount) {
                return res.status(409).json({ message: 'Employee account already exists' });
            }

            if(file) {
                if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
                    return res.status(400).json({ message: 'Invalid file type' });
                }

                // Create new employee account
                const newUser = new User(
                    {
                        user_name,
                        user_password,
                        user_email,
                        created_at: new Date(),
                        updated_at: new Date(),
                        user_avatar: file ? file.path : null
                    }
                );
                
                const user = await userService.createUser(newUser, 'employee');

                const updateFields: UpdateFields = {
                    file: file
                };
                await profileService.updateProfile(user.user_id, updateFields);
                return res.status(201).json({ message: 'Employee account created successfully' });
            }
            return res.status(400).json({ message: 'Missing required fields: avatar' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async updateEmployeeAccount(req: Request, res: Response) {
        try {
            const { username, password, email, role } = req.body;
            if (!username || !password || !email || !role) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            // Check if employee account exists
            // Update employee account
            return res.status(200).json({ message: 'Employee account updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async deleteEmployeeAccount(req: Request, res: Response) {
        try {
            const { user_email } = req.params;
            if (!user_email) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            // Check if employee account exists
            // Delete employee account
            return res.status(200).json({ message: 'Employee account deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getEmployeeDetail(req: Request, res: Response) {
        try {
            const { user_email } = req.params;
            if (!user_email) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            // Check if employee account exists
            // Get employee account detail
            return res.status(200).json({ message: 'Employee account detail' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getEmployeeList(req: Request, res: Response) {
        try {
            // Get all employee accounts
            return res.status(200).json({ message: 'Employee account list' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async createListEmployeeAccount(req: Request, res: Response) {
        try {
            const { employeeList } = req.body;
            if (!employeeList) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            // Check if employee account exists
            // Create new employee account
            return res.status(201).json({ message: 'Employee account created successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getCustomerList(req: Request, res: Response) {
        try {
            // Get all customer accounts
            return res.status(200).json({ message: 'Customer account list' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getCustomerDetail(req: Request, res: Response) {
        try {
            const { user_email } = req.params;
            if (!user_email) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            // Check if customer account exists
            // Get customer account detail
            return res.status(200).json({ message: 'Customer account detail' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async updateCustomerAccount(req: Request, res: Response) {
        try {
            const { username, password, email, role } = req.body;
            if (!username || !password || !email || !role) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            // Check if customer account exists
            // Update customer account
            return res.status(200).json({ message: 'Customer account updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async deleteCustomerAccount(req: Request, res: Response) {
        try {
            const { user_email } = req.params;
            if (!user_email) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            // Check if customer account exists
            // Delete customer account
            return res.status(200).json({ message: 'Customer account deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createMultipleEmployeeAccount(req: Request, res: Response) {
        try {
            const file = req.file;
            // Read the uploaded Excel file
            const workbook = xlsx.readFile(file.path);
            const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);

            const errors = [];
            let successCount = 0;

            // Iterate through the rows and create user accounts
            for (const row of data) {
                const { user_name, user_email, user_password } = row as {
                    user_name: string;
                    user_email: string;
                    user_password: string;
                };

                if (!user_name || !user_email || !user_password) {
                    errors.push({ row, error: 'Missing required fields' });
                    continue;
                }

                try {
                    // Create new employee account
                    const newUser = new User(
                        {
                            user_name,
                            user_password,
                            user_email,
                            created_at: new Date(),
                            updated_at: new Date()
                        }
                    );
                    await userService.createUser(newUser , 'employee');
                    successCount++;
                } catch (err) {
                    errors.push({ row, error: (err as Error).message });
                }
            }

            return res.status(201).json({
                message: `${successCount} employee accounts created successfully`,
                errors,
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

}
const ownerController = new OwnerController();
export default ownerController;