
const express = require("express")
const cors = require("cors")
const Stripe  = require("stripe")
const morgan = require("morgan")
const app =express()

const stripe = new Stripe("sk_test_51MNjItANEHdq6jhMobVaenrB8XCZzzcrdUXlWtyIm37wXMBuLUgni42TLHhOJ0crPhiCz5Bma8EzcrtGZ10vp8CE00sVZA8NQg")

app.use(cors())
app.use(morgan('tiny'))

app.use(express.json())

app.get("/",(req,res)=>{

  res.send("saludo desde el backend  hola ")
})

  
app.post("/create-payment-intent", async (req, res) => {

  const {products,priceTotalrounded} = req.body;
  console.log({products,priceTotalrounded})
  
  if(products.length > 0) {

    const descriptionBuy = () =>(products.map(product => product.title)).join("| ")

    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceTotalrounded,
      description:descriptionBuy,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      }, 
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
    return;
  }else{
  
  res.send({message:"no hay productos seleccionados", isError:true})
  }




});



const PORT =process.env.PORT || 3000


app.listen(PORT, () => {
  console.log('App listening on port '+ PORT);
})