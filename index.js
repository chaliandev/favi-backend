import express from "express";
import cors from "cors";

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";
const client = new MercadoPagoConfig({
  accessToken: "APP_USR-9003014782940362-052319-478e129215efbcfb77fbc2583e6420fd-1034747647",
});

const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS para tu dominio
app.use(cors({
  origin: [
    'https://www.favipañalera.com',
    'https://favipañalera.com',
    'https://xn--favipaalera-6db.com',
    'https://www.xn--favipaalera-6db.com'
  ],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend de Favi Pañalera funcionando correctamente! 🚀");
});

app.post("/create_preference", async (req, res) => {
  try {
    console.log("Recibiendo pedido:", req.body);
    
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id: "ARS",
        },
      ],
      back_urls: {
         success: "https://www.favipañalera.com/pages/carrito/succes.html",
        failure: "https://www.favipañalera.com/pages/carrito/failure.html",
        pending: "https://www.favipañalera.com/pages/carrito/pending.html",
      },
      auto_return: "approved",
      external_reference: "FAVI-" + Date.now(),
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });
    
    console.log("Preferencia creada:", result.id);
    
    res.json({
      id: result.id,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Error al crear la preferencia",
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Backend corriendo en puerto ${port}`);
});
