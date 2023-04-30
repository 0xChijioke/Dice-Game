# 🏗 Scaffold-Eth 2 | 🏰 BuidlGuidl

## 🚩 Challenge 3: 🎲 Dice Game 

> 🎰 Randomness is tricky on a public deterministic blockchain. The block hash is an easy to use, but very weak form of randomness. This challenge will give you an example of a contract using block hash to create random numbers.  This randomness is exploitable.  Other, stronger forms of randomness include commit/reveal schemes, oracles, or VRF from Chainlink.

> 👍 One day soon, randomness will be built into the Ethereum protocol!

> 💬 Dice Game is a contract that allows users to roll the dice to try and win the prize.  If players roll either a 0, 1, or 2 they will win the current prize amount.  The initial prize is 10% of the contract's balance, which starts out at .05 Eth.  
 
> 🧤 Every time a player rolls the dice, they are required to send .002 Eth.  40 percent of this value is added to the current prize amount while the other 60 percent stays in the contract to fund future prizes.  Once a prize is won, the new prize amount is set to 10% of the total balance of the DiceGame contract. 
 
> 🧨 Your job is to attack the Dice Game contract!  You will create a new contract that will predict the randomness ahead of time and only roll the dice when you're guaranteed to be a winner!

> 💬 Meet other builders working on this challenge and get help in the [Challenge 3 telegram](https://t.me/+3StA0aBSArFjNjUx)!
 
---

### Checkpoint 0: 📦 install 📚

```bash
git clone https://github.com/0xChijoke/Dice-Game.git
cd Dice-Game
yarn install
```
---

### Checkpoint 1: 🔭 Environment 📺

You'll have three terminals up for:

```bash
yarn chain   (hardhat backend)
yarn start   (react app frontend)
yarn deploy  (to compile, deploy, and publish your contracts to the frontend)
```

> 👀 Visit your frontend at http://localhost:3000


---

### Checkpoint 2: 🎲 Dice Game

 🔍 Inspect the code in the `DiceGame.sol` contract in `packages/hardhat/contracts`

 🔒  You will not be changing any code in the DiceGame.sol contract in this challenge.  You will write your own contract to predict the outcome, then only roll the dice when it is favourable.

 💸 Grab some funds from the faucet and roll the dice a few times.  Watch the balance of the DiceGame contract in the Debug tab.  It increases on a failed roll and decreases by the prize amount on a successful roll. 
<!-- 
![image]() -->


#### 🥅 Goals

- [ ] Track the solidity code to find out how the DiceGame contract is generating random numbers.
- [ ] Is it possible to predict the random number for any given roll?

---

### Checkpoint 3: 🔑 Rigged Contract

Start by creating a `receive()` function in the `RiggedRoll.sol` contract to allow it to receive Eth.  This will allow us to fund the RiggedRoll contract from the faucet which is required for our contract to call the rollTheDice() function.

Next add a `riggedRoll()` function. This function should predict the randomness of a roll, and if the outcome will be a winner, call `rollTheDice()` on the DiceGame contract.

 🃏 Predict the outcome by generating your random numbers in the exact same way as the DiceGame contract.

> 📣 Reminder!  Calling rollTheDice() will fail unless you send a message value of at least .002 Eth! [Here is one example of how to send value with a function call.](https://ethereum.stackexchange.com/questions/6665/call-contract-and-send-value-from-solidity)

🚀 To deploy your RiggedRoll contract, uncomment the appropriate lines in the `01_deploy_riggedRoll.js` file in `packages/hardhat/deploy`

❓ If you're struggling to get the exact same random number as the DiceGame contract, try adding some `console.log()` statements in both contracts to help you track the values.  These messages will appear in the Hardhat node terminal.

#### ⚔️ Side Quest

- [ ] Add a statement to require `address(this).balance >= .002 ether` in your riggedRoll function.  This will help prevent calling the rollTheDice() function without enough value.
- [ ] Uncomment the code in `App.jsx` to show a riggedRoll button and contract balance on the main UI tab.  Now you can test your function without switching tabs.
- [ ] Does your riggedRoll function only call rollTheDice() when it's going to be a winning roll?  What happens when it does call rollTheDice()?  


---

### Checkpoint 4: 💵 Where's my money?!?

You have beaten the game, but where is your money?  Since the RiggedRoll contract is the one calling `rollTheDice()`, that is where the prize money is being sent.  

📥 Create a `withdraw(address _addr, uint256 _amount)` function to allow you to send Eth from RiggedRoll to another address.

#### 🥅 Goals

- [ ] Can you send value from the riggedRoll contract to your front end address?
- [ ] Is anyone able to call the withdraw function?  What would be the downside to that?

#### ⚔️ Side Quest

- [ ] Lock the withdraw function so it can only be called by the owner.

> ⚠️ But wait, I am not the owner!  You will want to set your front end address as the owner in `01_deploy_riggedRoll.js`.  This will allow your front end address to call the withdraw function.

### Checkpoint 5: 💾 Deploy it! 🛰

📡 Edit the `defaultNetwork` in `packages/hardhat/hardhat.config.ts`, as well as `targetNetwork` in `packages/nextjs/env.production`, to [your choice of public EVM networks](https://ethereum.org/en/developers/docs/networks/)

👩‍🚀 You will want to run `yarn account` to see if you have a **deployer address**.

🔐 If you don't have one, run `yarn generate` to create a mnemonic and save it locally for deploying.

🛰 Use a faucet to fund your **deployer address** (run `yarn account` again to view balances)

> ⚠️ Make sure you fund your account with enough Eth! .05 is required to initially fund the DiceGame contract and .01 more is required to fund the riggedRoll contract.  Plus a bit extra to pay the gas.

 🚀 Run `yarn deploy` to deploy to your public network of choice (😅 wherever you can get ⛽️ gas)

🔬 Inspect the block explorer for the network you deployed to... make sure your contract is there.

## You can also run  `yarn test` to test your solution!
---
### Checkpoint 6: 🚢 Ship it! 🚁

📦 Run `yarn build` to package up your frontend.

💽 Deploy your Dapp on vercel with `yarn vercel` 

---

### Checkpoint 7: 📜 Contract Verification

Update the `apikey` in `packages/hardhat/package.json`. You can get your key [here](https://etherscan.io/myapikey).

> Now you are ready to run the `yarn verify --network your_network` command to verify your contracts on etherscan 🛰

Copy the verified address for your RiggedRoll contract and enter that into the appropriate Etherscan testnet.

---




