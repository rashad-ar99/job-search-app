module.exports = (sequelize, DataTypes) => {
	const Users = sequelize.define(
		"Users",
		{
			UUID: {
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			Name: {
				type: DataTypes.TEXT,
			},
			Email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			Password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			createdAt: "CreatedAt",
			updatedAt: "UpdatedAt",
			paranoid: true,
			deletedAt: "DeletedAt",
		}
	);

	Users.associate = (models) => {
		Users.hasMany(models.UserJobs, {
			onDelete: "cascade",
			foreignKey: {
				allowNull: false,
			},
		});
	};

	return Users;
};
