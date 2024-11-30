import { NextFunction } from "express";

const extractTenantId = (req: any, res: any, next: NextFunction) => {
  const tenantId = req.headers["x-tenant-id"];
  if (!tenantId) {
    return res.status(400).json({ error: "Tenant ID is required in headers" });
  }

  req.tenantId = tenantId;
  next();
};

export default extractTenantId;
