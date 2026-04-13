
let foodsAvailable = [
 /*  { foodName: "Biriyani", price: 100, rating: 4.5, imgUrl: "https://drive.google.com/file/d/1LYjsl6nOzK95-M_h9R1X029ibJPaZGyS/view?usp=drive_link", id: "09TpqcgoNymzwxv8sPAJ" },
  { foodName: "Chicken rice", price: 100, rating: 5, imgUrl: "https://drive.google.com/file/d/1LYjsl6nOzK95-M_h9R1X029ibJPaZGyS/view?usp=drive_link" } */
]

let orders = []
let orders_details = []
let myOrders = [];

/* =============================== */
//on load funcs

function onAdminPanalOpen()
{
  getFoods();
  getOrders();
}


/*  -------------------------------------------------------------------------  */

let filteredMenu = [];

let menuSample = [
            { id: 1, name: 'Veg Mess Thali', desc: 'Rice, dal, sabzi, roti, curd - complete meal', price: 45, category: 'veg', img: 'https://images.unsplash.com/photo-1606534161189-6288bd324716?w=400&h=200&fit=crop' },
            { id: 2, name: 'Chicken Curry Rice', desc: 'Spicy chicken curry with steamed rice', price: 65, category: 'nonveg', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=200&fit=crop' },
            { id: 3, name: 'Masala Dosa', desc: 'Crispy dosa with potato masala and sambar', price: 35, category: 'veg', img: 'https://images.unsplash.com/photo-1578875302065-f520ca9f0554?w=400&h=200&fit=crop' },
            { id: 4, name: 'Chicken Biryani', desc: 'Fragrant basmati rice with chicken masala', price: 80, category: 'nonveg', img: 'https://images.unsplash.com/photo-1603485269351-26e4f1259534?w=400&h=200&fit=crop' },
            { id: 5, name: 'Idli Sambhar', desc: 'Steamed idlis with lentil soup and chutney', price: 25, category: 'veg', img: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=200&fit=crop' },
            { id: 6, name: 'Vada Pav', desc: 'Spicy potato fritter in pav bun', price: 20, category: 'veg', img: 'https://images.unsplash.com/photo-1590779733387-8f94c926b7e1?w=400&h=200&fit=crop' },
            { id: 7, name: 'Egg Bhurji', desc: 'Scrambled eggs with onions and spices', price: 30, category: 'nonveg', img: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=200&fit=crop' },
            { id: 8, name: 'Chips & Tea', desc: 'Crunchy chips with masala chai', price: 15, category: 'snacks', img: 'https://images.unsplash.com/photo-1572497993727-6a019838d1dc?w=400&h=200&fit=crop' }
        ];


        let cart = [];

        function renderMenu(items = filteredMenu) {
          
            const grid = document.getElementById('menuGrid');
            grid.innerHTML = '';
            items.forEach((item, index) => {
                const card = createMenuCard(item);
                card.style.animationDelay = `${index * 0.1}s`;
                grid.appendChild(card);
            });
            if (items.length === 0) {
                grid.innerHTML = '<div class="no-results">No items found. Try another search!</div>';
            }
        }

        function createMenuCard(item) {
            const card = document.createElement('div');
            card.className = 'menu-card';
            card.innerHTML = `
                <img src="${item.imgUrl}" alt="${item.foodName}" class="menu-image">
                <div class="menu-info">
                    <div class="menu-name">${item.foodName}</div>
                    <div class="menu-price">₹${item.price}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQty(this, -1)">-</button>
                        <span id="qty-${item.id}">0</span>
                        <button class="qty-btn" onclick="updateQty(this, 1)">+</button>
                    </div>
                    <button class="order-btn" onclick="addToCart('${item.id}')">Add to Cart</button>
                </div>
            `;
            return card;
        }

        function searchMenu() {
          console.log("search");
            const query = document.getElementById('searchInput').value.toLowerCase();
            filteredMenu = foodsAvailable.filter(item => 
                item.foodName.toLowerCase().includes(query)
                
            );
            renderMenu();
        }

        window.onload = function()
        {
          let balance = localStorage.getItem("balance");


          document.getElementById("balance").textContent = `₹${balance}`;

          getFoods2();
          getFoods();
          document.querySelectorAll('.filter-btn').forEach(btn => {
              btn.addEventListener('click', () => {

                // Remove active class safely
                document.querySelectorAll('.filter-btn')
                  .forEach(b => b.classList.remove('active'));

                btn.classList.add('active');

                const category = btn.dataset.category;

                if (category === "all") {
                  filteredMenu = [...foodsAvailable];
                } else {
                  filteredMenu = foodsAvailable.filter(item => 
                    item.category === category
                  );
                }

                renderMenu();
              });
            });

        }

        
        function updateQty(btn, delta) {
            const qtySpan = btn.parentElement.querySelector('span');
            let qty = parseInt(qtySpan.textContent) + delta;
            if (qty < 0) qty = 0;
            qtySpan.textContent = qty;
        }

        
        function updateCartUI() {
            const count = cart.reduce((sum, item) => sum + item.qty, 0);
            document.getElementById('cartCount').textContent = count;
            const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
            document.getElementById('cartTotal').textContent = `₹${total}`;

            const cartItems = document.getElementById('cartItems');
            cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
        <span>${item.name} x${item.qty}</span>
        <span>₹${item.price * item.qty}</span>
        <button onclick="removeFromCart('${item.id}')">❌</button>
    </div>
`).join("");
        }

        function toggleCart() {
            const panel = document.getElementById('cartPanel');
            panel.classList.toggle('show');
        }

        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchMenu();
        });

        
        renderMenu();


        function addToCart(itemId) {

    const qtySpan = document.getElementById(`qty-${itemId}`);
    const qty = parseInt(qtySpan.textContent);

    if (qty === 0) return;

    const item = foodsAvailable.find(i => i.id == itemId);

    const cartItem = cart.find(c => c.id == itemId);

    if (cartItem) {
        cartItem.qty += qty;
    } else {
        cart.push({
            id: item.id,
            name: item.foodName,
            price: item.price,
            qty: qty
        });
    }
    

    updateCartUI();

    qtySpan.textContent = "0";

    const btn = qtySpan.closest(".menu-info").querySelector(".order-btn");

    btn.textContent = "Added!";
    btn.classList.add("loading");

    setTimeout(() => {
        btn.textContent = "Add to Cart";
        btn.classList.remove("loading");
    }, 1500);
}
function removeFromCart(itemId) {
    const item = cart.find(i => i.id == itemId);

    if (!item) return;

    item.qty--;

    if (item.qty <= 0) {
        cart = cart.filter(i => i.id != itemId);
    }

    updateCartUI();
}

function updateCartUI() {


    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById("cartCount").textContent = count;

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById("cartTotal").textContent = `₹${total}`;

    const cartItems = document.getElementById("cartItems");

    cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
        <span>${item.name} x${item.qty}</span>
        <span>₹${item.price * item.qty}</span>
        <button onclick="removeFromCart('${item.id}')">❌</button>
    </div>
`).join("");
}

function checkout() {

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (total === 0) return;

    // open table popup instead of direct order
    document.getElementById("tablePopup").style.display = "flex";
}

function confirmCheckout(){

  document.getElementById("tablePopup").style.display = "none";
  console.log(cart);

    let balance = parseInt(localStorage.getItem("balance"));

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (total === 0) return;

    if (total > balance) {
        alert(`Insufficient balance! Current: ₹${balance}`);
        return;
    }

    const tableNo = document.getElementById("tableInput").value;
    placeOrder(tableNo, total);
    
}

async function placeOrder(tableNo, total) {
 
  const foodOrdered = cart
  .map(item => `${item.name}-${item.qty}`)
  .join(" , ");

    const userName = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');

  try {
    const response = await fetch("/placeOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        foodOrdered: foodOrdered,
        userId: userId,
        userName: userName,
        tableNo : tableNo,
      })

    });

    const data = await response.json();
    if (data.message == "Orderplaced") {
      
    }
    /*     ==================================== */      

    console.log("Success:", data);
    
    let balance = localStorage.getItem("balance");
    balance -= total;

    localStorage.setItem("balance", balance);

    
    alert(`Order placed successfully!\nTotal: ₹${total}`);

    cart = [];

    updateCartUI();

    toggleCart();

    document.getElementById("balance").textContent = `₹${balance}`;
/*     ==================================== */      
  } catch (error) {
    console.error("Error:", error);
  }
}


