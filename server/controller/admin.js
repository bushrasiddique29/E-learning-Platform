import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { rm } from "fs";
import { promisify } from "util";
import fs from "fs";
import { User } from "../models/User.js";

export const createCourse = async (req, res) => {
  try {
     console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log(req.file);
    const { title, description, category, createdBy, duration, price } = req.body;
    const image = req.file;

    await Courses.create({
      title,
      description,
      category,
      createdBy,
      image: image?.path,
      duration,
      price,
    });

   return res.status(201).json({
      message: "Course Created Successfully",
    });
  } catch (error) {
   return res.status(500).json({ message: error.message });
  }
};

//add lectures
export const addLectures = async (req, res) => {
  try {
    const course = await Courses.findById(req.params.id);

    if (!course)
      return res.status(404).json({
        message: "No Course with this id",
      });

    const { title, description } = req.body;

    const file = req.file;
console.log(req.file);
    const lecture = await Lecture.create({
      title,
      description,
      video: file?.path,
      course: course._id,
    });

   return res.status(201).json({
      message: "Lecture Added",
      lecture,
    });
  } catch (error) {
   return res.status(500).json({ message: error.message });
  }
};

//delete lecture
export const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);

    rm(lecture.video, () => {
      console.log("Video deleted");
    });

    await lecture.deleteOne();

   return res.json({ message: "Lecture Deleted" });
  } catch (error) {
   return res.status(500).json({ message: error.message });
  }
};

const unlinkAsync = promisify(fs.unlink);

export const deleteCourse = async (req, res) => {
  try {
    const course = await Courses.findById(req.params.id);

    const lectures = await Lecture.find({ course: course._id });

    await Promise.all(
      lectures.map(async (lecture) => {
        await unlinkAsync(lecture.video);
        console.log("video deleted");
      }),
    );
    rm(course.image, () => {
      console.log("image deleted");
    });

    await Lecture.find({ course: req.params.id }).deleteMany();

    await course.deleteOne();

    await User.updateMany({}, { $pull: { subscription: req.params.id } });

  return  res.json({
      message: "Course Deleted",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllStats = async (req, res) => {
  try {
    const totalCoures = (await Courses.find()).length;
    const totalLectures = (await Lecture.find()).length;
    const totalUsers = (await User.find()).length;

    const stats = {
      totalCoures,
      totalLectures,
      totalUsers,
    };

    return res.json({
      stats,
    });
  } catch (error) {
   return res.status(500).json({ message: error.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
    "-password"
  );

  res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateRole = async (req, res) => {
 try {
   if (req.user.mainrole !== "superadmin")
    return res.status(403).json({
      message: "This endpoint is assign to superadmin",
    });
  const user = await User.findById(req.params.id);

  if (user.role === "user") {
    user.role = "admin";
    await user.save();

    return res.status(200).json({
      message: "Role updated to admin",
    });
  }

  if (user.role === "admin") {
    user.role = "user";
    await user.save();

    return res.status(200).json({
      message: "Role updated",
    });
  }
 } catch (error) {
  return res.status(500).json({ message: error.message });
 }
};