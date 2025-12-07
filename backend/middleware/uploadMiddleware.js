import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

//File Filter
const fileFilter = (req,file,cb)=>{
    const allowedFileTypes = ['image/jpeg','image/jpg','image/png'];
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null,true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG files are allowed.'), false);
    }
}

const upload = multer({ storage, fileFilter});
export default upload;
