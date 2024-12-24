import { Model, DataTypes } from "sequelize";

interface StaffCardsAttributes {
  card_ID: string;
  tenantID: string;
  id: string;
  activated: boolean;
  staffID?: string | null;
}

const initializeStaffCards = (sequelize: any) => {
  class StaffCards
    extends Model<StaffCardsAttributes>
    implements StaffCardsAttributes
  {
    id!: string;
    tenantID!: string;
    card_ID!: string;
    activated!: boolean;
    staffID?: string | null;
  }

  StaffCards.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      tenantID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      card_ID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      activated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      staffID: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        references: {
          model: "Staff", // Ensure this matches the actual model name
          key: "staffID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "StaffCards",
      timestamps: true,
    }
  );

  return StaffCards;
};

export default initializeStaffCards;
