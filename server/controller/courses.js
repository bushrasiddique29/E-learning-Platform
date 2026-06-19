import { instance } from "../index.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { Payment } from "../models/Payment.js";
import { Progress } from "../models/Progress.js";
import { User } from "../models/User.js";
import crypto from "crypto";
import mongoose from "mongoose";
import razorpay from 'razorpay';

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Courses.find();
    return res.json({ courses });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//single course
export const getSingleCourse = async (req, res) => {
  try {
    const course = await Courses.findById(req.params.id);
    return res.json({ course });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//fetch lectures
export const fetchLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ course: req.params.id });
    const user = await User.findById(req.user._id);
    console.log("Course ID:", req.params.id);
    console.log("User:", req.user);
    if (user.role === "admin") {
      return res.json({ lectures });
    }

    if (!user.subscription.includes(req.params.id))
      return res.status(400).json({
        message: "You have not subscribed to this course",
      });

    return res.json({ lectures });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const fetchLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    console.log("Lecture:", lecture);
    const user = await User.findById(req.user._id);

    if (user.role === "admin") {
      return res.json({ lecture });
    }

    if (!user.subscription.includes(lecture.course))
      return res.status(400).json({
        message: "You have not subscribed to this course",
      });

    return res.json({ lecture });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// export const getMyCourses = async (req, res) => {
//   try {
//     const courses = await Courses.find({ _id: req.user.subscription });

//     return res.json({
//       courses,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

export const getMyCourses = async (req, res) => {
  try {
    const courses = await Courses.find({
      _id: { $in: req.user.subscription },
    });
    console.log("User Subscription:", req.user.subscription);
    console.log("Courses Found:", courses);
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const checkOut = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const course = await Courses.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (user.subscription.includes(course._id)) {
      return res.status(400).json({
        message: "You already have this course",
      });
    }

    const options = {
      amount: Number(course.price) * 100,
      currency: "INR",
    };

    console.log("Course Price:", course.price);
    console.log("Options:", options);

    const order = await instance.orders.create(options);
    // const order = await razorpay.orders.create({
    //   amount: 50000,
    //   currency: "INR",
    //   receipt: "course_1",
    // });

    console.log("Order Created:", order);

    return res.status(201).json({
      order,
      course,
    });
  } catch (error) {
    console.log("Checkout Error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// export const checkOut = async (req, res) => {

//   try {
//     const user = await User.findById(req.user._id);

//     const course = await Courses.findById(req.params.id);

//     if (user.subscription.includes(course._id)) {
//       return res.status(400).json({
//         message: "You already have this course",
//       });
//     }
//     const options = {
//       amount: Number(course.price * 100),
//       currency: "INR",
//     };

//     const order = await instance.orders.create(options);
//     return res.status(201).json({
//       order,
//       course,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

//payment verification
export const paymentVerification = async (req, res) => {
  try {
    console.log("req.params:", req.params);
    console.log("PAYMENT VERIFICATION HIT");
    console.log("Course ID:", req.params.id);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.Razorpay_Secret)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      const user = await User.findById(req.user._id);

      const course = await Courses.findById(req.params.id);

      console.log("User Before:", user.subscription);
      console.log("Course ID:", course._id);

      user.subscription.push(course._id);

      await Progress.create({
        course: course._id,
        completedLectures: [],
        user: req.user._id,
      });

      await user.save();
      const updatedUser = await User.findById(req.user._id);

      console.log("User After:", updatedUser.subscription);
      return res.status(200).json({
        message: "Course Purchased Successfully",
      });
    } else {
      return res.status(400).json({ message: "Payment Failed" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//add progress

export const addProgress = async (req, res) => {
  try {
    const { course, lectureId } = req.query;

    let progress = await Progress.findOne({
      user: req.user._id,
      course,
    });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        course,
        completedLectures: [],
      });
    }

    const alreadyCompleted = progress.completedLectures.some(
      (id) => id.toString() === lectureId,
    );

    if (alreadyCompleted) {
      return res.json({
        message: "Progress already recorded",
      });
    }

    // Direct MongoDB update
    await Progress.findByIdAndUpdate(
      progress._id,
      {
        $addToSet: {
          completedLectures: new mongoose.Types.ObjectId(lectureId),
        },
      },
      { new: true },
    );

    return res.status(201).json({
      message: "New Progress Added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getYourProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.query.course,
    });

    const allLectures = await Lecture.countDocuments({
      course: req.query.course,
    });

    const completedLectures = progress?.completedLectures?.length || 0;

    const courseProgressPercentage =
      allLectures > 0 ? Math.round((completedLectures * 100) / allLectures) : 0;

    return res.json({
      courseProgressPercentage,
      completedLectures,
      allLectures,
      progress,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
