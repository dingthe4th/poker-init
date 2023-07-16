export default async function createDeck() {
    try {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1', {
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
