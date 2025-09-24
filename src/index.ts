import express, { type Request, type Response} from "express";
import morgan from 'morgan';
import studentRouter from "./routes/studentRoutes.js";
import courseRouter from "./routes/courseRoutes.js";

const app: any = express();

//Middleware
app.use(express.json());
app.use(morgan('dev'));

app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({
        success: true,
        message: "lab 15 API service successfully",
    });
});

app.get("/me",(req: Request, res: Response) => {
    try {
        const me = {
            studentId: "670610696",
            firstName: "Thanakon",
            lastName: "Changlek",
            program: "CPE",
            section: "001",
        }

        return res.status(200).json({
            success: true,
            data: me,

        });
    } catch (err) {
        return res.status(500).json ({
            success: false,
            massage: "Something is wrong, please try again",
            error: err,
        });
    }
});

app.use("/api/v2/students", studentRouter);
app.use("/api/v2/courses", courseRouter);

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);


export default app;