/* ==================================================================== */



function hideAddItemPanel() {
  document.getElementById('addItemPanel').style.display = 'none';
}

function openMenu() {
  document.getElementById("orders").style.display = "none";
  document.getElementById("menu").style.display = "block";

}
function openOrders() {
  document.getElementById("orders").style.display = "block";
  document.getElementById("menu").style.display = "none";
}



function randomRating() {
  const options = [4, 5, 4.5, 3, 3.5];
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}

function renderTable() {
  console.log("request received");
  const tableBody = document.getElementById("foodList");
  tableBody.innerHTML = `
  
  <thead>
                    <tr>
                        <th>Food name</th>
                        <th>Price</th>
                        <th>Rating</th>
                        <th>Category</th>
                        <th>Action</th>
                    </tr>
                </thead>
                
                `;

  foodsAvailable.forEach((food, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${food.foodName}</td>
      <td>${food.price} Rs</td>
      <td>Rating: ${food.rating}</td>
      <td>Category: ${food.category}</td>


      <td>
        <button onclick="deleteFoodDb('${food.id}', ${index})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}


async function addFood() {
  const foodName = document.getElementById("foodName").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value;

  const imgUrl = document.getElementById("imgUrl").value;

  try {
    const response = await fetch("/add-food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        foodName: foodName,
        price: price,
        rating: randomRating(),
        imgUrl: imgUrl,
        category:category,
      })

    });

    const data = await response.json();
    if (data.message == "Foodadded") {
      
    }
    console.log("Success:", data);
    foodsAvailable.push(data.food);
    renderTable();
    hideAddItemPanel();
      
  } catch (error) {
    console.error("Error:", error);
  }
}

