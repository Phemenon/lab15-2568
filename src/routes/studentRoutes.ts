import { Router, type Request, type Response } from "express";
import { zStudentId } from "../schemas/studentValidator.js";
import { students, courses } from "../db/db.js";
const router = Router();

router.get("/:studentId/courses", (req: Request, res: Response) => {
    try {
        const studentId = req.params.studentId;
        const studentIdParseResult = zStudentId.safeParse(studentId);
        const result = {
            studentId: studentIdParseResult,
            courses: courses.map(course => ({
                courseId: course.courseId,
                courseTitle: course.courseTitle
            }))
        };

        if(!studentIdParseResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "Student Id must contain 9 characters",
            });
        }

        const foundIndex = students.findIndex(
            (student) => student.studentId === studentId
        );

        if (foundIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Student does not exists",
            });
        }

       res.set("Link",`/students/${studentId}`);

       return res.status(200).json({
        success: true,
        message: `Get all courses of student ${studentId}`,
        data: result,
       });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error,
        });
    }
});

export default router;
