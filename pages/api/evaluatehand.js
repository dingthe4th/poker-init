export default async function evaluateHand(communityCards, playerCards) {
    try {
        const cc = communityCards
            .map((card) => (card.code.startsWith("0") ? `10${card.code.slice(1)}` : card.code))
            .join(",");

        // Change code of card#10 from 0<suit> to 10<suit> for the evaluator API
        const pc = playerCards
            .map((card) => (card.code.startsWith("0") ? `10${card.code.slice(1)}` : card.code))
            .join(",");

        const response = await fetch(
            `https://api.pokerapi.dev/v1/winner/texas_holdem?cc=${cc}&pc[]=${pc}`,
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
