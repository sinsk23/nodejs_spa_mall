const express = require("express");
const Goods = require("../schemas/goods");//./내 위치 지금 routes안에 good.js ../더 위 Sparta_node에서~schemas폴더안의 good.js
//Goods가 대문자인 이유 걍 이게 모듈이구나를 알수있는거임
const Cart = require("../schemas/cart");

const router = express.Router();

router.get("/goods/cart", async(req, res)=>{
  const carts = await Cart.find();
  // res.send("carts!!");
  const goodsIds = carts.map((cart) =>cart.goodsId);
  
  const goods = await Goods.find({ goodsId: goodsIds });


  
  const results = carts.map((cart)=>{
          return {
              quantity : cart.quantity,
              goods: goods.find((item)=>item.goodsId === cart.goodsId)
              };
                  
          
      });
  res.json({
    cart : results,
  });
});


//app.js와 연결된 경로 를 선언하고 함수로 실행된 값이
//바로 아래로 동작됨 즉  
//router.get(("/")~의("/")는 == ("/api/")와 같다.
router.get(("/"), (req, res) => {
  res.send("This is root page");
});

//key 값 goods
// const goods = [
//   {
//     goodsId: 4,//4는 숫자타입
//     name: "상품 4",
//     thumbnailUrl:
//       "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
//     category: "drink",
//     price: 0.1,
//   },
//   {
//     goodsId: 3,
//     name: "상품 3",
//     thumbnailUrl:
//       "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
//     category: "drink",
//     price: 2.2,
//   },
//   {
//     goodsId: 2,
//     name: "상품 2",
//     thumbnailUrl:
//       "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
//     category: "drink",
//     price: 0.11,
//   },
//   {
//     goodsId: 1,
//     name: "상품 1",
//     thumbnailUrl:
//       "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
//     category: "drink",
//     price: 6.2,
//   },
// ];

//"goods" == "/api/goods"
router.get("/goods", async (req, res) => {
  const { category } = req.query; //Query String
  
  console.log("category" , category);
  
  //카테고리를 못찾는경우 index.js의
  const goods = await Goods.find( {category} );
  res.json({
    // goods: goods //goods key값 :goods라는 값의 배열 
    //뒤 : value값족의 goods는 코드스니펫의 객체데이터
    goods,//위랑 똑같은 코드임
    //js shorthand property 객체 초기자,즉 같은 변수이름이면 하나로도 할 수있다.
    //같은이름의 key,value key,value를 참조하는경우
  });

});
// /goods/아무값  // 경로 주소는 항상 문자열!!! //상세조회 api
router.get("/goods/:goodsId", async (req, res) => {

  const { goodsId } = req.params;

  const [goods] = await Goods.find({ goodsId: Number(goodsId) });

  // const [detail] = goods.filter((item) => item.goodsId === Number(goodsId));
  res.json({
    goods,//

  });
  //goods.filter((item) => item.goodsId===goodsId)
  //위코드는 필터링되서 반환되기 때문에 응답값 res.json을 넣는다.
});

router.post("/goods/:goodsId/cart", async(req, res)=> {
  const { goodsId } =req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
  if (existsCarts.length){
    return res.status(400).json({ success: false, errorMessage: "이미 장바구니에 들어있는 상품입니다."});
  }

  await Cart.create({ goodsId : Number(goodsId), quantity });
  res.json({ success: true});

});

router.delete("/goods/:goodsId/cart", async(req,res)=>{

  const { goodsId } =req.params;

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
  if(existsCarts.length){
    await Cart.deleteOne({ goodsId: Number(goodsId)});
  }

  res.json({ success: true});
});

router.put("/goods/:goodsId/cart", async(req, res)=>{
  const { goodsId } = req.params;
  const  {quantity } = req.body;

if (quantity<1){
  return res.status(400).json({ 
    errorMessage : "1 이상의 값만 입력 할 수 있습니다.",
  });
  //retrun;이 없으면 아래의 코드가 실행되기때문 return이 있어야함
  // return; 위에입력해도 댐
  }

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
  if(!existsCarts.length){
    await Cart.create({ goodsId : Number(goodsId), quantity });
  
  } else {
    await Cart.updateOne({ goodsId: Number(goodsId)} , {$set:{ quantity}});
  }
  res.json({ success: true });
});

//async가 없다면 await을 사용할수 없음
router.post("/goods", async (req, res) => {
  // const goodsId = req.body.goodsId;
  // const name = req.body.goodsId;
  // const thumbnailUrl = req.body.goodsId;
  // 줄이 늘어남 밑에는 같은코드로 줄을 줄여줌
  const { goodsId, name, thumbnailUrl, category, price } = req.body;//distructuring 비구조화 비할당 구조화

  const goods = await Goods.find({ goodsId });
  if (goods.length) {
    //? post로 보냈는데 왜 false인데 ok이지? RestApi가 아님 즉 자기서술적이지않음
    //그래서 status(400)써줌 400은 bad request라는뜻가지고있음 너 요청 잘못했어~라는
    //retrun이 잘되었으면 여러번 insert되지 않았겠지? 3T가서 확인!
    return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터입니다." });
  }
  //create() 모델을 생성해주면서 insert까지 해주는 함수
  //await 안해주면 끝나지 않았는데 응답을 내보내기때매 await해줌
  const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });

  res.json({ goods: createdGoods });
});

//라우터를 모듈로써 내보내주겠다.
module.exports = router;