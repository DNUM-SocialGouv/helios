export function useSearchHistory() {
    const saveSearchHistory = (title: string, idUser: string, finessNumber: string) => {
        fetch("/api/history/save-search-history", {
            body: JSON.stringify({ title, idUser, finessNumber }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
    }

    return {
        saveSearchHistory,
    };
}