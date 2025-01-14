import { Request, Response } from 'express';
import { UpdateFields } from '../services/profile.service';
import * as xlsx from 'xlsx';
import { employeeService, profileService, userService } from '../services';
import { User } from '../models';
import { AuthenticatedRequest } from '../type';
import ownerservice from '../services/owner.service';

class OwnerController {
    async createEmployeeAccount(req: Request, res: Response) {
        try {
            const { user_name, user_password, user_email, user_phoneNumber, salary, user_address, create_at } = req.body;
            const file = req.file;

            if (!user_name || !user_password || !user_email || !user_phoneNumber || !salary) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            // Check if employee account exists
            const employeeAccount = await userService.getUserByEmail(user_email);
            if (employeeAccount) {
                return res.status(409).json({ message: 'Employee account already exists' });
            }

            // Create new employee account
            const newUser = new User(
                {
                    user_name,
                    user_password,
                    user_email,
                    created_at: create_at,
                    updated_at: new Date(),
                    user_avatar: file ? file.path : null,
                    user_phone_number: user_phoneNumber,
                    staff_salary: salary,
                    user_address: user_address
                }
            );

            const user = await userService.createEmployee(newUser, 'employee');

            if(file){
                const updateFields: UpdateFields = {
                    file: file
                };
                await profileService.updateProfile(user.user_id, updateFields);
            }
            if (!user) {
                return res.status(500).json({ message: 'Failed to create employee account' });
            }
            return res.status(201).json({ message: 'Employee account created successfully' });
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
            if (!userService.getUserByEmail(email)) {
                return res.status(404).json({ message: 'Employee account not found' });
            }
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

            if (!userService.getUserByEmail(user_email)) {
                return res.status(404).json({ message: 'Employee account not found' });
            }
            // Delete employee account
            await employeeService.deleteEmployee(user_email);
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
            if (!userService.getUserByEmail(user_email)) {
                return res.status(404).json({ message: 'Employee account not found' });
            }
            // Get employee account detail

            const employee = await userService.getUserByEmail(user_email);

            return res.status(200).json(employee);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getEmployeeList(req: Request, res: Response) {
        try {
            // Get all employee accounts
            const employees = await userService.getUsersByRole('Nhân viên');
            return res.status(200).json(employees);
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
            const customers = await userService.getUsersByRole('Khách hàng');
            return res.status(200).json(customers);
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
            if (!userService.getUserByEmail(user_email)) {
                return res.status(404).json({ message: 'Customer account not found' });
            }
            const customer = await userService.getUserByEmail(user_email);

            // Get customer account detail
            return res.status(200).json(customer);
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
                    await userService.createUser(newUser, 'employee');
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
    async createDiscount(req:AuthenticatedRequest, res: Response) {
        try {
            const {discount_value, event_name, begin, end} = req.body;

            const result = await ownerservice.createDiscountevent(
                discount_value, event_name, begin, end
            );
            return res.status(200).json(result);

        } catch (error) {
            throw (error)
        }
    }

}
const ownerController = new OwnerController();
export default ownerController;