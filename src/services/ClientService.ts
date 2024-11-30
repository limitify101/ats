import { ClientSettings } from "../types/clientSettings.type";

class ClientService {
  model: any;
  constructor(model: any) {
    this.model = model;
  }

  async create(clientSettings: ClientSettings) {
    try {
      const clientSetting = await this.model.create(clientSettings);
      return clientSetting;
    } catch (err: any) {
      throw err;
    }
  }
  async getClientSettings(tenantID: any) {
    try {
      return await this.model.findOne({
        where: { tenantID },
      });
    } catch (err: any) {
      throw err;
    }
  }
  async getAllTenants() {
    return await this.model.findAll({
      attributes: ["tenantID"], // Adjust based on your table structure
    });
  }
  async updateClientSettings(tenantID: any, settings: any) {
    const { startTime, endTime } = settings;

    // Update database with the provided times
    await this.model.update(
      { startTime, endTime }, // Fields to update
      { where: { tenantID: tenantID } } // Condition to match tenant
    );
  }
}

export default ClientService;
