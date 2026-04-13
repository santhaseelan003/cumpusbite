

// show/hide add-item panel
function showAddItemPanel() {
    document.getElementById('addItemPanel').style.display = 'block';
}



function submitNewItem() {
    const name = document.getElementById('itemName').value;
    const price = document.getElementById('itemPrice').value;
    const imgUrl = document.getElementById('itemImg').value;
    console.log('new item', { name, price, imgUrl });
    hideAddItemPanel();
}