export default async function drawCard(deckId, count = 1) {
    try {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`, {
            headers: {
                Accept: 'application/json'
            }
        });

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}
