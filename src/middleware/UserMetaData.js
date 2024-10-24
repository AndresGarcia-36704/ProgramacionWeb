import dayjs from "dayjs";

export const userMetaData = (req, res, next) => {
  const now = dayjs().format("HH:mm DD-MM-YYYY");
  req.body.ip = req.ip; // Dirección IP del remitente
  req.body.created_at = now; // Fecha y hora de creación

  next();
};
