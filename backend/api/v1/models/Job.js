module.exports = (sequelize, DataTypes) => {
	const Jobs = sequelize.define(
		"Jobs",
		{
			UUID: {
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			Name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			Salary: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			Description: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			CompanyName: {
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

	Jobs.associate = (models) => {
		Jobs.hasMany(models.UserJobs, {
			onDelete: "cascade",
			foreignKey: {
				allowNull: false,
			},
		});
	};

	return Jobs;
};
