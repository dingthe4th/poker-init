import React, { useEffect, useState } from 'react';
import drawCard from '../pages/api/drawcard';
import createDeck from '../pages/api/createdeck';
import evaluateHand from '../pages/api/evaluatehand';

function Home() {
    const [deckId, setDeckId] = useState('');
    const [cards, setCards] = useState([]);
    const [remaining, setRemaining] = useState(0);
    const [dealtCards, setDealtCards] = useState([]);
    const [communityCards, setCommunityCards] = useState([]);
    const [playerCards, setPlayerCards] = useState([]);
    const [evaluationResult, setEvaluationResult] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await createDeck();
                setDeckId(response.deck_id);
                setRemaining(response.remaining);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleDrawCard = async (count, isShared) => {
        try {
            const response = await drawCard(deckId, count);
            setCards(response.cards);
            setRemaining(response.remaining);
            setDealtCards((prevDealtCards) => [...prevDealtCards, ...response.cards]);

            if (count === 2) {
                setPlayerCards((prevPlayerCards) => [...prevPlayerCards, ...response.cards]);
            } else if (isShared) {
                setCommunityCards((prevCommunityCards) => [...prevCommunityCards, ...response.cards]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEvaluateHand = async () => {
        try {
            const response = await evaluateHand(communityCards, playerCards);
            setEvaluationResult(response);
        } catch (error) {
            console.error(error);
        }
    };

    const getImageSrc = (card) => {
        const imageName = `${card.code}.png`;
        const imagePath = `/cards/${imageName}`;
        return imagePath;
    };

    return (
        <div>
            <h1>Deck ID: {deckId}</h1>
            <h2>Remaining Cards: {remaining}</h2>
            <button onClick={() => handleDrawCard(2, false)}>Draw Card</button>
            <button onClick={() => handleDrawCard(3, true)}>Show Flop</button>
            <button onClick={() => handleDrawCard(1, true)}>Show Turn</button>
            <button onClick={() => handleDrawCard(1, true)}>Show River</button>
            <button onClick={handleEvaluateHand}>Evaluate Hand</button>

            <h2>Player cards:</h2>
            {playerCards.map((card) => (
                <li key={card.code}>{`${card.value} of ${card.suit}`}</li>
            ))}
            <h3>Community Cards </h3>
            {communityCards.map((card) => (
                <li key={card.code}>{`${card.value} of ${card.suit}`}</li>
            ))}
            <h2>Dealt Cards:</h2>
            <ul>
                {dealtCards.map((card) => (
                    <li key={card.code}>{`${card.value} of ${card.suit}`}</li>
                ))}
            </ul>

            {evaluationResult && (
                <div>
                    <h2>Evaluation Result:</h2>
                    <p>Winners:</p>
                    <ul>
                        {evaluationResult.winners.map((winner) => (
                            <li key={winner.cards}>{`${winner.cards} - ${winner.result}`}</li>
                        ))}
                    </ul>
                    <p>All Players:</p>
                    <ul>
                        {evaluationResult.players.map((player) => (
                            <li key={player.cards}>{`${player.cards} - ${player.result}`}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Home;
