const mongoose = require("mongoose");

const connect = () =>{
    mongoose
    .connect("mongodb://localhost:27017/sparta_node", {ignoreUndefined: true})
    .catch((err)=>{console.error(err)
    });//커넥트 이부분 수정      
};
// mongoose.connection.on("error"), err=>{
//     console.error("몽고디비 연결 에러",err);
// };

module.exports = connect;
