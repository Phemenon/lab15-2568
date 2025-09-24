import { Router, type Request, type Response } from "express";
import { courses, students } from "../db/db.js";
import { zCourseId, zCoursePutBody, zCourseDeleteBody } from "../schemas/courseValidator.js";
import { ca } from "zod/locales";
import { type Course } from "../libs/types.js";
import { success } from "zod";
const router: Router = Router();

// READ all
router.get("/", (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Get all courses successfully",
            data: courses,
        });
    }catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again",
            error: err,
        });
    }
});


// Params URL 
router.get("/:courseId", (req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId;
        const courseIdResult = zCourseId.safeParse(Number(courseId));
        if(!courseIdResult.success){
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "Invalid input: expexcted number, received NaN",
            });
        }

        const foundIndex = courses.findIndex(
            (course) => course.courseId === Number(courseId)
        );

        if (foundIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Course does not exist",
            });
        }

        res.set("Link", `/courses/${courseId}`);
        return res.status(200).json({
            success: true,
            message: `Get course ${courseId} successfully`,
            data: courses[foundIndex],
        });
    }catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again",
            error: err,
        });
    }
});


router.post("/", (req: Request, res: Response) => {
    try {
        const body = req.body as Course;
        const result = zCoursePutBody.safeParse(body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "Number must be exactly 6 digits",
            });
        }

        const found = courses.find(
            (course) => course.courseId === body.courseId
        );

        if(found) {
            return res.status(409).json({
                success: false,
                error: "Course ID already exists",
            });
        }

        const new_course = body;
        courses.push(new_course);

        res.set("Link", `/courses/${body.courseId}`);

        return res.status(201).json({
            success: true,
            message: `Course ${body.courseId} has been added successfully`,
            data: new_course,
        });
    }catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again",
            error: err,
        });
    }
});

router.put("/", (req: Request, res: Response) => {
    try {
        const body = req.body as Course;
        const result = zCoursePutBody.safeParse(body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "Number must be exactly 6 digits",
            });
        }

        const foundIndex = courses.findIndex(
            (course) => course.courseId === body.courseId
        );

        if (foundIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Course does not exist",
            });
        }

        courses[foundIndex] = {...courses[foundIndex], ...body};
        res.set("Link", `/courses/${body.courseId}`);
        return res.status(200).json({
            success: true,
            message: `Course ${body.courseId} has been updated successfully`,
            data: courses[foundIndex],
        });
    }catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again",
            error: err,
        });
    }
});

router.delete("/",(req: Request, res: Response) => {
    try {
        const body = req.body;
        const parseResult = zCourseDeleteBody.safeParse(body);

        if(!parseResult.success){
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "Number must be exactly 6 digits",
            });
        }
        const foundIndex = courses.findIndex(
            (course) => course.courseId === body.courseId
        );

        if (foundIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Course does not exist",
            });
        }

        res.json({
            success: true,
            message: `Course ${body.courseId} has been deleted successfully`,
            data: courses[foundIndex],
        });
        courses.splice(foundIndex, 1);
    }catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again",
            error: err,
        });
    }
});

export default router;
