import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads");
  },
  filename(req, file, cb) {
    const id = uuid();

    const extName = file.originalname.split(".").pop();

    const fileName = `${id}.${extName}`;

    cb(null, fileName);
  }
});

export const uploadFiles = multer({ storage:storage }).single("file");

// import multer from "multer";

// const upload = multer({ storage });

// export const uploadFiles = (req, res, next) => {
//   upload.single("file")(req, res, (err) => {
//     if (err) {
//       console.log("Multer Error:", err);
//       return res.status(500).json({ message: err.message });
//     }

//     console.log("REQ.FILE:", req.file);
//     next();
//   });
// };