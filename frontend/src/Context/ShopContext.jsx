import React, { createContext,useEffect,useState } from "react";
// import all_product from "../Components/Assests/all_product.js";


export const ShopContext = createContext(null);

const getDefaultCart = ()=>{
  let cart = {};

  // for(let index=0; index<all_product.length+1; index++)
  for(let index=0; index<300+1; index++)
  {
    cart[index]= 0;
  }
  return cart;
}

const ShopContextProvider = (props) => {
  
  const [all_product,setAll_product] = useState([]);
  const [cartItems,setCartItems] = useState(getDefaultCart());

  useEffect(()=>{
     fetch('http://localhost:4000/allproducts')
     .then((resp)=>resp.json())
     .then((data)=>setAll_product(data))

     if(localStorage.getItem('auth-token')){
      fetch('http://localhost:4000/getcart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',
        },
        body:"",
      }).then((response)=>response.json())
        .then((data)=>setCartItems(data));
     }
  },[])


  
  const addtoCart = (itemId) =>{
    console.log("hii");
    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
    if(localStorage.getItem('auth-token')){
      fetch('http://localhost:4000/addtocart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-type':'application/json',
        },
        body:JSON.stringify({"itemId":itemId})
      })
      .then((resp)=>resp.json())
      .then((data)=>console.log(data))
    }
    
    
  }

  const removeFromCart = (itemId) =>{
    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))

    if(localStorage.getItem('auth-token')){
      console.log("entered");
      fetch('http://localhost:4000/removefromcart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-type':'application/json',
        },
        body:JSON.stringify({"itemId":itemId})
      })
      .then((resp)=>resp.json())
      .then((data)=>console.log(data))
    }
  }
  
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems)
    {
      if(cartItems[item]>0)
      {
        let itemInfo = all_product.find((product)=>product.id===Number(item));
        totalAmount += itemInfo.new_price * cartItems[item];
      }
      
    }
    return totalAmount;
  }

  const getTotalCartItems = () => {
    let totalItem = 0;
    for(const item in cartItems)
    {
      if(cartItems[item]>0)
      {
        totalItem+=cartItems[item];
      }
    }
    return totalItem;
  }

  const contextValue ={getTotalCartItems, getTotalCartAmount,all_product,cartItems,addtoCart,removeFromCart};
  
  
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  )

}

export default ShopContextProvider;