function deleteFood() {
  const ind = document.getElementById("id").value;
  console.log(ind, foodsAvailable);
  deleteFoodDb(foodsAvailable[ind].id , ind);


}


async function deleteFoodDb(id , ind) {
  try {
    const response = await fetch("/deleteFood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: id })
    });
    
    const data = await response.json();
    foodsAvailable.splice(ind , 1);
    console.log("index : " , ind);
    renderTable();

   
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getOrders() {
  try
  {
    const response = await fetch("/getOrders");
    const orders_ = await response.json();
    orders = orders_;
    console.log("Orders: " , orders);
    renderOrdersTable();
  }catch (error) {
    console.error("Error:", error);
  }
}

function renderOrdersTable()
{
  const table = document.getElementById("ordersTable");
  document.getElementById("loading").innerHTML = "";
  table.innerHTML = `
  <thead>
                    <tr>
                        <th>Table No</th>
                        <th>Foods</th>
                        <th>Customer Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                
                `;

  orders.forEach((order, index) => {

    if(order.status != "Preparing")
    {
      return;
    }
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${order.tableNo}</td>
      <td>${order.foodOrdered}</td>

      <td>${order.userName}</td>

      <td>
        <button onclick="foodDelivered('${order.id}' , ${index} , '${"Delivered"}')">Delivered</button>
        <button onclick="foodDelivered('${order.id}', ${index} , '${"Canceled"}')">Cancel</button>
      </td>
    `;

    table.appendChild(row);
  });
}

async function foodDelivered(id , index , status)
{
  try
  {
    const response = await fetch("/foodDelivered", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: id , status : status})
    });

    const msg = await response.json();

    if(msg.message == "Fooddelivered")
    {
      console.log(orders[index]);
      orders.splice(index , 1);
      renderOrdersTable();
    }

    
  }
  catch (error)
  {
    console.error(error);
  }
}





async function getFoods() {
  console.log("Get foods 1");
  try {
    const response = await fetch("/getFoods");
    const foods = await response.json();
    foodsAvailable = foods;
    renderTable();
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getFoods2() {
  console.log("Get foods 1");
  try {
    const response = await fetch("/getFoods");
    const foods = await response.json();
    filteredMenu = [...foods]; 
    renderMenu();
    console.log("got");
  } catch (error) {
    console.error("Error:", error);
  }
}



async function getMyOrders()
{
  const userId = localStorage.getItem("userId");

  try{
    const response = await fetch(`/getMyOrders?userId=${userId}`);
    myOrders = await response.json();
     renderOrders();
    console.log("myOrders " , myOrders);
  }
  catch (error) {
    console.error("Error:", error);
  }
}



function openMyOrders()
{

  getMyOrders();

    document.getElementById("ordersOverlay").style.display="flex";
}

function closeMyOrders()
{
    document.getElementById("ordersOverlay").style.display="none";
}

function renderOrders()
{
  myOrders.reverse();
    const container=document.getElementById("ordersContainer");
    container.innerHTML="";

    myOrders.forEach(order=>{

        let statusClass="";

        if(order.status=="Preparing") statusClass="preparing";
        if(order.status=="Delivered") statusClass="delivered";
        if(order.status=="Canceled") statusClass="canceled";

        const time=new Date(order.createdAt._seconds*1000).toLocaleString();

        container.innerHTML+=`

        <div class="order-card">

            <div class="order-food">
                ${order.foodOrdered}
            </div>

            <div class="order-info">
                Table No : ${order.tableNo}
            </div>

            <div class="order-info">
                Ordered by : ${order.userName}
            </div>

            <div class="order-info">
                ${time}
            </div>

            <div class="status ${statusClass}">
                ${order.status}
            </div>

        </div>

        `;
    });
}

function logout() {
    // 🔐 Clear all stored user data
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("balance");


    // 🚀 Redirect to login page
    window.location.href = "/login.html";
}