const Sequelize = require('./notify.prepare').Sequelize;
const sequelize = require('./notify.prepare').sequelize;
const moment = require('moment');

const createdAt = {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    field: "created_at",
    get() {
        return getDate.call(this, 'createdAt');
    }
}

const updatedAt = {
    type: Sequelize.DATE,
    field: "updated_at",
    get() {
        return getDate.call(this, 'updatedAt');
    }
}

function getDate(field, tz) {
    tz = tz === undefined ? 8 : tz;
    let value = this.getDataValue(field);
    if(value == null) {
        return '';
    }
    return moment(this.getDataValue(field)).utcOffset(tz).format('YYYY-MM-DD HH:mm:ss');
}

var model = module.exports;

// model.DomainPoolAddresses = sequelize.define("pool_addresses", {
//     address: {
//         type: Sequelize.STRING,
//         field: "address"
//     },
//     currency:{
//         type: Sequelize.STRING,
//         field: "currency"
//     },
//     used:{
//         type: Sequelize.INTEGER,
//         field: "used"
//     },
//     createdAt: createdAt,
//     updatedAt: updatedAt
// }); 


// sequelize.sync({ force: false }).then(() => {
//     console.log('----------------------start----------------------');
// });
