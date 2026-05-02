import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId, jobDuration } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(",").map((item) => item.trim()).filter(Boolean),
            salary,
            location,
            jobType,
            experienceLevel: experience,
            jobDuration: jobDuration || "",
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId, jobDuration } = req.body;
        const jobId = req.params.id;
        const adminId = req.id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        if (job.created_by.toString() !== adminId) {
            return res.status(403).json({
                message: "You are not authorized to update this job.",
                success: false
            });
        }

        const hasValue = (value) => value !== undefined && value !== null && value !== "";

        if (title !== undefined) job.title = title;
        if (description !== undefined) job.description = description;
        if (location !== undefined) job.location = location;
        if (jobType !== undefined) job.jobType = jobType;
        if (jobDuration !== undefined) job.jobDuration = jobDuration;

        if (hasValue(experience)) {
            job.experienceLevel = String(experience).trim();
        }

        if (hasValue(position)) {
            const parsedPosition = Number(position);
            if (Number.isNaN(parsedPosition)) {
                return res.status(400).json({
                    message: "Position must be a valid number.",
                    success: false
                });
            }
            job.position = parsedPosition;
        }

        if (hasValue(salary)) {
            job.salary = String(salary).trim();
        }

        if (companyId !== undefined) job.company = companyId;
        if (requirements !== undefined) {
            job.requirements = Array.isArray(requirements)
                ? requirements
                : String(requirements)
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean);
        }

        await job.save();

        return res.status(200).json({
            message: "Job updated successfully.",
            success: true,
            job
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update job.",
            success: false
        });
    }
}

export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const adminId = req.id;

        const deletedJob = await Job.findOneAndDelete({
            _id: jobId,
            created_by: adminId
        });

        if (!deletedJob) {
            return res.status(404).json({
                message: "Job not found or you are not authorized.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Job deleted successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
