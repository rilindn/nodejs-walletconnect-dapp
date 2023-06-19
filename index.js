const { Core } = require("@walletconnect/core");
const { Web3Wallet } = require("@walletconnect/web3wallet");
const readline = require('readline');

const logQrCode = require("./utils/log_qr_code");
require('dotenv').config()

let web3wallet = null;
let session = [];
let accounts = [];
let transactions = [];

const projectId = process.env.PROJECT_ID
const metadata = {
    name: "ThoughtBank",
    description: "ThoughtBank Client as Wallet/Peer",
    url: "www.walletconnect.com",
    icons: ['https://lordicon.com/icons/wired/flat/268-avatar-man.svg'],
};

async function initConn() {
    const core = new Core({
        projectId,
    });

    web3wallet = await Web3Wallet.init({
        core, // <- pass the shared `core` instance
        metadata,
    });

    web3wallet.engine.signClient.on("session_delete", () => {
        console.log("🚀 user disconnected the session from their wallet");
        session = []
        accounts = []
    });

    rl.prompt();
}

async function getURI() {
    const proposalNamespace = {
        eip155: {
            chains: ["eip155:5"],
            methods: ["eth_sendTransaction"],
            events: ["connect", "disconnect"],
        },
    };

    const { uri, approval } = await web3wallet.engine.signClient.connect({
        requiredNamespaces: proposalNamespace,
    });

    if (uri) {
        console.log("🚀 This is your URI:\n", uri)
        logQrCode(uri)

        session = await approval();
        accounts = session.namespaces.eip155.accounts[0].slice(9)
        console.log("🚀 Sessions:", session)
        console.log("🚀 Accounts:", accounts)
    }
}

async function handleSend() {
    try {
        const tx = {
            from: accounts,
            to: "0xBDE1EAE59cE082505bB73fedBa56252b1b9C60Ce",
            data: "0x",
            gasPrice: "0x029104e28c",
            gasLimit: "0x5208",
            value: "0x00",
        };
        const result = await web3wallet.engine.signClient.request({
            topic: session.topic,
            request: {
                method: "eth_sendTransaction",
                params: [tx]
            },
            chainId: "eip155:5"
        })
        const link = `https://goerli.etherscan.io/tx/${result}`
        transactions.push({ tx: result, link })
        console.log("🚀 Transaction was successful:", link)
    } catch (e) {
        console.log(e);
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', async (input) => {
    if (input === 'exit') {
        rl.close();
    } else if (input.trim() === 'get-uri') {
        await getURI();
    } else if (input.trim() === 'send-eth') {
        await handleSend()
    } else if (input.trim() === 'show-txn') {
        console.log("🚀 Transactions:", transactions)
    } else {
        console.log('Invalid command');
    }

    rl.prompt();
});

rl.on('close', () => {
    console.log('Exiting...');
    process.exit(0);
});

// Initialize connection client
initConn();
