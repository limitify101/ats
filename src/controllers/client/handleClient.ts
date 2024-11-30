import { NextFunction, Response } from "express";
import ClientService from "../../services/ClientService";
import { ClientSettings } from "../../types/clientSettings.type";

const handleClient = (sequelize: any, clientService: ClientService) => {
  return async (req: any, res: Response): Promise<any> => {
    const transaction = await sequelize.transaction();
    const { starTime, endTime } = req.body;
    const tenantID = req.tenantId;
    try {
      const clientData: ClientSettings = {
        tenantID: tenantID,
        startTime: starTime ? starTime : "08:00",
        endTime: endTime ? endTime : "17:00",
      };
      await clientService.create(clientData);
      await transaction.commit();
      res.status(201).json({ message: "Client record created successfully!" });
    } catch (err: any) {
      console.error("Error creating client record:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

export default handleClient;
