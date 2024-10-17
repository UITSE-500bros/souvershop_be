import { Router } from "express";
import { EmployeeController } from "~/controllers/employee_controller";
import { EmployeeService } from "~/services";
const router = Router();

const employee = new EmployeeController(new EmployeeService)
router.get("/", employee.handleGetAllEmployees);
router.post("/", (req, res) => {});
router.put("/", (req, res) => {});
router.delete("/", (req, res) => {});

export default router;

