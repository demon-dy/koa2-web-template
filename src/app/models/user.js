export default function (sequelize, DataTypes) {
	return sequelize.define('auth_user', {
        id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(),
            allowNull: false
        },
        source: {
            type: DataTypes.STRING(),
            allowNull: true
        },
        nickName: {
            type: DataTypes.STRING(),
            allowNull: true,
            field:'nick_name'
        },
        status: {
            type: DataTypes.STRING(),
            allowNull: true,
            field:'status'
        },
        version: {
            type: DataTypes.STRING(),
            allowNull: true,
            field:'version'
        },
        create_time: {
            type: DataTypes.DATE,
            allowNull: true,
            field:'create_time',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        update_time: {
            type: DataTypes.DATE,
            allowNull: true,
            field:'update_time',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        timestamps: false,
        freezeTableName: true
	});
};
