import {  ref, uploadString, getDownloadURL } from "firebase/storage";

import { storage } from "../../Api/firebase";

const uploadImage = async (base64Image) => {
    // tạo tham chiếu đến thư mục images trên Firebase Storage và đặt tên file
    const imageName = new Date().getTime().toString(); // tạo tên file dựa trên timestamp
    const storageRef = ref(storage, `images/${imageName}`);
  
    // upload ảnh dưới dạng base64 lên Firebase Storage
    await uploadString(storageRef, base64Image, "data_url");
  
    // lấy URL download của ảnh vừa upload lên
    const downloadURL = await getDownloadURL(storageRef);
  
    // trả về URL download
    return downloadURL;
  }
  

export default uploadImage;
