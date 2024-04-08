

export function todayInString() {
    return (new Date()).toISOString().split('T')[0];
}