var Sequelize = require('sequelize');
// var sequelize = new Sequelize('peatio_production', 'root', null, {
    // host: "localhost",
    // logging: true,
    // timezone: "+08:00",  
    // port:3306,
    // define: {
    //     freezeTableName: true,
    //     underscored: true
    // },
    // dialect: 'mysql'
// });
const CONFIG = {
    ethereum:{
        rpc:"http://192.168.1.10:8545"
    },
    Api:{
        uploadProgress:{
            // port:8101,
            hostname:"bitop.io",
            method:"POST",
            path:"/hkico/project/pay",
            timeout: 300000
        },
        createProject:{
            // port:8101,
            hostname:"bitop.io",
            method:"POST",
            path:"/hkico/project/buildContract",
            timeout: 300000
        },
        uploadToBitop:{
            hostname:"bitop.io",
            method:"POST",
            path:"/hkico/project/buildContract",
            timeout: 300000
        }
    }
}
exports.CONFIG = CONFIG;
exports.Sequelize = Sequelize;
// exports.sequelize = sequelize;