module.exports = (sequelize, DataTypes) => {
	const UserJobs = sequelize.define(
		"UserJobs",
		{
			UUID: {
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
		},
		{
			createdAt: "CreatedAt",
			updatedAt: "UpdatedAt",
			paranoid: true,
			deletedAt: "DeletedAt",
		}
	);

	UserJobs.associate = (models) => {
		UserJobs.belongsTo(models.Users, {
			onDelete: "cascade",
			foreignKey: {
				allowNull: false,
			},
		});
		UserJobs.belongsTo(models.Jobs, {
			onDelete: "cascade",
			foreignKey: {
				allowNull: false,
			},
		});
	};

	return UserJobs;
};
