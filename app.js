const express = require('express');

//schemas폴더 안 js파일 index.js랑 연결
const connect = require("./schemas");// "./schemas/index" index생략가능

const app = express();
const port = 3000;

connect();

//경로지정
const goodsRouter = require("./routes/goods");



const requestMiddleware = (req,res,next)=>{
    console.log("Request URL", req.originalUrl, "-",new Date());
    next();

};

app.use(express.json());//body로 들어오는 json형태의 데이터를 파싱해줌
app.use(requestMiddleware)
//"/api"라는 경로로 들어왔을때만 goodsRouter를 실행시켜주겠다.
app.use("/api", [goodsRouter]);
// app.use("/api", goodsRouter);//app.use("/api", [goodsRouter, userRouter])
                                //만약 userRouter가 있으면 두개다 동작을 시켜주겠다 라는 뜻
//Router  get req 하면 res res send 해주겠다
app.get('/', (req, res) => {
  res.send('Hello World!');
});
// listen들어 포트를 열고 포트가 열리면 함수를 실행해줄꺼야
app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});