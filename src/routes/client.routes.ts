import express from "express";
import ClientService from "../services/ClientService";
import extractTenantId from "../middleware/extractTenantID";
import handleClient from "../controllers/client/handleClient";

const clientRoutes = (sequelize: any, model: any) => {
  const router = express.Router();
  const clientService = new ClientService(model);

  router.post(
    "/create",
    extractTenantId,
    handleClient(sequelize, clientService)
  );
  return router;
};

export default clientRoutes;
