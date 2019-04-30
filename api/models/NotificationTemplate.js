module.exports = {
  attributes: {
    key: {
      type: Sequelize.STRING(127),
      allowNull: false,
      unique: true,
    },

    name: {
      type: Sequelize.STRING(127),
      allowNull: true,
    },

    title: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    message: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    langCode: {
      type: Sequelize.STRING(45),
      allowNull: false,
    },

    fields: {
      allowNull: true,
      type: Sequelize.JSON,
      get() {
        try {
          const val = this.getDataValue('fields');
          return val ? JSON.parse(val) : null;
        } catch (error) {
          return this.getDataValue('fields');
        }
      },
    },
  },
  associations() {},
  options: {
    paranoid: false,
    timestamps: true,
    classMethods: {
      ...sails.config.models.classMethods.MessageTemplate,
    },
    instanceMethods: {
      ...sails.config.models.instanceMethods.MessageTemplate,
    },
    hooks: {
      ...sails.config.models.hooks.MessageTemplate,
    },
  },
};
