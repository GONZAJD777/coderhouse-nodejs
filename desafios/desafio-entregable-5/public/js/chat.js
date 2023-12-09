const socketClient = io();

socketClient.on("sendMessages", (messages) => {
    updateMessagesList(messages);
});

function updateMessagesList(messages) {
    const messagesListContainer = document.getElementById("productListContainer");

    messagesListContainer.innerHTML = "";

    listProducts.forEach(product => {
   
      
    });
}