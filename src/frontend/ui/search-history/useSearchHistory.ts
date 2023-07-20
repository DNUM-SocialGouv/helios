export function useSearchHistory() {
    const saveSearchHistory = (title: string, idUser: string, finessNumber: string, type: string) => {
        fetch("/api/history/save-search-history", {
            body: JSON.stringify({ title, idUser, finessNumber, type }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
    }

    return {
        saveSearchHistory,
    };
}