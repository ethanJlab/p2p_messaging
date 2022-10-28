import {ethers} from "ethers";


// Generate JSON RPC providers for all the listener contracts on all chain (One generic function please)

// Generate Signer to call Sender contracts for all chains (One generic function please) Parameters: (to_address, somethihng, chain_ID)

//Information fetch functions for each sender and reciever contract (one function that sends based on params (chain, Sender or Reciever))

const genericSenderAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "msg",
				"type": "string"
			}
		],
		"name": "NewMsg",
		"type": "event"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [],
		"name": "recieve",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_msg",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_chainID",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_reciever_address",
				"type": "address"
			}
		],
		"name": "step1_initiateAnyCallSimple",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
];



const genericRecieverAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "msg",
				"type": "string"
			}
		],
		"name": "NewMsg",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "_data",
				"type": "bytes"
			}
		],
		"name": "anyExecute",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			},
			{
				"internalType": "bytes",
				"name": "result",
				"type": "bytes"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

export const ethID = 5;
export const binanceID = 97;
export const fantomID = 4002;

export const ethSenderAddress = "0x159E70f9e59b74baa6fC9E661049a423a16762d9";
export const ethRecieverAddress = "0xfaF4059Fb91717F09F82ba24c0Dc91e1c60eFd42";
export const ethRPC = "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"

export const binanceSenderAddress = "0x6CAf2E5aB3878473bbfb6A72D1a621B7E5a1F4E8";
export const binanceRecieverAddress ="0x8e9EA53840243ba0c80072bbB097b1C560458691";
export const binanceRPC = "https://data-seed-prebsc-1-s3.binance.org:8545";

export const fantomSenderAddress = "0xfC8Bbd2E1868ea18adcBfe9a2Ad698aE55bB9D1B";
export const fantomRecieverAddress = "0xe6a9B8758C9bBD296F25d5045456966AefA2269E";
export const fantomRPC = "https://rpc.testnet.fantom.network/";


// chain
export function getContractData(chain, isSender){
    if(isSender){
        //need to have a signer to call the sender contracts (wallet needs to send money!)
        
        return getSender(chain);
    }else{
        //we just need a reader (no wallet) for the reciever contract
        
       return getReciever(chain);


    }


}

 function getReciever(chain){

    //going to need to find the JSON RPC for the corresponding chain to generate a reader
    const [recieverAddress,recieverAbi] = getRecieverInfo(chain);   

    var reader;

    switch(chain){
        case ethID:
            reader = new ethers.providers.JsonRpcProvider(ethRPC);
            break;
        
        case binanceID:
            reader = new ethers.providers.JsonRpcProvider(binanceRPC);
            break;
        
        case fantomID:
            reader = new ethers.providers.JsonRpcProvider(fantomRPC);
            break;
    }



    return new ethers.Contract(recieverAddress,recieverAbi,reader);

}

 async function getSender(chain){


    var provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts",[]);

    var signer = provider.getSigner();

    var [senderAddress,senderAbi] = getSenderInfo(chain);

    return new ethers.Contract(senderAddress,senderAbi,signer); 
}






function getContractInfo(){
    const contractAbi = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "newNumber",
                    "type": "uint256"
                }
            ],
            "name": "numberStored",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "retrieve",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "num",
                    "type": "uint256"
                }
            ],
            "name": "store",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    const contractAddress = "0x36d870F2EE0E1c69cadcf92A054F17Bf447C6745";

    return [contractAbi,contractAddress];
}
export async function getWallet(chainASigner,chainBProvider){
    var provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    chainASigner = provider.getSigner();

    chainBProvider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s3.binance.org:8545");

    
    
    return [chainASigner,chainBProvider];
}



function getRecieverInfo(chain){

    switch(chain){
        case ethID:
            return [ethRecieverAddress,genericRecieverAbi];
            
        case binanceID:
            return [binanceRecieverAddress,genericRecieverAbi];
            
        case fantomID:
            return [fantomRecieverAddress,genericRecieverAbi];
                     
    }
}

export function getSenderInfo(chain){
    switch(chain){
        case ethID:
            return [ethSenderAddress,genericSenderAbi];
            
        case binanceID:
            return [binanceSenderAddress,genericSenderAbi];
            
        case fantomID:
            return [fantomSenderAddress,genericSenderAbi];
            
    }
                
}

// export function callSenderContract(signer){
//     const [senderAddress,senderAbi] = getSenderInfo();
    

    

//     return new ethers.Contract(senderAddress,senderAbi,signer);
// }

// export function callRecieverContract(signer,chain){
//     const [recieverAddress,recieverAbi] = getRecieverInfo();

    

//     return new ethers.Contract(recieverAddress,recieverAbi,signer);
// }


