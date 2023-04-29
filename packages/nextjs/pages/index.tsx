import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";
import {
  useEthPrice, // useScaffoldContract,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";

// import { useAccount } from "wagmi";

// Setting roll value as a constant.
const ROLL_VALUE = "0.002";

type Players = {
  player: string;
  roll: string;
};

type Winners = {
  winner: string;
  amount: string;
};

const Home: NextPage = () => {
  const [players, setPlayers] = useState<Players[]>([]);
  const [winners, setWinners] = useState<Winners[]>([]);
  const [diceRolled, setDiceRolled] = useState<boolean>(false);
  const [diceRollImage, setDiceRollImage] = useState<string>("");
  const [showEthValue, setShowEthValue] = useState<boolean>(true);
  // const [claiming, setClaiming] = useState<boolean>(false);

  // const { address } = useAccount();

  // // Get access to the deployed contract object
  // const { data: diceGame } = useScaffoldContract({ contractName: "DiceGame" });
  // // console.log("diceGame: ", diceGame);

  // Call the rollTheDice function in the DiceGame smart contract.
  const {
    writeAsync,
    isSuccess: rollSuccessful,
    isError: rollError,
    isMining: isRollMinning,
  } = useScaffoldContractWrite({
    contractName: "DiceGame",
    functionName: "rollTheDice",
    value: ROLL_VALUE,
  });

  // Handle roll success.
  useEffect(() => {
    if (isRollMinning) {
      setDiceRollImage("ROLL");
    } else if (rollSuccessful) {
      setDiceRolled(false);
      setDiceRollImage(players[players.length - 1]?.roll);
    }
  }, [rollSuccessful, players]);

  // Handle roll error.
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (rollError) {
      timeoutId = setTimeout(() => {
        setDiceRolled(false);
        setDiceRollImage("");
      }, 2000); // delay for 2 seconds
    }
    return () => clearTimeout(timeoutId);
  }, [rollError]);

  // Call the riggedRoll function in the RiggedRoll smart contract.
  // const { writeAsync: riggedRollWrite, isSuccess: riggedRollSuccessful, isError: riggedRollError, isMining: riddedRollMinning } = useScaffoldContractWrite({
  //   contractName: "RiggedRoll",
  //   functionName: "riggedRoll",
  // });

  // Handle riggedRoll success.

  // Handle riggedRoll error.

  // Read prize data
  const { data: prize } = useScaffoldContractRead({
    contractName: "DiceGame",
    functionName: "prize",
  });

  const ETHPrice = useEthPrice();
  // Calculate the prize value to be displayed based on the toggle state
  const prizeValue = prize && valueDisplay(prize);

  // A function to help toggle between ETH value and dollar value.
  function valueDisplay(value: BigNumber) {
    const displayValue = showEthValue
      ? value && formatEther(value)
      : (value && Number(formatEther(value)) * ETHPrice)?.toFixed(2) || "0";

    return displayValue;
  }

  // Subscribe to the Roll event and set the players state.
  useScaffoldEventSubscriber({
    contractName: "DiceGame",
    eventName: "Roll",
    listener: (player, roll) => {
      const numberRolled = roll?.toNumber().toString(16).toUpperCase();
      setPlayers((prevPlayers): Players[] => [...prevPlayers, { player, roll: numberRolled }]);
    },
  });

  // Subscribe to the Winner event and set the winners state.
  useScaffoldEventSubscriber({
    contractName: "DiceGame",
    eventName: "Winner",
    listener: (winner, amount) => {
      setWinners((prevWinners): Winners[] => [...prevWinners, { winner, amount: valueDisplay(amount) }]);
      // console.log(winner, amount);
    },
  });

  // The butten calls this function to initiate the dice roll.
  const rollTheDice = async () => {
    setDiceRolled(true);
    setDiceRollImage("ROLL");

    try {
      await writeAsync();
    } catch (err) {
      // Handle the error.
      console.error(err);
    }
  };

  // Dice image manipulation.
  let diceRollImg;
  if (diceRollImage) {
    diceRollImg = (
      <Image className="rounded-xl" width={300} height={240} src={`/images/${diceRollImage}.png`} alt={"Dice Image"} />
    );
  }

  return (
    <>
      <Head>
        <title>Scaffold-ETH 2 App</title>
        <meta name="description" content="Created with 🏗 scaffold-eth-2" />
      </Head>

      <div className="flex items-center flex-col flex-grow pt-5">
        <h1 className="text-md font-semibold tracking-widest py-5 text-center">Roll a 0, 1 or 2 to win the prize!</h1>

        <div className="flex-grow bg-base-300 w-full px-8 py-5">
          <div className="items-center py-3 text-center">
            <button className="tracking-widest font-semibold text-2xl" onClick={() => setShowEthValue(prev => !prev)}>
              {showEthValue ? "⟠" : "💲"} {prizeValue} {showEthValue ? "ETH" : "USD"}
            </button>
          </div>
          <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-12 m-auto">
            <div className="flex flex-col -order-first lg:order-none bg-base-100 px-4 py-2 w-full lg:min-w-[25%] min-h-[300px] text-center items-center max-w-xs rounded-3xl">
              <h2 className="text-lg tracking-widest uppercase font-bold mb-4">Roll Events</h2>
              <ul>
                {players
                  .slice()
                  .reverse()
                  .map(({ player, roll }, i) => (
                    <li key={i} className="flex flex-row tracking-widest py-2 items-center text-base">
                      <Address address={player} /> &nbsp;Roll:&nbsp;{roll}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center w-full lg:min-w-[25%] min-h-[300px] bg-base-100 px-7 py-7 text-center items-center max-w-xs rounded-3xl">
              <button disabled={diceRolled} className="btn rounded-lg" onClick={rollTheDice}>
                Roll the dice!
              </button>
              <div className="my-4 transition ease-in-out delay-150 duration-200">{diceRollImg}</div>
            </div>
            <div className="flex flex-col flex-grow order-last lg:-order-none lg:min-w-[25%] w-full min-h-[300px] bg-base-100 px-4 py-2 text-center items-center max-w-xs rounded-3xl">
              <h2 className="text-lg tracking-widest uppercase font-bold mb-4">Winner Events</h2>
              <ul>
                {winners
                  .slice()
                  .reverse()
                  .map(({ winner, amount }, i) => (
                    <li key={i} className="flex flex-row items-center py-2 tracking-widest text-sm">
                      <Address address={winner} />
                      &nbsp;Amt:&nbsp;
                      <button className="flex flex-row w-full" onClick={() => setShowEthValue(prev => !prev)}>
                        {showEthValue ? "⟠" : "💲"}&nbsp;{amount}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
