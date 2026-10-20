(async () => {
    async function sleep(millis) {
        return new Promise(resolve => {
            setTimeout(() => resolve(), millis);
        });
    }

    async function fetchWithRetry(input, maxAttempts = 5, attempt = 0, ) {
        console.log("Attempt:", attempt);
        const result = await fetch(input);
        if ((result.status !== 200) && attempt < maxAttempts) {
            const delay = Math.floor(200 * Math.pow(1.6, attempt));
            console.log("Waiting:", delay);
            await sleep(delay);
            return await fetchWithRetry(input, maxAttempts, attempt + 1);
        }
        return result;
    }

    const element = document.getElementById("message");
    const message = await (await fetchWithRetry("http://localhost:3000/trigger")).json();
    element.innerHTML = "Loading";
    const result = await fetchWithRetry(`http://localhost:3000/result/${message.id}`, 10);
    if (result.status === 200) {
        element.innerHTML = JSON.stringify(await result.json());    
    } else {
        element.innerHTML = "Failure";
    }
})();