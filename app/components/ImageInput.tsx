"use client";
import { useEffect, useState } from 'react';
import styles from './ImageInput.module.css'

export default function ImageInput({imgUrl,imgCaption}: {imgUrl?:string;imgCaption?:string}){
    const [selectedImage, setSelectedImage] = useState(false);
    useEffect(() => {
        if(selectedImage){
            const imgInp = document.getElementById("image") as any;
            imgInp.style.display = "block";
            const imgPreview = document.getElementById("imagepreview") as any;
            const [file] = imgInp.files
            if (file) {
              imgPreview.src = URL.createObjectURL(file)
            }
        }
    }, [selectedImage])

    return <>
      <label htmlFor='image'>Image</label>
            {imgUrl || selectedImage ? 
            <img className={styles.preview} id="imagepreview" src={imgUrl || "#"} alt="Image preview" /> : <p className={styles.preview}>No image selected</p>}
            {imgUrl && !selectedImage ? 
            <div className={styles.fakeFileInputContainer}>
            <button type="button" onClick={(e) => {
              const imgInp = document.getElementById("image") as any;
              imgInp.click();
            }} className={styles.fakeButton}>Browse...</button>
            <p className={styles.fakeButtonLabel}>Change image</p>
            </div>: null}
          <input onClick={(e) => {
            e.stopPropagation();
          }} className={styles.input + (imgUrl ? " "+ styles.inputHidden : "")} placeholder="" onChange={() => {
            if(!selectedImage){
                // wait for img element to be mounted first
                setSelectedImage(true);
                return;
            }
            const imgInp = document.getElementById("image") as any;
            const imgPreview = document.getElementById("imagepreview") as any;
            const [file] = imgInp.files;
            if (file) {
              imgPreview.src = URL.createObjectURL(file)
            }
          }} type="file" id="image" name="image" accept="image/png, image/jpeg"/>
          <label htmlFor='imagecaption'>Image Caption</label>
          <input id="imagecaption" name="imagecaption" defaultValue={imgCaption} type='text' required />
          </>
          
}