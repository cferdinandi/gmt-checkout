let products = document.querySelectorAll('.edd_purchase_receipt_product_name');
for (let product of products) {
    product.textContent = product.textContent.replace(' — _', '');
}