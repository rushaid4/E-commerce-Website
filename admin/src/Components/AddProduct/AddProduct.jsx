import React, { useState,useEffect } from 'react';
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {

const [image,setImage] = useState(false);
const [productDetails,setProductDetails] = useState({
  name:"",
  image:"",
  category:"women",
  new_price:"",
  old_price:""
})

// useEffect(() => {
//   console.log("Updated productDetails:", productDetails);
// }, [productDetails]); // Log productDetails after each state update

const imagehandler = (e) => {
  setImage(e.target.files[0])
}
const changeHandler =(e) =>{
  setProductDetails({...productDetails,[e.target.name]:e.target.value});
}
const Add_Product = async ()=>{
  console.log("Current productDetails:", productDetails);

  let responseData;
  let product = productDetails;

  let formData = new FormData();
  formData.append('product',image);

  await fetch('http://localhost:4000/upload',{
    method:'POST',
    headers:{
      Accept:'application/json',
    },
    body:formData,
  }).then((resp)=>resp.json()).then((data)=>{responseData=data})

  console.log("response from serverr:", responseData);
  
  if(responseData.success)
  {
    console.log("img url:",responseData.image_url)
    product.image = responseData.image_url
    // console.log(product);

    console.log("product: ",product);

    await fetch('http://localhost:4000/addproduct',{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-Type':'application/json',
      },
      body:JSON.stringify(product),
    }).then((resp)=>resp.json()).then((data)=>{
      data.success?alert("product Added"):alert("Failed")
    })

  }
  }
  // if (responseData.success) {
  //   // Update productDetails state with the new image URL
  //   setProductDetails(prevProductDetails => ({
  //     ...prevProductDetails,
  //     image: responseData.image_url
  //   }));
    
  


  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
        </div>
        <div className="addproduct-price">
          <div className="addproduct-itemfield">
            <p>Price</p>
            <input value={productDetails.old_price} onChange={changeHandler} type='text' name='old_price' placeholder='Type here'/>
            </div>
            <div className="addproduct-itemfield">
            <p>Offer Price</p>
            <input value={productDetails.new_price} onChange={changeHandler}type='text' name='new_price' placeholder='Type here'/>
            </div>
            
        </div>
        <div className="addproduct-itemfield">
            <p>Product category</p>
            <select value={productDetails.category} onChange={changeHandler}name='category' className='add-product-selector'>
              <option value="women">Women</option>
              <option value="men">Men</option>
              <option value="kid">Kid</option>
            </select>
            
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor='file_input'>
                  <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img' alt=''/>
                </label>
                <input onChange={imagehandler} type='file' name='image' id='file_input' hidden/>
            </div>
            <button onClick={()=>{Add_Product()}} className='addproduct-btn'>ADD</button>
      
    </div>
  )
}

export default AddProduct;
