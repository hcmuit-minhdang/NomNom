// Mỗi công thức = 1 object. Thêm công thức mới: copy object này, đổi key và nội dung.
// Mở trang bằng: recipe.html?id=<key>
// Tên ảnh chỉ cần ghi tên file, recipe.js tự thêm "./assets/" phía trước.

const recipes = {
  "com-tam-long-xuyen": {
    title: "CƠM TẤM LONG XUYÊN",
    category: "Món ăn truyền thống",
    subcategory: "Cơm tấm",

    author: "Quốc Thịnh",
    uploaded: "7/10/2026",

    ratingScore: 3.67,
    reviewCount: 20,

    // Thời gian tính bằng phút. "totalTime" tự cộng trong recipe.js, không cần ghi.
    prepTime: 30,
    cookTime: 30,
    servings: 3,
    costTotal: "60.000đ",
    costPerServing: "20.000đ",

    description: "Cơm tấm Long Xuyên hay còn được người dân ở đây gọi bằng một cái tên thân thuộc là cơm tấm nhuyễn, bởi vì cơm được nấu từ những hạt tấm chính hiệu, còn nguyên vẹn những dưỡng chất. Khác với cơm tấm Sài Gòn, dĩa cơm tấm Long Xuyên đúng điệu sẽ có những miếng thịt sườn, trứng kho và bì được cắt thành những sợi nhỏ rất vừa miệng, đồ chua thường là củ cải cà rốt hoặc rau muống chua ngọt, tất cả cùng có hình dáng sợi, rưới thêm ít mỡ hành và nước mắm tỏi ớt kẹo lên trên, nghe thôi đã thấy thèm rồi đúng không?",
    summary: "This easy and comforting black bean chili is rich, full of warm chili spices, and fast enough to pull together on a busy weeknight.",

    mainImage: "com-tam-main.jpg",
    cardImage: "com-tam-main.jpg",
    gallery: ["com-tam-main.jpg", "com-tam-main.jpg", "com-tam-main.jpg", "com-tam-main.jpg"],

    featuredReview: {
      rating: 5,
      text: "“I love this recipe and reach for it in the cold months when I need an easy comfort food. I am heavy handed on all of the spices and love how flexible this recipe is.”",
      author: "TẤN PHÁT"
    },

    ingredients: [
      "500g gạo tấm",
      "300g thịt heo (có thể chọn sườn, cốt lết hoặc ba rọi tùy thích)",
      "30ml nước cốt dừa",
      "10ml nước cốt chanh",
      "30g lá dứa",
      "5 quả trứng vịt",
      "5g tỏi băm",
      "10 hành tím",
      "Hành lá",
      "10 món dưa chua tùy chọn",
      "3 - 4 nhánh hoa hồi",
      "Gia vị: Dầu hào, dầu ăn, muối, nước mắm, nước tương, bột ngọt, đường cát"
    ],

    quickSteps: [
      "Hấp cơm: Trộn gạo tấm với muối, dầu ăn, lá dứa rồi cho vào xửng hấp khoảng 30 phút. Luộc sẵn trứng vịt.",
      "Nướng thịt: Ướp thịt thái mỏng (với mật ong, mắm, cốt dừa, dầu hào, ngũ vị hương) 30 phút. Xiên que rồi nướng than cho bén.",
      "Kho trứng: Thắng caramel, phi thơm hành tím. Đổ nước dừa, nước tương, mắm, dầu hào và hoa hồi vào kho trứng 30-40 phút cho lên màu cánh gián.",
      "Pha chế: Làm mỡ hành (chế dầu thật sôi vào chén hành lá đã nêm gia vị). Giã tỏi ớt, pha nước mắm chua ngọt chuẩn vị.",
      "Lên dĩa: Cắt nhỏ thịt nướng và trứng kho. Bày ra dĩa cùng cơm, thêm bì, đồ chua, rưới mỡ hành và chan mắm là lên mâm thôi fam!"
    ],

    nutrition: {
      servings: 1,
      calories: "930 kcal",
      carbs: "93g",
      protein: "44g",
      fat: "47g",
      sodium: "2,500 - 3,200 mg",
      fiber: "2 - 4g"
    },

    // text: mỗi phần tử là 1 đoạn văn (có thể chứa <br />).
    // images: chuỗi = ảnh thường, hoặc { src, tall: true } = ảnh cao.
    steps: [
      {
        text: [
          "Trước hết, bạn làm sạch thịt heo bằng nước muối, để ráo rồi thái thành những lát mỏng và cho vào tô. Trứng vịt rửa sạch, sau đó đem luộc, lột vỏ. Hành tím bóc vỏ, băm nhỏ. Gạo tấm vo sạch, ngâm trong 15 phút rồi vớt ra để ráo và cho vào thau.",
          "Đặt nồi hấp lên bếp, cho gạo tấm vào xửng, thêm ½ muỗng cà phê muối, 1 muỗng canh dầu ăn rồi trộn đều. Cắt lá dứa thành khúc nhỏ và cho vào cùng. Đậy nắp và hấp trong 30 phút cho đến khi gạo chín, sau đó mở nắp và xới đều."
        ],
        images: ["step1-1.jpg", "step1-2.jpg", "step1-3.jpg", "step1-4.jpg"]
      },
      {
        text: [
          "Ướp thịt và nướng thịt sao cho thịt chín mềm, thấm gia vị để tăng thêm hương vị đậm đà cho món cơm tấm Long Xuyên.",
          "Cho vào tô thịt 60g mật ong, 30ml nước mắm, 30ml nước cốt dừa, 30g dầu hào, 10ml dầu ăn, 2g ngũ vị hương. Trộn đều và để ướp trong 30 phút để gia vị thấm đều vào thịt.",
          "Sau 30 phút, bạn xiên từng miếng thịt vào que rồi đặt lên bếp than nướng trong khoảng 20 phút cho thịt chín vàng, thơm ngon."
        ],
        images: ["step2-1.jpg", "step2-2.jpg", "step2-3.jpg", "step2-4.jpg"]
      },
      {
        text: [
          "Đặt nồi lên bếp, cho vào đường và đun đến khi đường tan chảy, chuyển màu cánh gián. Sau đó, thêm 10g hành tím băm vào và phi thơm. Tiếp tục cho vào 400ml nước dừa, 20ml nước tương, 20ml nước mắm, 20g dầu hào, 3-4 nhánh hoa hồi rồi khuấy đều.",
          "Kho trứng vịt cho đến khi trứng ngấm gia vị.<br />Tiếp tục đun hỗn hợp cho đến khi sôi thì thả 5 quả trứng vịt vào, kho trong 30-40 phút. Khi trứng chuyển màu cánh gián, bạn có thể tắt bếp."
        ],
        images: ["step3-1.jpg", "step3-2.jpg", "step3-3.jpg", "step3-4.jpg"]
      },
      {
        text: [
          "Đun sôi 20ml dầu ăn, sau đó cho vào chén hành lá, thêm ½ muỗng muối và ½ muỗng bột ngọt. Đổ dầu ăn đang nóng vào, rồi trộn đều để các gia vị thấm vào hành lá.",
          "Pha chế nước mắm chua ngọt chuẩn vị.",
          "Cho vào chén 3 tép tỏi, 2 trái ớt rồi dùng chày giã nhuyễn. Tiếp theo, thêm 2 muỗng canh đường, 10ml nước cốt chanh, 2 muỗng canh nước mắm, khuấy đều cho các nguyên liệu hòa quyện với nhau."
        ],
        images: ["step4-1.jpg", "step4-2.jpg", "step4-3.jpg", "step4-4.jpg"]
      },
      {
        text: [
          "Múc cơm tấm ra dĩa, cắt thịt nướng và trứng vịt thành miếng vừa ăn, bày xung quanh cơm. Rưới lên mỡ hành, thêm ít đồ chua, bì và nước mắm chua ngọt, vậy là bạn đã sẵn sàng thưởng thức món cơm tấm tuyệt vời này."
        ],
        images: [
          "step5-1.jpg", "step5-2.jpg", "step5-3.jpg", "step5-4.jpg",
          { src: "step5-5.jpg", tall: true },
          { src: "step5-6.jpg", tall: true }
        ]
      }
    ],

    // Thẻ "Công thức tương tự". id = key của công thức đó trong file này (để trống nếu chưa có).
    similar: [
      { id: "", name: "Recipe Name", price: "$ price / serving", time: "30 minutes", image: "food.png" },
      { id: "", name: "Recipe Name", price: "$ price / serving", time: "30 minutes", image: "food.png" },
      { id: "", name: "Recipe Name", price: "$ price / serving", time: "30 minutes", image: "food.png" },
      { id: "", name: "Recipe Name", price: "$ price / serving", time: "30 minutes", image: "food.png" }
    ]
  }

  // , "bun-bo-hue": { ... }
};