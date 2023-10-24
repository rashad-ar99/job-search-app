module.exports = (sequelize, DataTypes) => {
	const UserSessions = sequelize.define(
		"UserSessions",
		{
			UUID: {
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			JWTRefreshToken: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			JWTRefreshTokenExpiresAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			FCMToken: {
				type: DataTypes.STRING,
			},
			IP: {
				type: DataTypes.STRING,
			},
			UserAgent: {
				type: DataTypes.STRING,
			},
		},
		{
			createdAt: "CreatedAt",
			updatedAt: "UpdatedAt",
			paranoid: true,
			deletedAt: "DeletedAt",
		}
	);

	UserSessions.associate = (models) => {
		UserSessions.belongsTo(models.Users, {
			onDelete: "cascade",
			foreignKey: {
				allowNull: false,
			},
		});
	};

	return UserSessions;
};
